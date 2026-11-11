import PaintmartPageLayout from '../../components/PaintmartPageLayout';
import './RegisterPage.css';

const provinces = [
  'Hồ Chí Minh',
  'Hà Nội',
  'Đà Nẵng',
  'Bình Dương',
  'Đồng Nai',
  'Cần Thơ',
  'Hải Phòng',
  'Bà Rịa - Vũng Tàu',
  'An Giang',
  'Tiền Giang',
  'Long An',
];

const districts = [
  'Quận Bình Tân',
  'Huyện Bình Chánh',
  'Thành phố Thủ Đức',
  'Quận 1',
  'Quận 3',
  'Quận 5',
  'Quận 7',
  'Quận 10',
  'Quận 12',
  'Quận Tân Bình',
  'Quận Tân Phú',
  'Quận Gò Vấp',
];

const wards = [
  'Phường Bình Trị Đông A',
  'Phường Linh Tây',
  'Xã Bình Chánh',
];

function RegisterPage() {
  return (
    <PaintmartPageLayout pageTitle="Đăng ký">
      <h1 className="pm-register-title">Đăng ký</h1>
      <p className="pm-register-intro">
        Nếu bạn đã có một tài khoản với chúng tôi, xin vui lòng đăng nhập tại{' '}
        <a href="/login">trang đăng nhập</a>.
      </p>

      <form
        className="pm-register-form"
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="pm-register-row">
          <label htmlFor="phone">
            Điện thoại<span className="pm-required">(*)</span>
          </label>
          <input
            autoComplete="tel"
            id="phone"
            name="phone"
            placeholder="Điện thoại"
            required
            type="text"
          />
        </div>

        <div className="pm-register-row">
          <label htmlFor="email">E-Mail</label>
          <input
            autoComplete="email"
            id="email"
            name="email"
            placeholder="E-Mail"
            type="email"
          />
        </div>

        <div className="pm-register-row">
          <label htmlFor="full-name">
            Họ &amp; Tên<span className="pm-required">(*)</span>
          </label>
          <input
            autoComplete="name"
            id="full-name"
            name="fullName"
            placeholder="Họ & Tên"
            required
            type="text"
          />
        </div>

        <div className="pm-register-row">
          <label htmlFor="province">
            Tỉnh/Thành Phố<span className="pm-required">(*)</span>
          </label>
          <select
            autoComplete="address-level1"
            defaultValue="Hồ Chí Minh"
            id="province"
            name="province"
            required
          >
            <option value="">--- Vui lòng chọn ---</option>
            {provinces.map((province) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </select>
        </div>

        <div className="pm-register-row">
          <label htmlFor="district">
            Quận/Huyện<span className="pm-required">(*)</span>
          </label>
          <select
            autoComplete="address-level2"
            defaultValue=""
            id="district"
            name="district"
            required
          >
            <option value="">--- Vui lòng chọn ---</option>
            {districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>

        <div className="pm-register-row">
          <label htmlFor="ward">Phường/Xã</label>
          <select
            autoComplete="address-level3"
            defaultValue=""
            id="ward"
            name="ward"
          >
            <option value="">--- Vui lòng chọn ---</option>
            {wards.map((ward) => (
              <option key={ward} value={ward}>
                {ward}
              </option>
            ))}
          </select>
        </div>

        <div className="pm-register-row">
          <label htmlFor="address">
            Địa chỉ<span className="pm-required">(*)</span>
          </label>
          <input
            autoComplete="street-address"
            id="address"
            name="address"
            placeholder="Địa chỉ"
            required
            type="text"
          />
        </div>

        <div className="pm-register-row">
          <label htmlFor="password">
            Mật khẩu<span className="pm-required">(*)</span>
          </label>
          <input
            autoComplete="new-password"
            id="password"
            name="password"
            placeholder="Mật khẩu"
            required
            type="password"
          />
        </div>

        <div className="pm-register-row">
          <label htmlFor="confirm-password">
            Xác nhận mật khẩu<span className="pm-required">(*)</span>
          </label>
          <input
            autoComplete="new-password"
            id="confirm-password"
            name="confirmPassword"
            placeholder="Xác nhận mật khẩu"
            required
            type="password"
          />
        </div>

        <div className="pm-register-row pm-register-newsletter-row">
          <span className="pm-register-label">Nhận bản tin</span>
          <div className="pm-register-options">
            <label>
              <input name="newsletter" type="radio" value="yes" />
              <span>Có</span>
            </label>
            <label>
              <input
                defaultChecked
                name="newsletter"
                type="radio"
                value="no"
              />
              <span>Không</span>
            </label>
          </div>
        </div>

        <div className="pm-register-actions">
          <label className="pm-register-privacy">
            <input
              defaultChecked
              name="privacyPolicy"
              required
              type="checkbox"
            />
            <span>
              Tôi đã đọc và đồng ý với{' '}
              <a href="#">Chính sách riêng tư</a>
            </span>
          </label>
          <button type="submit">Đăng ký thành viên</button>
        </div>
      </form>
    </PaintmartPageLayout>
  );
}

export default RegisterPage;
