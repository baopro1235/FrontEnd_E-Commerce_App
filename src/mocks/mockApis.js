const DB_KEY = 'mock_users_db';
const DELAY = 500; //ms

const initDB = () => {
  if (!localStorage.getItem(DB_KEY)) {
    const defaultUsers = [
      {
        id: 'u1',
        fullName: 'Nguyễn Văn A',
        email: 'user@example.com',
        password: 'Password123',
        phone: '0901234567',
        addresses: [
          { id: 'a1', label: 'Nhà riêng', street: '123 Lê Lợi, Q.1, TP.HCM', isDefault: true },
        ],
      },
    ];
    localStorage.setItem(DB_KEY, JSON.stringify(defaultUsers));
  }
};

const wait = (ms) => new Promise((res) => setTimeout(res, ms));

export const mockApi = {
  async login({ email, password }) {
    initDB();
    await wait(DELAY);
    const users = JSON.parse(localStorage.getItem(DB_KEY));
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) throw new Error('Email hoặc mật khẩu không chính xác');

    const { password: _, ...safeUser } = user;
    return { token: `fake-jwt-token-${user.id}`, user: safeUser };
  },

  async register({ fullName, email, password, phone }) {
    initDB();
    await wait(DELAY);
    const users = JSON.parse(localStorage.getItem(DB_KEY));
    if (users.some((u) => u.email === email)) {
      throw new Error('Email này đã được sử dụng');
    }

    const newUser = {
      id: `u${Date.now()}`,
      fullName,
      email,
      password,
      phone,
      addresses: [],
    };
    users.push(newUser);
    localStorage.setItem(DB_KEY, JSON.stringify(users));

    const { password: _, ...safeUser } = newUser;
    return { token: `fake-jwt-token-${newUser.id}`, user: safeUser };
  },

  async updateProfile(userId, updatedData) {
    await wait(DELAY);
    const users = JSON.parse(localStorage.getItem(DB_KEY));
    const index = users.findIndex((u) => u.id === userId);
    if (index === -1) throw new Error('Không tìm thấy người dùng');

    users[index] = { ...users[index], ...updatedData };
    localStorage.setItem(DB_KEY, JSON.stringify(users));

    const { password: _, ...safeUser } = users[index];
    return safeUser;
  },

  async changePassword(userId, { currentPassword, newPassword }) {
    await wait(DELAY);
    const users = JSON.parse(localStorage.getItem(DB_KEY));
    const index = users.findIndex((u) => u.id === userId);
    if (users[index].password !== currentPassword) {
      throw new Error('Mật khẩu hiện tại không đúng');
    }

    users[index].password = newPassword;
    localStorage.setItem(DB_KEY, JSON.stringify(users));
    return { message: 'Đổi mật khẩu thành công' };
  },
};
