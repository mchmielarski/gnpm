import { PackagePublishAttachmentsDTO } from './package-publish-attachments.dto';
import { PackagePublishVersionsDTO } from './package-publish-versions.dto';

export interface PackagePublishDTO {
  name: string;
  description: string;
  distTags: {[tag: string]: string};
  readme: string;
  versions: PackagePublishVersionsDTO;
  attachments: PackagePublishAttachmentsDTO;
}
