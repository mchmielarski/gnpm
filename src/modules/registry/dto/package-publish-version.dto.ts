export interface PackagePublishVersionDTO {
  name: string;
  version: string;
  description: string;
  scripts: { [key: string]: string };
  keywords: string[];
  author: string;
  license: string;
  readme: string;
  readmeFilename: string;
  dist: {
    integrity: string;
    shasum: string;
    tarball: string;
  };
}
