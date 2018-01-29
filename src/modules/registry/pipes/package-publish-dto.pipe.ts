import { PipeTransform, Pipe, ArgumentMetadata } from '@nestjs/common';

@Pipe()
export class PackagePublishDTOPipe implements PipeTransform<any> {
  transform(value, metadata: ArgumentMetadata) {
    const { 'dist-tags': distTags, ...data } = value;

    return {
      distTags,
      ...data
    };
  }
}
