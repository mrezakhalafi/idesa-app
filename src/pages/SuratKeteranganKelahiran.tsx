import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SuratKeteranganLahir = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    namaBayi: "",
    jenisKelamin: "Laki-laki",
    tempatLahir: "",
    tanggalLahir: "1990-01-01",
    namaAyah: "",
    namaIbu: "",
    alamatOrtu: "",
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
      .post(`${import.meta.env.VITE_API_URL}/surat_keterangan_kelahiran/create`, {
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
      namaBayi: "",
      jenisKelamin: "Laki-laki",
      tempatLahir: "",
      tanggalLahir: "",
      namaAyah: "",
      namaIbu: "",
      alamatOrtu: "",
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
              Surat Keterangan Kelahiran
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
            <label htmlFor="namaBayi" className="form-label fw-bold">
              Nama Bayi
            </label>
            <input
              type="text"
              className="form-control rounded-4 py-2"
              id="namaBayi"
              placeholder="Masukkan nama bayi"
              value={formData.namaBayi}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="jenisKelamin" className="form-label fw-bold">
              Jenis Kelamin
            </label>
            <select
              id="jenisKelamin"
              className="form-select rounded-4 py-2"
              value={formData.jenisKelamin}
              onChange={handleChange}
            >
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="tempatLahir" className="form-label fw-bold">
              Tempat Lahir
            </label>
            <input
              type="text"
              className="form-control rounded-4 py-2"
              id="tempatLahir"
              placeholder="Masukkan tempat lahir"
              value={formData.tempatLahir}
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
            <label htmlFor="namaAyah" className="form-label fw-bold">
              Nama Ayah
            </label>
            <input
              type="text"
              className="form-control rounded-4 py-2"
              id="namaAyah"
              placeholder="Masukkan nama ayah"
              value={formData.namaAyah}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="namaIbu" className="form-label fw-bold">
              Nama Ibu
            </label>
            <input
              type="text"
              className="form-control rounded-4 py-2"
              id="namaIbu"
              placeholder="Masukkan nama ibu"
              value={formData.namaIbu}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="alamatOrtu" className="form-label fw-bold">
              Alamat Orang Tua
            </label>
            <textarea
              className="form-control rounded-4 py-2"
              id="alamatOrtu"
              placeholder="Masukkan alamat orang tua"
              value={formData.alamatOrtu}
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

export default SuratKeteranganLahir;
