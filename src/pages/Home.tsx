import React, { useState, useEffect } from "react";
import "./Home.css";
import { Link } from "react-router-dom";
import Drawer from "../components/Drawer";
import Octahelix from "./Octahelix";

interface MenuGridItemProps {
  title: string;
  link: string;
  background: string;
}

interface CardModernProps {
  children: React.ReactNode;
}

const CardModern = ({ children }: CardModernProps) => {
  return <div className="card-modern">{children}</div>;
};

let isLoginCheckCPAAS = false;

const Home = () => {
  const [drawerTitle, setDrawerTitle] = useState("");
  const [jumbotronTitle, setJumbotronTitle] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [qrData, setQrData] = useState<any | null>(null);
  // const [jumbotronDescription, setJumbotronDescription] = useState("");

  const loginCheck = () => {
    if (localStorage.getItem("isLogin") === "true") {
      if (JSON.parse(localStorage.getItem("loginData") || "{}")) {
        const name = JSON.parse(localStorage.getItem("loginData") || "{}").name;
        setJumbotronTitle(`${name}`);
        // setJumbotronDescription("Warga Satu iDesa");
      }
    } else {
      setJumbotronTitle("Satu iDesa");
      // setJumbotronDescription("Desa Maju, Transparan dan Akuntabel");
    }
  };

  const initCameraNative = () => {
    console.log("INIT CAM");
    if (
      (window as any).Android &&
      typeof (window as any).Android.openScanQrNative === "function"
    ) {
      (window as any).Android.openScanQrNative();
    } else {
      console.log("Android interface not available");
    }
  };

  const mustLogin = ["Forum", "Belanja", "Aduan", "Bantuan"];
  // const mustLogin = [""];

  const MenuGridItem = ({ title, link, background }: MenuGridItemProps) => {
    if (
      mustLogin.includes(title) &&
      (!localStorage.getItem("isLogin") ||
        localStorage.getItem("isLogin") === "false")
    ) {
      return (
      <div className="menu-outer">
        <div className="menu-bg"
          style={{
            cursor: "pointer",
            backgroundImage: `url(${background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div
            className="menu-item"
            onClick={() => setDrawerTitle("Pengguna iDesa")}
            data-bs-toggle="offcanvas"
            data-bs-target="#drawer"
            aria-controls="drawer"
          >
            <div className="menu-home">
              <div className="menu-title-home">{title}</div>
            </div>
          </div>
        </div>
        {/* <div className="menu-title mt-3">{title}</div> */}
      </div>
      );
    }

    return (
      <Link
        to={link} className="menu-outer">
        <div className="menu-bg"
          style={{
            backgroundImage: `url(${background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}>
          <div
            className="menu-item"
          >
            <div className="menu-home">
              <div className="menu-title-home">{title}</div>
            </div>
          </div>
        </div>
        {/* <div className="menu-title mt-3">{title}</div> */}
      </Link>
    );
  };

  const clearOverlays = () => {
    const modals = document.querySelectorAll(".modal.show");
    modals.forEach((modal) => {
      const bsModal = (window as any).bootstrap?.Modal.getInstance(modal);
      if (bsModal) {
        bsModal.hide();
      }
    });

    const offcanvasList = document.querySelectorAll(".offcanvas.show");
    offcanvasList.forEach((offcanvas) => {
      const bsOffcanvas = (window as any).bootstrap?.Offcanvas.getInstance(
        offcanvas
      );
      if (bsOffcanvas) {
        bsOffcanvas.hide();
      }
    });

    document
      .querySelectorAll(".modal-backdrop, .offcanvas-backdrop")
      .forEach((el) => el.remove());

    document.body.classList.remove("modal-open");
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
  };

  const goToWallet = () => {
    // const f_pin = localStorage.getItem("f_pin");
    // window.location.href = "https://nexilis.io/nexilis/pages/digipos?env=1&f_pin=" + f_pin;

    if (
      (window as any).Android &&
      typeof (window as any).Android.openWallet === "function"
    ) {
      console.log("CPAAS Open Wallet");

      (window as any).Android.openWallet();
    } else {
      console.log("Android interface not available");
    }
  };

  const goToWallet2 = () => {
    // const f_pin = localStorage.getItem("f_pin");
    // window.location.href = "https://nexilis.io/nexilis/pages/digipos?env=1&f_pin=" + f_pin;

    if (
      (window as any).Android &&
      typeof (window as any).Android.openWallet === "function"
    ) {
      console.log("CPAAS Open Wallet");

      (window as any).Android.openWallet2();
    } else {
      console.log("Android interface not available");
    }
  };


  const [wallet, setWallet] = useState<any | null>(null);
  // const [loadingWallet, setLoadingWallet] = useState(false);
  // const [walletWarning, setWalletWarning] = useState<string | null>(null);

  useEffect(() => {
    loginCheck();
    clearOverlays();

    if (!isLoginCheckCPAAS && localStorage.getItem("isLogin") === "true") {
      console.log("CPAAS Login");

      if (
        (window as any).Android &&
        typeof (window as any).Android.login === "function"
      ) {
        const username = JSON.parse(
          localStorage.getItem("loginData") || "{}"
        ).username;
        (window as any).Android.login(username);
      } else {
        console.log("Android interface not available");
      }

      isLoginCheckCPAAS = true;
    }

    const f_pin = JSON.parse(localStorage.getItem("loginData") || "{}").f_pin;

    if (f_pin) {
      // setLoadingWallet(true);
      // setWalletWarning(null);

      // fetch(`http://localhost:3060/wallet/${encodeURIComponent(f_pin)}`)
      //   .then(async (res) => {
      //     if (!res.ok) {
      //       const text = await res.text().catch(() => "");
      //       throw new Error(`Server error ${res.status} ${text}`);
      //     }
      //     return res.json();
      //   })
      //   .then((data) => {
      //     if (data?.error) {
      //       // setWalletWarning(data.error);
      //       setWallet(null);
      //     } else {
      //       setWallet(data);
      //     }
      //   })
      //   .catch((err) => {
      //     console.error("Wallet fetch error:", err);
      //     // setWalletWarning(err.message || "Unknown error");
      //     setWallet(null);
      //   });
      // .finally(() => setLoadingWallet(false));
    } else {
      setWallet(null);
    }
  }, []);

  useEffect(() => {
    (window as any).showModalFromNative = (qrString: string) => {
      if (!qrString || typeof qrString !== "string") {
        console.error("QR String invalid:", qrString);
        return;
      }

      const resultArr = qrString.split(".");

      if (resultArr.length < 3) {
        console.error("Format QR tidak sesuai:", qrString);
        return;
      }

      const result = {
        type: resultArr[2] === "0" ? "static" : "dynamic",
        reference_id: resultArr[1],
        amount: resultArr[3] || "0",
      };

      // misalnya kita taruh ke state supaya muncul modal
      setQrData(result);
    };
  }, []);

  useEffect(() => {
    if (qrData) {
      setShowModal(true);
    }
  }, [qrData]);

  // if (loadingWallet) {
  //   return <p>Loading wallet...</p>;
  // }

  const saldo = parseFloat(wallet?.AMOUNT_VALUE || "0");

  const handleUserChanged = () => {
    loginCheck();
  };

  // const background = [
  //   `url('wallpaper/1.gif') center/cover`,
  //   `url('wallpaper/2.gif') center/cover`,
  //   `url('wallpaper/3.gif') center/cover`,
  //   `url('wallpaper/4.gif') center/cover`,
  //   `url('wallpaper/5.gif') center/cover`,
  //   `url('wallpaper/6.gif') center/cover`,
  //   `url('wallpaper/7.gif') center/cover`,
  //   `url('wallpaper/8.gif') center/cover`,
  //   `url('wallpaper/9.gif') center/cover`,
  // ];

  return (
    <div>
      <div className="main-container">
        {/* <div
          style={{ background: background[Math.floor(Math.random() * 8) + 1] }}
        > */}
        <div className="background">
          <div className="header pb-0">
            <div className="mt-2">
              <small>
                <i className="fas fa-seedling me-2"></i>Selamat datang
              </small>
              <div className="welcome-name mt-1">{jumbotronTitle}</div>
            </div>
            <div className="header-icons">
              <div
                className="header-icon-home"
                onClick={() => setDrawerTitle("Notifikasi")}
                data-bs-toggle="offcanvas"
                data-bs-target="#drawer"
                aria-controls="drawer"
              >
                <i className="fas fa-bell text-dark"></i>
              </div>
              <div
                className="header-icon-home"
                onClick={() => setDrawerTitle("Pesan Masuk")}
                data-bs-toggle="offcanvas"
                data-bs-target="#drawer"
                aria-controls="drawer"
              >
                <i className="fas fa-envelope text-dark"></i>
              </div>
            </div>
          </div>

          <div className="jumbotron">
            <div className="jumbotron-content container">
              <div className="search-container my-4 mx-2">
                <input
                  name="search"
                  type="text"
                  className="form-control search-input"
                  placeholder="Cari informasi terkait desa"
                  style={{ color: "white" }}
                ></input>
                <i className="fas fa-search search-icon"></i>
              </div>
              <div className="container">
                <div className="row gx-3">
                  <div className="col-3" style={{ justifyItems: "center" }}>
                    {!localStorage.getItem("isLogin") ||
                    localStorage.getItem("isLogin") === "false" ? (
                      <>
                        <div
                          className="main-icon d-flex align-items-center shadow-lg ms-1 main-dompet"
                          style={{ cursor: "pointer" }}
                          onClick={() => setDrawerTitle("Pengguna iDesa")}
                          data-bs-toggle="offcanvas"
                          data-bs-target="#drawer"
                          aria-controls="drawer"
                        >
                          <i
                            className="fas fa-credit-card fa-xl m-auto text-dark"
                            style={{ filter: "brightness(0.8)" }}
                          ></i>
                        </div>
                        <div className="menu-title text-light mt-2 pt-1">
                          Dompet
                        </div>
                      </>
                    ) : (
                      <>
                        <div
                          className="main-icon d-flex align-items-center shadow-lg ms-1 main-dompet"
                          style={{ cursor: "pointer" }}
                          onClick={() => goToWallet()}
                        >
                          <i
                            className="fas fa-credit-card fa-xl m-auto text-dark"
                            style={{ filter: "brightness(0.8)" }}
                          ></i>
                        </div>
                        <div className="menu-title text-light mt-2 pt-1">
                          Dompet
                        </div>
                      </>
                    )}
                  </div>
                  <div className="col-3 pesanan_home">
                    {!localStorage.getItem("isLogin") ||
                    localStorage.getItem("isLogin") === "false" ? (
                      <div
                        className="main-icon d-flex align-items-center shadow-lg ms-1 main-pesanan"
                        style={{ cursor: "pointer" }}
                        onClick={() => setDrawerTitle("Pengguna iDesa")}
                        data-bs-toggle="offcanvas"
                        data-bs-target="#drawer"
                        aria-controls="drawer"
                      >
                        <i className="fas fa-calendar fa-xl m-auto text-dark"></i>
                      </div>
                    ) : (
                      <Link to="/pesanan" className="text-decoration-none">
                        <div
                          className="main-icon d-flex align-items-center shadow-lg ms-1 main-pesanan"
                          style={{ cursor: "pointer" }}
                        >
                          <i className="fas fa-box fa-xl m-auto text-dark"></i>
                        </div>
                      </Link>
                    )}

                    <div className="menu-title text-light mt-2 pt-1">
                      Pesanan
                    </div>
                  </div>
                  <div className="col-3" style={{ justifyItems: "center" }}>
                    {!localStorage.getItem("isLogin") ||
                    localStorage.getItem("isLogin") === "false" ? (
                      <div
                        className="main-icon d-flex align-items-center shadow-lg ms-1 main-qrcode"
                        style={{ cursor: "pointer" }}
                        onClick={() => setDrawerTitle("Pengguna iDesa")}
                        data-bs-toggle="offcanvas"
                        data-bs-target="#drawer"
                        aria-controls="drawer"
                      >
                        <i className="fas fa-qrcode fa-xl m-auto text-dark"></i>
                      </div>
                    ) : (
                      <div
                        className="main-icon d-flex align-items-center shadow-lg ms-1 main-qrcode"
                        style={{ cursor: "pointer" }}
                        onClick={initCameraNative}
                      >
                        <i className="fas fa-qrcode fa-xl m-auto text-dark"></i>
                      </div>
                    )}

                    <div className="menu-title text-light mt-2 pt-1">
                      Kode QR
                    </div>
                  </div>
                  <div className="col-3" style={{ justifyItems: "center" }}>
                    <div
                      className="main-icon d-flex align-items-center shadow-lg ms-1 main-profile"
                      style={{ cursor: "pointer" }}
                      onClick={() => setDrawerTitle("Pengguna iDesa")}
                      data-bs-toggle="offcanvas"
                      data-bs-target="#drawer"
                      aria-controls="drawer"
                    >
                      <i
                        className="fas fa-user fa-xl m-auto text-dark"
                        style={{ filter: "brightness(0.9)" }}
                      ></i>
                    </div>
                    <div className="menu-title text-light mt-2 pt-1">
                      Profil
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="card position-absolute shadow rounded-4 mx-auto p-3"
          style={{
            left: 20,
            right: 20,
            marginTop: -60,
            background: "white",
            borderRadius: 20,
            width: "auto",
            maxWidth: 600,
            zIndex: 100,
          }}
        >
          <div className="card-body pt-1 px-1 pb-0">
            {/* {!wallet ? ( */}
              <div className="row gx-0">
                <div className="col-8">
                  <div style={{ fontSize: "0.8rem" }}>Saldo kamu</div>
                  <div className="d-flex align-items-center">
                    <h4 className="mt-1 me-2">
                      Rp{saldo.toLocaleString("id-ID")}
                    </h4>
                  </div>
                  {/* <p
                    className="mb-0"
                    style={{ fontSize: "0.75rem", color: "grey" }}
                  >
                    <i
                      className="fa fa-exclamation-circle me-2"
                      aria-hidden="true"
                      style={{ fontSize: "0.75rem" }}
                    ></i>
                    Anda belum terhubung
                  </p> */}
                  {/* {walletWarning && (
                  <p style={{ fontSize: "0.85rem", color: "grey" }}>
                    <i className="fa fa-exclamation-circle me-2" aria-hidden="true"></i>
                    {walletWarning}
                  </p>
                )} */}
                </div>

                <div className="col-4 d-flex">
                  {!localStorage.getItem("isLogin") ||
                  localStorage.getItem("isLogin") === "false" ? (
                    <div
                      className="header-icon-secondary-long p-2 shadow"
                      onClick={() => setDrawerTitle("Pengguna iDesa")}
                      data-bs-toggle="offcanvas"
                      data-bs-target="#drawer"
                      aria-controls="drawer"
                    >
                      <i
                        className="fas fa-plus-circle ms-1 me-2 text-light"
                        style={{ fontSize: "0.80rem" }}
                      ></i>
                      <small
                        className="text-light"
                        style={{ fontSize: "0.75rem", marginLeft: "-3px" }}
                      >
                        Saldo
                      </small>
                    </div>
                  ) : (
                    <div
                      className="header-icon-secondary-long p-2 shadow"
                      onClick={() => goToWallet2()}
                    >
                      <i
                        className="fas fa-plus-circle ms-1 me-2 text-light"
                        style={{ fontSize: "0.80rem" }}
                      ></i>
                      <small
                        className="text-light"
                        style={{ fontSize: "0.75rem", marginLeft: "-3px" }}
                      >
                        Saldo
                      </small>
                    </div>
                  )}
                </div>
              </div>
            {/* ) : ( */}
              {/* <div className="row gx-0">
                <div className="col-8">
                  <div style={{ fontSize: "0.9rem" }}>Saldo kamu</div>
                  <div className="d-flex align-items-center">
                    <h4 className="mt-1 me-2">
                      Rp{saldo.toLocaleString("id-ID")}
                    </h4>
                  </div>
                  <p
                    className="mb-0"
                    style={{ fontSize: "0.75rem", color: "grey" }}
                  >
                    <i
                      className="fa fa-exclamation-circle me-2"
                      aria-hidden="true"
                      style={{ fontSize: "0.75rem" }}
                    ></i>
                    Anda sudah terhubung
                  </p>
                </div>

                <div className="col-4">
                  <div
                    className="header-icon-secondary-long p-2 my-1"
                    onClick={() => setShowModal(true)}
                  >
                    <i className="fas fa-plus-circle me-2 text-light"></i>
                    <small className="text-light">Saldo</small>
                  </div>
                  <div
                    className="header-icon-secondary-long p-2 my-1"
                    onClick={() => goToWallet()}
                  >
                    <i className="fas fa-wallet me-2 text-light"></i>
                    <small className="text-light">Dompet</small>
                  </div>
                </div>
              </div> */}
            {/* )} */}
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div
            className="modal fade show"
            style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
            tabIndex={-1}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content rounded-4 shadow-lg border-0">
                {/* Header */}
                <div className="modal-header bg-dark text-white rounded-top-4">
                  <h5 className="modal-title">
                    <i className="fas fa-info-circle me-2"></i> Informasi
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>

                {/* Body */}
                <div className="modal-body text-center pt-5">
                  <div className="card mx-5 shadow-sm py-3">
                    <div className="card-body">
                      <i className="fas fa-rocket fa-3x mb-3" style={{ color: "#2a8b29" }}></i>
                      <h4 className="fw-bold" style={{ color: "#2a8b29" }}>Segera Hadir</h4>
                    </div>
                  </div>
                  <p className="text-muted mt-3 pt-1">
                    Fitur ini sedang dalam tahap pengembangan.
                    <br />
                    Nantikan update berikutnya ya!
                  </p>
                </div>

                {/* Footer */}
                <div className="modal-footer justify-content-center">
                  <button
                    type="button"
                    className="btn btn-dark text-white px-4"
                    onClick={() => setShowModal(false)}
                  >
                    <i className="fas fa-check me-2"></i> Mengerti
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showModal && qrData && (
          <div
            className="modal fade show"
            style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
            tabIndex={-1}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content rounded-4 shadow">
                <div className="modal-header">
                  <h5 className="modal-title">QR Result</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body text-center">
                  <p>
                    <b>Type:</b> {qrData.type}
                  </p>
                  <p>
                    <b>Reference:</b> {qrData.reference_id}
                  </p>
                  <p>
                    <b>Amount:</b> Rp
                    {Number(qrData.amount).toLocaleString("id-ID")}
                  </p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="menu-grid">
          <MenuGridItem title="Dasbor" link="dashboard" background="db_menu.jpeg" />
          <MenuGridItem title="Forum" link="forum" background="forum_menu.png" />
          <MenuGridItem title="Belanja" link="belanja" background="belanja_menu.png" />
          <MenuGridItem title="Keuangan" link="keuangan" background="keuangan_menu.png" />
          <MenuGridItem title="SIG" link="sig" background="sig_menu.png" />
          <MenuGridItem title="Aduan" link="aduan" background="aduan_menu.png" />
          <MenuGridItem title="Layanan" link="bantuan" background="layanan_menu.png" />
          <MenuGridItem
            title="Pelatihan"
            link="pelatihan"
            background="pelatihan_menu.png"
          />
          <MenuGridItem
            title="Potensi"
            link="potensi_desa"
            background="potensi_menu.png"
          />
          <MenuGridItem title="Media" link="media_desa" background="media_menu.png" />
          <MenuGridItem
            title="BUMDes"
            link="info_bumdes"
            background="bumdes_menu.png"
          />
          <MenuGridItem
            title="Riset"
            link="riset_akademik"
            background="riset_menu.png"
          />
        </div>

        <div className="content-section shadow-lg">
          <CardModern>
            <h6 className="mb-4 pb-2 fw-bold text-center">Kolaborasi Oktaheliks</h6>
            <div className="row">
              <Octahelix />
            </div>
          </CardModern>
        </div>
      </div>
      <Drawer menu={drawerTitle} isChangedUser={handleUserChanged} />
    </div>
  );
};

export default Home;
