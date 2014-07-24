var $ = require('jquery');

module.exports = {
  /****************************************************************
   * Avoid `console` errors in browsers that lack a console.
   */
  noConsole: function() {
    var method;
    var noop = function() {};
    var methods = [
      'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
      'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
      'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
      'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
      method = methods[length];

      // Only stub undefined methods.
      if (!console[method]) {
        console[method] = noop;
      }
    }
  },

  /****************************************************************
   * Trace where a console.log is coming from
   * source: http://remysharp.com/2014/05/23/where-is-that-console-log/
   */
  traceLog: function() {
    if (!Array.prototype.forEach) {
      ['log', 'warn'].forEach(function(method) {
        var old = console[method];
        console[method] = function() {
          var stack = (new Error()).stack.split(/\n/);
          // Chrome includes a single "Error" line, FF doesn't.
          if (stack[0].indexOf('Error') === 0) {
            stack = stack.slice(1);
          }
          var args = [].slice.apply(arguments).concat([stack[1].trim()]);
          return old.apply(console, args);
        };
      });
    }
  },

  /****************************************************************
   *  scroll to element via its id
   *  used to fix issues on some older browsers cause they suck
   */
  scrollToAnchor: function(aid) {
    $('html,body').animate({
      scrollTop: $(aid).offset().top
    }, 'fast');
  }
};