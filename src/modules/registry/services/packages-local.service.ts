import { Component } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { config } from '../../config';
import { StorageService } from '../../storage';
import { Package } from '../entities';
import { PackagePublishDTO } from '../dto';
import { PackageDistTagsService } from './package-dist-tags.service';
import { PackageVersionsService } from './package-versions.service';

@Component()
export class PackagesLocalService {
  constructor(
    @InjectRepository(Package) private readonly packagesRepository: Repository<Package>,
    private readonly versionsService: PackageVersionsService,
    private readonly distTagsService: PackageDistTagsService,
    private readonly storageService: StorageService
  ) {}

  async save(pkgDTO: PackagePublishDTO) {
    let pkg = await this.findOneByName(pkgDTO.name);
    const { versions, distTags, ...pkgData } = pkgDTO;

    if (pkg) {
      pkg = this.packagesRepository.merge(pkg, pkgData);
    } else {
      pkg = this.packagesRepository.create(pkgData);
    }

    pkg = await this.packagesRepository.save(pkg);

    await Promise.all([
      this.versionsService.saveAll(pkg.id, versions),
      this.distTagsService.saveAll(pkg.id, distTags)
    ]);

    return pkg;
  }

  async getManifest(pkgName: string, abbreviated: boolean = false) {
    const pkg = await this.findOneByName(pkgName, true);

    if (!pkg) {
      return null;
    }

    const distTags = pkg.distTags.reduce((aggr: any, tag) => {
      aggr[tag.tag] = tag.version;
      return aggr;
    }, {});

    const versions = pkg.versions.reduce((aggr: any, version) => {
      version.dist.tarball = `${config.getLocalRegistry()}${version.dist.tarball}`;

      aggr[version.version] = {
        name: version.name,
        version: version.version,
        dependencies: version.dependencies,
        devDependencies: version.devDependencies,
        directories: version.directories,
        dist: version.dist,
        _hasShrinkwrap: version.hasShrinkwrap
      };

      return aggr;
    }, {});

    // tslint:disable
    const manifest = {
      modified: pkg.updated,
      name: pkg.name,
      'dist-tags': distTags,
      versions
    };
    // tslint:enable

    return manifest;
  }

  async getTarballAsStream(name: string, tarball: string) {
    if (await this.storageService.exists(`${name}/${tarball}`)) {
      return this.storageService.createReadStream(`${name}/${tarball}`);
    }
    return null;
  }

  setTarballFromStream(name: string, tarball: string, stream) {
    stream.pipe(this.storageService.createWriteStream(`${name}/${tarball}`));
  }

  private async findOneByName(name: string, withVersions = false) {
    const relations = withVersions ? { relations: ['versions', 'distTags'] } : {};
    return this.packagesRepository.findOne({ where: { name }, ...relations });
  }
}
