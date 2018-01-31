import { Component } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PackageDistTag } from '../entities';

@Component()
export class PackageDistTagsService {
  constructor(
    @InjectRepository(PackageDistTag)
    private readonly packageDistTagsRepository: Repository<PackageDistTag>
  ) {}

  saveAll(pkgId: number, pkgDistTags: { [tag: string]: string }) {
    for (const tag in pkgDistTags) {
      if (pkgDistTags.hasOwnProperty(tag)) {
        this.save(pkgId, tag, pkgDistTags[tag]);
      }
    }
  }

  save(pkgId: number, tag: string, version: string) {
    const distTag = this.packageDistTagsRepository.create({
      tag,
      version,
      package: { id: pkgId }
    });

    return this.packageDistTagsRepository.save(distTag);
  }
}
