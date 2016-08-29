'use strict';

// Depends
const blessed = require('blessed');
const SC = require('../../libs/soundcloud');
const Events = require('../../libs/events');
const Player = require('../../libs/player');

const Playlist = class Playlist {

  constructor(screen, params) {
    this.screen = screen;
    this.params = params || {};
    this.tracks = [];

    new Player();

    return this;
  }

  render() {
    var list = blessed.list({
      parent: this.screen,
      top: '10%',
      left: 1,
      width: '100%-4',
      height: '88%',
      keys: true,
      fg: 'white',
      selectedFg: 'white',
      selectedBg: 'blue',
      interactive: true,
      label: 'Playlist:',
      border: {
        type: 'line', fg: '#ffffff'
      }
    });

    Events.on('loading:tracks', data => {
      this.tracks = data.map(item => {
        return { id: item.id, title: item.title, duration: item.duration };
      });

      list.setItems(this.tracks.map(item => {
        return item.title;
      }));

      Events.emit('render');
    });

    list.on('select', (el, selected) => {
      let active = this.tracks[selected];
      SC.get(`/tracks/${active.id}/stream`)
        .then(res => {
          Events.emit('song:play', res);
        });
    });

    return list;
  }
};

module.exports = function(params) {
  return new Playlist(params);
};
