import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import winston from 'winston';
import { utilities, WinstonModule } from 'nest-winston';
import 'winston-daily-rotate-file';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: (requestOrigin, callback) => {
        const corsOrigin = process.env.CORS_ORIGIN || '*';
        callback(
          null,
          corsOrigin.split(',').map((item) => item.trim())
        );
      },
      credentials: true,
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    },
    logger: WinstonModule.createLogger({
      instance: winston.createLogger({
        transports: [
          new winston.transports.Console({
            level: process.env.NODE_ENV === 'production' ? 'warn' : 'info',
            format: winston.format.combine(
              winston.format.timestamp(),
              utilities.format.nestLike()
            ),
          }),
          new winston.transports.DailyRotateFile({
            level: 'warn',
            dirname: 'logs',
            filename: 'application-%DATE%.log',
            datePattern: 'YYYY-MM-DD-HH',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.simple()
            ),
          })
        ]
      })
    })
  });

  // 监听端口，启动服务
  const configService = app.get(ConfigService);
  const port = configService.get('LOCAL_SERVER_PORT') || 3000;
  await app.listen(port);
}
bootstrap();
