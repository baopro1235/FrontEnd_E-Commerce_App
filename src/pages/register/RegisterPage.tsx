import './RegisterPage.css';

function RegisterPage() {
  return (
    <main className="register-page">
      <section className="register-card" aria-labelledby="register-title">
        <h1 id="register-title">Đăng ký</h1>
        <p className="register-intro">
          Nếu bạn đã có một tài khoản với chúng tôi, xin vui lòng{' '}
          <a href="/login">đăng nhập</a> tại trang đăng nhập.
        </p>

        <form className="register-form" onSubmit={(event) => event.preventDefault()}>
          <div className="register-fields">
            <div className="register-field">
              <label htmlFor="phone">Điện thoại (*)</label>
              <input id="phone" name="phone" type="tel" autoComplete="tel" required />
            </div>

            <div className="register-field">
              <label htmlFor="email">E-Mail</label>
              <input id="email" name="email" type="email" autoComplete="email" />
            </div>

            <div className="register-field">
              <label htmlFor="full-name">Họ &amp; Tên (*)</label>
              <input
                id="full-name"
                name="fullName"
                type="text"
                autoComplete="name"
                required
              />
            </div>

            <div className="register-field">
              <label htmlFor="province">Tỉnh/Thành Phố (*)</label>
              <input id="province" name="province" type="text" autoComplete="address-level1" required />
            </div>

            <div className="register-field">
              <label htmlFor="district">Quận/Huyện (*)</label>
              <input id="district" name="district" type="text" autoComplete="address-level2" required />
            </div>

            <div className="register-field">
              <label htmlFor="ward">Phường/Xã</label>
              <input id="ward" name="ward" type="text" />
            </div>

            <div className="register-field register-field-wide">
              <label htmlFor="address">Địa chỉ (*)</label>
              <input id="address" name="address" type="text" autoComplete="street-address" required />
            </div>

            <div className="register-field">
              <label htmlFor="password">Mật khẩu (*)</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
              />
            </div>

            <div className="register-field">
              <label htmlFor="confirm-password">Xác nhận mật khẩu (*)</label>
              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
              />
            </div>
          </div>

          <fieldset className="register-newsletter">
            <legend>Nhận bản tin</legend>
            <label>
              <input type="radio" name="newsletter" value="yes" />
              Có
            </label>
            <label>
              <input type="radio" name="newsletter" value="no" />
              Không
            </label>
          </fieldset>

          <label className="register-privacy">
            <input type="checkbox" name="privacyPolicy" required />
            <span>
              Tôi đã đọc và đồng ý với <strong>Chính sách riêng tư</strong>
            </span>
          </label>

          <button type="submit">Đăng ký</button>
        </form>
      </section>
    </main>
  );
}

export default RegisterPage;
