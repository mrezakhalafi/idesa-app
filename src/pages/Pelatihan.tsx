import { useState, useEffect } from "react";
import './Pelatihan.css'
import { Link } from 'react-router-dom'
import TrainingDrawer from "../components/TrainingDrawer";
import axios from "axios";

interface Training {
  id: number;
  training_id: string; 
  title: string;
  description: string;
  location: string;
  date: string;
  category_id: number;
  created_at: string;
  participants: number;
  institution: string;
}

interface Category {
  id: number;
  category_id: string;
  name: string;
  icon: string;
}

const Pelatihan = () => {

  const [training, setTraining] = useState<Training[]>([]);
  const [selectedTraining, setSelectedTraining] = useState<Training>();
  const [category, setCategory] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTraining = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/training`)
      .then((res) => {
        console.log(res.data);
        setTraining(res.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchCategory = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/category_posts`)
      .then((res) => {
        console.log(res.data);
        setCategory(res.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTraining();
    fetchCategory();
  }, []);

  function formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
    };
    return new Date(dateString).toLocaleString("id-ID", options);
  }

  function formatMonth(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
    };
    return new Date(dateString).toLocaleString("id-ID", options);
  }

  function formatTime(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleString("id-ID", options);
  }

  return (
    <div className="main-container">
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
              Pelatihan
            </h1>
          </div>
        </div>
      </div>

      <ul className="nav nav-tabs nav-fill belanja-tab" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className="nav-link py-3 active"
            style={{ color: "#3a3a3a" }}
            id="pelatihan-tab"
            data-bs-toggle="tab"
            data-bs-target="#pelatihan"
            type="button"
            role="tab"
          >
            <i className="fa-solid fa-clipboard px-1 me-1"></i> Pelatihan
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link py-3"
            style={{ color: "#3a3a3a" }}
            id="magang-tab"
            data-bs-toggle="tab"
            data-bs-target="#magang"
            type="button"
            role="tab"
          >
            <i className="fa-solid fa-briefcase px-1 me-1"></i> Magang
          </button>
        </li>
      </ul>

      <div className="tab-content">
        <div
          className="tab-pane fade show active"
          id="pelatihan"
          role="tabpanel"
        >
        <section className="sheet">
          <div className="hero-map bg-white">
            <div className="section-title pb-3">Pelatihan Mendatang</div>

            {loading && (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status" />
                <div className="mt-2">Memuat Data...</div>
              </div>
            )}

            {!loading && !training.length && (
            <>
              <div className="alert alert-light text-center px-5" role="alert">
                <i className="fas fa-exclamation-circle me-2" />
                Belum ada pelatihan mendatang yang tersedia.
              </div>
            </>
          )}

            {!loading && training[0] && (
            <div className="feature-list shadow d-flex p-3 position-relative" style={{ backgroundColor: '#e8e8e8', overflow: 'hidden' }}
              data-bs-toggle="offcanvas"
              data-bs-target="#trainingDrawer"
              aria-controls="trainingDrawer"
              onClick={() => setSelectedTraining(training[0])}
              >
              <div className="col-3 d-flex align-items-center justify-content-center">
                <h1 style={{ fontSize: '5rem' }}>
                  <i className={`fa-solid ${category.find((cat) => cat.id === training[0].category_id)?.icon || ""}`} style={{ color: '#ff8f17' }} />
                </h1>
              </div>
              <div className="col-9 d-flex flex-column ms-4">
                <span className="badge bg-primary mb-2 bg-secondary" style={{ width: '40%' }}>
                  {category.find((cat) => cat.id === training[0].category_id)?.name || ""}
                </span>
                <h4 className="mb-3 mt- w-75">{training[0].title}</h4>
                <span className="m-0 text-muted" style={{ fontSize: '13px' }}>
                  <i className="fa-solid fa-location-dot me-2" />
                  {training[0].location}
                  <span className="mx-2">-</span>
                  <i className="fa-regular fa-clock me-1" />
                  {formatTime(training[0].date)} WIB
                </span>
              </div>
              <div className="date-ribbon position-absolute top-0 end-0 d-flex flex-column align-items-center fx-orange">
                <span className="day">{formatDate(training[0].date)}</span>
                <span className="month">{formatMonth(training[0].date)}</span>
              </div>
            </div>
          )}

          </div>

          <div className="section-title pt-5">Materi Pelatihan</div>

          {loading && (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status" />
              <div className="mt-2">Memuat Data...</div>
            </div>
          )}

          {!loading && !training.length && (
            <>
              <div className="alert alert-light text-center px-5 mt-3" role="alert">
                <i className="fas fa-exclamation-circle me-2" />
                Belum ada materi pelatihan yang tersedia.
              </div>
              <img
                src="training.png"
                alt="Notifikasi"
                className="w-50 d-block mx-auto"
              />
            </>
          )}

          <div className="feature-list mt-3 shadow">
            {!loading &&
            training.slice(1).map((item) => (
              <div
                key={item.id}
                className="feature-item py-3"
                data-bs-toggle="offcanvas"
                data-bs-target="#trainingDrawer"
                aria-controls="trainingDrawer"
                onClick={() => setSelectedTraining(item)}
              >
                <div className="feature-left">
                  <div className="feature-icon fx-orange">
                    <i className={`fa-solid ${category.find((cat) => cat.id === item.category_id)?.icon || ""}`} />
                  </div>
                  <div className="feature-name">{item.title}</div>
                </div>
                <i className="fa-solid fa-chevron-right" />
              </div>
            ))}

          </div>
        </section>
      </div>

      <div className="tab-pane fade" id="magang" role="tabpanel">
        <div className="sheet">
          <small className="fw-bold">Temukan pelatihan magang yang sesuai dengan kebutuhan Anda melalui beberapa portal berikut.</small>

          <div className="alert alert-light text-center pe-4 mt-4 shadow-sm" style={{ backgroundColor: '#e8e8e8' }} role="alert" onClick={() => window.location.href='https://www.jobstreet.co.id/'}>
            Jobstreet
            <i className="fa-solid fa-chevron-right float-end" />
          </div>
          <div className="alert alert-light text-center pe-4 mt-3 shadow-sm" style={{ backgroundColor: '#e8e8e8' }} role="alert" onClick={() => window.location.href='https://www.kalibrr.com/id-ID/home'} >
            Kalibrr
            <i className="fa-solid fa-chevron-right float-end" />
          </div>
          <div className="alert alert-light text-center pe-4 mt-3 shadow-sm" style={{ backgroundColor: '#e8e8e8' }} role="alert" onClick={() => window.location.href='https://www.indeed.com/'} >
            Indeed
            <i className="fa-solid fa-chevron-right float-end" />
          </div>
           <div className="alert alert-light text-center pe-4 mt-3 shadow-sm" style={{ backgroundColor: '#e8e8e8' }} role="alert" onClick={() => window.location.href='https://www.karir.com/'} >
            Karir
            <i className="fa-solid fa-chevron-right float-end" />
          </div>
          <div className="alert alert-light text-center pe-4 mt-3 mb-4 shadow-sm" style={{ backgroundColor: '#e8e8e8' }} role="alert" onClick={() => window.location.href='https://glints.com/id/'} >
            Glints
            <i className="fa-solid fa-chevron-right float-end" />
          </div>

          <small style={{ color: '#ff8f17' }}>* Pelatihan magang diselenggarakan oleh pihak <b>diluar</b> dari aplikasi <b>iDesa</b></small>       
        </div>
      </div>

    </div>
    <TrainingDrawer training={selectedTraining} />

  </div>
  )
}

export default Pelatihan

