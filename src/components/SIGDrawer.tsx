import { useState, useEffect } from "react";
import axios from "axios";
type SIGDrawerProps = {
  menu: string;
};

interface SIG{
  id: number;
  sig_id: string;
  title: string;
  icon: string;
  value: number;
  type: number;
  created_at: string;
}

const SIGDrawer = ({ menu }: SIGDrawerProps) => {

  const [sig, setSIG] = useState<SIG[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSIG = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/sig`)
      .then((res) => {
        console.log(res.data);
        setSIG(res.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchSIG();
  }, []);

  const gradients = [
    "#ce443c",
    "#33c6a8",
    "#3b82f6",
    "#f5576c",
    "#dd8867",
    "#566a7f",
    "#ce443c",
    "#ff9900",
    "#ff69b4",
    "#ffc107",
    "#00bfff",
    "#5ea333ff",
  ];

  let content;

  if (menu === "Infrastruktur") {
    content = (
          <div className="row g-3">
            <div className="px-3">
              <p className="mb-2 text-muted small">Infrastruktur desa adalah sarana dan prasarana yang ada di desa yang digunakan untuk meningkatkan kesejahteraan masyarakat.</p>
            </div>

            {loading && (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status" />
                <div className="mt-2">Memuat Data...</div>
              </div>
            )}

            {!loading && !sig.length && (
              <>
                <div className="alert alert-light text-center px-5" role="alert">
                  <i className="fas fa-exclamation-circle me-2" />
                  Belum ada data yang tersedia.
                </div>
                <img
                  src="post.png"
                  alt="Notifikasi"
                  className="w-50 d-block mx-auto"
                />
              </>
            )}

            {!loading && sig.filter((item) => item.type === 1).map((item, index) => (
              <div className="col-6" key={index}>
                <div className="card-list card shadow rounded-3">
                  <div className="card-body">
                    <div className="text-center">
                      <h6 className="mb-3">{item.title}</h6>
                      <i className={`fa-solid py-1 ${item.icon}`} style={{ fontSize: "2.5rem", color: gradients[(item.id - 1) % gradients.length] }} />
                      <p className="mb-0 mt-3">
                        <span className="badge rounded-pill bg-orange-outline px-3 py-2" style={{ fontSize: "0.85rem" }}>{item.value}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
    );
  } else if (menu === "Pertanian") {
    content = (
      <div className="row g-3">
        <div className="px-3">
          <p className="mb-2 text-muted small">
            Pertanian desa adalah sektor yang bergerak dalam bidang pertanian, perkebunan, peternakan, perikanan, dan kehutanan.
          </p>
        </div>
        
          {loading && (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status" />
              <div className="mt-2">Memuat Data...</div>
            </div>
          )}

          {!loading && !sig.length && (
            <>
              <div className="alert alert-light text-center px-5" role="alert">
                <i className="fas fa-exclamation-circle me-2" />
                Belum ada data yang tersedia.
              </div>
              <img
                src="post.png"
                alt="Notifikasi"
                className="w-50 d-block mx-auto"
              />
            </>
          )}

          {!loading && sig.filter((item) => item.type === 2).map((item, index) => (
          <div className="col-6" key={index}>
            <div className="card-list card shadow rounded-3">
              <div className="card-body">
                <div className="text-center">
                  <h6 className="mb-3">{item.title}</h6>
                  <i className={`fa-solid py-1 ${item.icon}`} style={{ fontSize: "2.5rem", color: gradients[(item.id - 1) % gradients.length] }} />
                  <p className="mb-0 mt-3">
                    <span className="badge rounded-pill bg-orange-outline px-3 py-2" style={{ fontSize: "0.85rem" }}>{item.value}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
        
      </div>
    );
  } else if (menu === "Kependudukan") {
    content = (
      <div className="row g-3">
        <div className="px-3">
          <p className="mb-2 text-muted small">Kependudukan desa adalah jumlah penduduk yang tinggal di desa.</p>
        </div>
        
          {loading && (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status" />
              <div className="mt-2">Memuat Data...</div>
            </div>
          )}

          {!loading && !sig.length && (
            <>
              <div className="alert alert-light text-center px-5" role="alert">
                <i className="fas fa-exclamation-circle me-2" />
                Belum ada data yang tersedia.
              </div>
              <img
                src="post.png"
                alt="Notifikasi"
                className="w-50 d-block mx-auto"
              />
            </>
          )}

          {!loading && sig.filter((item) => item.type === 3).map((item, index) => (
          <div className="col-6" key={index}>
            <div className="card-list card shadow rounded-3">
              <div className="card-body">
                <div className="text-center">
                  <h6 className="mb-3">{item.title}</h6>
                  <i className={`fa-solid py-1 ${item.icon}`} style={{ fontSize: "2.5rem", color: gradients[(item.id - 1) % gradients.length] }} />
                  <p className="mb-0 mt-3">
                    <span className="badge rounded-pill bg-orange-outline px-3 py-2" style={{ fontSize: "0.85rem" }}>{item.value}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

      </div>
    );
  } else if (menu === "Batas Desa") {
    content = (
      <div className="row g-3">
        <div className="px-3">
          <p className="mb-2 text-muted small">Batas desa adalah batas yang memisahkan antara desa dengan desa lainya.</p>
        </div>
        
          {loading && (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status" />
              <div className="mt-2">Memuat Data...</div>
            </div>
          )}

          {!loading && !sig.length && (
            <>
              <div className="alert alert-light text-center px-5" role="alert">
                <i className="fas fa-exclamation-circle me-2" />
                Belum ada data yang tersedia.
              </div>
              <img
                src="post.png"
                alt="Notifikasi"
                className="w-50 d-block mx-auto"
              />
            </>
          )}

          {!loading && sig.filter((item) => item.type === 4).map((item, index) => (
          <div className="col-6" key={index}>
            <div className="card-list card shadow rounded-3">
              <div className="card-body">
                <div className="text-center">
                  <h6 className="mb-3">{item.title}</h6>
                  <i className={`fa-solid py-1 ${item.icon}`} style={{ fontSize: "2.5rem", color: gradients[(item.id - 1) % gradients.length] }} />
                  <p className="mb-0 mt-3">
                    <span className="badge rounded-pill bg-orange-outline px-3 py-2" style={{ fontSize: "0.75rem" }}>{item.value}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="offcanvas offcanvas-end w-100 drawer" id="SIGDrawer" aria-labelledby="SIGDrawerLabel">
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="SIGDrawerLabel">{menu}</h5>
        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div className="offcanvas-body p-4">
        {content}
      </div>
    </div>
    )
}

export default SIGDrawer

