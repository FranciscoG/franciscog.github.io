---
title: npm safety follow-up
date: 2026-04-01
syntax: true
tags:
  - security
  - npm
---

I wanted to write a follow-up to my [previous post](https://franciscog.com/blog/npm-package-safety-guide/) on npm security because I've learned a couple new things due to this whole axios compromise.

## The axios compromise

If you've been following the tech news, just a couple days ago the very popular [`axios`](https://www.npmjs.com/package/axios) npm package published 2 malicious versions (`0.30.4` and `1.14.1`).

Not going to get too deep into it because articles like this do a much better job: 
<https://www.stepsecurity.io/blog/axios-compromised-on-npm-malicious-versions-drop-remote-access-trojan>

But there are 2 things to I wanted to call out:

1. The attacker used the `postInstall` script to run malicious code
2. It was discovered within 24 hours

If you had followed the advice from my previous post, you would not have been affected. 

- disable npm scripts: `ignore-scripts=true`
- delay installing newly published versions for a few days (or pin your dependencies)

## npm adds min-release-age

When I wrote my last post, npm did not have a config option that would allow you to delay installing after a specified amount of time. So I recommended using `pnpm` instead, because it was the first to implement that kind of feature (`minimumReleaseAge`). Well, npm finally caught up.

`min-release-age` was added in version `11.10.0`, [released Feb 11, 2026](https://github.com/npm/cli/releases/tag/v11.10.0). 

## My updated npm recommendation
 
### in your package.json
```json
{
  "engines": {
    "npm": ">=11.10.0",
    "node": "^20.20.2 || ^22.22.2 || >=24.14.1"
  }
}
```
Why those specific versions of node? 

1. npm supports versions of node that are still in active LTS or maintenance at the time of each specific version's release. For `npm@11.10.0`, that would be nodejs `>= 20`. Refer to [the NodeJS releases page](https://nodejs.org/en/about/previous-releases) to see what versions are receiving support.
1. We only want LTS releases ([eventually all major releases will be LTS starting at Node 27](https://nodejs.org/en/blog/announcements/evolving-the-nodejs-release-schedule))
1. Previous versions had a high serverity vulnerability as of writing this post. This will be something you'll constantly need to update so make sure to pay attention to the latest security release post at the npm blog: <https://nodejs.org/en/blog/vulnerability>


### in your .npmrc

```conf
min-release-age=3 # 3 days
ignore-scripts=true 
engine-strict=true
```

Why 3 days and not just 1 if vulnerabilities are being discovered so fast? npm has a [72-hour rule](https://docs.npmjs.com/policies/unpublish) where a package can be unpublished if no other package depends on it. Also it's nice to be a little extra cautious.  Snyk [recommends waiting 21 days](https://snyk.io/blog/npm-security-preventing-supply-chain-attacks/#:~:text=Snyk%20does%20not%20recommend%20upgrading%20to%20versions%20that%20are%20less%20than%2021%20days%20old) before installing a package so maybe listen to them instead of me. 

## What about Yarn?

I didn't include information about Yarn in my last post which was a mistake. Yarn v4 added a `npmMinimalAgeGate` about a month after pnpm's `minimumReleaseAge`. 


Yarn's equivalent of `ignore-scripts` is `enabledScripts: false`. One thing to note about this is [their documentation](https://yarnpkg.com/configuration/yarnrc#enableScripts) only mentions `postInstall` specifically so I'm assuming `preInstall` scripts can still run (need to confirm that).

file: `.yarnrc.yml`

```yml
npmMinimalAgeGate: "3d" # 3 days
enableScripts: false 
```

Just like pnpm, you can allow certain packages to run their `postInstall` scripts by adding them to the [`dependenciesMeta`](https://yarnpkg.com/configuration/manifest#dependenciesMeta) property in your package.json:

```json
{
  "dependenciesMeta": {
    "esbuild" : {
      "built":  true
    }
  }
}
```



## What about Bun?

Similar to pnpm, Bun does not execute scripts [by default](https://bun.com/docs/pm/lifecycle#:~:text=Bun%20does%20not%20execute%20arbitrary%20lifecycle%20scripts%20by%20default.).

Bun 1.3, released Oct 2025, added [`minimumReleaseAge`](https://bun.com/docs/runtime/bunfig#install-minimumreleaseage).

Yes you can allow certain packages to run lifescycle scripts by adding them to a [`trustedDependencies`](https://bun.com/docs/guides/install/trusted) array in your package json:

```json
{
  "trustedDependencies": ["my-trusted-package"] 
}
```

Bun even has a ["Security Scanner API"](https://bun.com/docs/pm/security-scanner-api) which allows to to configure an external scanning tool that runs _before_ installation. This feature might bump pnpm out of my top recommendation spot.

## What about \<insert_tool_name>?

Look, I'm not going to cover all pacakge managers, but at this point you should know what to look for.


## Conclusion

If you're going to do 1 thing, it should be ignoring lifecycle scripts.

It's nice that npm is catching up, but the one thing it's still missing is that allow-list for trusted packages. There is a [very recent issue](https://github.com/npm/cli/issues/9172) opened requesting it.

In the meantime, use Bun or pnpm, yarn is cool too, or npm >= 11.10.0 if you have to.


Happy coding! Don't get hacked!