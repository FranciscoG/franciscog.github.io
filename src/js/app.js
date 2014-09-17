var starfield = require('../js/modules/starfield.js');
var typer = require('../js/modules/text_writer.js');

// http://bililite.com/wvm/cli.html
window.addEventListener("load", function() {
  starfield.main.init();
}, false);

window.onresize = function() {
  starfield.main.setField();
};