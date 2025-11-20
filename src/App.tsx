import { HashRouter, Route, Routes } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Forum from "./pages/Forum";
import Belanja from "./pages/Belanja";
import Keuangan from "./pages/Keuangan";
import SIG from "./pages/SIG";
import Aduan from "./pages/Aduan";
import Pelatihan from "./pages/Pelatihan";
import PotensiDesa from "./pages/PotensiDesa";
import MediaDesa from "./pages/MediaDesa";
import Bantuan from "./pages/Bantuan";
import InfoBUMDes from "./pages/InfoBUMDes";
import RisetAkademik from "./pages/RisetAkademik";

import Success from "./pages/Success";
import Waiting from "./pages/Waiting";
import SuratDesa from "./pages/SuratDesa";
import PuskesmasDesa from "./pages/PuskesmasDesa";

import PendaftaranPuskesmasDesa from "./pages/PendaftaranPuskesmasDesa";

import SuratKeteranganDomisili from "./pages/SuratKeteranganDomisili";
import SuratKeteranganUsaha from "./pages/SuratKeteranganUsaha";
import SuratKeteranganKematian from "./pages/SuratKeteranganKematian";
import SuratKeteranganKelahiran from "./pages/SuratKeteranganKelahiran";
import SuratKeteranganTidakMampu from "./pages/SuratKeteranganTidakMampu";
import SuratKeteranganKelakuanBaik from "./pages/SuratKeteranganKelakuanBaik";
import SuratKeteranganKehilangan from "./pages/SuratKeteranganKehilangan";
import SuratPengantar from "./pages/SuratPengantar";
import SuratKependudukan from "./pages/SuratKependudukan";
import SuratPernikahan from "./pages/SuratPernikahan";
import SuratPerizinan from "./pages/SuratPerizinan";
import OrderPages from "./pages/pesanan";

function App() {
  return (
    <>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/belanja" element={<Belanja />} />
          <Route path="/keuangan" element={<Keuangan />} />
          <Route path="/sig" element={<SIG />} />
          <Route path="/aduan" element={<Aduan />} />
          <Route path="/pelatihan" element={<Pelatihan />} />
          <Route path="/potensi_desa" element={<PotensiDesa />} />
          <Route path="/bantuan" element={<Bantuan />} />
          <Route path="/media_desa" element={<MediaDesa />} />
          <Route path="/info_bumdes" element={<InfoBUMDes />} />
          <Route path="/riset_akademik" element={<RisetAkademik />} />

          <Route path="/success" element={<Success />} />
          <Route path="/waiting" element={<Waiting />} />

          <Route path="/surat_desa" element={<SuratDesa />} />
          <Route path="/puskesmas_desa" element={<PuskesmasDesa />} />

          <Route
            path="/pendaftaran_puskesmas_desa"
            element={<PendaftaranPuskesmasDesa />}
          />

          <Route
            path="/surat_keterangan_domisili"
            element={<SuratKeteranganDomisili />}
          />
          <Route
            path="/surat_keterangan_usaha"
            element={<SuratKeteranganUsaha />}
          />
          <Route
            path="/surat_keterangan_kematian"
            element={<SuratKeteranganKematian />}
          />
          <Route
            path="/surat_keterangan_kelahiran"
            element={<SuratKeteranganKelahiran />}
          />
          <Route
            path="/surat_keterangan_tidak_mampu"
            element={<SuratKeteranganTidakMampu />}
          />
          <Route
            path="/surat_keterangan_kelakuan_baik"
            element={<SuratKeteranganKelakuanBaik />}
          />
          <Route
            path="/surat_keterangan_kehilangan"
            element={<SuratKeteranganKehilangan />}
          />
          <Route path="/surat_pengantar" element={<SuratPengantar />} />
          <Route path="/surat_kependudukan" element={<SuratKependudukan />} />
          <Route path="/surat_pernikahan" element={<SuratPernikahan />} />
          <Route path="/surat_perizinan" element={<SuratPerizinan />} />

          <Route path="/pesanan" element={<OrderPages />} />
        </Routes>
      </HashRouter>
    </>
  );
}

export default App;
