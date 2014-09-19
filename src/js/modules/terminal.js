var typer = require('../modules/text_writer.js');
var imgFilters = require('../modules/image_filters.js');
typer.speed = 50;

/**
 * Defining some utilities functions mostly use in termina.blur below
 */

/**
 * Converts a rendered canvas into an image dataURI
 * @param  {canvas} canvas
 * @return {image node}
 */
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
  // create an array with a total of NxN 
  // where each item is 1 / NxN
  var _tempArr = [];
  for (var i = 0; i < num; i++) {
    _tempArr.push(1 / num);
  }
  return _tempArr;
}

var terminal = {};

// this probably doesn't belong here but originally I was going to use it to replicate
// the computer scene from the 2001 film Avalon by Mamoru Oshii
terminal.blur = function(elem) {
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
  html2canvas(elem, options);
};

terminal.cli = function(elem, handler) {
  var prompt = '&gt;&nbsp';

  function newline() {
    var input = document.createElement('p');
    input.style.overflow = 'hidden';
    input.innerHTML = prompt + '<span id="input" style="outline:none" contenteditable></span>';
    elem.appendChild(input);
    input.childNodes[1].focus();
  }
  newline();

  elem.addEventListener('keydown', function(evt) {
    if (evt.keyCode === 13) {
      var currentInput = document.getElementById("input");
      currentInput.removeAttribute('contenteditable');
      currentInput.removeAttribute('id');
      var response = document.createElement('p');
      response.className = "response";
      elem.appendChild(response);
      typer.go(response, handler(currentInput.textContent || currentInput.innerText), function() {
        newline();
      });
      return false;
    }
  }, false);
};

terminal.init = function() {
  var title = document.getElementById("title");
  typer.go(title, "Welcome to FranciscoG.com", function() {
    terminal.cli(document.getElementById("terminal"), function(text) {
      if (/(ls|menu|help)/i.test(text)) {
        return ['[v] viewport tool', '[g] github'];
      }
      if (/v/i.test(text)) {
        window.location.href = window.location.href + 'viewport.html';
      }
      if (/g/i.test(text)) {
        window.location.href = 'https://github.com/FranciscoG';
      }
      return 'I do not understand: ' + text;
    });
  });
};

module.exports = terminal;