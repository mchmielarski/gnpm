import { Controller, All, Get, Headers, Query, Put, Res, Req, Param, Body } from '@nestjs/common';
import { Response, Request } from 'express';

import { Abbreviated } from '../decorators';
import { PackageNotFoundException, TarballNotFoundException } from '../exceptions';
import { PackagePublishDTO } from '../dto';
import { PackagePublishDTOPipe } from '../pipes';
import { AttachmentsService, PackagesService } from '../services';

@Controller()
export class PackagesController {
  constructor(
    private readonly attachments: AttachmentsService,
    private readonly packagesService: PackagesService
  ) {}

  @Get(':pkgName')
  async getMetadata(@Param('pkgName') pkgName: string, @Abbreviated() abbreviated: boolean) {
    const manifest = await this.packagesService.getManifest(pkgName, abbreviated);

    if (!manifest) {
      throw new PackageNotFoundException();
    }

    return manifest;
  }

  @Put(':pkgName')
  async publish(
    @Body(new PackagePublishDTOPipe())
    pkg: PackagePublishDTO,
    @Headers() heads
  ) {
    await Promise.all([
      this.packagesService.save(pkg),
      this.attachments.saveAll(pkg)
    ]);
  }

  @Get(':scope/:package/-/:tarball')
  tarballWithScope(
    @Param('package') packageName: string,
    @Param('scope') scope: string,
    @Param('tarball') tarball: string,
    @Res() response: Response
  ) {
    packageName = scope ? `${scope}/${packageName}` : packageName;
    this.download(packageName, tarball, response);
  }

  @Get(':pkgName/-/:tarball')
  tarballWithoutScope(
    @Param('pkgName') pkgName: string,
    @Param('tarball') tarball: string,
    @Res() response: Response
  ) {
    this.download(pkgName, tarball, response);
  }

  private async download(pkgName: string, tarball: string, response: Response) {
    const stream: any = await this.packagesService.getTarballAsStream(pkgName, tarball);

    if (!stream) {
      throw new TarballNotFoundException();
    }
    response.setHeader('Content-type', 'application/octet-stream');
    stream.pipe(response);
  }
}
