import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SuratAdministrasiKependudukan = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    namaPemohon: "",
    nik: "",
    jenisPermohonan: "", // misalnya: KTP, KK, Akta Kelahiran, dll.
    alamat: "",
    rtRw: "",
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
      .post(`${import.meta.env.VITE_API_URL}/surat_kependudukan/create`, {
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
      namaPemohon: "",
      nik: "",
      jenisPermohonan: "",
      alamat: "",
      rtRw: "",
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
              Surat Administrasi Kependudukan
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
            <label htmlFor="namaPemohon" className="form-label fw-bold">
              Nama Pemohon
            </label>
            <input
              type="text"
              className="form-control rounded-4 py-2"
              id="namaPemohon"
              placeholder="Masukkan nama lengkap"
              value={formData.namaPemohon}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="nik" className="form-label fw-bold">
              Nomor KTP/NIK
            </label>
            <input
              type="number"
              className="form-control rounded-4 py-2"
              id="nik"
              placeholder="Nomor Induk Kependudukan"
              value={formData.nik}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="jenisPermohonan" className="form-label fw-bold">
              Jenis Permohonan
            </label>
            <select
              className="form-select rounded-4 py-2"
              id="jenisPermohonan"
              value={formData.jenisPermohonan}
              onChange={handleChange}
            >
              <option value="">Pilih Jenis Permohonan</option>
              <option value="KTP">KTP</option>
              <option value="KK">Kartu Keluarga (KK)</option>
              <option value="Akta Kelahiran">Akta Kelahiran</option>
              <option value="Surat Pindah">Surat Pindah</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="alamat" className="form-label fw-bold">
              Alamat
            </label>
            <textarea
              className="form-control rounded-4 py-2"
              id="alamat"
              placeholder="Masukkan alamat lengkap"
              value={formData.alamat}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="rtRw" className="form-label fw-bold">
              RT/RW
            </label>
            <input
              type="text"
              className="form-control rounded-4 py-2"
              id="rtRw"
              placeholder="Masukkan RT/RW"
              value={formData.rtRw}
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

export default SuratAdministrasiKependudukan;
