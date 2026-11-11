import PaintmartPageLayout from '../../components/PaintmartPageLayout';

function LoginPage() {
  return (
    <PaintmartPageLayout pageTitle="Đăng nhập">
      <h1>Đăng nhập</h1>
      <div className="pm-login-card">
        <form onSubmit={(event) => event.preventDefault()}>
          <div className="pm-login-input">
            <span aria-hidden="true">
              <i className="fa-solid fa-user" />
            </span>
            <input
              aria-label="Địa chỉ email"
              autoComplete="email"
              name="email"
              placeholder="Địa chỉ email"
              required
              type="text"
            />
          </div>
          <div className="pm-login-input">
            <span aria-hidden="true">
              <i className="fa-solid fa-lock" />
            </span>
            <input
              aria-label="Mật khẩu"
              autoComplete="current-password"
              name="password"
              placeholder="Mật khẩu"
              required
              type="password"
            />
          </div>
          <div className="pm-login-links">
            <a href="/register">Đăng ký</a>
            <a href="#">Quên mật khẩu</a>
          </div>
          <button className="pm-login-submit" type="submit">
            ĐĂNG NHẬP
          </button>
        </form>
      </div>
    </PaintmartPageLayout>
  );
}

export default LoginPage;
