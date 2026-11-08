
import "./CategoryList.css";

const categories = [
    {
        id: 1,
        name: "Sơn nội thất",
        description: "Làm đẹp không gian bên trong",
        color: "interior",
        label: "INTERIOR",
    },
    {
        id: 2,
        name: "Sơn ngoại thất",
        description: "Bảo vệ vẻ đẹp bên ngoài",
        color: "exterior",
        label: "EXTERIOR",
    },
    {
        id: 3,
        name: "Sơn lót",
        description: "Tăng độ bám dính cho bề mặt",
        color: "primer",
        label: "PRIMER",
    },
    {
        id: 4,
        name: "Sơn chuyên dụng",
        description: "Giải pháp cho nhiều vật liệu",
        color: "special",
        label: "SPECIAL",
    },
];

function CategoryList() {
    return (
        <section className="category-section">
            <div className="category-heading">
                <div>
                    <span className="section-label">DANH MỤC SẢN PHẨM</span>
                    <h2>Khám phá các dòng sơn</h2>
                    <p>Lựa chọn sản phẩm phù hợp với nhu cầu của bạn.</p>
                </div>
            </div>

            <div className="category-grid">
                {categories.map((category) => (
                    <a
                        href={`/products?category=${category.id}`}
                        className="category-card"
                        key={category.id}
                    >
                        <div className={`category-visual ${category.color}`}>
                            <div className="paint-can">
                                <div className="paint-can-lid"></div>
                                <span>{category.label}</span>
                            </div>
                        </div>

                        <div className="category-info">
                            <h3>{category.name}</h3>
                            <p>{category.description}</p>
                            <span className="category-link">
                Khám phá <span aria-hidden="true">→</span>
              </span>
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
}

export default CategoryList;
