---
title: "Mitigating Supply Chain Risk: A Guide to npm Package Safety"
date: 2025-12-04
syntax: true
tags:
- npm
- security
---

This has been one hell of a year for npm.

In August, the [Nx and `@nx/*` packages were compromised](https://www.aikido.dev/blog/popular-nx-packages-compromised-on-npm) via a Github Actions exploit. 

In September, a successful phishing email [compromised the account of a maintainer of many packages](https://www.aikido.dev/blog/npm-debug-and-chalk-packages-compromised) with _hundreds of millions of weekly downloads_, including `chalk` and `debug`.

Also in September, a self-replicating worm called "Shai-Hulud" [compromised over 40 packages](https://socket.dev/blog/tinycolor-supply-chain-attack-affects-40-packages).

And in November [the Shai-Hulud worm came back with a vengeance](https://www.aikido.dev/blog/shai-hulud-strikes-again-hitting-zapier-ensdomains), this time affecting 492 packages.

The good news is that the npm ecosystem is actively monitored, so malicious packages usually get flagged and taken down pretty fast&ndash;sometimes within a few minutes, other times up to four hours. The bad news? That's still a huge window for someone to get compromised.

Given how often we see these supply chain attacks pop up, I decided to write down some practical tips I use myself to stay safe. Just to be clear, this is for those who are installing dependencies, not for people publishing them.

## TL:DR

- Add `ignore-scripts=true` to your `.npmrc` ([caveat](#what-about-my-own-lifecycle-scripts) regarding your own scripts)
- Commit your lockfile
- Pin your dependencies and add `save-exact=true` to your `.npmrc`
- Use `npm ci` over `npm install` in any environment
- Include the `"engines"` property in your package.json and enforce it by adding `engine-strict=true` to your `.npmrc`
- run `npm audit --audit-level=critical` in your build step before `npm ci`
- Use an `.npmrc` file at both the project level and your OS user level (`~/.npmrc` or `$HOME/.npmrc`)

```json
{
  "engines": {
    "npm": ">=9",
    // or
    "pnpm": ">=10.16"
  }
}
```

```ini
ignore-scripts=true
save-exact=true
engine-strict=true
```

OR

Use pnpm `>=v10.16` instead of npm because it:

- ignores scripts by default while still running your own lifecycle scripts
- allow certain dependencies to run their lifecycle scripts using an [allow list in your config](https://pnpm.io/settings#onlybuiltdependencies)
- enforces strict engine by default
- does not install peer dependencies by default
- has a config item called [`minimumReleaseAge`](https://pnpm.io/settings#minimumreleaseage) which prevents installing a package version until it has been live for a certain amount of time.

Use `save-prefix=''` as the equivalent to `save-exact=true` for pnpm:

```sh
pnpm config set save-prefix=''
```

## Ignore Scripts

This is the most common attack vector of a compromised package. Unfortunately npm runs all lifecycle scripts by default and you need to explicitly opt out of them. You can use the `--ignore-scripts` flag with both `npm install` and `npm ci`, whether you're installing a single package or installing all dependencies. 

You can also add `ignore-scripts=true` to your `.npmrc` so you don't need to remember it. 

```sh
# locally in your project adjacent to the package.json
npm config --location project set ignore-scripts true
# globally at the user level: ~/.npmrc
npm config set ignore-scripts true
```

<https://docs.npmjs.com/cli/v8/using-npm/config#ignore-scripts>

<aside>

I recommend adding it in both places because at the project level it ensures all team members are protected and you also don't need to remember it for CI/CD environments. At the user level it protects you when installing dependencies of a project that doesn't have it set in its own `.npmrc`.

</aside>

### What happens when a package I need requires one of these lifecycle scripts?

You can use `npm rebuild package_name` to force npm to run that package's lifecycle scripts. 

Personally, I rarely need a package that uses one of these scripts, but they are not uncommon. Packages like [sqlite3](https://www.npmjs.com/package/sqlite3), [electron](https://www.npmjs.com/package/electron), and [node-sass](https://www.npmjs.com/package/node-sass), each with millions of downloads weekly, all use lifecycle scripts to handle either downloading or binding binaries written in other languages.

### What about my own lifecycle scripts?

Using `ignore-scripts` also means that your own package.json's lifecycle scripts get ignored as well. So if you use a popular library like [Husky](https://typicode.github.io/husky/), which adds a `prepare` script to your package.json, you'll need to manually run the `prepare` script. 

Some alternative package managers have fixed this issue by allowing your own lifecycle scripts to run, see [pnpm section below](#you-should-try-pnpm).

## Commit your lockfile

This is pretty well known already but it bears repeating. You should always commit your lockfile. This helps keep consistency between builds across environments and team members. With a lockfile in your repo, any time you run `npm install` or `npm ci` it will install exactly what's in your lockfile. 

Here's an example:

- Let's say you add a new package to your project: `npm install some-package`. 

- At the time of install, version `1.2.10` was the latest version of that package so npm will add  `some-package: ^1.2.10` to your `dependencies` and it will also add that version to your lockfile. By default, npm uses the [caret ranges](https://github.com/npm/node-semver?tab=readme-ov-file#caret-ranges-123-025-004) for dependencies.

- `some-package` releases a new version `1.2.11`, but the next time you run `npm install`, it will still install `1.2.10` because that's what's in your lockfile.

- `some-package` gets compromised and releases a malicious version `1.2.12`. But since your lockfile still has version `1.2.10`, you should be protected from this version.

### When npm install Ignores the Lockfile

While the lockfile is designed to ensure reproducible builds by locking dependency versions, running `npm install` can override it in several specific situations.

- When you install a specific package (`npm install pkg`), npm will resolve versions from the registry and update your package.json + lockfile, which can also affect other dependencies if they are shared with the new package.

- When your package.json and the lockfile are out of sync. This can happen when you manually change the version of a package in your package.json, or pull down upstream changes locally. This will cause `npm install` to resolve the new version and update your lockfile.

- When you run `npm update` or `npm audit fix`, or similar commands. These intentionally upgrade dependencies and change what gets installed.

- If you, or someone on your team, deletes the lockfile, then npm will rebuild it from scratch and can possibly install a malicious version if it still exists.

- If the lockfile was generated with an older version of npm and you're running `npm install` with a newer version. This might cause changes to your lockfile that make npm re-resolve some dependencies. This is why you should be [enforcing npm version](#enforce-strict-engine-use) in your project.

The next 3 sections should help prevent some of these issues.

## Pin your dependencies

This one is more controversial. Why do you need this if a lockfile already ensures you're installing specific versions? 

A lockfile is great for ensuring repeatable builds, but it's not foolproof. The bigger issue is the risk you face when you decide to update. If you use a broad version range like `^1.2.3` in your package.json (allowing non-breaking updates), and a maintainer's account is compromised, the next time you update, you could pull a malicious version before anyone even knows it exists.

Since all our security tips depend on someone finding and reporting the bad package, pinning to a specific version number is one of the best defenses against a recently published, but not yet discovered, supply chain attack.

To pin a dependency, use the `--save-exact` flag when adding a new package: 

```sh
npm install pkg --save-exact
```

Or you can add `save-exact=true` to your `.npmrc` file so that it becomes the default behavior:

```sh
# locally in your project adjacent to the package.json
npm config --location project set save-exact true
# globally at the user level: ~/.npmrc
npm config set save-exact true
```

<https://docs.npmjs.com/cli/v8/using-npm/config#save-exact>

## Use npm ci

The `ci` stands for "clean install". It will first wipe out your `node_modules` folder and then install dependencies exactly as they are listed in your lockfile. This _requires_ that you have a lockfile or it will exit with an error. It will also exit with an error if your package.json is out of sync with the lockfile. This only works when installing all dependencies at once, not adding new ones.

You should always use `npm ci --ignore-scripts` in your CI/CD environments so that it throws an error and exits the pipeline if there any issues. I also like to use it when I first clone a project and install the dependencies for the first time. This helps prevent the automatic updating of the lockfile if it has become out of sync with the package.json.

## Enforce strict engine use

As I mentioned before, if you have mismatched versions of npm between creating the lockfile and running `npm install`, this could cause unwanted updates to your lockfile. 

You should enforce that your team is using the same version of npm by including it in your `"engines"` section of your package.json and setting `engine-strict=true` in your `.npmrc`. You want to pay attention to the `lockfileVersion` of your package-lock.json so that no one is using a version of npm that doesn't support the same version.

```json
{
  "engines": {
    "node" : ">=22",
    "npm": ">=9"
  }
}
```

```sh
# locally in your project adjacent to the package.json
npm config --location project set engine-strict true
# globally at the user level: ~/.npmrc
npm config set engine-strict true
```

<https://docs.npmjs.com/cli/v8/using-npm/config#engine-strict>

## Run npm audit in Your CI/CD Pipelines

npm audit is not perfect. It often flags dependencies that aren't actually vulnerable in your specific context. Dan Abramov has a [great post about this](https://overreacted.io/npm-audit-broken-by-design/). 

However, despite its flaws, I still think it has value as another simple layer of defense, especially in CI/CD.

I like to add a step that runs an audit check before the step that runs `npm ci`. Why? Because npm audit checks the dependencies listed in your package-lock.json against a known database of vulnerabilities. If a critical vulnerability has been reported in one of those dependencies, running the audit first will fail the build before the package even has a chance to be installed locally.

```sh
npm audit --audit-level=critical
```

Is there a tiny window where a brand new, malicious package slips through? Sure. But adding this line takes virtually zero effort and can prevent known, critical risks from ever making it into your deployment.

## You should try pnpm

I highly recommend switching to pnpm as your package manager. It fixes so many of the security and dependency headaches mentioned in this post, _by default_.

- Since [their v10 release](https://github.com/orgs/pnpm/discussions/8945), pnpm disables running dependency lifecycle scripts (`preinstall`, `install`, and `postinstall`) by default. These are the hooks attackers often use to inject malicious code during installation. If you need them, you can still selectively enable them using the [`onlyBuiltDependencies`](https://pnpm.io/settings#onlybuiltdependencies) setting.

- [In v10.16](https://pnpm.io/blog/releases/10.16), pnpm added a fantastic flag called [`minimumReleaseAge`](https://pnpm.io/settings#minimumreleaseage). Since most malicious packages are caught and removed within hours, this flag prevents installation if a package was published too recently. This creates a crucial buffer time, protecting you from installing a compromised package during that critical discovery window.

- pnpm comes with robust auditing functionality and allows you to add specific CVEs to an [ignore list](https://pnpm.io/settings#auditconfigignorecves). This directly addresses the 'audit fatigue' problem, letting you silence false positives that don't actually affect your project.

- Beyond security, pnpm provides better defaults, like not automatically installing legacy peer dependencies and enforcing strict use of the engines property in your package.json. These features lead to cleaner, more predictable, and ultimately safer dependency trees.

```json
{
  "engines": {
    "pnpm": ">=10.16"
  }
}
```

The one security measure pnpm doesn't enforce by default is pinning your dependency versions, but it's trivial to enforce. When adding new packages, you can use the `--save-exact` flag. Even better, you can set it globally in your workspace configuration by adding `save-prefix=''` to your pnpm-workspace.yaml.

```sh
pnpm add pkg --save-exact

# or set this in your config so you don't need the flag
pnpm config set save-prefix=''
```

<https://pnpm.io/settings#saveprefix>


## Conclusion

There's probably a lot more I can write about regarding this topic-like keeping your dependencies shallow and how to choose a dependency-but those are a little more squishy. I wanted to keep this post focused on more actionable items that were easy to implement and you didn't have to think about. By implementing these few small settings you can immediately and significantly reduce your exposure to the most common supply chain attacks. 