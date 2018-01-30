import { Component } from '@nestjs/common';

import { waitOnNextTick } from '../../common';
import { PackagePublishDTO, PackageNameDTO } from '../dto';
import { PackagesFallbackService } from './packages-fallback.service';
import { PackagesLocalService } from './packages-local.service';
import { AttachmentsService } from './attachments.service';

@Component()
export class PackagesService {
  constructor(
    private readonly attachmentsService: AttachmentsService,
    private readonly fallbackService: PackagesFallbackService,
    private readonly localService: PackagesLocalService
  ) {}

  async getManifest(pkgName: string, abbreviated: boolean = false) {
    let manifest = await this.localService.getManifest(pkgName, abbreviated);

    if (!manifest) {
      const {
        headers,
        body: { 'dist-tags': distTags, ...data }
      } = await this.fallbackService.getManifest(pkgName, abbreviated);
      const etag = (headers as any).etag;

      await this.localService.save({
        fallback: true,
        etag,
        distTags,
        ...data
      });

      await waitOnNextTick();

      manifest = await this.localService.getManifest(pkgName, abbreviated);
    }

    return manifest;
  }

  async getTarballAsStream(pkgName: string, tarball: string) {
    let stream = await this.localService.getTarballAsStream(pkgName, tarball);

    if (!stream) {
      stream = this.fallbackService.getTarballAsStream(pkgName, tarball) as any;

      if (stream) {
        this.localService.setTarballFromStream(pkgName, tarball, stream);
      }
    }

    return stream;
  }

  async save(pkgName: PackageNameDTO, pkgData: PackagePublishDTO) {
    await this.localService.save(pkgData);
    await this.attachmentsService.saveAll(pkgName, pkgData.attachments);
  }
}
