import { useState, useEffect } from "react";
import './MediaDesa.css'
import { Link } from 'react-router-dom'
import NewsDrawer from '../components/NewsDrawer'
import axios from "axios";

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
  category_name: string;
}

const MediaDesa = () => {

  const [media, setMedia] = useState<Media[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<Media>();
  const [loading, setLoading] = useState(true);

  const fetchMedia = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/media`)
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
    fetchMedia();
  }, []);

  function formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleString("id-ID", options);
  }

  return (
    <div className="main-container">
      <div className="background">
        <div className="header py-3">
          <div className="d-flex">
            <Link to="/" replace className="header-icon" style={{ fontSize: '24px', color: 'white', textDecoration: 'none' }}>
              <i className="fa-solid fa-arrow-left"></i>
            </Link>
            <h1 className="ms-3" style={{ marginTop: '0.35rem' }}>Media Desa</h1>
          </div>
        </div>

        <section className="sheet-media-desa py-3 px-4">
          <div className="section-title-media-desa mt-2">Galeri</div>
          <div className="hero-map">
            <div
              id="newsCarousel"
              className="carousel slide hero-carousel"
              data-bs-ride="carousel"
              data-bs-interval="2000"
            >
              <div className="carousel-indicators">

                {media
                  .filter((item) => item.type === 1)
                  .map((_item, index) => (
                    <button
                      key={index}
                      type="button"
                      data-bs-target="#newsCarousel"
                      data-bs-slide-to={index}
                      className={index === 0 ? "active" : ""}
                    ></button>
                  ))}

              </div>

              <div className="carousel-inner">

                {loading && (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status" />
                    <div className="mt-2">Memuat Data...</div>
                  </div>
                )}

                {!loading && media.filter(item => item.type === 1).length == 0 && (
                  <>
                    <div className="alert alert-light text-center px-5" role="alert">
                      <i className="fas fa-exclamation-circle me-2" />
                      Belum ada galeri yang tersedia.
                    </div>
                  </>
                )}

                {!loading && media
                  .filter((item) => item.type === 1)
                  .map((item, index) => (
                    <div
                      key={item.id}
                      className={index === 0 ? "carousel-item active" : "carousel-item"}
                    >
                      <img src={item.image} alt="" srcSet="" className="carousel-bg" />
                      <div className="carousel-overlay">
                        <div className="carousel-content">
                          <h2 className="carousel-title">
                            {item.title}
                          </h2>
                          <p className="carousel-text">
                            {item.description}
                          </p>
                          <div className="carousel-meta d-flex justify-content-between">
                            <span
                              className="me-2"
                            >
                              <i className="fas fa-calendar-alt me-1"></i> {formatDate(item.created_at)}
                            </span>
                            <span className="me-2">
                              <i className="fas fa-user me-1"></i> {item.source}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#newsCarousel"
                data-bs-slide="prev"
              >
                <span className="carousel-control-prev-icon"></span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#newsCarousel"
                data-bs-slide="next"
              >
                <span className="carousel-control-next-icon"></span>
              </button>
            </div>
          </div>

          <div className="section-title-media-desa mt-2">Berita</div>

           {loading && (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status" />
                <div className="mt-2">Memuat Data...</div>
              </div>
            )}

            {!loading && media.filter(item => item.type === 2).length == 0 && (
              <>
                <div className="alert alert-light text-center px-5" role="alert">
                  <i className="fas fa-exclamation-circle me-2" />
                  Belum ada berita yang tersedia.
                </div>
                <img
                  src="post.png"
                  alt="Notifikasi"
                  className="w-50 d-block mx-auto"
                />
              </>
            )}

          {!loading && media
            .filter((item) => item.type === 2)
            .map((item) => (
              <div className="col" key={item.id}>
                <div className="card news-card">
                  <img src={item.image} alt="" srcSet="" className="news-image" />
                  <div className="news-content">
                    <span className="news-category px-3">
                      {item.category_name}
                    </span>
                    <h3 className="news-title mt-2">{item.title}</h3>
                    <p className="news-excerpt">{item.description}</p>
                    <div className="news-meta">
                      <span className="news-date"
                        style={{ marginRight: '1rem' }}
                      >
                        <i className="fas fa-calendar-alt"></i> {formatDate(item.created_at)}
                      </span>
                      <button
                        className="btn btn-read-more"
                        data-bs-toggle="offcanvas" data-bs-target="#newsDrawer"
                        aria-controls="newsDrawer"
                        onClick={() => setSelectedMedia(item)}
                      >
                        Baca
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

        </section>
      </div>

      <NewsDrawer
        media={selectedMedia}
      />

    </div>
  );
}

export default MediaDesa;
