import { useState, useEffect } from "react";
import './InfoBUMDes.css'
import { Link } from 'react-router-dom'
import axios from "axios";

interface InfoBUMDES{
  id: number;
  info_id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  type: number;
  created_at: string;
}

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

interface Media {
  id: number;
  media_id: string;
  title: string;
  description: string;
  image: string;
  source: string;
  category_id: number;
  type: number;
  created_at: string;
}

const InfoBUMDes = () => {

  const [infoBUMDES, setInfoBUMDES] = useState<InfoBUMDES[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [media, setMedia] = useState<Media[]>([]);

  const [selectedInfoBUMDES, setSelectedInfoBUMDES] = useState<InfoBUMDES>();
  const [selectedProduct, setSelectedProduct] = useState<Product>();
  const [selectedMedia, setSelectedMedia] = useState<Media>();

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchInfoBUMDES = () => {
    axios
      .get<InfoBUMDES[]>(`${import.meta.env.VITE_API_URL}/info_bumdes`, {
        params: {
          search: search,
        },
      })
      .then((response) => {
        setInfoBUMDES(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the product data.", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchProducts = () => {
    axios
      .get<Product[]>(`${import.meta.env.VITE_API_URL}/product`, {
        params: {
          category: "1",
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

  const fetchMedia = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/media`, {
         params: {
          search: search,
        },
      })
      .then((res) => {
        console.log(res.data);
        setMedia(res.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchInfoBUMDES();
    fetchProducts();
    fetchMedia();
  }, [search]);

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
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString)
      .toLocaleString("id-ID", options)
      .replace("pukul", "-");
  }

  return (
    <div className="main-container">
      <div className="background">
        <div className="header py-3">
          <div className="d-flex">
            <Link to="/" replace className="header-icon" style={{ fontSize: '24px', color: 'white', textDecoration: 'none' }}>
              <i className="fa-solid fa-arrow-left" />
            </Link>
            <h1 className="ms-3" style={{ marginTop: '0.35rem' }}>Info BUMDes</h1>
          </div>
        </div>

        <section className="sheet mb-5">
          <div className="search-box mt-2 mb-4">
            <i className="fa-solid fa-search" />
            <input
              type="text"
              className="form-control"
              placeholder="Cari produk atau layanan"
              aria-label="Search"
              aria-describedby="search-addon"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="section-title-info-bumdes">Info Terbaru</div>

            {loading && (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status" />
                <div className="mt-2">Memuat Data...</div>
              </div>
            )}

            {!loading && infoBUMDES.filter(item => item.type === 1).length == 0 && (
              <>
                <div
                  className="alert alert-light text-center px-5"
                  role="alert"
                >
                  <i className="fas fa-exclamation-circle me-2" />
                  Belum ada info terbaru yang tersedia.
                </div>
              </>
            )}
          {!loading && infoBUMDES.filter(item => item.type === 1).length > 0 && (
            infoBUMDES.filter(item => item.type === 1).map((item) => (
              <div className="info-card-info-bumdes my-2 mb-3 shadow-sm" 
                onClick={() => setSelectedInfoBUMDES(item)} data-bs-toggle="modal" data-bs-target="#modalInfoBUMDes" key={item.id}>
                <i className="fas fa-calendar-alt" />
                <div>
                  <p className="info-title-info-bumdes">{item.title}</p>
                  <p className="info-sub-info-bumdes mt-1">{item.date}</p>
                </div>
              </div>
            ))
          )}

          <hr/>

          <div className="section-title-info-bumdes">Layanan Terbaru</div>

            {loading && (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status" />
                <div className="mt-2">Memuat Data...</div>
              </div>
            )}

            {!loading && infoBUMDES.filter(item => item.type === 2).length == 0 && (
              <>
                <div
                  className="alert alert-light text-center px-5"
                  role="alert"
                >
                  <i className="fas fa-exclamation-circle me-2" />
                  Belum ada layanan terbaru yang tersedia.
                </div>
              </>
            )}

          {!loading && infoBUMDES.filter(item => item.type === 2).length > 0 && (
              infoBUMDES.filter(item => item.type === 2).map((item) => (
                <div className="info-card-info-bumdes" data-bs-toggle="modal" data-bs-target="#modalInfoBUMDes"
                key={item.id}
                onClick={() => setSelectedInfoBUMDES(item)}>
                  <img src={item.image} alt="Ekspedisi Murah" />
                  <div>
                    <p className="info-title-info-bumdes">{item.title}</p>
                    <p className="info-sub-info-bumdes mt-1">
                      {item.description.length > 50 ? (
                        <>
                          {item.description.slice(0, 60)}...
                        </>
                      ) : (
                        item.description
                      )}</p>
                  </div>
                </div>
              ))
            )}

          <hr/>

          <div className="section-title-info-bumdes">Berita Terbaru</div>

            {loading && (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status" />
                <div className="mt-2">Memuat Data...</div>
              </div>
            )}

            {!loading &&  media.filter(item => item.type === 2).length == 0 && (
              <>
                <div
                  className="alert alert-light text-center px-5"
                  role="alert"
                >
                  <i className="fas fa-exclamation-circle me-2" />
                  Belum ada berita terbaru yang tersedia.
                </div>
              </>
            )}

          {!loading && media.filter(item => item.type === 2).length > 0 && (
            media.filter(item => item.type === 2).map((item) => (
              <div className="info-card-info-bumdes" data-bs-toggle="modal" data-bs-target="#modalMedia" key={item.id}
                onClick={() => setSelectedMedia(item)}>
                <img src={item.image} alt="Images" />
                <div>
                  <p className="info-title-info-bumdes">{item.title}</p>
                  <p className="info-sub-info-bumdes mt-1">
                    {item.description.length > 50 ? (
                      <>
                        {item.description.slice(0, 60)}...
                      </>
                    ) : (
                      item.description
                    )}
                  </p>
                </div>
              </div>
            ))
          )}

          <hr/>

          <div className="section-title-info-bumdes mt-3">Produk Unggulan</div>

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
                    Belum ada produk unggulan yang tersedia.
                  </div>
                </>
              )}

            {!loading && products.length > 0 && (
              <div className="info-card-info-bumdes" data-bs-toggle="modal" data-bs-target="#modalProduct"
                onClick={() => setSelectedProduct(products[0])}>
                <img src={products[0].images} alt="Produk Unggulan" />
                <div>
                  <p className="info-title-info-bumdes">{products[0].name}</p>
                  <p className="info-sub-info-bumdes mt-1">{products[0].description}</p>
                </div>
              </div>
            )}
        </section>
      </div>

      <div
        className="modal fade"
        id="modalInfoBUMDes"
        tabIndex={-1}
        aria-labelledby="modalInfoBUMDesLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
              <div className="modal-body">
               <div className="card shadow rounded-3 mb-3">
                <div className="card-body mb-2">
                    <img
                      src={selectedInfoBUMDES?.image ? selectedInfoBUMDES?.image : "training.png"}
                      alt="Notifikasi"
                      className="w-50 d-block mx-auto rounded-3 mt-2 mb-4"
                    />
                  <h5 className="my-3">{selectedInfoBUMDES?.title}</h5>
                  <p className="mb-0 mt-3 small">
                    {selectedInfoBUMDES?.description}
                  </p>
                </div>
              </div>
              <button
                  type="button"
                  className="btn btn-secondary w-100 mt-2 rounded-5"
                  data-bs-dismiss="modal"
                >
                  Tutup
                </button>
              </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="modalMedia"
        tabIndex={-1}
        aria-labelledby="modalMediaLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
              <div className="modal-body">
               <div className="card shadow rounded-3 mb-3">
                <div className="card-body mb-2">
                    <img
                      src={selectedMedia?.image ? selectedMedia?.image : "training.png"}
                      alt="Notifikasi"
                      className="w-50 d-block mx-auto rounded-3 mt-2 mb-4"
                    />
                  <h5 className="my-3">{selectedMedia?.title}</h5>
                  <p className="mb-0 mt-3 small">
                    {selectedMedia?.description}
                  </p>
                  <p className="mb-0 mt-3 text-muted small">
                    {selectedMedia?.created_at ? formatDate(selectedMedia.created_at) : ""}
                  </p>
                </div>
              </div>
              <button
                  type="button"
                  className="btn btn-secondary w-100 mt-2 rounded-5"
                  data-bs-dismiss="modal"
                >
                  Tutup
                </button>
              </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="modalProduct"
        tabIndex={-1}
        aria-labelledby="modalProductLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
              <div className="modal-body">
               <div className="card shadow rounded-3 mb-3">
                <div className="card-body mb-2">
                    <img
                      src={selectedProduct?.images ? selectedProduct?.images : "training.png"}
                      alt="Notifikasi"
                      className="w-50 d-block mx-auto rounded-3 mt-2 mb-4"
                    />
                  <h5 className="my-3">{selectedProduct?.name}</h5>
                  <p className="mb-0 mt-3 small">
                    {selectedProduct?.description}
                  </p>
                  <h5 className="mb-0 mt-3 fw-bold text-orange">
                    {formatRupiah(Number(selectedProduct?.price))}
                  </h5>
                </div>
              </div>
              <button
                  type="button"
                  className="btn btn-secondary w-100 mt-2 rounded-5"
                  data-bs-dismiss="modal"
                >
                  Tutup
                </button>
              </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InfoBUMDes

