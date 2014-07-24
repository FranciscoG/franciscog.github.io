boilerplate
===========

What started as my front-end boilerplate is now turning into a more general Web Start boilerplate using PHP to handle things like includes.

Right now it is very specific to where I work and needs to support back to IE8.

contains:
 - [Gulp](http://gulpjs.com/) for task running
 - [Stylus](http://learnboost.github.io/stylus/) css preprocessing
 - [normalize.css](http://necolas.github.io/normalize.css/) instead of a CSS reset
 - [nib](http://visionmedia.github.io/nib/) - Stylus mixin library
 - jQuery 1.11.1
 - Modernizr
 - The beginnings of [Atomic Design](http://blog.groupbuddies.com/posts/32-our-css-sass-project-architecture-and-styleguide) for CSS architecture  
 

tbd: either requireJS or browserify for managing dependecies and keeping JS clean


#### Mac OS X setup instructions

1. Install [Node JS](http://nodejs.org/)

2. Open OS X's Terminal program, or install [iTerm2](http://www.iterm2.com/#/section/home) which is better than Terminal

3. go to the root of the boilerplate directory and do the following: 

4. run this command: ```npm install -g gulp```, you might need to use "sudo"

5. then run this comment: ```npm install```


#### Windows setup instructions

1. Install [Node JS](http://nodejs.org/)

2. Install [Git for Windows](http://git-scm.com/download/win) so you can use the **Git-Bash** tool that it comes with

3. Open Git-Bash, go to the root of the boilerplate directory and do the following: 

4. run this command: ```npm install -g gulp```

5. then run this comment: ```npm install```


#### Daily Use

Here are some commands you can run and what they do

```gulp```  - just does a one-time compile/concat of the js and stylus files  
```gulp watch``` - starts watching for changes and auto-compiles when you hit save on any js or stylus file in the /src folder  
```gulp build-js``` - one-time build of the js files  
```gulp build-css``` - one-time compile of the stylus to css  