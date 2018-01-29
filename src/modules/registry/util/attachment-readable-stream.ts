import { Readable } from 'stream';
import { Buffer } from 'buffer';

export class AttachmentReadableStream extends Readable {

  constructor(data: string) {
    super();

    this.push(new Buffer(data, 'base64'));
    this.close();
  }

  _read() {}

  close() {
    this.push(null);
  }
}
