import { PackagePublishVersionDTO } from './package-publish-version.dto';

export interface PackagePublishVersionsDTO {
  [version: string]: PackagePublishVersionDTO;
}
