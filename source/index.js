'use strict';

// Depends
const SC = require('./libs/soundcloud');
const Events = require('./libs/events');
const blessed = require('blessed');
const Screens = {
  player: require('./screens/player')
};

/**
 * soundterm player
 * @type {[type]}
 */
const Player = class Player {

  constructor(config) {
    this.config = config || {};

    // Create a screen object.
    this.screen = blessed.screen({
      smartCSR: true,
      dockBorders: true,
      fullUnicode: true,
      cursor: {
        artificial: true,
        blink: true,
        shape: 'underline'
      },
      log: `${__dirname}/application.log`,
      debug: true
    });

    // set title
    this.screen.title = 'soundterm';

    // event emitter object
    this.events = Events.machine;

    return this;
  }

  start() {
    Events.on('search:start', (q) => {
      SC.get('/tracks', { limit: 150, q: q })
        .then(res => {
          return res.json();
        })
        .then(json => {
          Events.emit('loading:tracks', json);
        });
    });

    SC.get('/tracks', { limit: 50 })
      .then(res => {
        return res.json();
      })
      .then(json => {
        Events.emit('loading:tracks', json);
      });

    Events.on('render', () => {
      this.screen.render();
    });

    // Quit on Escape, q, or Control-C.
    this.screen.key(['q', 'C-c'], function() {
      return process.exit(0);
    });

    Screens
      .player(this.screen, {})
      .render();

    // render screen
    this.screen.render();

    return this;
  }
};

/**
 * @param  {object} config
 * @return {object}
 */
module.exports = function(config) {
  return new Player(config).start();
};
