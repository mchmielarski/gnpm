import { PackagePublishAttachmentDTO } from './package-publish-attachment.dto';
import { PackagePublishVersionDTO } from './package-publish-version.dto';

export interface PackagePublishDTO {
  name: string;
  description: string;
  distTags: {[tag: string]: string};
  readme: string;
  versions: {[version: string]: PackagePublishVersionDTO };
  _attachments: {[name: string]: PackagePublishAttachmentDTO};
}
