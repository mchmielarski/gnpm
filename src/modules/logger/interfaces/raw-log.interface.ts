export class RawLog {
  pid: number;
  host: string;
  name: string;
  msg: string;
  level: number;
  time: string;
  event: string;
  [key: string]: any;
}
