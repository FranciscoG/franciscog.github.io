---
title: NPM Safety Tips
date: 2025-12-03
syntax: true
tags:
- npm
- security
---

npm has been having one hell of a year. 

In August, the [Nx and `@nx/*` packages were compromised](https://www.aikido.dev/blog/popular-nx-packages-compromised-on-npm) via a Github Actions exploit. 

In September, a successful phishing email [compromised the account of a maintainer of many packages](https://www.aikido.dev/blog/npm-debug-and-chalk-packages-compromised) with _hundreds of millions of weekly downloads_, including `chalk` and `debug`.

Also in September, a self-replicating worm called "Shai-Hulud" (a Dune reference) [wreaked havoc on about 40 packages](https://socket.dev/blog/tinycolor-supply-chain-attack-affects-40-packages).

And in November [the Shai-Hulud struck again](https://www.aikido.dev/blog/shai-hulud-strikes-again-hitting-zapier-ensdomains).

Thankfully, due to active monitoring of the npm ecosystem, these malicious packages are often discovered within 5 minutes to 4 hours of publication.

Given the state of npm security these days, I wanted to jot down some tips I use to help protect against accidentally installing a malicious package. This post is meant for people using npm to install dependencies and not meant for publishers of packages.

## TL:DR

- Ignore scripts
- Commit your lockfile
- Pin your dependencies
- Use `npm ci` over `npm install` when installing all dependencies in any environment
- Include the "engines" property in your package.json and enforce it
- Set `legacy-peer-deps=true` in your `.npmrc`
- run `npm audit --audit-level=critical` in your build step before `npm ci`

```json
{
  "engines": {
    "npm": ">=9",
    // or
    "pnpm": ">=10.16"
  }
}
```

Add the following to **both** your project's `.npmrc` and your user's `~/.npmrc` or `$HOME/.npmrc`

```ini
ignore-scripts=true
save-exact=true
engine-strict=true
legacy-peer-deps=true
```

OR

Use `pnpm >=v10.16` instead of `npm` because it:

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

You could also use an alternative package manager like `pnpm` or `bun`.

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

- If the lockfile was generated with an older version of npm and you're running `npm install` with a newer version. This might cause changes to your lockfile that make npm re-resolve some dependencies.

The next 3 sections should help prevent some of these issues.

## Pin your dependencies

This one is more controversial. Why do you need this if a lockfile already ensures you're installing specific versions? One is human error, someone could accidentally delete the lockfile and commit that. The other, more important one is that most of the tips in this post rely on malicious packages being discovered and reported. If an account is compromised and it publishes a new malicious package that no one finds for a while, not pinning your dependencies puts you at a greater risk. 

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

## Use legacy peer deps

Since npm v7, peer dependencies are auto-installed and captured in the lockfile. Peer dependency resolution changes can update the lockfile when package.json changes, even if top-level versions are pinned. Add `legacy-peer-deps=true` to your `.npmrc` to prevent this from happening:

```sh
# locally in your project adjacent to the package.json
npm config --location project set legacy-peer-deps true
# globally at the user level: ~/.npmrc
npm config set legacy-peer-deps true
```

<https://docs.npmjs.com/cli/v8/using-npm/config#legacy-peer-deps>

## Run npm audit in your build jobs

Npm audit is not perfect. Dan Abramov has a good post outlining its issues: <https://overreacted.io/npm-audit-broken-by-design/>. 

But I still find some value in it as another line of defense in my CI/CD workflows. I like to add a step in my build jobs that runs an audit check before the step that runs `npm ci`. This will help prevent accidentally installing a malicious package. 

```sh
npm audit --audit-level=critical
```

There's probably going to be a very tiny window where a package has been given a critical severity and has not been removed from the registry by npm. But adding this doesn't hurt your pipeline so it's better to have it than not.

## pnpm

I highly recommend switching to pnpm as your package manager because it handles so many of the above issues by default.

In their v10 release, they disabled running dependency scripts by default while still running your own lifecycle scripts. You can also enable specific package lifecycle scripts by using the [`onlyBuiltDependencies`](https://pnpm.io/settings#onlybuiltdependencies) setting^[<https://github.com/orgs/pnpm/discussions/8945>].

As of their v10.16 release, they added a new flag called [`minimumReleaseAge`](https://pnpm.io/settings#minimumreleaseage) that prevents the installation of a package that was published too recently. Most malicious published packages are being caught and taken down within hours or less. Using this flag will give you some extra buffer time if you happen to be installing during the window where the malicious packages are still in the registry.

It also comes with [auditing functionality](https://pnpm.io/cli/audit) and allows you to add CVEs to an ignore list because they don't affect your project. This solves some of the issues Dan Abramov was mentioning in his article.

Other nice defaults pnpm provides is not installing legacy peer deps automatically and enforcing the strict engine use if you have added it to your engines property of your package.json.

```json
{
  "engines": {
    "pnpm": ">=10.16"
  }
}
```

The only thing it doesn't do is save exact versions by default. When adding new packages you can use the `--save-exact` flag, or set it in the pnpm-workspace.yaml by adding `save-prefix=''`

```sh
pnpm add pkg --save-exact

# or set this in your config so you don't need the flag
pnpm config set save-prefix=''
```

<https://pnpm.io/settings#saveprefix>
