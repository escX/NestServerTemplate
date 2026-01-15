import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import TestAgent from 'supertest/lib/agent';

interface TestRequestParam {
  url: string;
  data?: any;
  log?: boolean;
  success?: boolean;
  expectSuccess?: (result: Record<string, any>) => void;
  expectError?: (result: Record<string, any>) => void;
}

export class TestClient {
  private agent: TestAgent;
  private userIndex = 0;
  public users: { id: number; token: string; phone: string }[] = [];

  constructor(private app: INestApplication) {
    this.agent = request.agent(app.getHttpServer());
  }

  switch(index: number) {
    this.userIndex = index;
  }

  getUser() {
    return this.users[this.userIndex];
  }

  async generateUsers() {
    const promises = Array.from({ length: 3 }).map((_, index) => {
      return this.auth(`1380000000${index}`);
    });
    const result = await Promise.all(promises);
    result.forEach((user, index) => {
      this.users.push({
        id: user.user_id,
        token: user.token,
        phone: `1380000000${index}`,
      });
    });
  }

  private async auth(phone: string) {
    const response = await this.agent.post('/auth/sign_up_in').send({ phone, code: '000000' });

    return response.body.data;
  }

  // 封装 GET 请求
  async get(param: TestRequestParam) {
    const token = this.getUser()?.token;
    return await this.agent
      .get(param.url)
      .set('Authorization', token ? `Bearer ${token}` : '')
      .query(param.data ?? {})
      .expect((response) => {
        if (param.log) {
          console.log(`[url]: ${param.url}\n[result]: ${JSON.stringify(response.body, null, 2)}`);
        }

        if (!!param.expectSuccess || param.success === true) {
          expect(response.body.success).toBe(true);
        }
        if (!!param.expectError || param.success === false) {
          expect(response.body.success).toBe(false);
        }

        param.expectSuccess?.(response.body);
        param.expectError?.(response.body);
      });
  }

  // 封装 POST 请求
  async post(param: TestRequestParam) {
    const token = this.getUser()?.token;
    return await this.agent
      .post(param.url)
      .set('Authorization', token ? `Bearer ${token}` : '')
      .send(param.data ?? {})
      .expect((response) => {
        if (param.log) {
          console.log(`[url]: ${param.url}\n[result]: ${JSON.stringify(response.body, null, 2)}`);
        }

        if (!!param.expectSuccess || param.success === true) {
          expect(response.body.success).toBe(true);
        }
        if (!!param.expectError || param.success === false) {
          expect(response.body.success).toBe(false);
        }

        param.expectSuccess?.(response.body);
        param.expectError?.(response.body);
      });
  }
}
