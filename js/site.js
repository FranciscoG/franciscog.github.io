(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * 3D Star field animation
 * using Javascript and HTML5 Canvas
 *
 * source: http://www.mrspeaker.net/2009/08/04/3d-html5-part-1/
 * modified slightly to change direction of stars, use requestAnimation frame,
 * increase number of stars, change speed, etc
 */


//=========================================================================
// POLYFILL for requestAnimationFrame
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/

var requestAnimFrame = window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    };
})();

var cancelAnimFrame = window.cancelAnimFrame = (function() {
  return window.cancelAnimationFrame ||
    window.webkitCancelAnimationFrame ||
    window.mozCancelAnimationFrame;
})();


var starfield = {};

starfield.star = function() {
  this.x;
  this.y;
  this.z;

  this.projectedX; // store location to move X value to
  this.projectedY; // store location to move Y value to
  this.projectedSize; // store new size
  this.projectedColor; // store new color
};

starfield.main = {
  maxStars: 300,
  hfov: 100 * Math.PI / 180,
  vfov: 80 * Math.PI / 180,
  maxDistance: 800,
  starSpeed: 9,

  stars: [],
  hViewDistance: 0,
  vViewDistance: 0,
  fieldWidth: 0,
  fieldHeight: 0,
  context: null,

  setField: function() {
    this.field = document.getElementById("field");
    this.field.width = window.innerWidth;
    this.field.height = window.innerHeight;
    this.fieldWidth = this.field.offsetWidth;
    this.fieldHeight = this.field.offsetHeight;
  },

  init: function() {
    this.setField();

    if (!this.field.getContext) {
      return;
    }

    this.context = this.field.getContext("2d");

    // Set up the view distance based on the field-of-view (with pythagoras)
    this.hViewDistance = (this.fieldWidth / 2) / Math.tan(this.hfov / 2);
    this.vViewDistance = (this.fieldHeight / 2) / Math.tan(this.vfov / 2);

    // Init the stars
    for (var i = 0; i < this.maxStars; i++) {
      var star = new starfield.star();
      star.x = (Math.random() * this.fieldWidth) - (this.fieldWidth / 2);
      star.y = (this.fieldHeight / 2) - (Math.random() * this.fieldHeight);
      star.z = (Math.random() * this.maxDistance);
      star.speed = this.starSpeed;
      this.stars.push(star);
    }

    this.run();
  },

  run: function() {
    var that = this;

    // Run the main loop
    (function tick() {
      that.update();
      that.draw();
      requestAnimFrame(tick);
    })();
  },

  update: function() {
    for (var i = 0; i < this.stars.length; i++) {
      var star = this.stars[i];

      // this is where you'd set direction of the stars
      star.z += this.starSpeed;
      if (star.z >= this.maxDistance) {
        star.z = 0;
      }

      // Project to 2D space
      star.projectedX = (star.x * this.hViewDistance) / star.z;
      star.projectedY = (star.y * this.vViewDistance) / star.z;

      // Transform from field cordinates to X/Y
      star.projectedX += this.fieldWidth / 2;
      star.projectedY = (this.fieldHeight / 2) - star.projectedY;

      // Change the size & color based on depth
      star.projectedSize = (1 - (star.z / this.maxDistance)) * 4;
      var shade = Math.floor((1 - (star.z / this.maxDistance)) * 255);
      star.projectedColor = "rgba(" + shade + "," + shade + "," + shade + ", 0.8)";
    }
  },

  draw: function() {
    var ctx = this.context;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, this.fieldWidth, this.fieldHeight);
    for (var i = 0; i < this.stars.length; i++) {
      var star = this.stars[i];
      ctx.fillStyle = star.projectedColor;
      ctx.beginPath();
      ctx.arc(
        star.projectedX,
        star.projectedY,
        star.projectedSize,
        0, Math.PI * 2, true
      );
      ctx.closePath();
      ctx.fill();
    }
  }
};

window.addEventListener("load", function() {
  starfield.main.init();
}, false);

window.onresize = function() {
  starfield.main.setField();
};
},{}]},{},[1])