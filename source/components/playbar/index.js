'use strict';

const blessed = require('blessed');

const Playbar = class Playbar {
  constructor(params) {
    this.config = params.config || {};
    this.parent = params.parent;
    this.events = params.events;

    return this;
  }

  render() {
    return blessed.box({
      parent: this.parent,
      left: 1,
      top: '88%',
      width: '100%-4',
      height: '10%',
      content: 'playbar',
      tags: true,
      border: {
        type: 'line'
      },
      style: {
        fg: 'white',
        border: {
          fg: '#f0f0f0'
        }
      }
    });
  }
};

module.exports = function(config, parentScreen) {
  return new Playbar({config, parentScreen});
};
