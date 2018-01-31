import { Readable } from 'stream';
import { Buffer } from 'buffer';

import { PackagePublishAttachmentDTO } from '../dto';

export class AttachmentReadableStream extends Readable {
  constructor(attachment: PackagePublishAttachmentDTO) {
    super();

    this.push(new Buffer(attachment.data, 'base64'));
    this.close();
  }

  _read() {}

  close() {
    this.push(null);
  }
}
