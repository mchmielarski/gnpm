import { Component } from '@nestjs/common';
import { Readable } from 'stream';
import { Buffer } from 'buffer';
import { join } from 'path';

import { StorageService } from '../../storage';
import { PackagePublishDto } from '../dto';
import { AttachmentReadableStream } from '../util/attachment-readable-stream';

@Component()
export class AttachmentsService {
  constructor(
    private readonly storage: StorageService
  ) {}

  getAttachmentData(dto, name: string) {
    return dto._attachments[name].data;
  }

  getAttachmentDataAsStream(dto, name: string): Readable {
    return new AttachmentReadableStream(this.getAttachmentData(dto, name));
  }

  saveAll(pkg: PackagePublishDto) {
    const promises: Promise<void>[] = [];

    for (const attachmentName in pkg._attachments) {
      if (pkg._attachments.hasOwnProperty(attachmentName)) {
        promises.push(this.save(pkg, attachmentName));
      }
    }

    return Promise.all(promises);
  }

  save(pkg: PackagePublishDto, attachmentName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const src = this.getAttachmentDataAsStream(pkg, attachmentName);
      const dest = this.storage.createWriteStream(join(pkg.name, attachmentName));

      src
        .on('end', () => resolve())
        .on('error', error => reject(error))
        .pipe(dest);
    });
  }
}
