import type { ReactNode } from 'react';
import './LoginPage.css';

const branches = [
  {
    name: 'Bình Chánh',
    address: 'D10/8 quốc lộ 1A, ấp 4, xã Bình Chánh, huyện Bình Chánh',
    phone: '0902 359 377',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAGUI3JaTYGbwgzSZe0rUgdR-kch-sQPNFgMY_ZcLEDbmhaogH4TRNkpobkC4KjHHVs1QoxSRh_UXeTyNPj0OEGOB29c_fUBi5fNwWRXoKyO-wG229eLktNBzjOsRQeXLIUJ5HQMLXhWYY4Jia1V3TNLF9z7N6y25ZJO9UUFknApqpv-R3SDDmL91JMSSVClp4fMUbJnQBkz7dZoJVLKqsLuLIjVC7nM-C2Axj2NbVr',
  },
  {
    name: 'Bình Tân',
    address: '439/13 Lê Văn Quới, P. Bình Trị Đông A, Q. Bình Tân, Tp. HCM',
    phone: '0934 060 067',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB7Pvm4P960ozLEMLnjJKWDVCx878JZgUgI3UR_qn70X5-DVgpp81zky5A5ng1bBbgslBtp3xs28Lad2xl4L6TJ0XhHzp7GProT1-loFS3_HdEi_JkyQpg9kAbrzOMwk2ZUTPWgm_n_VI-Qa2m7FBQJ__Eg9_iAX3mMCcPEAibiMrW8yUSSsNkBnWkIzspLdZKsoaU9zVG5Ao891NsR9HWq4xN4GnCSJEYdEGDrynhk',
  },
  {
    name: 'Thủ Đức',
    address: '139A3 Đ. Số 9, Linh Tây, Thủ Đức, Hồ Chí Minh',
    phone: '0934 060 067',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCOzN5ksC-lDKvicRURdx7hsl28a6tMsT2fmgnawzMWIROgy_SPDAdSGPygZT4yz9L7LO3HacE2UpiTPTWHgKwmOtuZJrz8yugYWLGFpFIq5b0Gz1vrzE-KRr1lI41Xe9IzSo8lyFnSr35dACR4xe3Kf8NFRxSqBc9hTidgetvs1doEuyjn8d7YR1QcoxTR3qVACCGLKLMbc3Ue6ufawExAQbqq7DXuM1W6Db1TQAOh',
  },
];

const branchAddresses = [
  {
    name: 'Bình Chánh',
    address: 'D10/8 quốc lộ 1A, ấp 4, xã Bình Chánh, huyện Bình Chánh',
  },
  {
    name: 'Bình Tân',
    address: '439/13 Lê Văn Quới, P. Bình Trị Đông A, Q. Bình Tân, Tp. HCM',
  },
  {
    name: 'Thủ Đức',
    address: '139A3 Đ. Số 9, Linh Tây, Thủ Đức, Hồ Chí Minh',
  },
];

const policies = [
  'Chính sách riêng tư',
  'Chính sách đổi trả hàng',
  'Chính sách vận chuyển',
  'Chính sách thanh toán',
  'Hướng dẫn mua hàng',
];

const categories = [
  'BẢNG MÀU SƠN NƯỚC',
  'SẢN PHẨM THEO TÍNH NĂNG',
  'NHÀ THẦU SƠN',
  'ĐẠI LÝ',
  'BÁO GIÁ SƠN',
  'KIẾN THỨC XÂY DỰNG',
  'TIN KHUYẾN MÃI',
  'TIN TỨC',
  'LIÊN HỆ',
];

interface PaintmartPageLayoutProps {
  pageTitle: string;
  children: ReactNode;
}

function PaintmartPageLayout({ pageTitle, children }: PaintmartPageLayoutProps) {
  return (
    <div className="paintmart-site">
      <header className="pm-header">
        <div className="pm-header-inner">
          <a className="pm-logo" href="#" aria-label="Paintmart - Trang chủ">
            <span className="pm-logo-mark">
              <i className="fa-solid fa-shapes" aria-hidden="true" />
            </span>
            <span className="pm-logo-copy">
              <span className="pm-logo-name">
                PAINTMART <sup>®</sup>
              </span>
              <span className="pm-logo-tagline">SIÊU THỊ SƠN CHÍNH HÃNG</span>
            </span>
          </a>

          <div className="pm-search">
            <form onSubmit={(event) => event.preventDefault()}>
              <input aria-label="Tìm kiếm" placeholder="Tìm kiếm" type="text" />
              <button aria-label="Tìm kiếm" type="submit">
                <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
              </button>
            </form>
          </div>

          <div className="pm-hotline-head">
            <span className="pm-hotline-head-icon">
              <i className="fa-solid fa-headset" aria-hidden="true" />
            </span>
            <span className="pm-hotline-head-copy">
              <span className="pm-hotline-label">TƯ VẤN &amp; ĐẶT HÀNG</span>
              <span className="pm-hotline-number">1900 234 535</span>
            </span>
          </div>

          <div className="pm-user-actions">
            <a href="/login">
              <i className="fa-solid fa-key" aria-hidden="true" />
              <span>Đăng nhập</span>
            </a>
            <a href="/register">
              <i className="fa-regular fa-user" aria-hidden="true" />
              <span>Đăng ký</span>
            </a>
            <a className="pm-cart" href="#" aria-label="Giỏ hàng, 0 sản phẩm">
              <i className="fa-solid fa-cart-shopping" aria-hidden="true" />
              <span className="pm-cart-count">0</span>
            </a>
          </div>
        </div>
      </header>

      <nav className="pm-category-nav" aria-label="Danh mục sản phẩm">
        <div className="pm-category-inner">
          <a className="pm-category-trigger" href="#">
            <i className="fa-solid fa-bars" aria-hidden="true" />
            <span>DANH MỤC SẢN PHẨM</span>
          </a>
          <div className="pm-category-links">
            {categories.map((category) => (
              <a href="#" key={category}>
                {category}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <nav className="pm-breadcrumb" aria-label="Đường dẫn">
        <div className="pm-content-width">
          <a href="#">Trang chủ</a>
          <span aria-hidden="true">&gt;</span>
          <a href="#">Tài khoản</a>
          <span aria-hidden="true">&gt;</span>
          <span>{pageTitle}</span>
        </div>
      </nav>

      <main className="pm-main">
        <div className="pm-content-width">{children}</div>
      </main>

      <section className="pm-company-info" aria-label="Thông tin công ty">
        <div className="pm-content-width pm-info-grid">
          <div className="pm-info-company">
            <div className="pm-address-list">
              {branchAddresses.map((branch) => (
                <div className="pm-address-item" key={branch.name}>
                  <i className="fa-solid fa-location-dot" aria-hidden="true" />
                  <span>
                    <strong>Chi nhánh {branch.name} :</strong> {branch.address}
                  </span>
                </div>
              ))}
            </div>
            <div className="pm-company-details">
              <p>Điện thoại: 0934060067</p>
              <p>Thời gian làm việc: 7h30 - 18h00 (từ thứ 2 tới thứ 7)</p>
              <p>Mã số thuế: 0310993943</p>
              <p>
                Địa chỉ đăng ký kinh doanh: 439/13 Lê Văn Quới, P. Bình Trị Đông A,
                Q. Bình Tân, Tp. Hồ Chí Minh
              </p>
              <p>
                Ngày cấp: 16/7/2011 Nơi cấp: Sở Kế Hoạch Và Đầu Tư Thành Phố Hồ Chí
                Minh.
              </p>
              <p>Giám đốc: Đoàn Cao Sơn.</p>
              <p>
                <strong>Điện thoại:</strong> 0934060067 - 0934060067
              </p>
              <p>
                <strong>Email:</strong>{' '}
                <a href="mailto:sonnuocgiasi.tvp@gmail.com">
                  sonnuocgiasi.tvp@gmail.com
                </a>
              </p>
            </div>
            <div className="pm-social-links" aria-label="Mạng xã hội">
              <a href="#" aria-label="Facebook">
                <i className="fa-brands fa-facebook-f" aria-hidden="true" />
              </a>
              <a href="#" aria-label="YouTube">
                <i className="fa-brands fa-youtube" aria-hidden="true" />
              </a>
              <a href="#" aria-label="Twitter">
                <i className="fa-brands fa-twitter" aria-hidden="true" />
              </a>
              <a href="#" aria-label="LinkedIn">
                <i className="fa-brands fa-linkedin-in" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="pm-info-policies">
            <ul>
              {policies.map((policy) => (
                <li key={policy}>
                  <a href="#">{policy}</a>
                </li>
              ))}
            </ul>
            <div className="pm-certifications">
              <div className="pm-commerce-badge">
                <span>
                  <i className="fa-solid fa-check" aria-hidden="true" />
                </span>
                <strong>
                  ĐÃ THÔNG BÁO
                  <small>BỘ CÔNG THƯƠNG</small>
                </strong>
              </div>
              <div className="pm-dmca-green">
                <i className="fa-solid fa-shield-halved" aria-hidden="true" />
                <strong>
                  DMCA
                  <small>PROTECTED</small>
                </strong>
              </div>
            </div>
          </div>

          <div className="pm-info-account">
            <ul>
              <li><a href="#">Tài khoản</a></li>
              <li><a href="#">Lịch sử đặt hàng</a></li>
              <li><a href="#">Danh sách yêu thích</a></li>
            </ul>
            <div className="pm-dmca-gray">
              <strong>DMCA</strong>
              <span>PROTECTED</span>
            </div>
          </div>
        </div>
      </section>

      <section className="pm-branches">
        <div className="pm-content-width">
          <h2>HỆ THỐNG SIÊU THỊ SƠN CHÍNH HÃNG PAINTMART ®</h2>
          <div className="pm-branch-cards">
            {branches.map((branch) => (
              <article className="pm-branch-card" key={branch.name}>
                <div className="pm-branch-image">
                  <img
                    alt={`Chi nhánh ${branch.name} Paintmart`}
                    src={branch.image}
                  />
                </div>
                <div className="pm-branch-copy">
                  <h3>Chi nhánh {branch.name}</h3>
                  <p>
                    <strong>Số địa chỉ:</strong> {branch.address}
                  </p>
                  <p>
                    <strong>Điện thoại:</strong>{' '}
                    <span>{branch.phone}</span>
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="pm-bottom-hotline">
        <div className="pm-content-width">
          {['Tổng đài', 'Sale 1', 'Sale 2', 'Zalo'].map((label) => (
            <div key={label}>
              <span>{label}:</span>{' '}
              <a href="tel:0934060067">0934060067</a>
            </div>
          ))}
        </div>
      </footer>

      <aside className="pm-floating-actions" aria-label="Liên hệ nhanh">
        <a aria-label="Gọi điện" href="tel:0934060067">
          <i className="fa-solid fa-phone" aria-hidden="true" />
        </a>
        <a
          aria-label="Chat qua Zalo"
          href="https://zalo.me/0934060067"
          rel="noopener noreferrer"
          target="_blank"
        >
          <span>Zalo</span>
        </a>
        <a aria-label="Nhắn tin Messenger" href="#">
          <i className="fa-brands fa-facebook-messenger" aria-hidden="true" />
        </a>
        <button
          aria-label="Cuộn lên đầu trang"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          type="button"
        >
          <i className="fa-solid fa-chevron-up" aria-hidden="true" />
        </button>
      </aside>
    </div>
  );
}

export default PaintmartPageLayout;
