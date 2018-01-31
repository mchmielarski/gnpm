import { Component } from '@nestjs/common';

import { FallbackService } from './fallback.service';

@Component()
export class PackagesFallbackService {
  constructor(private fallbackService: FallbackService) {}

  async getManifest(pkgName: string, abbreviated = false): Promise<any> {
    const encodedPackageName = pkgName.replace(/\//, '%2f');
    const headers: any = abbreviated
      ? { accept: 'application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8, */*' }
      : {};

    const response: any = await this.fallbackService.request(`/${encodedPackageName}`, headers);

    Object.keys(response.body.versions).forEach(v => {
      response.body.versions[v].dist.tarball = response.body.versions[v].dist.tarball.replace(
        `${this.fallbackService.getUrl()}`,
        ''
      );
    });

    return response;
  }

  getTarballAsStream(pkgName: string, tarball: string) {
    return this.fallbackService.requestStream(`/${pkgName}/-/${tarball}`);
  }
}
