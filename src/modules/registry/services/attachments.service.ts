import { Component } from '@nestjs/common';
import { Readable } from 'stream';
import { Buffer } from 'buffer';
import { join } from 'path';

import { StorageService } from '../../storage';
import { PackagePublishAttachmentDTO, PackagePublishAttachmentsDTO, PackageNameDTO } from '../dto';
import { AttachmentReadableStream } from '../util/attachment-readable-stream';

@Component()
export class AttachmentsService {
  constructor(private readonly storage: StorageService) {}

  saveAll(pkgName: PackageNameDTO, attachments: PackagePublishAttachmentsDTO) {
    const promises: Promise<void>[] = [];

    for (const attachmentName in attachments) {
      if (attachments.hasOwnProperty(attachmentName)) {
        promises.push(this.save(pkgName, attachmentName, attachments[attachmentName]));
      }
    }

    return Promise.all(promises);
  }

  private getAttachmentDataAsStream(attachment: PackagePublishAttachmentDTO): Readable {
    return new AttachmentReadableStream(attachment);
  }

  private save(
    pkgName: PackageNameDTO,
    attachmentName: string,
    attachment: PackagePublishAttachmentDTO
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const src = this.getAttachmentDataAsStream(attachment);
      const dest = this.storage.createWriteStream(join(pkgName.full, attachmentName));

      src
        .on('end', () => resolve())
        .on('error', error => reject(error))
        .pipe(dest);
    });
  }
}
