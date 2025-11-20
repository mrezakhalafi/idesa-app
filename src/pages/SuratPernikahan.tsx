import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SuratAdministrasiPernikahan = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    namaSuami: "",
    nikSuami: "",
    namaIstri: "",
    nikIstri: "",
    tanggalPernikahan: "2025-01-01",
    alamat: "",
    keteranganTambahan: "",
  });

  const [isNotFilled, setIsNotFilled] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
      .post(`${import.meta.env.VITE_API_URL}/surat_pernikahan/create`, {
        f_pin: JSON.parse(localStorage.getItem("loginData") || "{}").f_pin,
        ...formData,
      })
      .then((response) => {
        console.log("Success:", response.data);
        navigate("/waiting");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const resetForm = () => {
    setFormData({
      namaSuami: "",
      nikSuami: "",
      namaIstri: "",
      nikIstri: "",
      tanggalPernikahan: "",
      alamat: "",
      keteranganTambahan: "",
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
              Surat Administrasi Pernikahan
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
            <label htmlFor="namaSuami" className="form-label fw-bold">
              Nama Calon Suami
            </label>
            <input
              type="text"
              className="form-control rounded-4 py-2"
              id="namaSuami"
              placeholder="Masukkan nama lengkap calon suami"
              value={formData.namaSuami}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="nikSuami" className="form-label fw-bold">
              NIK Calon Suami
            </label>
            <input
              type="number"
              className="form-control rounded-4 py-2"
              id="nikSuami"
              placeholder="Nomor Induk Kependudukan calon suami"
              value={formData.nikSuami}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="namaIstri" className="form-label fw-bold">
              Nama Calon Istri
            </label>
            <input
              type="text"
              className="form-control rounded-4 py-2"
              id="namaIstri"
              placeholder="Masukkan nama lengkap calon istri"
              value={formData.namaIstri}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="nikIstri" className="form-label fw-bold">
              NIK Calon Istri
            </label>
            <input
              type="number"
              className="form-control rounded-4 py-2"
              id="nikIstri"
              placeholder="Nomor Induk Kependudukan calon istri"
              value={formData.nikIstri}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="tanggalPernikahan" className="form-label fw-bold">
              Tanggal Pernikahan
            </label>
            <input
              type="date"
              className="form-control rounded-4 py-2"
              id="tanggalPernikahan"
              value={formData.tanggalPernikahan}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="alamat" className="form-label fw-bold">
              Alamat Pasangan
            </label>
            <textarea
              className="form-control rounded-4 py-2"
              id="alamat"
              placeholder="Masukkan alamat pasangan"
              value={formData.alamat}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="keteranganTambahan" className="form-label fw-bold">
              Keterangan Tambahan
            </label>
            <input
              type="text"
              className="form-control rounded-4 py-2"
              id="keteranganTambahan"
              placeholder="Tuliskan keterangan tambahan (opsional)"
              value={formData.keteranganTambahan}
              onChange={handleChange}
            />
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-dark mt-2">
              Kirim Permohonan
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

export default SuratAdministrasiPernikahan;
