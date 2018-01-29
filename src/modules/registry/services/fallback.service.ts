import { Component } from '@nestjs/common';
import * as r from 'request';

import { config } from '../../config';

@Component()
export class FallbackService {
  enabled(): boolean {
    return !!config.getFallbackRegistry();
  }

  getUrl() {
    return config.getFallbackRegistry();
  }

  request(path: string, headers: { [key: string]: string } = {}) {
    return new Promise((resolve, reject) => {
      r(
        `${this.getUrl()}${path}`,
        { headers, json: true },
        (error, response, body) => {
          if (error) {
            return reject(error);
          }
          resolve({ headers: response.headers, body });
        }
      );
    });
  }

  requestStream(path: string, headers: { [key: string]: string } = {}) {
    return r(`${this.getUrl()}${path}`, { headers });
  }
}
