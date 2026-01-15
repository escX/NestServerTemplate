import { ConfigService } from '@nestjs/config';
import { utilities } from 'nest-winston';
import winston from 'winston';
import 'winston-daily-rotate-file';

export default function CustomLogger(configService: ConfigService) {
  const env = configService.get('NODE_ENV');
  const transports: any[] = [
    new winston.transports.Console({
      level: 'warn',
      format: winston.format.combine(winston.format.timestamp(), utilities.format.nestLike()),
    }),
  ];

  if (env === 'production') {
    transports.push(
      new winston.transports.DailyRotateFile({
        level: 'warn',
        dirname: 'logs',
        filename: 'application-%DATE%.log',
        datePattern: 'YYYY-MM-DD-HH',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        format: winston.format.combine(winston.format.timestamp(), winston.format.simple()),
      })
    );
  }

  return winston.createLogger({
    transports,
    silent: env === 'test',
  });
}
