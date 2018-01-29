import { Component } from '@nestjs/common';
import { Readable, Writable } from 'stream';

import { BaseAdapter } from '../adapters';

@Component()
export class StorageService {

  constructor(
    private readonly adapter: BaseAdapter
  ) {}

  async exists(name: string): Promise<boolean> {
    return this.adapter.exists(name);
  }

  async delete(name: string): Promise<void> {
    return this.adapter.delete(name);
  }

  async save(name: string, contents: any): Promise<void> {
    return this.adapter.save(name, contents);
  }

  async get(name: string): Promise<any> {
    return this.adapter.get(name);
  }

  createWriteStream(name: string): Writable {
    return this.adapter.createWriteStream(name);
  }

  createReadStream(name: string): Readable {
    return this.adapter.createReadStream(name);
  }
}
