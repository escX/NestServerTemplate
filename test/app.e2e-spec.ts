import { TestClient } from './test-client';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import TestUser from './spec/TestUser';

declare global {
  var __APP__: INestApplication;
  var __CLIENT__: TestClient;
}

describe('app', () => {
  beforeAll(async () => {
    // 1、创建测试应用
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    const app = moduleFixture.createNestApplication();

    // 2、初始化测试应用
    await app.init();

    // 3、创建测试客户端，并生成测试用户
    const client = new TestClient(app);
    await client.generateUsers();

    global.__APP__ = app;
    global.__CLIENT__ = client;
  });

  afterAll(async () => {
    if (global.__APP__) {
      const app = global.__APP__;

      // 1、清理测试数据
      const connection = app.get(DataSource);
      await connection.createQueryBuilder().delete().from('user').execute();
      await connection.destroy();

      // 2、关闭测试应用
      await app.close();
    }
  });

  TestUser();
});
