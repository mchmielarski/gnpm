import { PackagePublishAttachmentDTO } from './package-publish-attachment.dto';
export interface PackagePublishAttachmentsDTO {
  [attachment: string]: PackagePublishAttachmentDTO;
}
