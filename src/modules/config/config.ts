import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import * as yaml from 'yaml';

class Config {

  private data: any;

  constructor() {
    this.init();
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

  getDatabaseOptions() {
    return this.data.database;
  }

  getFallbackRegistry() {
    return this.data.fallback && this.data.fallback[0];
  }

  private init() {
    const env = process.env.NODE_ENV || 'dev';
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

    const content = readFileSync(configFilePath, { encoding: 'utf8' })
      .split('\n')
      .filter(line => line.trim().length > 0)
      .join('\n') + '\n';

    this.data = yaml.eval(content);
  }
}

export const config = new Config();
