var starfield = require('../js/modules/starfield.js');
var typer = require('../js/modules/text_writer.js');

var terminal = {};

terminal.init = function() {
  var title = document.getElementById("title");
  // typer(title, "Welcome to FranciscoG.com");
};

// http://bililite.com/wvm/cli.html
window.addEventListener("load", function() {
  starfield.main.init();
  terminal.init();
}, false);

window.onresize = function() {
  starfield.main.setField();
};