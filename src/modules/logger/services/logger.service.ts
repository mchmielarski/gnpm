import { Component, Inject, ReflectMetadata } from '@nestjs/common';
import * as bunyan from 'bunyan';
import { Request } from 'express';
import chalk from 'chalk';
import * as Stream from 'stream';

import { RawAdapter } from '../adapters/raw.adapter';
import { Logger } from './logger';

function wrapAdapter(adapter: RawAdapter) {
  const stream = new Stream.Writable();

  stream.write = obj => {
    adapter.write(obj);
    return true;
  };

  return {
    type: adapter.type,
    level: adapter.level,
    stream
  } as bunyan.Stream;
}

function createStreams(adapters: RawAdapter[]) {
  return adapters.map(wrapAdapter);
}

@Component()
export class LoggerService extends Logger {
  constructor(@Inject('ADAPTERS') adapters: RawAdapter[]) {
    super(
      bunyan.createLogger({
        name: 'gnpm',
        streams: createStreams(adapters),
        serializers: {
          error: bunyan.stdSerializers.err,
          request: bunyan.stdSerializers.req,
          response: bunyan.stdSerializers.res
        }
      })
    );
  }
}

// function getlvl(x) {
//   switch (true) {
//     case x < 15:
//       return 'trace';
//     case x < 25:
//       return 'debug';
//     case x < 35:
//       return 'info';
//     case x === 35:
//       return 'http';
//     case x < 45:
//       return 'warn';
//     case x < 55:
//       return 'error';
//     default:
//       return 'fatal';
//   }
// }

// const levels = {
//   fatal: chalk.red,
//   error: chalk.red,
//   warn: chalk.yellow,
//   http: chalk.magenta,
//   info: chalk.cyan,
//   debug: chalk.green,
//   trace: chalk.white
// };

// let max = 0;
// for (const l in levels) {
//   if (Object.prototype.hasOwnProperty.call(levels, l)) {
//     max = Math.max(max, l.length);
//   }
// }

// function pad(str) {
//   if (str.length < max) {
//     return str + ' '.repeat(max - str.length);
//   }
//   return str;
// }

// function print(type, msg, obj, colors) {
//   if (typeof type === 'number') {
//     type = getlvl(type);
//   }
//   const finalmsg = msg.replace(/@{(!?[$A-Za-z_][$0-9A-Za-z\._]*)}/g, (_, name) => {
//     let str = obj;
//     let is_error;
//     if (name[0] === '!') {
//       name = name.substr(1);
//       is_error = true;
//     }

//     const _ref = name.split('.');
//     for (const id of _ref) {
//       if (Array.isArray(str)) {
//         str = str[id];
//       } else {
//         str = undefined;
//       }
//     }

//     if (typeof str === 'string') {
//       if (!colors || str.includes('\n')) {
//         return str;
//       } else if (is_error) {
//         return chalk.red(str);
//       } else {
//         return chalk.green(str);
//       }
//     } else {
//       return require('util').inspect(str, null, null, colors);
//     }
//   });

//   const subsystems = [
//     {
//       in: chalk.green('<--'),
//       out: chalk.yellow('-->'),
//       fs: chalk.black('-=-'),
//       default: chalk.blue('---')
//     },
//     {
//       in: '<--',
//       out: '-->',
//       fs: '-=-',
//       default: '---'
//     }
//   ];

//   const sub = subsystems[colors ? 0 : 1][obj.sub] || subsystems[+!colors].default;
//   if (colors) {
//     return ` ${levels[type](pad(type))}${chalk.white(`${sub} ${finalmsg}`)}`;
//   } else {
//     return ` ${pad(type)}${sub} ${finalmsg}`;
//   }
// }
