---
title: Bikeshedding
date: 
draft: true
syntax: true
---

I was just listening to a recent Syntax.fm podcast [episode](https://syntax.fm/show/938/hot-takes-bike-shedding) called "Hot Takes & Bikeshedding" where they went through your typical developer bikeshedding topics (such as "tabs vs spaces"). I thought it would be fun to go through that list and give my own opinions on each of them. Wouldn't be bikeshedding without more unnessecary opinions! Also, in true bikeshedding fashion, it's a nice distraction from some of the more important things I should be working on. 😅

## CSS variables: descriptive vs. semantic

```css
:root {
	/* descriptive */
	--blue: rgb(0, 0, 255);

	/* semantic */
	--color-primary: rgba(0,0,255);
}
```

I prefer the semantic names like `--color-primary` because it makes it easier to theme and also not have to find and replace if you want to change a color. I use this whether the site has 1 theme or not.

## snake_case vs. camelCase

```js
// snake_case
const do_something = () => {}

// camelCase
const doSomething = () => {}
```

I don't really have a strong opinion on this one. I admit that I've defaulted to camelCase for a long time but only out of habit, and probably influence from previous jobs. 

You can argue that snake_case is a little easier to read.

You can also argue that camelCase saves "bytes" by using less characters, but that's so inconsequential. I don't think bytes saved by a few less characters is an issue in most codebases, definitely not the ones I've worked in.

Conclusion: I might try switching to snake_case in future projects to see how that goes.

## Default exports vs. named exports

```js
// default export
export default function whatever() {}

// named exports
export function whatever() {}
```

Always named exports.

It's a much better experience with my editor when I am renaming things, using autocomplete, and finding all references.

## Barrel files vs. direct imports

```js
// example of consuming a component from a barrel file
import { Header } from '@/components'

// without a barrel file
import { Header } from '@/components/Header'
```

Barrel files are when you create an index file at the root of a folder and you import, and then re-export, a bunch of other modules. The [React-Bootstrap source](https://github.com/react-bootstrap/react-bootstrap/blob/v2.10.10/src/index.tsx) has a good example of one.

I don't think barrel files offer anything useful to me in my projects. It's just a style choice. They probably have their place, like if you're developing a library (like React-Bootstrap), but I prefer using direct imports.

## Function declaration vs. function expression

```js
// function declaration
function myFunction() {}

// function expression
const func = function() {}
const func = function namedFunc() {}
const func = () => {}
```

These days, JS engines are so optimized that the difference between them in performance or memory is negligible. The difference now is purely a style choice. I usually go for function declarations, especially if writing functions at the root of the current module scope. It makes things a lot clearer, especially the longer the function or larger the codebase. 

There's also the hoisting aspect of it but I personally don't like to write my function declarations after they are called. I'll set the eslint rule `no-use-before-define` to true. Rarely do I need an exception to this rule.

## Inferred types vs. explicit types

This refers to whether you should define a function/method's return type or let TypeScript infer it.

I prefer explicit types.

2 reasons:

1. I read once somewhere that it's faster type checking if you define the return type yourself. You probably wouldn't notice anyhting until your codebase gets pretty large. And this will probably be less of an issue with the upcoming release of their [rewrite in Go](https://devblogs.microsoft.com/typescript/typescript-native-port/).

2. If you change something in the function that breaks the expected return type, you'll see the error right away. Otherwise it will just silently change the return type and you won't know anything has broken until you type lint the whole project or open a file that uses that function.

## Long and explicit variable names vs. short with comments

Long variable names. Just saves me the step of having to hover and see the comments (at vscode will that with proper JSDoc comments).

## Self-documenting code vs. code comments

A little bit of both. I kind of play this one by ear. But I do err on the side of more comments, rather than less. But I don't comment the obvious.

## Rebase vs. merge commit

There's no clear answer from me on this. I guess "it depends". I've worked on projects that preferred rebasing, and when it went smooth, it was great. But rarely did a rebase go smooth. I was always having to fix conflicts and use `git push --force-with-lease` because the branch was already pushed to remote. 

## Naming event parameters: e vs. event

They also mentioned using `e` or `error` in a `try/catch` statement.

I think specifically for `event` and `error`, I've flipped between `e` and the full name. But I'm totally ok with just `e`. It's a very well-known parameter at this point that people usually get it right away, just like `i` for index. 

## Tabs vs. spaces

I used to be a spaces person but I've come around to tabs now. I don't even remember why I preferred spaces, I think it had to do with how previous editors handled displaying tabs (which was mentioned in the podcat). So if I'm choosing, I would choose tabs now, but I honestly don't care either way.

## Big line height vs. small line height

I didn't even know this was a thing people bikeshedded about. I've never changed the default line height for my editor (which is vscode these days), so whatever VSCode's default is considered, I'll go with that. 

My vscode line height settings is set to `0`, which is "automatically compute the line height from the font size." Which doesn't seem to produce a very big line height so I guess I prefer a smaller one.

## Hard line length vs. line wrap

I like a hard line length

I have 2 rulers values setup in my vscode setting: `[80,100]`.

80 is useful when I'm developing with multiple side-by-side tabs open. 100 is nicer in single column view.


In the end I think I pretty much agreed with all of their choices.