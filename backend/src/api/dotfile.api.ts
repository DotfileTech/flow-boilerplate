import axios from 'axios';
import * as https from 'https';

class Dotfile {
  serverUrl: string;
  secretKey: string;
  isDev: boolean;

  constructor(
    config: { host?: string; secretKey?: string; isDev?: boolean } = {}
  ) {
    config.host = config.host || 'https://api.dotfile.com/v1';
    this.serverUrl = config.host;

    if (this.serverUrl.slice(-1) === '/') {
      this.serverUrl = this.serverUrl.slice(0, -1);
    }

    try {
      new URL(this.serverUrl);
    } catch (err) {
      throw new Error(
        `Invalid URL provided for the Dotfile host: ${this.serverUrl}`
      );
    }

    this.secretKey = config.secretKey || '';
    this.isDev = config.isDev || true;
  }

  public async request(
    method: string,
    endpoint: string,
    params: {},
    payload: {},
    headers: {}
  ) {
    const url = `${this.serverUrl}/${endpoint}`;

    const { data } = await axios(url, {
      method,
      params,
      headers: {
        'Content-Type': 'application/json',
        'Accept-Encoding': 'application/json',
        'X-DOTFILE-API-KEY': this.secretKey,
        ...headers,
      },
      data: payload,
      httpsAgent: new https.Agent({
        rejectUnauthorized: !this.isDev,
      }),
    });

    return data;
  }
}

export default Dotfile;
