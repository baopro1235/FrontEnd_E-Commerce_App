import { Lock, UserRound } from 'lucide-react';
import './LoginPage.css';

function LoginPage() {
  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <h1 id="login-title">Đăng nhập</h1>
        <form className="login-form" onSubmit={(event) => event.preventDefault()}>
          <div className="login-field">
            <label className="sr-only" htmlFor="email">Email</label>
            <div className="login-input-wrap">
              <UserRound className="login-input-icon" size={20} aria-hidden="true" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Địa chỉ email"
                required
              />
            </div>
          </div>
          <div className="login-field">
            <label className="sr-only" htmlFor="password">Mật khẩu</label>
            <div className="login-input-wrap">
              <Lock className="login-input-icon" size={20} aria-hidden="true" />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Mật khẩu"
                required
              />
            </div>
          </div>
          <nav className="login-links" aria-label="Tài khoản">
            <a href="/register">Đăng ký</a>
            <button type="button">Quên mật khẩu?</button>
          </nav>
          <button type="submit">Đăng nhập</button>
        </form>
      </section>
    </main>
  );
}

export default LoginPage;