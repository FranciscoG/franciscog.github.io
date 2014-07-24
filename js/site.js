(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// source: http://codentronix.com/2011/07/22/html5-canvas-3d-starfield/

var dimension = [document.documentElement.clientWidth, document.documentElement.clientHeight];
var field = document.getElementById("field");
field.width = dimension[0];
field.height = dimension[1];

var MAX_DEPTH = 32;
var ctx;
var totalStars = 512;
var stars = new Array(totalStars);

/* Returns a random number in the range [minVal,maxVal] */
function randomRange(minVal, maxVal) {
  return Math.floor(Math.random() * (maxVal - minVal - 1)) + minVal;
}

function initStars() {
  for (var i = 0; i < stars.length; i++) {
    stars[i] = {
      x: randomRange(-25, 25),
      y: randomRange(-25, 25),
      z: randomRange(MAX_DEPTH, 1)
    };
  }
}

function loop() {
  var canvas = field;
  var halfWidth = canvas.width / 2;
  var halfHeight = canvas.height / 2;

  // fill canvas bg with black
  ctx.fillStyle = "rgb(0,0,0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (var i = 0; i < stars.length; i++) {
    // increase the z-index of each star by 0.2
    stars[i].z += 0.2;

    if (stars[i].z >= MAX_DEPTH) {
      stars[i].x = randomRange(-25, 25);
      stars[i].y = randomRange(-25, 25);
      stars[i].z = 1;
    }

    var k = Math.round(totalStars / 4) / stars[i].z;
    var px = stars[i].x * k + halfWidth;
    var py = stars[i].y * k + halfHeight;

    if (px >= 0 && px <= 500 && py >= 0 && py <= canvas.height) {
      var size = (1 - stars[i].z / 32.0) * 5;
      var shade = parseInt((1 - stars[i].z / 32.0) * (window.innerWidth / 2), 10);
      ctx.fillStyle = "rgb(" + shade + "," + shade + "," + shade + ")";
      ctx.fillRect(px, py, size, size);
    }
  }
}

window.onload = function() {
  if (field && field.getContext) {
    ctx = field.getContext("2d");
    initStars(); // place the stars in random locations within the canvas
    setInterval(loop, 22);
  }
};
},{}]},{},[1])