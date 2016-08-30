// Depends
const blessed = require('blessed');
const Events = require('../../libs/events');

const Command = class Command {

  constructor(screen, params) {
    this.screen = screen;
    this.params = params || {};
    this.tracks = [];

    return this;
  }

  render() {
    var form = blessed.form({
      parent: this.screen,
      bottom: 0,
      left: 1,
      width: '100%-4',
      height: 3,
      keys: true,
      fg: 'white',
      selectedFg: 'white',
      selectedBg: 'blue',
      label: 'Command:',
      border: {
        type: 'line', fg: 'blue'
      },
      padding: {
        left: 1,
        right: 1
      }
    });

    var textarea = blessed.textbox({
      parent: form,
      name: 'q',
      top: '10%',
      left: '0%',
      width: '100%-6',
      height: 1,
      input: true,
      inputOnFocus: true,
      keys: true
    });

    form.on('submit', function(data) {
      Events.emit('search:start', data.q);
    });

    textarea.key(['enter'], function() {
      form.submit();
      textarea.clearValue();
    });

    textarea.key(['esc'], function() {
      textarea.clearValue();
    });

    return textarea;
  }
};

module.exports = function(params) {
  return new Command(params);
};
