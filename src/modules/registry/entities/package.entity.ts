import { Entity, Index, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';

import { PackageDistTag } from './package-dist-tag.entity';
import { PackageVersion } from './package-version.entity';

@Entity({ name: 'packages' })
export class Package {
  @PrimaryGeneratedColumn() id: number;

  @Column({
    unique: true
  })
  @Index()
  name: string;

  @Column({
    type: 'text',
    nullable: true
  })
  description: string;

  @Column({
    type: 'text',
    nullable: true
  })
  readme: string;

  @Column({
    default: false
  })
  fallback: boolean;

  @Column({
    nullable: true
  })
  etag: string;

  @OneToMany(type => PackageVersion, version => version.package)
  versions: PackageVersion[];

  @OneToMany(type => PackageDistTag, distTag => distTag.package)
  distTags: PackageDistTag[];

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

}
