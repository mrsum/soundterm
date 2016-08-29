'use strict';

// Depends
const Config = require('../../config');
const fetch = require('node-fetch');

/**
 * [Soundcloud description]
 * @type {[type]}
 */
const Soundcloud = class Soundcloud {

  constructor(clientId, clientSecret) {
    this.host = 'https://api.soundcloud.com';
    this.clientId = clientId || false;
    this.clientSecret = clientSecret || false;
  }

  /**
   * [description]
   * @param  {[type]} url [description]
   * @return {[type]}     [description]
   */
  get(url, data) {
    var params = [];
    if (typeof data === 'object' && Object.keys(data).length > 0) {
      params = Object.keys(data).map(item => {
        return `${item}=${data[item]}`;
      });
    }

    return fetch(`${this.host}${url}?client_id=${this.clientId}&${params.join('&')}`);
  }

};

module.exports = new Soundcloud(Config.credentials.clientId, Config.credentials.clientSecret);
