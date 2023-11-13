---
title: Something old, something new
date: 2023-11-08
draft: true
---

Welcome to the relaunch of my personal website _and_ my first blog post! It's been about 5+ years since I've made any significant changes to my site so it was about time.

## Innovation Tokens

I was recently listening to an [episode of the JS Party Podcast](https://changelog.com/jsparty/298) and on it someone mentinoed the term "innovation tokens", which was an idea popularized by Dan McKinley in his famous essay [Choose Boring Technology](https://mcfunley.com/choose-boring-technology). It got me thinking about the redesign of my own personal website and what technology I was going to choose to build it. It's easy getting carried away wanting to try out the latest flashy tech, but there's also the learning curve and risks that comes with that. While the innovation tokens idea is probably not something I need to worry about, it's still a good way of helping me keep on track and reduce headaches.

## What does an innovation token mean for me?

In the essay he proposes that the majority of your stack should be comprised of tried-and-tested (aka boring) technology that's been available for a long time. In my case though, it's not about how long the tech has been around (i.e. boring-ness), but more about the level of my experience with it. I know React very well, so choosing that wouldn't cost me anything, but if I wanted to try something like SvelteKit, that would cost me a token (that might be a bad example because SvelteKit is still pretty new, but you get the idea).

## What I spent my innovation tokens on

I've alloted myself 2 tokens for my site.

### 1. [Eleventy](https://www.11ty.dev/) 

Eleventy has been around since 2017, so it technically could be called "boring technology", especially for what it does. It's been on my radar for quite some time but, until now, I've never had a reason to use it. I had almost decided to write my own custom framework but when I looked at Eleventy I saw that it had a lot of the things I was looking for:

- static site generation
- page templates and partials
- write content in markdown
- good for blogging
- robust plugin system (love the [image plugin](https://www.11ty.dev/docs/plugins/image/))
- good documentation
- active development
- been around long enough that there's plenty of help via the community
- shallow learnig curve

They even have a great [blog template](https://github.com/11ty/eleventy-base-blog) that I used as the base for this site.

#### WebC

Eleventy supports multiple different templating languages, or you can even bring your own custom one (I seriously considered writing a Preact template plugin), but one that caught my eye was this new one called [WebC](https://www.11ty.dev/docs/languages/webc/) that was developed by the creators of Eleventy. Out of all of the templates, it was the most html-like one. 

It does come with a sub-dependency of learning the [Nunjucks](https://mozilla.github.io/nunjucks/) templating enging, but that's been around even longer than Eleventy and is pretty easy to figure out.

### 2. [Tailwind](https://tailwindcss.com/)

I'm going to finally try and get on the Tailwind train. I have my own personal reservations about it so I'm going to write about that in 2 separate upcoming blog posts (my "before" and "after" thoughts on it). For now, the style of this site is going to be the default that came with the blog template.
