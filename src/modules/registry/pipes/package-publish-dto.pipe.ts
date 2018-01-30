import { PipeTransform, Pipe, ArgumentMetadata } from '@nestjs/common';
import { basename, join } from 'path';

@Pipe()
export class PackagePublishDTOPipe implements PipeTransform<any> {
  transform(value, metadata: ArgumentMetadata) {
    const {
      'dist-tags': distTags,
      _attachments: attachmentsSrc,
      versions: versionsSrc,
      ...data
    } = value;

    const attachments = {};
    const versions = {};

    Object.keys(versionsSrc).forEach(version => {
      const versionData = versionsSrc[version];
      versionData.dist.tarball = this.normalizeTarball(versionData.dist.tarball);

      versions[version] = versionData;
    });

    Object.keys(attachmentsSrc).forEach(name => {
      const normalizedName: string = name.split('/').pop() as string;
      attachments[normalizedName] = attachmentsSrc[name];
    });

    return {
      distTags,
      attachments,
      versions,
      ...data
    };
  }

  private normalizeTarball(tarball: string) {
    const tmp = tarball.split('/-/');
    tmp[1] = basename(tmp[1]);

    return tmp.join('/-/');
  }
}
