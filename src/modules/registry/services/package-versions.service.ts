import { Component } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { parse as parseURL } from 'url';

import { PackageVersion } from '../entities';
import { PackagePublishVersionDTO } from '../dto';

@Component()
export class PackageVersionsService {
  constructor(
    @InjectRepository(PackageVersion)
    private readonly packageVersionsRepository: Repository<PackageVersion>
  ) {}

  saveAll(pkgId: number, pkgVersions: { [version: string]: PackagePublishVersionDTO }) {
    for (const version in pkgVersions) {
      if (pkgVersions.hasOwnProperty(version)) {
        this.save(pkgId, pkgVersions[version]);
      }
    }
  }

  save(pkgId: number, pkgVersionDTO: PackagePublishVersionDTO) {
    const { dist, ...data } = pkgVersionDTO;
    const tarball = parseURL(dist.tarball);

    dist.tarball = tarball.pathname as string;

    const version = this.packageVersionsRepository.create({
      ...pkgVersionDTO,
      dist,
      package: { id: pkgId }
    });

    return this.packageVersionsRepository.save(version);
  }
}
