import { useState, useEffect } from "react";
import "./Aduan.css";
import { Link } from "react-router-dom";
import axios from "axios";
import ReportDrawer from "../components/ReportDrawer";

interface Report {
  id: number;
  report_id: string;
  title: string;
  description: string;
  category_id: number;
  created_at: string;
  name: string;
}

interface Category {
  id: number;
  category_id: string;
  name: string;
  icon: string;
}

const Aduan = () => {
  const [report, setReport] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [category, setCategory] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/reports`)
      .then((res) => {
        console.log(res.data);
        setReport(res.data);
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
    fetchReports();
    fetchCategory();
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

  const handleReportClick = (report: Report) => {
    setSelectedReport(report);
  };

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
              Aduan
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

          {!loading && !report.length && (
            <>
              <div className="alert alert-light text-center px-5" role="alert">
                <i className="fas fa-exclamation-circle me-2" />
                Belum ada aduan yang masuk.
              </div>
              <img
                src="notification.png"
                alt="Notifikasi"
                className="w-50 d-block mx-auto"
              />
            </>
          )}

          <div className="feature-list-aduan shadow">
            {!loading &&
              report.map((item) => (
                <div
                  className="feature-item-aduan"
                  key={item.id}
                  onClick={() => handleReportClick(item)}
                  data-bs-toggle="modal"
                  data-bs-target="#modalAduan"
                >
                  <div className="feature-left">
                    <div className="feature-icon fx-road-aduan">
                        <i className={`fa-solid ${category.find((cat) => cat.id === item.category_id)?.icon || ""}`} />
                    </div>
                    <div className="feature-name mt-3 ms-1 mb-3">
                      <small>{item.title}</small> <br />
                      <small className="text-muted fw-normal">
                        {item.name}
                      </small>{" "}
                      <br />
                      <small className="text-muted fw-normal">
                        {formatDate(item.created_at)}
                      </small>
                    </div>
                  </div>
                  <i className="fa-solid fa-chevron-right" />
                </div>
              ))}
          </div>
        </section>
        <div className="bg-aduan d-flex justify-content-center mb-5">
          <button
            type="button"
            className="btn btn-primary btn-dark w-75 mt-3 fw-bold"
            data-bs-toggle="offcanvas"
            data-bs-target="#reportDrawer"
            aria-controls="reportDrawer"
          >
            Buat Aduan
          </button>
        </div>
      </div>

      <div
        className="modal fade"
        id="modalAduan"
        tabIndex={-1}
        aria-labelledby="modalAduanLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            {selectedReport && (
              <div className="modal-body">
                <h5 className="modal-title mb-3" id="modalAduanLabel">
                  {selectedReport.title}
                </h5>
                <div className="d-block"></div>
                <small className="mt-3">{selectedReport.description}</small>
                <div className="mt-3">
                  <small className="text-muted">
                    Oleh {selectedReport.name} pada{" "}
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

      <ReportDrawer onReportCreated={() => fetchReports()} />
    </div>
  );
};

export default Aduan;
