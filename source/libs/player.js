'use strict';

// Depends
const lame = require('lame');
const Promise = require('bluebird');
const Speaker = require('speaker');
const request = require('follow-redirects').https;
const Events = require('./events');

const Player = class Player {

  constructor() {
    this.speaker = false;
    this.decoder = false;

    Events.on('song:play', song => this.play(song));
    Events.on('song:stop', song => this.stop(song));
  }

  play(song) {
    var setSpeaker = speaker => {
      this.speaker
        ? this.stop()
        : null;

      this.speaker = speaker;

      return speaker;
    };

    new Promise(resolve => {
      this.download(song.url, resolve);
    })
    .then(res => {
      this.decoder = new lame.Decoder();
      res
        .pipe(this.decoder)
        .on('format', function(format) {
          this.pipe(setSpeaker(new Speaker(format)));
        });
    });
  }

  stop() {
    this.decoder.unpipe();
    this.speaker
      ? this.speaker.close()
      : null;


    this.speaker = false;
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
