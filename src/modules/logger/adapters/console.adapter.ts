import chalk from 'chalk';

import { RawLog } from '../interfaces/raw-log.interface';
import { RawAdapter } from './raw.adapter';

export class ConsoleAdapter extends RawAdapter {
  write(log: RawLog) {
    const isTTY = process.stdout.isTTY;

    if (isTTY) {
      const label = this.getLevelLabel(log.level);
      const eventSymbol = chalk.grey(this.getEventSymbol(log.event));

      const message = `${eventSymbol} ${log.event} ${log.request.method} ${log.status} ${log.request.url}`;

      process.stdout.write(`${message}\n`);
    }
  }

  private getEventSymbol(event: string) {

    switch (event) {
      case 'http:request:received': return '-->';
      case 'http:response:sent': return '<--';
      case 'http:response:canceled': return '-X-';
      default: return '   ';
    }
  }

  private getLevelColor(level: number) {
      switch (true) {
        case level < 15:
          return chalk.white;
        case level < 25:
          return chalk.green;
        case level < 35:
          return chalk.cyan;
        case level < 45:
          return chalk.yellow;
        case level < 55:
          return chalk.red;
        default:
          return chalk.red;
    }
  }

  protected getLevelLabel(level: number) {
    const color = this.getLevelColor(level);
    const label = super.getLevelLabel(level);

    return color(label);
  }
}
