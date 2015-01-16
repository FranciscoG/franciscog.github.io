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