var starfield = require('../js/modules/starfield.js');
var typer = require('../js/modules/text_writer.js');
var imgFilters = require('../js/modules/image_filters.js');

// Converts canvas to an image
function convertCanvasToImage(canvas) {
  var image = new Image();
  image.src = canvas.toDataURL("image/png");
  return image;
}

function doit(idata) {
  var c = document.createElement('canvas');
  c.width = idata.width;
  c.height = idata.height;
  var ctx = c.getContext('2d');
  ctx.putImageData(idata, 0, 0);
  ctx.scale(0.4, 0.4);
  return c;
}

function createNxN(num) {
  var _tempArr = [];
  for (var i = 0; i < num; i++) {
    _tempArr.push(1 / num);
  }
  console.log(_tempArr);
  return _tempArr;
}

var terminal = {};

terminal.test = function() {
  var title = document.getElementById("title");
  var options = {
    background: 'undefined',
    onrendered: function(canvas) {
      var newTimg = convertCanvasToImage(canvas);
      var blurredImg = imgFilters.filterImage(imgFilters.convolute, newTimg, createNxN(9));
      var newCanvas = doit(blurredImg);
      newCanvas.className = "lastText";
      document.getElementById('terminal').appendChild(newCanvas);
    }
  };
  html2canvas(title, options);
};

terminal.init = function() {
  var title = document.getElementById("title");
  typer(title, "Welcome to FranciscoG.com", terminal.test);
};

// http://bililite.com/wvm/cli.html
window.addEventListener("load", function() {
  starfield.main.init();
  terminal.init();
}, false);

window.onresize = function() {
  starfield.main.setField();
};