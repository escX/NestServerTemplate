import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

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
  });

  // 监听端口，启动服务
  const configService = app.get(ConfigService);
  const port = configService.get('LOCAL_SERVER_PORT') || 3000;
  await app.listen(port);
}
bootstrap();
