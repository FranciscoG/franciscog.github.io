/** 
 * inspiration:
 * https://github.com/jaz303/jquery-grab-bag/blob/master/javascripts/jquery.text-effects.js
 *
 * half-block unicode info: http://www.fileformat.info/info/unicode/char/258c/index.htm
 * ▌ = \u258C   or    &#9612;
 */

module.exports = function(elem, str, cb) {
  var progress = 0;
  elem.textContent = '';
  var timer = setInterval(function() {
    elem.textContent = str.substring(0, progress++) + '\u258C';
    if (progress > str.length) {
      clearInterval(timer);
      setTimeout(function() {
        elem.textContent = str;
        if (typeof cb === 'function') {
          cb();
        }
      }, 500);
    }
  }, 80);
};