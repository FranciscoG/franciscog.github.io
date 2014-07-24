/*  
 * tinyRouter.js
 *
 * Super simple JS router class, like super super simple
 * doesn't use any regex to match url pathnames or hashes
 * just takes a route name, looks for that function that matches it and runs it
 * this is really only useful in small projects where you have a few pages and not a ton of JS
 * but enough so where you still want to keep things organized
 *
 * there is one reserved route name
 * universal : always runs this route before other routes
 *
 * this is kind of an offshoot of Paul Irish's DOM-Based routing:
 * http://www.paulirish.com/2009/markup-based-unobtrusive-comprehensive-dom-ready-execution/
 */


module.exports = function(info) {
    this.methods = info;

    var route = document.body.getAttribute('data-route'); //supporting back to IE8, why not

    if (route === null) {
        return false; // no route so we exit quietly
    }

    if (route === 'universal') {
        throw new Error("universal is a reserved name, don't use it");
    }

    if (typeof this.methods.universal !== 'undefined') {
        // always run what's in 'universal' before other routes
        this.methods.universal();
    }

    var execRoute = this.methods[route];
    if (typeof execRoute === 'function') {
        execRoute();
    }

};

/** 
How to use:

Step 1:  on your page you add a 'data-route' attribute to your body tag like this:
        
<body data-route="users">
 
 
Step 2:  Create your Route functions, tinyRouter takes an Object Literal as its only parameter

// require it
var TinyRouter = require('../js/modules/TinyRouter.js');

// use it
var yourMainModule = new TinyRouter({
  
  universal: function() {
    // this is an optional route (but a reserved name, so don't use it in data-route)
    // runs this route on every page before the other routes
  },
  
  users: function() {
    // do stuff specific to users page
  }
  
});


*/