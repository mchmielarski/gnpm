import { AdapterType } from '../enums/adapter-type.enum';
import { LogLevel } from '../enums/log-level.enum';

export abstract class BaseAdapter<T> {
  constructor(public readonly type: AdapterType, public readonly level: LogLevel) {}

  abstract write(log: T);

  protected getLevelLabel(level: number): string {
    switch (true) {
      case level < 15:
        return 'trace';
      case level < 25:
        return 'debug';
      case level < 35:
        return 'info';
      case level < 45:
        return 'warn';
      case level < 55:
        return 'error';
      default:
        return 'fatal';
    }
  }
}
