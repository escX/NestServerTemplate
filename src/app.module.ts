import {
  ClassSerializerInterceptor,
  HttpStatus,
  Logger,
  Module,
  ValidationPipe,
} from '@nestjs/common';
import { LoggingInterceptor } from './interceptor/logging.interceptor';
import { ResolvePromisesInterceptor } from './interceptor/resolve-promises.interceptor';
import { TimestampInterceptor } from './interceptor/timestamp.interceptor';
import { AuthGuard } from './guard/auth.guard';
import { ExceptionsFilter } from './filter/exceptions.filter';
import { TransformInterceptor } from './interceptor/transform.interceptor';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ServeStaticModule } from '@nestjs/serve-static';
import { APP_GUARD, APP_PIPE, APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import CustomLogger from './logger/custom-logger';
import { join } from 'path';
import { AuthModule } from './modules/Auth/index.module';
import { UserModule } from './modules/User/index.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env'],
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
      serveRoot: '/public',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST') || 'localhost',
        port: configService.get('DB_PORT') || 5432,
        username: configService.get('DB_USERNAME') || 'root',
        password: configService.get('DB_PASSWORD') || 'root',
        database: configService.get('DB_NAME') || 'test',
        synchronize: configService.get('AUTO_SYNC_ENTITY') === 'true',
        autoLoadEntities: true,
      }),
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
      }),
    }),
    AuthModule,
    UserModule,
  ],
  providers: [
    {
      // 日志服务
      provide: Logger,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => CustomLogger(configService),
    },
    {
      // 认证守卫
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      // 异常过滤器
      provide: APP_FILTER,
      useClass: ExceptionsFilter,
    },
    {
      // 参数校验和转换
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true, // 自动剥离非DTO定义的属性
        forbidNonWhitelisted: true, // 对非白名单属性抛出错误
        transform: true, // 自动转换有效负载到DTO实例
        stopAtFirstError: true, // 遇到第一个验证错误就停止验证
        skipMissingProperties: false, // 不跳过缺失的属性验证
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY, // 设置验证失败时的HTTP状态码
      }),
    },
    // {
    //   // 请求记录
    //   provide: APP_INTERCEPTOR,
    //   useClass: LoggingInterceptor,
    // },
    {
      // 格式化响应数据
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    // {
    //   // 将Date数据转换为时间戳
    //   provide: APP_INTERCEPTOR,
    //   useClass: TimestampInterceptor,
    // },
    // {
    //   // 解析 Promise 响应
    //   provide: APP_INTERCEPTOR,
    //   useClass: ResolvePromisesInterceptor,
    // },
    // {
    //   // 自动过滤、转换、格式化控制器返回的对象属性
    //   provide: APP_INTERCEPTOR,
    //   useClass: ClassSerializerInterceptor,
    // },
  ],
  exports: [],
})
export class AppModule {}
