import './SuratDesa.css'
import { Link } from 'react-router-dom'

interface SuratDesa {
  id: string;
  title: string;
  icon: string;
  description: string;
  link: string;
}
const suratDesaList: SuratDesa[] = [
  {
    id: "surat_keterangan_domisili",
    title: "Surat Keterangan Domisili",
    icon: "fa-solid fa-house",
    description: "Digunakan untuk keperluan administrasi kependudukan dan legalitas tempat tinggal.",
    link: "/surat_keterangan_domisili"
  },
  {
    id: "surat_keterangan_usaha",
    title: "Surat Keterangan Usaha",
    icon: "fa-solid fa-briefcase",
    description: "Bukti legalitas usaha untuk pengajuan modal atau izin usaha.",
    link: "/surat_keterangan_usaha"
  },
  {
    id: "surat_keterangan_kematian",
    title: "Surat Keterangan Kematian",
    icon: "fa-solid fa-cross",
    description: "Dokumen resmi yang menyatakan seseorang telah meninggal dunia.",
    link: "/surat_keterangan_kematian"
  },
  {
    id: "surat_keterangan_kelahiran",
    title: "Surat Keterangan Kelahiran",
    icon: "fa-solid fa-baby",
    description: "Dokumen dasar untuk mengurus akta kelahiran dan kependudukan bayi.",
    link: "/surat_keterangan_kelahiran"
  },
  {
    id: "surat_keterangan_tidak_mampu",
    title: "Surat Keterangan Tidak Mampu",
    icon: "fa-solid fa-hand-holding-heart",
    description: "Diberikan kepada warga kurang mampu untuk memperoleh bantuan sosial.",
    link: "/surat_keterangan_tidak_mampu"
  },
  {
    id: "surat_keterangan_kelakuan_baik",
    title: "Surat Keterangan Kelakuan Baik",
    icon: "fa-solid fa-user-check",
    description: "Dokumen resmi yang menyatakan catatan baik seseorang.",
    link: "/surat_keterangan_kelakuan_baik"
  },
  {
    id: "surat_keterangan_kehilangan",
    title: "Surat Keterangan Kehilangan",
    icon: "fa-solid fa-file-circle-exclamation",
    description: "Dokumen pengganti jika kehilangan barang penting atau dokumen Official.",
    link: "/surat_keterangan_kehilangan"
  },
  {
    id: "surat_pengantar",
    title: "Surat Pengantar",
    icon: "fa-solid fa-envelope-open-text",
    description: "Surat pengantar dari desa untuk keperluan administrasi tertentu.",
    link: "/surat_pengantar"
  },
  {
    id: "surat_kependudukan",
    title: "Surat Administrasi Kependudukan",
    icon: "fa-solid fa fa-users",
    description: "Surat pengantar dari desa untuk keperluan administrasi kependudukan.",
    link: "/surat_kependudukan"
  },
  {
    id: "surat_pernikahan",
    title: "Surat Administrasi Pernikahan",
    icon: "fa-solid fa fa-venus-mars",
    description: "Surat pengantar dari desa untuk keperluan administrasi pernikahan.",
    link: "/surat_pernikahan"
  },
  {
    id: "surat_perizinan",
    title: "Surat Layanan Perizinan",
    icon: "fa-solid fa-file-circle-check",
    description: "Surat pengantar dari desa untuk layanan perizinan sederhana.",
    link: "/surat_perizinan"
  }
];

const SuratDesa = () => {

    return (
    <div className="main-container">
      <div className="background">
        <div className="header py-3">
          <div className="d-flex">
            <Link to="/bantuan" className="header-icon" style={{ fontSize: '24px', color: 'white', textDecoration: 'none' }}>
              <i className="fa-solid fa-arrow-left" />
            </Link>
            <h1 className="ms-3" style={{ marginTop: '0.35rem' }}>Surat Desa</h1>
          </div>
        </div>
        <section className="sheet">
          <p className="mb-3 mt-3 small mx-2">
            Pengajuan berbagai surat resmi desa dapat dilakukan secara online melalui aplikasi iDesa.
          </p>

            <div className="feature-list mt-3 shadow">
            {suratDesaList.map((sd) => (
              <Link key={sd.id} to={sd.link}
                className="feature-item-bantuan" 
              >
                <div className="feature-left">
                  <div
                    className={`feature-icon fx-green`}>
                    <i className={sd.icon} />
                  </div>
                  <div className="feature-name">{sd.title}</div>
                </div>
                <i className="fa-solid fa-chevron-right" />
              </Link>
            ))}
          </div>
          
        </section>
      </div>
    </div>

)}

export default SuratDesa