import { useState, useEffect } from "react";
import "./Belanja.css";
import { Link } from "react-router-dom";
import ProductDrawer from "../components/ProductDrawer";
import CartDrawer from "../components/CartDrawer";
import axios from "axios";

interface Product {
  id: number;
  product_id: string;
  merchant_id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  images: string;
  created_at: string;
  merchant_name: string;
}

interface Cart {
  id: number;
  product_id: string;
  merchant_id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  images: string;
  created_at: string;
  merchant_name: string;
}

interface Foundation {
  id: number;
  foundation_id: string;
  title: string;
  agency: string;
  type: string;
  estimated_budget: number;
  bid_deadline: string;
  status: string;
  created_at: string;
}

interface Category {
  id: number;
  category_id: string;
  name: string;
  icon: string;
}

interface Stock {
  id: number;
  stock_id: string;   
  name: string;       
  symbol: string;     
  price: number;      
  logo: string;     
  created_at: string; 
}

const Belanja = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [currentProductId, setCurrentProductId] = useState("");
  const [search, setSearch] = useState("");
  const [searchPengadaan, setSearchPengadaan] = useState("");
  const [cart, setCart] = useState<Cart[]>(() => {
    const cartData = localStorage.getItem("cart");
    return cartData ? JSON.parse(cartData) : [];
  });
  const [loading, setLoading] = useState(true);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [searchSaham, setSearchSaham] = useState<string>("");

  const [foundations, setFoundations] = useState<Foundation[]>([]);

  const fetchProducts = () => {
    axios
      .get<Product[]>(`${import.meta.env.VITE_API_URL}/product`, {
        params: {
          category: selectedCategory,
          search: search,
        },
      })
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the product data.", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchFoundations = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/foundations`, {
        params: {
          search: searchPengadaan,
        },
      })
      .then((response) => {
        setFoundations(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the product data.", error);
      });
  };

  const fetchCategory = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/category_products`, {
        params: {
          search: searchPengadaan,
        },
      })
      .then((response) => {

       const categories: Category[] = [
          ...response.data.map((category : Category) => ({
            id: category.id,
            category_id: category.category_id,
            name: category.name,
            icon: category.icon,
          }))
        ];

        categories.splice(4, 0, {
          id: categories.length + 1,
          category_id: "CAT-PPOB",
          name: "PPOB",
          icon: "fas fa-money-check-alt",
        });

        setCategory(categories);

      })
      .catch((error) => {
        console.error("There was an error fetching the product data.", error);
      });
  };

  const fetchStocks = () => {
    axios
      .get<Stock[]>(`${import.meta.env.VITE_API_URL}/stocks`, {
        params: {
          search: searchSaham, 
        },
      })
      .then((response) => {
        setStocks(response.data);
      })
      .catch((error) => {
        console.error("Error fetching stocks data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
    fetchFoundations();
    fetchCategory();
    fetchStocks();
  }, [selectedCategory, search, searchPengadaan, searchSaham]);

  useEffect(() => {
    console.log("Cart", cart);
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const changeCategory = (category: number) => {
    setSelectedCategory(category);
  };

  const filteredStocks = stocks.filter(
    (stock) =>
      stock.name.toLowerCase().includes(searchSaham.toLowerCase()) ||
      stock.symbol.toLowerCase().includes(searchSaham.toLowerCase())
  );

  function formatRupiah(amount: number): string {
    return amount.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });
  }

  function formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  }

  const handleAddToCart = (quantity: number) => {
    if (!currentProductId) return;

    const existingProduct = cart.find(
      (item) => item.product_id === currentProductId
    );

    if (existingProduct) {
      const updatedCart = cart.map((item) => {
        if (item.product_id === currentProductId) {
          return { ...item, quantity: quantity };
        }
        return item;
      });

      setCart(updatedCart);
    } else {
      const product = products.find(
        (item) => item.product_id === currentProductId
      );

      if (product) {
        setCart([...cart, { ...product, quantity: quantity }]);
      }
    }
  };

  const handleDeleteCart = () => {
    const cartData = localStorage.getItem("cart");
    setCart(cartData ? JSON.parse(cartData) : []);
  };

  const goToWallet = () => {

    // const f_pin = localStorage.getItem("f_pin");
    // window.location.href = "https://nexilis.io/nexilis/pages/digipos?env=1&f_pin=" + f_pin;

    if ((window as any).Android && typeof (window as any).Android.openWallet === "function") {

      console.log("CPAAS Open Wallet");

      (window as any).Android.openWallet();
      
    } else {
      console.log("Android interface not available");
    }

  };

  const goToPPOB = () => {

    // const f_pin = localStorage.getItem("f_pin");
    // window.location.href = "https://nexilis.io/nexilis/pages/IBS/himbara_wallet_2?f_pin="+f_pin;

    if ((window as any).Android && typeof (window as any).Android.openPPOB === "function") {

      console.log("CPAAS Open PPOB");

      (window as any).Android.openPPOB();
      
    } else {
      console.log("Android interface not available");
    }

  };

  const gradients = [
    "#ff8f17ff",
    "#24803bff",
    "#E33E3E",
    "#3462dfff",
    "#2C3E50",
    "#7f6fdeff"
  ];

  return (
    <div className="main-container">
      {/* Header */}
      <div className="background">
        <div className="header-belanja py-3">
          <div className="d-flex">
            <Link
              to="/" replace
              className="header-icon-belanja"
              style={{
                fontSize: "24px",
                color: "white",
                textDecoration: "none",
              }}
            >
              <i className="fa-solid fa-arrow-left"></i>
            </Link>
            <h1 className="ms-3" style={{ marginTop: "0.35rem" }}>
              Belanja
            </h1>
             <div className="header-icons-wallet">
              <div
                className="header-icon-belanja position-relative"
                onClick={() => goToWallet() }
              >
                <i className="fas fa-credit-card"></i>
              </div>
            </div> 
            {/* <div className="header-icons-ppob">
              <div
                className="header-icon-belanja position-relative"
                onClick={() => goToPPOB() }
              >
                <i className="fas fa-money-check-alt"></i>
              </div>
            </div>  */}
            <div className="header-icons-belanja">
              <div
                className="header-icon-belanja position-relative"
                data-bs-toggle="offcanvas"
                data-bs-target="#cartDrawer"
                aria-controls="cartDrawer"
              >
                <i className="fas fa-cart-shopping"></i>
                {cart.length > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cart.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ul
        className="nav nav-tabs belanja-tab flex-nowrap overflow-auto"
        role="tablist"
        style={{ whiteSpace: "nowrap" }}
      >
        <li className="nav-item" role="presentation">
          <button
            className="nav-link py-3 active"
            style={{ color: "#3a3a3a" }}
            id="perdagangan-tab"
            data-bs-toggle="tab"
            data-bs-target="#perdagangan"
            type="button"
            role="tab"
          >
            <i className="fa-solid fa-store px-1 me-1"></i> Perdagangan
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link py-3"
            style={{ color: "#3a3a3a" }}
            id="pengadaan-tab"
            data-bs-toggle="tab"
            data-bs-target="#pengadaan"
            type="button"
            role="tab"
          >
            <i className="fa-solid fa-clipboard-list px-1 me-1"></i> Pengadaan
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link py-3"
            style={{ color: "#3a3a3a" }}
            id="saham-tab"
            data-bs-toggle="tab"
            data-bs-target="#saham"
            type="button"
            role="tab"
          >
            <i className="fa-solid fa-comment px-1 me-1"></i> Saham
          </button>
        </li>
      </ul>

      <div className="tab-content">
        {/* Perdagangan */}
        <div
          className="tab-pane fade show active"
          id="perdagangan"
          role="tabpanel"
        >
          <section className="sheet">
            <div className="search-box">
              <i className="fa-solid fa-search"></i>
              <input
                type="text"
                className="form-control"
                placeholder="Cari produk atau jasa"
                aria-label="Search"
                aria-describedby="search-addon"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="section-title-belanja mb-3">Kategori</div>
            <div className="mt-1">
              <div className="category-list-belanja d-flex gap-2 overflow-auto no-scrollbar pb-2 flex-nowrap">
                {category.map((ctg) => (
                  <div
                    key={ctg.id}
                    className={`category-item pt-3 ${
                      selectedCategory === ctg.id ? "active" : ""
                    }`}
                    onClick={() => ctg.category_id === "CAT-PPOB" ? goToPPOB() : changeCategory(ctg.id)}
                  >
                    <i style={{ color: gradients[(ctg.id - 1) % gradients.length] }}
                    className={`fa ${ctg.icon} fs-3`}></i>
                    <div className="small mt-1">{ctg.name}</div>
                  </div>
                ))}
                
              </div>
            </div>

            <div className="section-title-belanja">Produk Terbaru</div>
            <div className="mt-2">
              {loading && (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status" />
                  <div className="mt-2">Memuat Data...</div>
                </div>
              )}

              {!loading && !products.length && (
                <>
                  <div
                    className="alert alert-light text-center px-5"
                    role="alert"
                  >
                    <i className="fas fa-exclamation-circle me-2" />
                    Belum ada produk yang tersedia.
                  </div>
                  <img
                    src="cart.png"
                    alt="Notifikasi"
                    className="w-50 d-block mx-auto"
                  />
                </>
              )}

              {!loading &&
                products.map((product) => (
                  <div
                    className="product-card my-2"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#productDrawer"
                    aria-controls="productDrawer"
                    onClick={() => setCurrentProductId(product.product_id)}
                    key={product.id}
                  >
                    <img src={product.images} alt={product.name} />
                    <div className="flex-grow-1 ms-2">
                      <div className="fw-bold fs-14">
                        {product.name}
                        <span className="text-orange">
                          {cart.find((item) => item.id === product.id)?.quantity
                            ? ` x ${
                                cart.find((item) => item.id === product.id)
                                  ?.quantity
                              }`
                            : ""}
                        </span>
                      </div>
                      <div className="text-muted small mt-1">
                        {product.merchant_name}
                      </div>
                      <div
                        className="fw-bold mt-1"
                        style={{ color: "#ff8f17", fontSize: "16px" }}
                      >
                        {formatRupiah(product.price)}
                      </div>
                    </div>
                    <i className="fa-solid fa-chevron-right text-muted"></i>
                  </div>
                ))}
            </div>
          </section>
        </div>

        {/* Pengadaan */}
        <div className="tab-pane fade" id="pengadaan" role="tabpanel">
          <section className="sheet">
            <div className="search-box">
              <i className="fa-solid fa-search"></i>
              <input
                type="text"
                className="form-control"
                placeholder="Cari paket pengadaan"
                aria-label="Search"
                aria-describedby="search-addon"
                onChange={(e) => setSearchPengadaan(e.target.value)}
              />
            </div>

            <div className="section-title-belanja mt-3">Daftar Pengadaan</div>
            {foundations.length === 0 && (
              <> 
                <div
                  className="alert alert-light text-center px-5 mt-3"
                  role="alert"
                >
                  <i className="fas fa-exclamation-circle me-2" />
                  Belum ada pengadaan yang tersedia untuk saat ini.
                </div>
                <img
                  src="cart.png"
                  alt="Notifikasi"
                  className="w-50 d-block mx-auto"
                />
              </>
            )}
            {foundations.map((foundation) => (
              <div className="product-card mt-3" key={foundation.id}>
                <div className="flex-grow-1">
                  <h6 className="mt-2">{foundation.title}</h6>
                  <small>
                    <b>Instansi :</b> {foundation.agency}
                  </small>
                  <br />
                  <small>
                    <b>Jenis :</b> {foundation.type}
                  </small>
                  <br />
                  <small>
                    <b>Estimasi Anggaran :</b>{" "}
                    {formatRupiah(foundation.estimated_budget)}
                  </small>
                  <br />
                  <small>
                    <b>Batas Penawaran :</b>{" "}
                    {formatDate(foundation.bid_deadline)}
                  </small>
                  <br />
                  <div className="mt-2 mb-2">
                    <span className="pt-1">Status :</span>{" "}
                    <span
                      className="ms-1 px-3 py-1 fw-bold fs-14"
                      style={{
                        backgroundColor:
                          foundation.status === "Dibuka"
                            ? "rgba(0, 163, 25, 1)"
                            : "rgba(168, 1, 1, 1)",
                        color: "white",
                        borderRadius: "5px",
                      }}
                    >
                      {foundation.status}
                    </span>
                  </div>
                </div>
                {/* <i className="fa-solid fa-chevron-right text-muted"></i> */}
              </div>
            ))}
          </section>
        </div>

        {/* Saham */}
        <div className="tab-pane fade" id="saham" role="tabpanel">
          <section className="sheet">
            <div className="search-box">
              <i className="fa-solid fa-search"></i>
              <input
                type="text"
                className="form-control"
                placeholder="Cari saham"
                aria-label="Search"
                aria-describedby="search-addon"
                value={searchSaham}
                onChange={(e) => setSearchSaham(e.target.value)}
              />
            </div>

            <div className="section-title-belanja mt-3">Daftar Saham</div>
            {loading ? (
              <div className="alert alert-info text-center mt-3">Loading...</div>
            ) : filteredStocks.length === 0 ? (
              <>
                <div className="alert alert-light text-center px-5 mt-3" role="alert">
                  <i className="fas fa-exclamation-circle me-2" />
                  Belum ada saham yang tersedia untuk saat ini.
                </div>
                <img src="cart.png" alt="Notifikasi" className="w-50 d-block mx-auto" />
              </>
            ) : (
              filteredStocks.map((stock) => {
                const randomChange = (Math.random() * 10 - 5).toFixed(2); // -5.00 s/d 5.00
                const isPositive = parseFloat(randomChange) >= 0;

                return (
                  <div className="product-card mt-3 d-flex align-items-center" key={stock.id}>
                    <div style={{ minWidth: "60px", textAlign: "center" }}>
                      <img
                        src={stock.logo}
                        alt={stock.name}
                        style={{ width: "40px", height: "40px", objectFit: "contain" }}
                      />
                    </div>

                    <div className="flex-grow-1 ms-3">
                      <h6 className="mt-2 mb-1">{stock.name}</h6>
                      <small>
                        <b>Kode :</b> {stock.symbol}
                      </small>
                      <br />
                      <small>
                        <b>Harga :</b> {formatRupiah(stock.price)}
                      </small>
                      <br />
                      <small>
                        <b>Perubahan :</b>{" "}
                        <span
                          style={{
                            color: isPositive ? "green" : "red",
                            fontWeight: "bold",
                          }}
                        >
                          {isPositive ? `+${randomChange}%` : `${randomChange}%`}
                        </span>
                      </small>
                    </div>
                  </div>
                );
              })
            )}
          </section>
        </div>
      </div>

      <ProductDrawer
        product_id={currentProductId}
        onAddToCart={(quantity) => handleAddToCart(quantity)}
      />
      <CartDrawer cart={cart} onDeleteCart={handleDeleteCart} />
    </div>
  );
};

export default Belanja;
