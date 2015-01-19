var typer = require('../modules/text_writer.js');
var getCreepyGif = require('../modules/getCreepyGif.js');

typer.speed = 30;

var terminal = {};

terminal.cli = function(elem, handler) {
  var prompt = '&gt;&nbsp';

  function newline() {
    var input = document.createElement('p');
    input.className = "currentInput";
    input.style.overflow = 'hidden';
    input.innerHTML = prompt + '<input type="text" id="input" style="outline:none;">';
    elem.appendChild(input);
    input.childNodes[1].focus();
  }
  newline();

  elem.addEventListener('keydown', function(evt) {
    if (evt.keyCode === 13) {
      var currentInput = document.getElementById("input");
      currentInput.parentNode.className = "pastInput";
      // currentInput.removeAttribute('contenteditable');
      currentInput.removeAttribute('id');
      var response = document.createElement('p');
      response.className = "response";
      elem.appendChild(response);
      typer.go(response, handler(currentInput.value), function() {
        newline();
      });
      return false;
    }
  }, false);
};

terminal.attachPic = function(pic) {
  var d = document.createElement('div');
  d.className = "floatingPic";
  var img = document.createElement('img');
  img.src = pic;
  d.appendChild(img);
  document.body.appendChild(d);
};

terminal.exit = false;

terminal.commands = {
  error: function(t) {
    return 'I do not understand: ' + t;
  },
  ls: function() {
    terminal.exit = false;
    return ['[v] viewport tool', '[r] CSS clip rect tool', '[g] github', '[c] codepen', '[o] other'];
  },
  menu: function() {
    return this.ls();
  },
  help: function() {
    return this.ls();
  },
  g: function() {
    window.location.href = 'https://github.com/FranciscoG';
  },
  v: function() {
    window.location.href = window.location.href + 'viewport.html';
  },
  c: function() {
    window.location.href = 'http://codepen.io/FranciscoG/';
  },
  r: function() {
    window.location.href = 'http://www.franciscog.com/cliprector/';
  },
  o: function() {
    terminal.exit = false;
    getCreepyGif(function(gif) {
      terminal.attachPic(gif);
    });
    return "you asked for it";
  },
  exit: function() {
    terminal.exit = true;
    return 'Are you sure? [Y/N]';
  },
  y: function() {
    if (terminal.exit) {
      terminal.exit = false;
      return "ok, see you later!";
    } else {
      return this.error("Y");
    }
  },
  n: function() {
    if (terminal.exit) {
      terminal.exit = false;
      return "Thanks for not leaving";
    } else {
      return this.error("N");
    }
  },
  clear: function() {
    terminal.exit = false;
    var past = Array.prototype.slice.call(document.querySelectorAll(".pastInput, .response, .next"));
    if (past.length > 0) {
      past.forEach(function(e, i, r) {
        if (i < past.length - 1) {
          document.getElementById("terminal").removeChild(past[i]);
        }
      });
    }
    return '';
  }
};

terminal.init = function() {
  var title = document.getElementById("title");
  typer.go(title, "Welcome to FranciscoG.com", function() {
    terminal.cli(document.getElementById("terminal"), function(text) {

      text = text.toLowerCase();
      if (text === 'shut up') {
        return 'You shut up';
      } else if (/i know you are but what am i/i.test(text)) {
        return text;
      } else if (typeof terminal.commands[text] === 'undefined') {
        return terminal.commands.error(text);
      } else {
        return terminal.commands[text]();
      }

    });
  });
};

module.exports = terminal;