import { Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderModule } from './order/order.module';
import { LoggerMiddleware } from './logging/logger.middleware';
import { devConfig } from './config/database.config';

@Module({
  imports: [TypeOrmModule.forRoot(devConfig), OrderModule],
})
export class AppModule implements NestModule {
  configure(consumer) {
    consumer.apply(LoggerMiddleware).forRoutes('orders');
  }
}
