import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  Index
} from 'typeorm';

import { Package } from './package.entity';
import { PackageVersion } from './package-version.entity';

@Entity({ name: 'package_dist_tags' })
@Index('index_with_name_version_tag', ['version', 'tag'], { unique: true })
export class PackageDistTag {
  @PrimaryGeneratedColumn() id: number;

  @Column()
  @Index()
  tag: string;

  @Column()
  @Index()
  version: string;

  @ManyToOne(type => Package, pkg => pkg.distTags)
  package: Package;

  @CreateDateColumn() created: Date;
}
