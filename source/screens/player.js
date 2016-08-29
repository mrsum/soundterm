'use strict';

// Depends
const blessed = require('blessed');

const search = require('../components/search');
const playlist = require('../components/playlist');

const PlayerScreen = class PlayerScreen {

  constructor(screen, params) {
    this.screen = screen;
    this.params = params || {};

    return this;
  }

  render() {
    let soundtermBox = blessed.box({
      parent: this.screen,
      autoPadding: true,
      top: '0%',
      left: '0%',
      width: '100%',
      height: '100%',
      border: {
        type: 'line',
      },
      style: {
        border: {
          fg: 'blue',
        },
      }
    });

    var searchComponent = search(soundtermBox, {}).render();
    var playlistComponent = playlist(soundtermBox, {}).render();

    this.screen.key(['S-up'], () => {
      searchComponent.focus();
    });

    this.screen.key(['S-down'], () => {
      playlistComponent.focus();
    });

    return soundtermBox;
  }
};

module.exports = function(screen, params) {
  return new PlayerScreen(screen, params);
};
