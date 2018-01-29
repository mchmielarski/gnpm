import { Writable, Readable } from 'stream';

export abstract class BaseAdapter {
  abstract async exists(name: string): Promise<boolean>;

  abstract async delete(name: string): Promise<void>;

  abstract async save(name: string, contents: any): Promise<void>;

  abstract async get(name: string): Promise<any>;

  abstract createWriteStream(name: string): Writable;

  abstract createReadStream(name: string): Readable;
}
