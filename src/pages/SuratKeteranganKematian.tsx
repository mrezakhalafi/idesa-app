import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SuratKeteranganKematian = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    namaAlm: "",
    nikAlm: "",
    tanggalLahir: "1990-01-01",
    tanggalMeninggal: "2025-01-01",
    alamatTerakhir: "",
    keperluan: "",
    namaPelapor: "",
  });

  const [isNotFilled, setIsNotFilled] = useState(false);

  // Handle perubahan form
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const sendData = (e: React.FormEvent) => {
    e.preventDefault();

        const isFormDataEmpty = Object.values(formData).some((value) => value === "");
    if (isFormDataEmpty) {
      setIsNotFilled(true);
      return;
    } else {
      setIsNotFilled(false);
    }

    axios
      .post(`${import.meta.env.VITE_API_URL}/surat_keterangan_kematian/create`, {
        f_pin: JSON.parse(localStorage.getItem("loginData") || "{}").f_pin,
        ...formData,
      })
      .then((response) => {

        console.log("Success:", response.data);
        navigate("/waiting")

      })
      .catch((error) => {
        console.error("Error:", error);
      });

  };

  const resetForm = () => {
    setFormData({
      namaAlm: "",
      nikAlm: "",
      tanggalLahir: "",
      tanggalMeninggal: "",
      alamatTerakhir: "",
      keperluan: "",
      namaPelapor: "",
    });
    setIsNotFilled(false);
  };

  return (
    <div className="main-container">
      <div className="background">
        <div className="header py-3">
          <div className="d-flex">
            <Link
              to="/surat_desa"
              className="header-icon"
              style={{ fontSize: "24px", color: "white", textDecoration: "none" }}
            >
              <i className="fa-solid fa-arrow-left" />
            </Link>
            <h1 className="ms-3" style={{ marginTop: "0.35rem" }}>
              Surat Keterangan Kematian
            </h1>
          </div>
        </div>
      </div>

      <div className="container my-4">
        {isNotFilled && (
          <div className="alert alert-danger text-center px-5" role="alert">
            <i className="fas fa-exclamation-circle me-2" />
            Data formulir tidak boleh kosong.
          </div>
        )}

        <form className="card shadow p-4" onSubmit={sendData}>
          <div className="mb-3">
            <label htmlFor="namaAlm" className="form-label fw-bold">
              Nama Alm/Almh
            </label>
            <input
              type="text"
              className="form-control rounded-4 py-2"
              id="namaAlm"
              placeholder="Masukkan nama Alm/Almh"
              value={formData.namaAlm}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="nikAlm" className="form-label fw-bold">
              Nomor KTP/NIK (Alm/Almh)
            </label>
            <input
              type="number"
              className="form-control rounded-4 py-2"
              id="nikAlm"
              placeholder="Nomor Induk Kependudukan"
              value={formData.nikAlm}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="tanggalLahir" className="form-label fw-bold">
              Tanggal Lahir
            </label>
            <input
              type="date"
              className="form-control rounded-4 py-2"
              id="tanggalLahir"
              value={formData.tanggalLahir}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="tanggalMeninggal" className="form-label fw-bold">
              Tanggal Meninggal
            </label>
            <input
              type="date"
              className="form-control rounded-4 py-2"
              id="tanggalMeninggal"
              value={formData.tanggalMeninggal}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="alamatTerakhir" className="form-label fw-bold">
              Alamat Terakhir
            </label>
            <textarea
              className="form-control rounded-4 py-2"
              id="alamatTerakhir"
              placeholder="Masukkan alamat terakhir"
              value={formData.alamatTerakhir}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="keperluan" className="form-label fw-bold">
              Keperluan
            </label>
            <textarea
              className="form-control rounded-4 py-2"
              id="keperluan"
              placeholder="Tuliskan keperluan surat"
              value={formData.keperluan}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="namaPelapor" className="form-label fw-bold">
              Nama Pelapor
            </label>
            <input
              type="text"
              className="form-control rounded-4 py-2"
              id="namaPelapor"
              placeholder="Masukkan nama pelapor"
              value={formData.namaPelapor}
              onChange={handleChange}
            />
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-dark mt-2">
              Kirim Pengajuan
            </button>
            <button
              type="button"
              className="btn btn-outline-dark my-2"
              onClick={resetForm}
            >
              Ulang Pengisian
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SuratKeteranganKematian;
