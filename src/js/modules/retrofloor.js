/**
 * 
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


var retro_floor = {};

retro_floor.star = function() {
  this.x;
  this.y;
  this.z;

};

retro_floor.main = {
  
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

    // Init the squares/lines/whatever
    /*
      

     */

    this.run();
  },

  run: function() {
    var that = this;
    retro_floor.running = null;

    // Run the main loop
    (function tick() {
      that.update();
      that.draw();
      retro_floor.running = requestAnimFrame(tick);
    })();
  },

  stop: function() {
    if (retro_floor.running) {
      cancelAnimFrame(retro_floor.running);
    }
  },

  update: function() {
    // update the current position of all the squares
  },

  draw: function() {
    var ctx = this.context;
    // reset field
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, this.fieldWidth, this.fieldHeight);
    // draw squares
    
  }
};

module.exports = retro_floor;