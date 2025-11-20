import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SuratPerizinan = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    namaPemohon: "",
    nik: "",
    jenisLayanan: "",
    namaUsaha: "",
    alamatUsaha: "",
    rtRw: "",
    ketTambahan: "",
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
      .post(`${import.meta.env.VITE_API_URL}/surat_perizinan/create`, {
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
      jenisLayanan: "",
      namaUsaha: "",
      alamatUsaha: "",
      rtRw: "",
      ketTambahan: "",
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
              Surat Layanan Perizinan
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
            <label htmlFor="jenisLayanan" className="form-label fw-bold">
              Jenis Layanan
            </label>
            <select
              className="form-select rounded-4 py-2"
              id="jenisLayanan"
              value={formData.jenisLayanan}
              onChange={handleChange}
            >
              <option value="">Pilih Jenis Layanan</option>
              <option value="Usaha Mikro">Usaha Mikro</option>
              <option value="Rekomendasi">Rekomendasi</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="namaUsaha" className="form-label fw-bold">
              Nama Usaha
            </label>
            <input
              type="text"
              className="form-control rounded-4 py-2"
              id="namaUsaha"
              placeholder="Masukkan nama usaha (jika ada)"
              value={formData.namaUsaha}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="alamatUsaha" className="form-label fw-bold">
              Alamat Usaha
            </label>
            <textarea
              className="form-control rounded-4 py-2"
              id="alamatUsaha"
              placeholder="Masukkan alamat usaha"
              value={formData.alamatUsaha}
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
            <label htmlFor="ketTambahan" className="form-label fw-bold">
              Keterangan Tambahan
            </label>
            <textarea
              className="form-control rounded-4 py-2"
              id="ketTambahan"
              placeholder="Tambahkan keterangan lain jika diperlukan"
              value={formData.ketTambahan}
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

export default SuratPerizinan;
