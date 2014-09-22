/** 
 * inspiration:
 * https://github.com/jaz303/jquery-grab-bag/blob/master/javascripts/jquery.text-effects.js
 *
 * half-block unicode info: http://www.fileformat.info/info/unicode/char/258c/index.htm
 * ▌ = \u258C   or    &#9612;
 */
var text_writer = {};

text_writer.speed = text_writer.speed || 80;

text_writer.go = function(elem, str, cb) {
  var repeat = false,
    i = 0,
    progress = 0;
  if (typeof str === 'object') {
    repeat = true;
  }
  elem.textContent = '';

  var stopTyping = function(__str) {
    return setTimeout(function() {
      elem.textContent = __str;
      if (typeof cb === 'function') {
        cb();
      }
    }, 500);
  };

  var startTyping = function() {
    var _str = (repeat) ? str[i] : str;

    if (repeat && i === str.length) {
      return stopTyping(_str);
    }

    var timer = setInterval(function() {
      elem.textContent = _str.substring(0, progress++) + '\u258C';
      elem.parentNode.scrollTop = elem.parentNode.scrollHeight;
      if (progress > _str.length) {
        clearInterval(timer);
        if (repeat && i < str.length) {
          i++;
          elem.textContent = _str;
          elem.insertAdjacentHTML('afterend', '<p class="next"></p>');
          elem = elem.nextSibling;
          progress = 0;
          return startTyping();
        } else {
          return stopTyping(_str);
        }
      }
    }, text_writer.speed);
  };
  startTyping();

};

module.exports = text_writer;