import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PendaftaranPuskesmasDesa = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    namaPemohon: '',
    nik: '',
    alamat: '',
    rtRw: '',
    kelurahan: '',
    kecamatan: '',
    keluhan: '',
  });

  // Handle perubahan setiap input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const sendData = (e: React.FormEvent) => {
    e.preventDefault();
    
    const isFormDataEmpty = Object.values(formData).some(value => value === '');

    if (isFormDataEmpty) {
      setIsNotFilled(true);
      return;
    }else{
      setIsNotFilled(false);
    }

    axios.post(`${import.meta.env.VITE_API_URL}/pendaftaran_puskesmas_desa/create`, {
      f_pin: JSON.parse(localStorage.getItem("loginData") || "{}").f_pin,
      ...formData
    })
    .then(response => {
      
      console.log(response);
      navigate("/waiting")
      
    })
    .catch(error => {
      console.error(error);
    });

  };

  const resetForm = () => {;

    setFormData({
      namaPemohon: '',
      nik: '',
      alamat: '',
      rtRw: '',
      kelurahan: '',
      kecamatan: '',
      keluhan: '',
    });

    setIsNotFilled(false);

  };

  const [isNotFilled, setIsNotFilled] = useState(false);

  return (
    <div className="main-container">
      <div className="background">
        <div className="header py-3">
          <div className="d-flex">
            <Link
              to="/puskesmas_desa"
              className="header-icon"
              style={{ fontSize: '24px', color: 'white', textDecoration: 'none' }}
            >
              <i className="fa-solid fa-arrow-left" />
            </Link>
            <h1 className="ms-3" style={{ marginTop: '0.35rem' }}>
              Pendaftaran Puskesmas Desa
            </h1>
          </div>
        </div>
      </div>

      <div className="container my-4">

        {isNotFilled == true && (
        <>
            <div className="alert alert-danger text-center px-5" role="alert">
            <i className="fas fa-exclamation-circle me-2" />
            Data formulir tidak boleh kosong.
            </div>
        </>
        )}

        <form className="card shadow p-4" onSubmit={sendData}>
          <div className="mb-3">
            <label htmlFor="namaPemohon" className="form-label fw-bold">
              Nama Pasien
            </label>
            <input
              type="text"
              className="form-control rounded-4 py-2"
              id="namaPemohon"
              placeholder="Masukan nama lengkap"
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
            <label htmlFor="alamat" className="form-label fw-bold">
              Alamat Domisili
            </label>
            <textarea
              className="form-control rounded-4 py-2"
              id="alamat"
              placeholder="Alamat lengkap"
              value={formData.alamat}
              onChange={handleChange}
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="rtRw" className="form-label fw-bold">
                RT/RW
              </label>
              <input
                type="text"
                className="form-control rounded-4 py-2"
                id="rtRw"
                placeholder="Masukan RT/RW"
                value={formData.rtRw}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="kelurahan" className="form-label fw-bold">
                Kelurahan
              </label>
              <input
                type="text"
                className="form-control rounded-4 py-2"
                id="kelurahan"
                placeholder="Masukan nama Kelurahan"
                value={formData.kelurahan}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="kecamatan" className="form-label fw-bold">
              Kecamatan
            </label>
            <input
              type="text"
              className="form-control rounded-4 py-2"
              id="kecamatan"
              placeholder="Masukan nama Kecamatan"
              value={formData.kecamatan}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="keluhan" className="form-label fw-bold">
              Keluhan
            </label>
            <textarea
              className="form-control rounded-4 py-2"
              id="keluhan"
              placeholder="Tuliskan keluhan"
              value={formData.keluhan}
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

export default PendaftaranPuskesmasDesa;

