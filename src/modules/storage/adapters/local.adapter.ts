import { BaseAdapter } from './base.adapter';
import { Readable, Writable } from 'stream';
import * as mkdirp from 'mkdirp';
import {
  createReadStream,
  createWriteStream,
  exists,
  unlink,
  writeFile,
  readFile
} from 'fs';
import { promisify } from 'util';
import { join, basename, dirname } from 'path';

const existsAsync = promisify(exists);
const unlinkAsync = promisify(unlink);
const writeFileAsync = promisify(writeFile);
const readFileAsync = promisify(readFile);
const mkdirAsync = promisify(mkdirp);

export interface LocalAdapterOptions {
  root: string;
}

export class LocalAdapter extends BaseAdapter {
  constructor(private readonly options: LocalAdapterOptions) {
    super();
  }

  async exists(name: string): Promise<boolean> {
    return existsAsync(this.getPath(name));
  }

  async delete(name: string): Promise<void> {
    return unlinkAsync(this.getPath(name));
  }

  async save(name: string, contents: any): Promise<void> {
    return writeFileAsync(this.getPath(name), contents);
  }

  async get(name: string): Promise<any> {
    return readFileAsync(this.getPath(name));
  }

  createWriteStream(name: string): Writable {
    const path = this.getPath(name);
    const dirPath = dirname(path);

    mkdirp.sync(dirPath);

    return createWriteStream(path);
  }

  createReadStream(name: string): Readable {
    return createReadStream(this.getPath(name));
  }

  private getPath(name: string): string {
    return join(this.options.root, name);
  }
}
