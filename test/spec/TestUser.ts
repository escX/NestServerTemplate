export default function TestUser() {
  describe('User', () => {
    it('获取用户信息', async () => {
      const client = global.__CLIENT__;
      await client.get({
        url: '/user/get_user',
        data: {
          user_id: client.getUser().id,
        },
        expectSuccess: (result) => {
          expect(result.data.id).toBe(client.getUser().id);
        },
      });
    });

    it('修改手机号', async () => {
      const client = global.__CLIENT__;
      const newPhone = '13100000000';
      await client.post({
        url: '/user/change_phone',
        data: {
          old_phone: client.getUser().phone,
          new_phone: newPhone,
          code: '000000',
        },
        success: true,
      });
      await client.get({
        url: '/user/get_user',
        data: {
          user_id: client.getUser().id,
        },
        expectSuccess: (result) => {
          expect(result.data.phone).toBe(newPhone);
        },
      });
    });

    it('更新用户信息', async () => {
      const client = global.__CLIENT__;
      const data = {
        photo: 'http://example.com/newphoto.jpg',
        nickname: '新的昵称',
      };
      await client.post({
        url: '/user/update_user',
        data,
        success: true,
      });
      await client.get({
        url: '/user/get_user',
        data: {
          user_id: client.getUser().id,
        },
        expectSuccess: (result) => {
          expect(result.data.photo).toBe(data.photo);
          expect(result.data.nickname).toBe(data.nickname);
        },
      });
    });

    it('删除用户', async () => {
      const client = global.__CLIENT__;
      await client.post({
        url: '/user/delete_user',
        success: true,
      });
      await client.get({
        url: '/user/get_user',
        data: {
          user_id: client.getUser().id,
        },
        success: false,
      });
    });
  });
}
