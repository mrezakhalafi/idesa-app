import { useState, useEffect } from "react";
import './SIG.css'
import { Link } from 'react-router-dom'
import SIGDrawer from "../components/SIGDrawer";
import Maps from "../components/Maps";
import axios from "axios";

interface DashboardData {
  id: number;
  sig: string;
}

const SIG = () => {

  const [currentLocation, setCurrentLocation] = useState('');
  const [currentMenu, setCurrentMenu] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchSIG = () => {
       axios
      .get<DashboardData>(`${import.meta.env.VITE_API_URL}/dashboard`)
      .then((response) => {
        const data = response.data;
        setCurrentLocation(data.sig);
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was an error fetching the dashboard data.", error);
      });
    }

  // const updateMaps = (location: string) => {

  //   // setCurrentLocation("-6.2333277,106.8506781");
  //   setCurrentLocation(location);
  //   setLoading(false);

  //   localStorage.setItem('maps', location);

  // };

  useEffect(() => {
    
    // if(localStorage.getItem('maps')) {
    //   setCurrentLocation(localStorage.getItem('maps')!);
    //   setLoading(false);
    // }

    // if ((window as any).Android && typeof (window as any).Android.startLocation === "function") {

    //   console.log("CPAAS Start Location");

    //   (window as any).Android.startLocation();

    // } else {
    //   console.log("Android interface not available");
    // }

    fetchSIG();
    
  }, []);

  // (window as any).updateMaps = updateMaps;

  return (
    <div className="main-container">
      <div className="background">
        <div className="header py-3">
          <div className="d-flex">
           <Link to="/" replace className="header-icon" style={{ fontSize: '24px', color: 'white', textDecoration: 'none' }}>
              <i className="fa-solid fa-arrow-left"></i>
            </Link>
            <h1 className="ms-3" style={{ marginTop: '0.35rem' }}>SIG</h1>
          </div>
        </div>

        <div className="hero-map">

         {loading && (
            <div className="bg-light d-flex justify-content-center align-items-center" style={{ height: '407px' }}>
              <div className="text-center">
                <div className="spinner-border text-primary" role="status" />
                <div className="mt-2">Memuat Info Lokasi...</div>
              </div>
            </div>
          )}

          {!loading && (
           <Maps currentLocation={currentLocation} />
          )}

        </div>

        <section className="sheet">
          <div className="section-title">Data Wilayah</div>

          <div className="feature-list-sig mt-3 shadow">
            <div className="feature-item-sig"
             onClick={() => setCurrentMenu('Infrastruktur')} data-bs-toggle="offcanvas" data-bs-target="#SIGDrawer" aria-controls="SIGDrawer" >
              <div className="feature-left">
                <div className="feature-icon fx-road">
                  <i className="fa-solid fa-road"></i>
                </div>
                <div className="feature-name">Infrastruktur</div>
              </div>
              <i className="fa-solid fa-chevron-right"></i>
            </div>

            <div className="feature-item-sig"
            onClick={() => setCurrentMenu('Pertanian')} data-bs-toggle="offcanvas" data-bs-target="#SIGDrawer" aria-controls="SIGDrawer">
              <div className="feature-left">
                <div className="feature-icon fx-plant">
                  <i className="fa-solid fa-seedling"></i>
                </div>
                <div className="feature-name">Pertanian</div>
              </div>
              <i className="fa-solid fa-chevron-right"></i>
            </div>

            <div className="feature-item-sig"
            onClick={() => setCurrentMenu('Kependudukan')} data-bs-toggle="offcanvas" data-bs-target="#SIGDrawer" aria-controls="SIGDrawer">
              <div className="feature-left">
                <div className="feature-icon fx-people">
                  <i className="fa-solid fa-users"></i>
                </div>
                <div className="feature-name">Kependudukan</div>
              </div>
              <i className="fa-solid fa-chevron-right"></i>
            </div>

            <div className="feature-item-sig"
            onClick={() => setCurrentMenu('Batas Desa')} data-bs-toggle="offcanvas" data-bs-target="#SIGDrawer" aria-controls="SIGDrawer">
              <div className="feature-left">
                <div className="feature-icon fx-border">
                  <i className="fa-solid fa-map"></i>
                </div>
                <div className="feature-name">Batas Desa</div>
              </div>
              <i className="fa-solid fa-chevron-right"></i>
            </div>
          </div>
        </section>
      </div>

      <SIGDrawer menu={currentMenu} />
    </div>
  )
}

export default SIG