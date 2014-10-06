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