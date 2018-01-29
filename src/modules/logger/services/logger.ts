import * as bunyan from 'bunyan';

export class Logger {
  constructor(private readonly logger: bunyan) {}

  child(options: { [key: string]: any }) {
    const logger = this.logger.child({ options });
    return new Logger(logger);
  }

  trace(log: string);
  trace(log: { [key: string]: any }, message?: string);
  trace(log: string | { [key: string]: any }, message?: string) {
    this.log('trace', log, message);
  }

  debug(log: string);
  debug(log: { [key: string]: any }, message?: string);
  debug(log: string | { [key: string]: any }, message?: string) {
    this.log('debug', log, message);
  }

  info(log: string);
  info(log: { [key: string]: any }, message?: string);
  info(log: string | { [key: string]: any }, message?: string) {
    this.log('info', log, message);
  }

  warn(log: string);
  warn(log: { [key: string]: any }, message?: string);
  warn(log: string | { [key: string]: any }, message?: string) {
    this.log('warn', log, message);
  }

  error(log: string);
  error(log: { [key: string]: any }, message?: string);
  error(log: string | { [key: string]: any }, message?: string) {
    this.log('error', log, message);
  }

  fatal(log: string);
  fatal(log: { [key: string]: any }, message?: string);
  fatal(log: string | { [key: string]: any }, message?: string) {
    this.log('fatal', log, message);
  }

  private log(level: string, arg1: any, arg2: any) {
    if (arg2 === undefined) {
      this.logger[level](arg1);
    } else {
      this.logger[level](arg1, arg2);
    }
  }
}
