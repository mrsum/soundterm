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
    Events.on('song:stop', () => this.stop());

    this._stream  = null;
    this._decoder = null;
  }

  play(song) {
    new Promise(resolve => {
      this.download(song.url, resolve);
    })
    .then(stream => {
      return this.createDecoder(stream);
    });
  }


  createDecoder(stream) {
    this.deinit();

    stream.on('error', this.onError);
    stream.on('close', this.onDecoderClosed);

    this._stream = stream;
    this._decoder = stream.pipe(new lame.Decoder);
    this._decoder
			.pipe(new Speaker({}))
			.on('error', this.onError)
			.on('close', this.onDecoderClosed);
  }

  onError() {
    return this.stop();
  }

  stop() {
    this.deinit();
    return Promise.resolve();
  }

  deinit() {
    if (this._stream) {
      this._stream.removeAllListeners('close');
      this._stream.destroy();
      this._stream.removeAllListeners('error');
      this._stream = null;
    }

    if (this._decoder) {
      this._decoder.removeAllListeners('close');
      this._decoder.removeAllListeners('error');
      this._decoder.unpipe();
      this._decoder = null;
    }
  }

  onDecoderClosed() {
    return this.deinit();
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
