import { NestMiddleware, MiddlewaresConsumer } from '@nestjs/common';

export function applyMiddlewareToControllers(
  consumer: MiddlewaresConsumer,
  middleware: { new (...args: any[]): NestMiddleware },
  controllers: any[]
) {
  for (const controller of controllers) {
    consumer.apply(middleware).forRoutes(controller);
  }
}
