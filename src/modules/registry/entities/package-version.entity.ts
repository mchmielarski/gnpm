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

  @Column({
    type: 'text',
    nullable: true
  })
  description: string;

  @Column({ type: 'text', nullable: true })
  scripts: { [key: string]: string };

  @Column({ type: 'simple-array', nullable: true })
  keywords: string[];

  @Column({ nullable: true })
  author: string;

  @Column({ nullable: true })
  license: string;

  @Column({ nullable: true })
  readme: string;

  @Column({ nullable: true })
  readmeFilename: string;

  @Column({ default: false })
  hasShrinkwrap: boolean;

  @Column({ type: 'text', nullable: true })
  directories: { [key: string]: string };

  @Column({ type: 'text', nullable: true })
  dependencies: { [key: string]: string };

  @Column({ type: 'text', nullable: true })
  devDependencies: { [key: string]: string };

  @Column({ type: 'text' })
  dist: { [key: string]: string };

  @Column({
    default: false
  })
  fallback: boolean;

  @ManyToOne(type => Package, pkg => pkg.versions, { cascadeRemove: true })
  package: Package;

  @OneToMany(type => PackageDistTag, tag => tag.version)
  distTags: PackageDistTag[];

  @CreateDateColumn() created: Date;

  @AfterLoad()
  onAfterLoad() {
    try {
      this.dist = JSON.parse(this.dist as any);
    } catch (e) {}

    try {
      this.dependencies = JSON.parse(this.dependencies as any);
    } catch (e) {}

    try {
      this.devDependencies = JSON.parse(this.devDependencies as any);
    } catch (e) {}

    try {
      this.scripts = JSON.parse(this.scripts as any);
    } catch (e) {}
  }

  @BeforeInsert()
  onBeforeInsert() {
    try {
      (this.dist as any) = JSON.stringify(this.dist);
    } catch (e) {}

    try {
      (this.dependencies as any) = JSON.stringify(this.dependencies);
    } catch (e) {}

    try {
      (this.devDependencies as any) = JSON.stringify(this.devDependencies);
    } catch (e) {}

    try {
      (this.scripts as any) = JSON.stringify(this.scripts);
    } catch (e) {}
  }
}
