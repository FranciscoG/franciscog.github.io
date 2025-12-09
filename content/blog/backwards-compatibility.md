---
title: The importance of backwards compatibility
date: 2025-12-09
---

This is kind of a medium spicy hot take: I feel like we should be giving backwards compatibility almost the same importance we do for accessibility.

A while ago I saw this [post in Jim Nielsen's blog](https://blog.jim-nielsen.com/2022/a-web-for-all/) where he recounts the story of helping his mom figure out why a website she frequently used suddenly stopped working for her. Jim did some digging and figured out that the site was breaking because it was using optional chaining (`?.`) and the version of Chrome she had did not support it. She couldn't update her Chrome because she was on a Chromebook that had already past its support window. On Chromebooks, Chrome is tied to the ChromeOS version.

Jim's mom is lucky to have a son who works in tech that could help her. She also probably has the means to buy a newer device (if not on her own, than definitely through her son). 

But there could be many reasons why someone can't just switch to another computer. Maybe they can't afford an upgrade. Maybe they have mobility issues that don't allow them to get to another location to access a newer device (like a public library or a friend's house). Maybe they don't have family and friends they could call for help. These people also deserve the right to be able to use your website. We shouldn't just assume everyone can access browsers that are up to date. 

## How far back should you support?

This [web-features tool](https://web-platform-dx.github.io/web-features/supported-browsers/) helps you find the versions of major browsers to target for transpilation.

That blog post was written in Jan 2022 and he says "about a month ago" so let's assume the issue happened in Dec 2021. I put in the date of [December 1, 2021](https://web-platform-dx.github.io/web-features/supported-browsers/?widelyAvailableOnDate=2021-12-01&includeDownstream=false) and it recommended that Chrome	66 (released 2019-03-25) should have been the browser target[^1]. Had the developer followed this recommendation, Jim's mom would not have had any problems.

Props to [Vite](https://vite.dev/guide/build#browser-compatibility) for choosing slightly older default transpilation targets than the ones recommend by the web-features tool for [today](https://web-platform-dx.github.io/web-features/supported-browsers/?widelyAvailableOnDate=2025-12-09&includeDownstream=false) (like Chrome v107 instead of Chrome v111).

[^1]: Baseline widely available means browser versions that support all features which have been interoperable in the Baseline core browser set for at least 30 months (2.5 years): ([source](https://web-platform-dx.github.io/web-features/#how-do-features-become-part-of-baseline%3F))