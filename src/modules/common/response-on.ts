import { Response } from 'express';

export function finish(response: Response, callback: () => void) {
  response.once('finish', callback);
  return () => response.removeListener('finish', callback);
}

export function close(response: Response, callback: () => void) {
  response.once('close', callback);
  return () => response.removeListener('close', callback);
}

export function send(response: Response, callback: () => void) {
  const previousSend = response.send.bind(response);

  response.send = (...args: any[]) => {
    callback();
    return previousSend(...args);
  };

  return () => {};
}

export function write(response: Response, callback: (buf) => void) {
  const previousWrite = response.write.bind(response);

  response.write = (buf) => {
    callback(buf);
    return previousWrite(buf);
  };

  return () => {};
}
