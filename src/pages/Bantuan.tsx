import { useState } from "react";
import './Bantuan.css'
import { Link, useNavigate } from 'react-router-dom'

interface Bantuan {
  id: string;
  title: string;
  icon: string;
  description: string;
}
const bantuanList: Bantuan[] = [
  {
    id: "surat_desa",
    title: "Surat Desa",
    icon: "fa-solid fa-file-signature",
    description: ""
  },
  {
    id: "puskesmas_desa",
    title: "Puskesmas Desa",
    icon: "fa-solid fa-user-doctor",
    description: ""
  },
  {
    id: "chat_langsung",
    title: "Chat Langsung",
    icon: "fa-solid fa-comment",
    description: "Tidak ada agent yang online saat ini. Silahkan coba beberapa saat lagi."
  },
  {
    id: "pusat_bantuan",
    title: "Pusat Bantuan",
    icon: "fa-solid fa-headset",
    description: "Silakan menghubungi email bantuan@satuidesa.id untuk mendapatkan bantuan."
  },
  {
    id: "pusat_informasi",
    title: "Pusat Informasi",
    icon: "fa-solid fa-info-circle",
    description: "Silakan menghubungi email informasi@satuidesa.id untuk untuk mendapatkan informasi seputar Satu iDesa."
  },
];

  const openContactCenter = () => {
    if ((window as any).Android && typeof (window as any).Android.openContactCenter === "function") {
      (window as any).Android.openContactCenter();
    } else {
      console.log("Android interface not available");
    }
  };

const Bantuan = () => {

  const [selected, setSelected] = useState<Bantuan | null>(null);
  const navigate = useNavigate();

  const openSuratDesa = () => {
    navigate("/surat_desa");
  }

    const openPuskesmasDesa = () => {
    navigate("/puskesmas_desa");
  }

  return (

    <div className="main-container">
      <div className="background">
        <div className="header py-3">
          <div className="d-flex">
            <Link to="/" replace className="header-icon" style={{ fontSize: '24px', color: 'white', textDecoration: 'none' }}>
              <i className="fa-solid fa-arrow-left" />
            </Link>
            <h1 className="ms-3" style={{ marginTop: '0.35rem' }}>Layanan</h1>
          </div>
        </div>
        <section className="sheet">
          <p className="mb-3 mt-3 fw-bold">Silahkan pilih salah satu layanan desa di bawah ini</p>

          <div className="feature-list mt-3 shadow">
            {bantuanList.map((bantuan) => (
              <div key={bantuan.id} 
                className="feature-item-bantuan" 
                data-bs-toggle={bantuan.id !== "chat_langsung" && bantuan.id !== "surat_desa" && bantuan.id !== "puskesmas_desa" ? "modal" : undefined}
                data-bs-target={bantuan.id !== "chat_langsung" && bantuan.id !== "surat_desa" && bantuan.id !== "puskesmas_desa" ? "#modalBantuan" : undefined}
                onClick={() => {
                  if (bantuan.id === "chat_langsung") {
                    openContactCenter();
                  } else if (bantuan.id === "surat_desa") {
                    openSuratDesa();
                  } else if (bantuan.id === "puskesmas_desa") {
                    openPuskesmasDesa();
                  } else {
                    setSelected(bantuan);
                  }
                }}
              >
                <div className="feature-left">
                  <div
                    className={`feature-icon`}
                    style={{
                      background: bantuan.title === "Surat Desa" || bantuan.title === "Chat Langsung" || bantuan.title === "Puskesmas Desa"
                        ? "linear-gradient(135deg, #3a9306, #41b883)"
                        : "linear-gradient(135deg, #667eea, #764ba2)",
                    }}
                  >
                    <i className={bantuan.icon} />
                  </div>
                  <div className="feature-name">{bantuan.title}</div>
                </div>
                <i className="fa-solid fa-chevron-right" />
              </div>
            ))}
          </div>
        </section>
      </div>

      <div
        className="modal fade"
        id="modalBantuan"
        tabIndex={-1}
        aria-labelledby="modalBantuanLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            {selected && (
              <div className="modal-body text-center">
                <div className="d-flex justify-content-center">
                  <div className="menu-item-bantuan">
                    <div className="feature-icon-bantuan mx-auto fx-road">
                      <i className={`fas fs-50 ${selected.icon}`}></i>
                    </div>
                    <div className="mt-3 fw-bold">{selected.title}</div>
                  </div>
                </div>
                <div className="card p-3 text-center">
                  <p className="card-text">{selected.description}</p>
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
  )
}

export default Bantuan

