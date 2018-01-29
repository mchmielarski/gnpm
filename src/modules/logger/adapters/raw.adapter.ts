import { AdapterType } from '../enums/adapter-type.enum';
import { LogLevel } from '../enums/log-level.enum';
import { RawLog } from '../interfaces/raw-log.interface';
import { BaseAdapter } from './base.adapter';

export abstract class RawAdapter extends BaseAdapter<RawLog> {
  constructor(level: LogLevel = LogLevel.INFO) {
    super(AdapterType.RAW, level);
  }
}
