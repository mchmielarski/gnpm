import { join, basename, dirname } from 'path';
import * as Storage from '@google-cloud/storage';
import { Readable, Writable } from 'stream';

import { BaseAdapter } from './base.adapter';

export interface GoogleStorageAdapterOptions {
  projectId: string;
  keyFilename: string;
  bucket: string;
}

export class GoogleStorageAdapter extends BaseAdapter {
  private bucket: Storage.bucket;

  constructor(private readonly options: GoogleStorageAdapterOptions) {
    super();
    const storage = new Storage({
      projectId: this.options.projectId,
      keyFilename: this.options.keyFilename
    });
    this.bucket = storage.bucket(this.options.bucket);
  }

  async exists(name: string): Promise<boolean> {
    const result = await this.getFile(name).exists();
    return result[0];
  }

  async delete(name: string): Promise<void> {
    return this.getFile(name).delete();
  }

  async save(name: string, contents: any): Promise<void> {
    return this.getFile(name).save(contents);
  }

  async get(name: string): Promise<any> {
    const data = await this.getFile(name).get();
    return data[0];
  }

  createWriteStream(name: string): Writable {
    return this.getFile(name).createWriteStream();
  }

  createReadStream(name: string): Readable {
    return this.getFile(name).createReadStream();
  }

  private getFile(name: string) {
    return this.bucket.file(name);
  }
}
