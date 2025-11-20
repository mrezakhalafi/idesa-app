import { useState, useEffect } from "react";
import './PuskesmasDesa.css'
import { Link } from 'react-router-dom'
import NewsDrawer from '../components/NewsDrawer'
import axios from "axios";

interface PuskesmasDesa {
  id: string;
  title: string;
  icon: string;
  description: string;
  link: string;
}
const puskesmasDesaList: PuskesmasDesa[] = [
  {
    id: "pendaftaran_puskesmas_desa",
    title: "Pendaftaran Puskesmas Desa",
    icon: "fa-solid fa-hospital",
    description: "Pendaftaran Puskesmas Desa",
    link: "/pendaftaran_puskesmas_desa"
  }
];

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

const PuskesmasDesa = () => {

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

    function formatDate(dateString: string): string {
        const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
        };
        return new Date(dateString).toLocaleString("id-ID", options);
    }

    useEffect(() => {
        fetchMedia();
    }, []);

    return (
    <div className="main-container">
      <div className="background">
        <div className="header py-3">
          <div className="d-flex">
            <Link to="/bantuan" className="header-icon" style={{ fontSize: '24px', color: 'white', textDecoration: 'none' }}>
              <i className="fa-solid fa-arrow-left" />
            </Link>
            <h1 className="ms-3" style={{ marginTop: '0.35rem' }}>Puskesmas Desa</h1>
          </div>
        </div>
        <section className="sheet">
          <p className="mb-3 mt-3 small mx-2">
            Layanan Puskesmas Desa dapat dilakukan secara online melalui aplikasi iDesa.
          </p>

            <div className="feature-list mt-3 mb-4 shadow">
            {puskesmasDesaList.map((sd) => (
              <Link key={sd.id} to={sd.link}
                className="feature-item-bantuan" 
              >
                <div className="feature-left">
                  <div
                    className={`feature-icon fx-green`}>
                    <i className={sd.icon} />
                  </div>
                  <div className="feature-name">{sd.title}</div>
                </div>
                <i className="fa-solid fa-chevron-right" />
              </Link>
            ))}
          </div>

          <hr/>

          <div className="section-title-media-desa mt-2">Informasi Kesehatan</div>

           {loading && (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status" />
                <div className="mt-2">Memuat Data...</div>
              </div>
            )}

            {!loading && media.filter(item => item.type === 3).length == 0 && (
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
            .filter((item) => item.type === 3)
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

)}

export default PuskesmasDesa