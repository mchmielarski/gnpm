import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import * as yaml from 'yaml';

class Config {
  private data: any;

  constructor() {
    this.init();
  }

  getEnv() {
    return process.env.NODE_ENV || 'dev';
  }

  isDevEnv() {
    return this.getEnv() === 'dev';
  }

  isTestEnv() {
    return this.getEnv() === 'test';
  }

  getPort() {
    return this.data.port;
  }

  getHostname() {
    return this.data.hostname;
  }

  getLocalRegistry() {
    return `http://${this.data.hostname}:${this.data.port}`;
  }

  getStorageType() {
    return this.data.storage.type;
  }

  getStorageOptions() {
    const { type, ...options } = this.data.storage;
    return options;
  }

  getDatabaseOptions() {
    return this.data.database;
  }

  getFallbackRegistry() {
    return this.data.fallback && this.data.fallback[0];
  }

  private init() {
    const env = this.getEnv();
    const path = join(__dirname + '../../../config');

    try {
      this.load(join(path, `${env}.yaml`));
    } catch (e) {
      this.load(join(path, 'default.yaml'));
    }
  }

  private load(configFilePath: string) {
    if (!existsSync(configFilePath)) {
      throw new Error(`Config file ${configFilePath} does not exist.`);
    }

    const content =
      readFileSync(configFilePath, { encoding: 'utf8' })
        .split('\n')
        .filter(line => line.trim().length > 0)
        .join('\n') + '\n';

    this.data = yaml.eval(content);
  }
}

export const config = new Config();
