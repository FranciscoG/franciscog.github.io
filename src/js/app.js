var starfield = require('../js/modules/starfield.js');
var terminal = require('../js/modules/terminal.js');


// http://bililite.com/wvm/cli.html
window.addEventListener("load", function() {
  starfield.main.init();
  terminal.init();
}, false);

window.onresize = function() {
  starfield.main.setField();
};