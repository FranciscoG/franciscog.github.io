(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var starfield = require('../js/modules/starfield.js');
var terminal = require('../js/modules/terminal.js');
var blurify = require('../js/modules/blurify.js');

function resizeHeight(id) {
  return document.getElementById(id).style.height = window.innerHeight + "px";
}

var field = document.getElementById("field");
var stopped = false;

// http://bililite.com/wvm/cli.html
window.addEventListener("load", function() {
  starfield.main.init("field");
  resizeHeight("terminal");
}, false);

var terminalListener = function(e) {
  // stopped = true;
  // starfield.main.stop();
  // var blurry = new blurify({
  //   type: 'canvas',
  //   canvas: field,
  //   intensity: 25
  // });
  // var blurred = blurry.blurCanvas();
  // var boop = blurry.imageDataToCanvas(blurred);
  // var beep = blurry.convertCanvasToImage(boop);
  // field.remove();
  // document.body.style.backgroundImage = 'url(' + beep.src + ')';
  terminal.init();
  document.body.removeEventListener("click", terminalListener, false);
};
document.body.addEventListener("click", terminalListener, false);

window.onresize = function() {
  if (!stopped) {
    starfield.main.setField();
  }
  resizeHeight("terminal");
};
},{"../js/modules/blurify.js":2,"../js/modules/starfield.js":5,"../js/modules/terminal.js":6}],2:[function(require,module,exports){
var imgFilters = require('../modules/image_filters.js');
// also requires html2canvas.js

function blurify(options) {
  this.options = options;
  this.options.intensity = this.options.intensity || 25;
}

blurify.prototype.blurIMG = function(img) {
  var _img = this.options.image || img;
  return imgFilters.filterImage(imgFilters.convolute, _img, this.createNxN(this.options.intensity));
};

blurify.prototype.blurCanvas = function(canvas) {
  var _canvas = this.options.canvas || canvas;
  var newImg = this.convertCanvasToImage(_canvas);
  return imgFilters.filterImage(imgFilters.convolute, newImg, this.createNxN(this.options.intensity));
};

blurify.prototype.blurHTML = function(elem) {
  var _elem = this.options.node || elem;
  var self = this;
  html2canvas(_elem, {
    background: 'undefined', // makes it transparent
    onrendered: function(canvas) {
      if (typeof self.options.callback === 'function') {
        return self.options.callback(self.blurCanvas(canvas));
      } else {
        console.error('Blurify: Must specify a callback function');
      }
    }
  });
};

/**
 * Converts a rendered canvas into an image dataURI
 * @param  {canvas} canvas
 * @return {image node}
 */
blurify.prototype.convertCanvasToImage = function(canvas) {
  var image = new Image();
  image.src = canvas.toDataURL("image/png");
  return image;
};

blurify.prototype.imageDataToCanvas = function(idata) {
  var c = document.createElement('canvas');
  c.width = idata.width;
  c.height = idata.height;
  var ctx = c.getContext('2d');
  ctx.putImageData(idata, 0, 0);
  return c;
};

/**
 * creates a NxN array of 1/N that's used for setting intensity of blur
 * @param  {number} num   a whole number that is X squared.  examples: 4, 9, 16, 25, 36, ...
 * @return {object}       the array
 */
blurify.prototype.createNxN = function(num) {
  // create an array with a total of NxN 
  // where each item is 1 / NxN
  var _tempArr = [];
  for (var i = 0; i < num; i++) {
    _tempArr.push(1 / num);
  }
  return _tempArr;
};

module.exports = blurify;
},{"../modules/image_filters.js":4}],3:[function(require,module,exports){
/******************************************************************/
// AJAX helper
var getJSON = function(url, cb){
  var request = new XMLHttpRequest();
  request.open('GET', url, true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      var data = JSON.parse(request.responseText);
      cb(data);
    } else {
      // We reached our target server, but it returned an error
      console.warn("getJSON: target server returned an error");
    }
  };

  request.onerror = function() {
    // There was a connection error of some sort
    console.error("getJSON: connection error");
  };

  request.send();
};

/******************************************************************/
// Get that creepy gif!
// some help: http://speckyboy.com/2014/01/22/building-simple-reddit-api-webapp-using-jquery/

// get all the data from reddit and create an array of just the GIFs
var redditURL = 'http://www.reddit.com/r/creepygifs.json';

var creepyArray = [];

var getRandomFromArray = function(arr) {
  var num = Math.floor(Math.random()*(arr.length - 1));
  //console.log(arr.length, num);
  return arr[num];
};

var fixImgur = function(gif){
  if (/i\.imgur/i.test(gif)) {
    return gif;
  } else {
    var g = gif.split("/");
    return 'http://i.imgur.com/' + g[g.length - 1] + '.gif';
  }
};

var callback = null;

var checkArray = function(cb){
  var stopcheck = 0;

  if (creepyArray.length > 0) {
    var gif = getRandomFromArray(creepyArray);
    if (/imgur/i.test(gif)) { 
      // console.log(gif);
      gif = fixImgur(gif);
      return callback(gif);
    } else {
      return callback(gif);
    }
  } else {
    // keep looking
    if (stopcheck < 101) {
      stopcheck++;
      window.setTimeout(checkArray, 10);
    }
  }
};

module.exports = function(cb){
  
  getJSON(redditURL, function(json){
    var listing = json.data.children;
    for(var i=0, l=listing.length; i<l; i++) {
      var obj = listing[i].data;
      creepyArray.push(obj.url);
    } // end for{} loop
  });
  callback = cb;
  checkArray();
};
},{}],4:[function(require,module,exports){
// source: http://www.html5rocks.com/en/tutorials/canvas/imagefilters/
var Filters = {};

Filters.getPixels = function(img) {
  var c = this.getCanvas(img.width, img.height);
  var ctx = c.getContext('2d');
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, c.width, c.height);
};

Filters.getCanvas = function(w, h) {
  var c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
};

Filters.filterImage = function(filter, image, var_args) {
  var args = [this.getPixels(image)];
  for (var i = 2; i < arguments.length; i++) {
    args.push(arguments[i]);
  }
  return filter.apply(null, args);
};

Filters.grayscale = function(pixels, args) {
  var d = pixels.data;
  for (var i = 0; i < d.length; i += 4) {
    var r = d[i];
    var g = d[i + 1];
    var b = d[i + 2];
    // CIE luminance for the RGB
    // The human eye is bad at seeing red and blue, so we de-emphasize them.
    var v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    d[i] = d[i + 1] = d[i + 2] = v;
  }
  return pixels;
};

Filters.brightness = function(pixels, adjustment) {
  var d = pixels.data;
  for (var i = 0; i < d.length; i += 4) {
    d[i] += adjustment;
    d[i + 1] += adjustment;
    d[i + 2] += adjustment;
  }
  return pixels;
};


Filters.threshold = function(pixels, threshold) {
  var d = pixels.data;
  for (var i = 0; i < d.length; i += 4) {
    var r = d[i];
    var g = d[i + 1];
    var b = d[i + 2];
    var v = (0.2126 * r + 0.7152 * g + 0.0722 * b >= threshold) ? 255 : 0;
    d[i] = d[i + 1] = d[i + 2] = v;
  }
  return pixels;
};

Filters.tmpCanvas = document.createElement('canvas');
Filters.tmpCtx = Filters.tmpCanvas.getContext('2d');

Filters.createImageData = function(w, h) {
  return this.tmpCtx.createImageData(w, h);
};

Filters.convolute = function(pixels, weights, opaque) {
  var side = Math.round(Math.sqrt(weights.length));
  var halfSide = Math.floor(side / 2);
  var src = pixels.data;
  var sw = pixels.width;
  var sh = pixels.height;
  // pad output by the convolution matrix
  var w = sw;
  var h = sh;
  var output = Filters.createImageData(w, h);
  var dst = output.data;
  // go through the destination image pixels
  var alphaFac = opaque ? 1 : 0;
  for (var y = 0; y < h; y++) {
    for (var x = 0; x < w; x++) {
      var sy = y;
      var sx = x;
      var dstOff = (y * w + x) * 4;
      // calculate the weighed sum of the source image pixels that
      // fall under the convolution matrix
      var r = 0,
        g = 0,
        b = 0,
        a = 0;
      for (var cy = 0; cy < side; cy++) {
        for (var cx = 0; cx < side; cx++) {
          var scy = sy + cy - halfSide;
          var scx = sx + cx - halfSide;
          if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
            var srcOff = (scy * sw + scx) * 4;
            var wt = weights[cy * side + cx];
            r += src[srcOff] * wt;
            g += src[srcOff + 1] * wt;
            b += src[srcOff + 2] * wt;
            a += src[srcOff + 3] * wt;
          }
        }
      }
      dst[dstOff] = r;
      dst[dstOff + 1] = g;
      dst[dstOff + 2] = b;
      dst[dstOff + 3] = a + alphaFac * (255 - a);
    }
  }
  return output;
};

module.exports = Filters;
},{}],5:[function(require,module,exports){
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
    this.field.width = window.innerWidth;
    this.field.height = window.innerHeight;
    this.fieldWidth = this.field.offsetWidth;
    this.fieldHeight = this.field.offsetHeight;
  },

  init: function(id) {
    this.field = document.getElementById(id);
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
    starfield.running = null;

    // Run the main loop
    (function tick() {
      that.update();
      that.draw();
      starfield.running = requestAnimFrame(tick);
    })();
  },

  stop: function() {
    if (starfield.running) {
      cancelAnimFrame(starfield.running);
    }
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

module.exports = starfield;
},{}],6:[function(require,module,exports){
var typer = require('../modules/text_writer.js');
var getCreepyGif = require('../modules/getCreepyGif.js');

typer.speed = 30;

var terminal = {};

terminal.cli = function(elem, handler) {
  var prompt = '&gt;&nbsp';

  function newline() {
    var input = document.createElement('p');
    input.className = "currentInput";
    input.style.overflow = 'hidden';
    input.innerHTML = prompt + '<input type="text" id="input" style="outline:none;">';
    elem.appendChild(input);
    input.childNodes[1].focus();
  }
  newline();

  elem.addEventListener('keydown', function(evt) {
    if (evt.keyCode === 13) {
      var currentInput = document.getElementById("input");
      currentInput.parentNode.className = "pastInput";
      // currentInput.removeAttribute('contenteditable');
      currentInput.removeAttribute('id');
      var response = document.createElement('p');
      response.className = "response";
      elem.appendChild(response);
      typer.go(response, handler(currentInput.value), function() {
        newline();
      });
      return false;
    }
  }, false);
};

terminal.attachPic = function(pic) {
  var d = document.createElement('div');
  d.className = "floatingPic";
  var img = document.createElement('img');
  img.src = pic;
  d.appendChild(img);
  document.body.appendChild(d);
};

terminal.exit = false;

terminal.commands = {
  error: function(t) {
    return 'I do not understand: ' + t;
  },
  ls: function() {
    terminal.exit = false;
    return ['[v] viewport tool', '[r] CSS clip rect tool', '[g] github', '[c] codepen', '[o] other'];
  },
  menu: function() {
    return this.ls();
  },
  help: function() {
    return this.ls();
  },
  g: function() {
    window.location.href = 'https://github.com/FranciscoG';
  },
  v: function() {
    window.location.href = window.location.href + 'viewport.html';
  },
  c: function() {
    window.location.href = 'http://codepen.io/FranciscoG/';
  },
  r: function() {
    window.location.href = 'http://www.franciscog.com/cliprector/';
  },
  o: function() {
    terminal.exit = false;
    getCreepyGif(function(gif) {
      terminal.attachPic(gif);
    });
    return "you asked for it";
  },
  exit: function() {
    terminal.exit = true;
    return 'Are you sure? [Y/N]';
  },
  y: function() {
    if (terminal.exit) {
      terminal.exit = false;
      return "ok, see you later!";
    } else {
      return this.error("Y");
    }
  },
  n: function() {
    if (terminal.exit) {
      terminal.exit = false;
      return "Thanks for not leaving";
    } else {
      return this.error("N");
    }
  },
  clear: function() {
    terminal.exit = false;
    var past = Array.prototype.slice.call(document.querySelectorAll(".pastInput, .response, .next"));
    if (past.length > 0) {
      past.forEach(function(e, i, r) {
        if (i < past.length - 1) {
          document.getElementById("terminal").removeChild(past[i]);
        }
      });
    }
    return '';
  }
};

terminal.init = function() {
  var title = document.getElementById("title");
  typer.go(title, "Welcome to FranciscoG.com", function() {
    terminal.cli(document.getElementById("terminal"), function(text) {

      text = text.toLowerCase();
      if (text === 'shut up') {
        return 'You shut up';
      } else if (/i know you are but what am i/i.test(text)) {
        return text;
      } else if (typeof terminal.commands[text] === 'undefined') {
        return terminal.commands.error(text);
      } else {
        return terminal.commands[text]();
      }

    });
  });
};

module.exports = terminal;
},{"../modules/getCreepyGif.js":3,"../modules/text_writer.js":7}],7:[function(require,module,exports){
/** 
 * inspiration:
 * https://github.com/jaz303/jquery-grab-bag/blob/master/javascripts/jquery.text-effects.js
 *
 * half-block unicode info: http://www.fileformat.info/info/unicode/char/258c/index.htm
 * ▌ = \u258C   or    &#9612;
 */
var text_writer = {};

text_writer.speed = text_writer.speed || 80;

text_writer.go = function(elem, str, cb) {
  var repeat = false,
    i = 0,
    progress = 0;
  if (typeof str === 'object') {
    repeat = true;
  }
  elem.textContent = '';

  var stopTyping = function(__str) {
    return setTimeout(function() {
      elem.textContent = __str;
      if (typeof cb === 'function') {
        cb();
      }
    }, 500);
  };

  var startTyping = function() {
    var _str = (repeat) ? str[i] : str;

    if (repeat && i === str.length) {
      return stopTyping(_str);
    }

    var timer = setInterval(function() {
      elem.textContent = _str.substring(0, progress++) + '\u258C';
      elem.parentNode.scrollTop = elem.parentNode.scrollHeight;
      if (progress > _str.length) {
        clearInterval(timer);
        if (repeat && i < str.length) {
          i++;
          elem.textContent = _str;
          elem.insertAdjacentHTML('afterend', '<p class="next"></p>');
          elem = elem.nextSibling;
          progress = 0;
          return startTyping();
        } else {
          return stopTyping(_str);
        }
      }
    }, text_writer.speed);
  };
  startTyping();

};

module.exports = text_writer;
},{}]},{},[1])