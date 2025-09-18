---
title: Bikeshedding
date: 2025-09-18
syntax: true
---

I was just listening to a recent Syntax.fm podcast [episode](https://syntax.fm/show/938/hot-takes-bike-shedding) called "Hot Takes & Bike Shedding" where they went through your typical developer bikeshedding topics (such as "tabs vs spaces"). I thought it would be fun to go through that list and give my own opinions on each of them. Wouldn't be bikeshedding without more opinions that nobody asked for! 😅

## CSS variables: descriptive vs. semantic

```css
:root {
	/* descriptive */
	--blue: rgb(0, 0, 255);

	/* semantic */
	--color-primary: rgb(0, 0, 255);
}
```

I prefer the semantic names like `--color-primary` because it makes it easier to theme, and it doesn't tie my design to specific colors. I prefer this whether the site has any theming or not. The only negative of this is that naming things is hard. While the industry seems to have agreed upon a lot of common terms like "primary", "secondary", etc (did bootstrap popularize these?), it can still be annoying to figure out names once you exhaust those common ones.

## snake_case vs. camelCase

```js
// snake_case
const do_something = () => {}
const my_variable = "";

// camelCase
const doSomething = () => {}
const myVariable = "";
```

I admit that I've defaulted to camelCase for a long time but only out of habit, and probably influence from previous jobs. 

You can argue that snake_case is a little easier to read. You can also argue that camelCase saves "bytes" by using less characters. Which is probably something most people don't really needs to worry about.

That being said, the more that I look at the example above, the more I'm starting to formulate a preference. I like the snake_case in variable names, but I don't like it for function names. I also still don't mind camelCase in variable names.

So henceforth, let it be known that I will try and stick to the following naming convention:

- camelCase for function names
- snake_case or camelCase for variable names.
- PascalCase for class names or any function invoked with the `new` keyword

It is written!

## Default exports vs. named exports

```js
// default export
export default function whatever() {}

// named exports
export function whatever() {}
```

Always named exports.

It's a much better experience with my editor when I am renaming things, or using autocomplete, or finding all references.

## Barrel files vs. direct imports

Barrel files are when you create an index file at the root of a folder and you import, and then re-export, a bunch of other modules. The [React-Bootstrap source](https://github.com/react-bootstrap/react-bootstrap/blob/v2.10.10/src/index.tsx) has a good example of one. To be honest, I didn't know this was the term used to describe this pattern. 

```js
// in '@/components/index.js'
export { Header } from './Header'

// example of consuming a component from a barrel file
import { Header } from '@/components'

// without a barrel file you'll need to import directly from the Header.jsx file
import { Header } from '@/components/Header'
```

I don't think barrel files offer anything useful to me in my projects. It's just a style choice. They probably have their place, like if you're developing a library (like React-Bootstrap), but I prefer using direct imports. It's also one less file to maintain.

## Function declaration vs. function expression

```js
// function declaration
function myFunction() {}

// function expression
const func = function() {}
const func = function namedFunc() {}
const func = () => {}
```

These days, JS engines are so optimized that the difference between them in performance or memory is negligible. The difference now is purely a style choice. I usually go for function declarations, especially if writing functions at the root of the current module scope. It makes things a lot clearer when scanning your code, especially the longer the function or larger the codebase. 

There's also the hoisting aspect of it but I personally don't like to reference a function before it's declared. I'll set the eslint rule `no-use-before-define` to true (or the equivalent in whatever linter I'm using these days). Rarely do I need an exception to this rule.

## Inferred types vs. explicit types

```ts
// TypeScript will infer that this function returns a number
function double(n: number) {
	return n * 2;
}

// Explicit return type
function double(n: number): number {
	return n * 2;
}
```

I prefer explicit types.

2 reasons:

1. [Type inference can be slow](https://github.com/honojs/hono/issues/3869), especially the more complicated and larger your codebase gets. Hopefully this will be less of an issue with the upcoming release of the [TypeScript rewrite in Go](https://devblogs.microsoft.com/typescript/typescript-native-port/).

2. Quicker indication of errors in my code.
	
	Take the example I put above. If I refactor the inferred function to return a string instead of a number, I will get no immediate intellisense error in my editor because it will just silently change the inferred return type. It won't be until I open a file that uses the function that I notice there's an error. Or maybe during a build process or pre-commit hook that run the `tsc` type checker.

## Long and explicit variable names vs. short with comments

I don't mind long variable/function names. The more descriptive the better. But not too long, of course. It just makes it easier to understand what it's for. Otherwise you'd see a variable that makes no sense and have to either go to where you declared it originally to read the comment, or hover over it (if you are using proper JSDoc comments).

## Self-documenting code vs. code comments

A little bit of both. I kind of play this one by ear. I do err on the side of more comments, rather than less. But I don't comment the obvious.

## Rebase vs. merge commit

There's no clear answer from me on this. I guess "it depends". I've worked on projects that preferred rebasing, and when it went smooth, it was great. But rarely did a rebase go smooth. I was always having to fix conflicts and use `git push --force-with-lease` because the branch was already pushed to remote.

So I guess I'd recommend:

- Rebase if you haven't pushed your branch yet.

- Merge for everything else.

But I'm not very strict with this one.

For anyone that is interested, I found this [blog post](https://salferrarello.com/visualizing-git-branching-with-blocks/) to be a good visual explanation of how git branch/rebase/merge work.

## Naming event parameters: e vs. event

They also mentioned your typical `e` vs `error` in a `try/catch` statement. 

And I also wanted to throw in one more, which is the use of `i` vs `index` in loops or array method callbacks. 

```js
document.querySelector('#someButton').addEventListener('click', (e) => {
	// do something
});

try {
	// do something that might throw an error
} catch (e) {

}

for (let i = 0; i < arr.length; i++) {
	const item = arr[i];
	// etc
}

// this one is a double-whammy
someArrayOfThings.forEach((e, i, arr) => {

});
```

I'm ok with the short-hand version of these specific parameters because they are super common practice in JS development that I feel most people will immediately recognize them for what they are.

However, it can get a little tricky when you start declaring your callbacks as separate functions. As long as your function name is descriptive enough to inform the developer as to what exactly `e` is, then I'm still ok with the short-hand. 

For example, in this code below the function name pretty clearly describes that it is a click event handler, so using `e` as the parameter name is ok with me because I know it's an instance of `Event`.

```js
function buttonClickHandler(e) {
  // handle the click 
}

document.querySelector('#someButton').addEventListener('click', buttonClickHandler);
```

Here's an example of a more ambiguous function name that should not use the short-hand `e` parameter. My immediate reaction to seeing this function is thinking that `e` could possibly be an array since the function includes the word "List". In this case I would either rename the function or use the full name `event`. And if the latter, add some comments.

```js
function clearList(e) {

}

document.querySelector('#reset-list').addEventListener('click', clearList);
```

I also wanted to bring up this common practice of using a short-hand `e` in an inlined array method callback like `forEach`. In this case I prefer a more descriptive parameter name for the first param. I'm ok with using `i` for index and something like `arr` for the third parameter (which I barely use anyways).

```js
// ❌ How does `e` explain to the developer what the current item represents
allUsers.forEach((e, i, arr) => { });

// ✅ `user` makes it much more clear.
allUsers.forEach((user, i, arr) => { });
```

## Tabs vs. spaces

I used to be a spaces person, but I've come around to tabs now. I don't even remember why I preferred spaces, I think it had to do with how previous editors handled displaying tabs (which was mentioned in the podcast). So if I'm choosing, I would choose tabs now, but I honestly don't care either way.

## Big line height vs. small line height

I didn't even know this was a thing people cared about. I've never changed the default line height for my editor. My vscode line height settings is set to `0`, which means "automatically compute the line height from the font size." So I guess I'm on team "small line height" because it doesn't seem particular big to me. 

## Hard line length vs. line wrap

I like a hard line length.

I have 2 ruler values setup in my vscode setting: `[80,100]`.

`80` is useful when I'm developing with multiple side-by-side tabs open. `100` is nicer in single column view. However, when I'm working on solo projects I don't usually enable my formatter to automatically wrap code for me. I just usually do it myself when I see that I'm getting close to one of my rule lines. But on bigger projects I can see this being helpful. It's all about consistency!


