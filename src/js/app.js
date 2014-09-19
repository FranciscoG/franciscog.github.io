var starfield = require('../js/modules/starfield.js');
var typer = require('../js/modules/text_writer.js');
var imgFilters = require('../js/modules/image_filters.js');

// Converts canvas to an image
function convertCanvasToImage(canvas) {
  var image = new Image();
  image.src = canvas.toDataURL("image/png");
  return image;
}

function imageDataToCanvas(idata) {
  var c = document.createElement('canvas');
  c.width = idata.width;
  c.height = idata.height;
  var ctx = c.getContext('2d');
  ctx.putImageData(idata, 0, 0);
  return c;
}

function createNxN(num) {
  // create an array of NxN
  // where each item is 1/NxN
  var _tempArr = [];
  for (var i = 0; i < num; i++) {
    _tempArr.push(1 / num);
  }
  return _tempArr;
}

var terminal = {};

terminal.test = function() {
  var title = document.getElementById("title");
  var options = {
    background: 'undefined',
    onrendered: function(canvas) {
      // take returned canvas element and convert it into an image
      var newTimg = convertCanvasToImage(canvas);
      // pass this image to image filter library and add blur, returns a canvas image data
      var blurredImg = imgFilters.filterImage(imgFilters.convolute, newTimg, createNxN(36));
      // put imageData onto a canvas and append that a div
      var newCanvas = imageDataToCanvas(blurredImg);
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