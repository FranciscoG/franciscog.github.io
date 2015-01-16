var typer = require('../modules/text_writer.js');
typer.speed = 50;

var terminal = {};

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

terminal.exit = false;

// TODO:  convert all function names to UPPERCASE 
terminal.commands = {
  ls: function() {
    return ['[v] viewport tool', '[g] github'];
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
  exit: function() {
    terminal.exit = true;
    return 'Are you sure? [Y/N]';
  },
  Y: function() {
    if (terminal.exit) {
      terminal.exit = false;
      return "goodbye!";
    } else {
      return "'I do not understand: Y";
    }
  },
  N: function() {
    if (terminal.exit) {
      terminal.exit = false;
      return "Thanks for not leaving";
    } else {
      return "'I do not understand: N";
    }
  },
  clear: function() {
    document.getElementById("terminal").innerHTML = '<p style="overflow: hidden;">&gt;&nbsp;<span id="input" style="outline:none" contenteditable=""></span></p>';
    return 'Welcome to FranciscoG.com';
  }
};

terminal.init = function() {
  var title = document.getElementById("title");
  typer.go(title, "Welcome to FranciscoG.com", function() {
    terminal.cli(document.getElementById("terminal"), function(text) {

      // TODO: convert all toUPPERCASE
      if (text === 'shut up') {
        return 'You shut up';
      } else if (/i know you are but what am i/i.test(text)) {
        return text;
      } else if (typeof terminal.commands[text] === 'undefined') {
        return 'I do not understand: ' + text;
      } else {
        return terminal.commands[text]();
      }

    });
  });
};

module.exports = terminal;