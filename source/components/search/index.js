// Depends
const blessed = require('blessed');
const Events = require('../../libs/events');

const Search = class Search {

  constructor(screen, params) {
    this.screen = screen;
    this.params = params || {};
    this.tracks = [];

    return this;
  }

  render() {
    var form = blessed.form({
      parent: this.screen,
      top: '0%',
      left: 1,
      width: '100%-4',
      height: '10%',
      keys: true,
      fg: 'white',
      selectedFg: 'white',
      selectedBg: 'blue',
      label: 'Search:',
      border: {
        type: 'line', fg: '#ffffff'
      }
    });

    var textarea = blessed.textbox({
      parent: form,
      name: 'q',
      top: '10%',
      left: '0%',
      width: '99%',
      height: 3,
      input: true,
      inputOnFocus: true,
      keys: true,
      border: {
        type: 'line', fg: '#ffffff'
      }
    });

    form.on('submit', function(data) {
      Events.emit('search:start', data.q);
    });

    textarea.key(['enter'], function() {
      form.submit();
      textarea.clearValue();
    });

    return textarea;
  }
};

module.exports = function(params) {
  return new Search(params);
};
