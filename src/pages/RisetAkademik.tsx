import { useState, useEffect } from "react";
import "./RisetAkademik.css";
import { Link } from "react-router-dom";
import axios from "axios";

interface RisetAkademik {
  id: string;
  research_id: string;
  title: string;
  description: string;
  source: string;
  created_at: string;
}

const RisetAkademik = () => {
  const [risetAkademik, setRisetAkademik] = useState<RisetAkademik[]>([]);
  const [selectedReport, setSelectedReport] = useState<RisetAkademik>();
  const [loading, setLoading] = useState(true);

  const fetchRisetAkademik = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/research`)
      .then((res) => {
        console.log(res.data);
        setRisetAkademik(res.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchRisetAkademik();
  }, []);

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
            <Link
              to="/" replace
              className="header-icon"
              style={{
                fontSize: "24px",
                color: "white",
                textDecoration: "none",
              }}
            >
              <i className="fa-solid fa-arrow-left" />
            </Link>
            <h1 className="ms-3" style={{ marginTop: "0.35rem" }}>
              Riset Akademik
            </h1>
          </div>
        </div>

        <section className="sheet">
          {loading && (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status" />
              <div className="mt-2">Memuat Data...</div>
            </div>
          )}

          {!loading && !risetAkademik.length && (
            <>
              <div className="alert alert-light text-center px-5" role="alert">
                <i className="fas fa-exclamation-circle me-2" />
                Belum ada riset akademik yang tersedia untuk saat ini.
              </div>
              <img
                src="notification.png"
                alt="Notifikasi"
                className="w-50 d-block mx-auto"
              />
            </>
          )}

          {!loading &&
            risetAkademik.map((item) => (
              <div className="info-card" key={item.id}>
                <div className="section-title-riset-akademik">{item.title}</div>
                <div className="info-sub">
                  {item.description.length > 100
                    ? `${item.description.substring(0, 180)}...`
                    : item.description}
                </div>
                <div className="info-link">
                  <a
                    className="text-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#risetAkademik"
                    onClick={() => setSelectedReport(item)}
                  >
                    Baca Selengkapnya
                  </a>
                </div>
                <p className="info-title">Sumber : {item.source}</p>
                <p className="info-sub">{formatDate(item.created_at)}</p>
              </div>
            ))}
        </section>
      </div>

      <div
        className="modal fade"
        id="risetAkademik"
        tabIndex={-1}
        aria-labelledby="risetAkademikLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            {selectedReport && (
              <div className="modal-body">
                <h5 className="modal-title mb-3" id="risetAkademikLabel">
                  {selectedReport.title}
                </h5>
                <div className="d-block"></div>
                <small className="mt-3">{selectedReport.description}</small>
                <div className="mt-3">
                  <small className="text-muted">
                    Oleh {selectedReport.source} pada{" "}
                    {formatDate(selectedReport.created_at)}
                  </small>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary w-100 mt-4 rounded-5"
                  data-bs-dismiss="modal"
                >
                  Tutup
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RisetAkademik;
