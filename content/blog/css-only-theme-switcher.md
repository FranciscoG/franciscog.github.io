---
title: CSS-only theme switcher
date: 2023-11-09
draft: true
syntax: true
tags:
  - css
---

As I've been working on my site I knew that I wanted add a theme switcher

1. defaults to user's `prefers-color-scheme`
2. ability to override
3. persists across the entire site
4. persists on returning visits

I was hoping to implement this with only HTML and CSS, and I found this [great article by Alexander Sandberg](https://alexandersandberg.com/articles/creating-a-website-theme-switcher-with-css-only/) on how do just that, but there's no way to persist without using JS unfortunately.

I already have a theme in the css that respects `prefers-color-scheme: dark` but I would also like a way to override that.

