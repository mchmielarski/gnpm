import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  Index,
  AfterLoad,
  BeforeInsert
} from 'typeorm';

import { Package } from './package.entity';
import { PackageDistTag } from './package-dist-tag.entity';

@Entity({ name: 'package_versions' })
@Index('index_with_name_and_version', ['name', 'version'], { unique: true })
export class PackageVersion {
  @PrimaryGeneratedColumn() id: number;

  @Column()
  @Index()
  name: string;

  @Column()
  @Index()
  version: string;

  @Column({ type: 'text' })
  description: string = '';

  @Column({ type: 'simple-json', nullable: true })
  scripts: { [key: string]: string };

  @Column({ type: 'simple-array', nullable: true })
  keywords: string[];

  @Column() author: string;

  @Column() license: string;

  @Column({ nullable: true })
  readme: string;

  @Column({ nullable: true })
  readmeFilename: string;

  @Column({ default: false })
  hasShrinkwrap: boolean;

  @Column({ type: 'simple-json', nullable: true })
  directories: { [key: string]: string };

  @Column({ type: 'simple-json', nullable: true })
  dependencies: { [key: string]: string };

  @Column({ type: 'simple-json', nullable: true })
  devDependencies: { [key: string]: string };

  @Column({ type: 'simple-json', nullable: true })
  dist: { [key: string]: string };

  @Column({ default: false })
  fallback: boolean;

  @ManyToOne(type => Package, pkg => pkg.versions)
  package: Package;

  @OneToMany(type => PackageDistTag, tag => tag.version)
  distTags: PackageDistTag[];

  @CreateDateColumn() created: Date;
}
