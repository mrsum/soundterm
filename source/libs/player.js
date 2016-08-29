'use strict';

// Depends
const lame = require('lame');
const Promise = require('bluebird');
const Speaker = require('speaker');
const request = require('follow-redirects').https;
const Events = require('./events');

const Player = class Player {

  constructor() {
    Events.on('song:play', song => this.play(song));
    Events.on('song:stop', song => this.stop(song));

    this.resource = false;
    this.speaker = false;
  }

  play(song) {
    new Promise(resolve => {
      this.download(song.url, resolve);
    })
    .then(resource => {
      if (this.stop()) {
        this.decoder = new lame.Decoder();
        this.speaker = new Speaker();
        this.resource = resource;
      }

      return resource;
    })
    .then(resource => {
      resource
        .pipe(this.decoder)
        .pipe(this.speaker);
    });
  }

  stop() {
    this.speaker
      ? this.speaker.end()
      : null;

    this.resource
      ? this.resource.unpipe()
      : null;

    return true;
  }

  download(url, resolve) {
    let errorHandler = () => {};
    let responseHandler = (res) => {
      resolve(res);
    };

    request
      .get(url, responseHandler)
      .once('error', errorHandler);
  }
};

module.exports = Player;
