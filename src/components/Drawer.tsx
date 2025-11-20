import { useState, useEffect, useRef } from "react";
import axios from "axios";

type DrawerProps = {
  menu: string;
  isChangedUser: () => void;
};

interface MenuGridItemProps {
  icon: string;
  title: string;
  description: string;
}

const MenuGridItem = ({ icon, title, description }: MenuGridItemProps) => {
  return (
    <div className="col-12 menu-item shadow rounded-0">
      <div className="row">
        <div className="col-2">
          <div className="menu-icon">
            <i className={`${icon}`}></i>
          </div>
        </div>
        <div className="col-10 text-start">
          <p className="menu-title fw-bold">{title}</p>
          <p className="menu-title text-muted">{description}</p>
        </div>
      </div>
    </div>
  );
};

interface User {
  id: number;
  f_pin: string;
  name: string;
  image: string;
  created_at: string;
}

const Drawer = ({ menu, isChangedUser }: DrawerProps) => {

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isRegisterPage, setIsRegisterPage] = useState(false);
  const [isLoginPage, setIsLoginPage] = useState(false);

  const [isNotFilled, setIsNotFilled] = useState(false);
  const [isPasswordNotMatch, setIsPasswordNotMatch] = useState(false);
  const [isUserAlreadyExists, setIsUserAlreadyExists] = useState(false);

  const [isUserNotFound, setIsUserNotFound] = useState(false);
  const [isPasswordFalse, setIsPasswordFalse] = useState(false);

  const [isRegisterSuccess, setIsRegisterSuccess] = useState(false);
  const [isLoginSuccess, setIsLoginSuccess] = useState(false);

  const [isLogin, setIsLogin] = useState(false);
  const [loginData, setLoginData] = useState<User>();

  const [isErrorCPAAS, setIsErrorCPAAS] = useState(false);
  const [reasonErrorCPAAS, setReasonErrorCPAAS] = useState("");

  const [loading, setLoading] = useState(false);

  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const loginCheck = () => {

    if (localStorage.getItem("isLogin") === "true") {

      setIsLogin(true);

      if (JSON.parse(localStorage.getItem("loginData") || "{}")) {
        setLoginData(JSON.parse(localStorage.getItem("loginData") || "{}"));

      }
    }else{
      setIsLogin(false);
      setLoginData(undefined);
    }
  };
  
  useEffect(() => {
    loginCheck();
  }, []);

  const logout = () => {

    setLoading(true);

    if ((window as any).Android && typeof (window as any).Android.logout2 === "function") {

      console.log("CPAAS Logout");

      (window as any).Android.logout2();

    } else {

      console.log("Android interface not available");

    }

  }

  const logoutCallback = (message : string) => {

    console.log(message);
    setLoading(false);

    const code = message.split(":")[0];

    if (code == "00"){

      confirmLogout();

    }else{

      setIsErrorCPAAS(true);
      setReasonErrorCPAAS(message);

    }

  }

  const confirmLogout = () => {
    
    localStorage.setItem("isLogin", "false");
    localStorage.removeItem("loginData");
    localStorage.removeItem("f_pin");

    closeBtnRef.current?.click();
    
    isChangedUser();
    
    setTimeout(() => {
    
      setIsLogin(false);
    
    },500);

  }

  const handleRegister = () => {

    if (!name || !username || !password || !confirmPassword) {
      setIsNotFilled(true);
      return;
    }else{
       setIsNotFilled(false);
    }

    if (password !== confirmPassword) {
      setIsPasswordNotMatch(true);
      return;
    }else{
      setIsPasswordNotMatch(false);
    }

    axios.post(`${import.meta.env.VITE_API_URL}/register`, {
      name: name,
      username: username,
      password: password
    })
    .then(response => {
      
      console.log(response);

      if(response.data){
        
        localStorage.setItem("state","Register");
        localStorage.setItem("loginDataTemp", JSON.stringify(response.data));

        setLoading(true);

        loginCPAAS();

        // Loading Until Native Call LoginCallback()

      }
      
    })
    .catch(error => {
      console.error(error);

      if(error.response.data == "User already exists"){
        setIsUserAlreadyExists(true);
        setIsNotFilled(false);
        setIsPasswordNotMatch(false);
        setIsErrorCPAAS(false);
      }
    });

  };

  const handleLogin = () => {

    if (!username || !password) {
      setIsNotFilled(true);
      return;
    }

    axios.post(`${import.meta.env.VITE_API_URL}/login`, {
      username: username,
      password: password
    })
    .then(response => {

      console.log(response);

      if(response.data){

        localStorage.setItem("state","Login");
        localStorage.setItem("loginDataTemp", JSON.stringify(response.data));

        setLoading(true);

        loginCPAAS();

        // Loading Until Native Call LoginCallback()

      }
      
    })
    .catch(error => {

      console.error(error.response.data);

      if(error.response.data == "User not found"){
        setIsPasswordFalse(false);
        setIsUserNotFound(true);
      }
      if(error.response.data == "Password is incorrect"){
        setIsUserNotFound(false);
        setIsPasswordFalse(true);
      }

      setIsNotFilled(false);
      setIsErrorCPAAS(false);

    });

  };

  function formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  }

  const loginCPAAS = () => {

    if ((window as any).Android && typeof (window as any).Android.login === "function") {

      console.log("CPAAS Login");

      (window as any).Android.login(username);

    } else {
      console.log("Android interface not available");
    }

  };

  const loginCallback = (status: string, message: string) => {

    setLoading(false);

    const state = localStorage.getItem('state');

    if (status === "1" && state == "Register") {

      console.log("Connect CPAAS Success");

      setIsPasswordNotMatch(false);
      setIsNotFilled(false);
      setIsRegisterSuccess(true);
      setIsErrorCPAAS(false);
      
      setName("");
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      
      localStorage.setItem("isLogin", "true");
      localStorage.setItem("f_pin", message);
      localStorage.setItem("loginData", localStorage.getItem("loginDataTemp") || "{}");

      setTimeout(() => {

        closeBtnRef.current?.click();
        
      }, 1000);

      setTimeout(() => {

        setIsRegisterPage(false);
        setIsLoginPage(false);
        setIsRegisterSuccess(false);
        setIsUserAlreadyExists(false);
        
        isChangedUser();
        setIsLogin(true);
        setLoginData(JSON.parse(localStorage.getItem("loginDataTemp") || "{}"));

        localStorage.removeItem("state");
        localStorage.removeItem("loginDataTemp");

      }, 1100);


    }else if (status == "1" && state == "Login") {
     
      setIsLoginSuccess(true);
      setIsPasswordFalse(false);
      setIsUserNotFound(false);
      setIsNotFilled(false);
      setIsErrorCPAAS(false);

      setUsername("");
      setPassword("");

      localStorage.setItem("isLogin", "true");
      localStorage.setItem("f_pin", message);
      localStorage.setItem("loginData", localStorage.getItem("loginDataTemp") || "{}");

      setTimeout(() => {

        closeBtnRef.current?.click();
        
      }, 1000);

      setTimeout(() => {

        setIsRegisterPage(false);
        setIsLoginPage(false);
        setIsLoginSuccess(false);

        isChangedUser();
        setIsLogin(true);
        setLoginData(JSON.parse(localStorage.getItem("loginDataTemp") || "{}"));

        localStorage.removeItem("state");
        localStorage.removeItem("loginDataTemp");

      }, 1100);
      
    }else if (status == "0") {
      
      console.log("Connect CPAAS Failure");

      setIsErrorCPAAS(true);
      setReasonErrorCPAAS(message);

    }
    
  }

  useEffect(() => {

    setIsNotFilled(false);
    setIsPasswordNotMatch(false);
    setIsUserAlreadyExists(false);
    setIsUserNotFound(false);
    setIsPasswordFalse(false);
    setIsRegisterSuccess(false);
    setIsLoginSuccess(false);
    setIsErrorCPAAS(false);

    setName("");
    setUsername("");
    setPassword("");
    setConfirmPassword("");

  }, [isRegisterPage, isLoginPage]);

  (window as any).loginCallback = loginCallback;
  (window as any).logoutCallback = logoutCallback;

  return (
    <div
      className="offcanvas offcanvas-start w-100 h-100"
      id="drawer"
      aria-labelledby="drawerLabel"
    >
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="drawerLabel">
          {menu}
        </h5>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
          ref={closeBtnRef}
          onClick={() => {
            setTimeout(() => {
              setIsRegisterPage(false);
              setIsLoginPage(false);
            }, 500);
          }}
        ></button>
      </div>
      <div className="offcanvas-body">

        {menu === "Fitur Satu iDesa" && (
          <div className="row">
            <MenuGridItem
              icon="fas fa-tachometer-alt"
              title="Dashboard"
              description="Halaman utama untuk memantau kondisi desa. Informasi yang disajikan berupa grafik, chart, dan keterangan lainnya yang membantu memantau kondisi desa."
            />
            <MenuGridItem
              icon="fas fa-comments"
              title="Forum"
              description="Tempat berdiskusi dan berbagi informasi. Masyarakat dapat berbagi pengalaman dan pengetahuan di sini."
            />
            <MenuGridItem
              icon="fas fa-shopping-cart"
              title="Belanja"
              description="Pembelian secara online. Masyarakat dapat membeli produk-produk yang dijual di sini."
            />
            <MenuGridItem
              icon="fas fa-wallet"
              title="Keuangan"
              description="Pengelolaan keuangan desa. Informasi yang disajikan berupa laporan keuangan, anggaran, dan pengeluaran."
            />
            <MenuGridItem
              icon="fas fa-map-marked-alt"
              title="SIG"
              description="Sistem informasi geografis. Informasi yang disajikan berupa peta, data spasial, dan informasi lainnya yang berhubungan dengan geografis."
            />
            <MenuGridItem
              icon="fas fa-handshake"
              title="Layanan"
              description="Fitur yang disajikan berupa layanan dan informasi lainnya yang berhubungan dengan pelayanan desa."
            />
            <MenuGridItem
              icon="fas fa-life-ring"
              title="Bantuan"
              description="Pemberian bantuan. Informasi yang disajikan berupa jenis bantuan, syarat, dan prosedur pemberian bantuan."
            />
            <MenuGridItem
              icon="fas fa-chalkboard-teacher"
              title="Pelatihan"
              description="Pelatihan untuk masyarakat. Informasi yang disajikan berupa jadwal, materi, dan informasi lainnya yang berhubungan dengan pelatihan."
            />
            <MenuGridItem
              icon="fas fa-seedling"
              title="Potensi Desa"
              description="Potensi desa. Informasi yang disajikan berupa potensi desa, data statistik, dan informasi lainnya yang berhubungan dengan potensi desa."
            />
            <MenuGridItem
              icon="fas fa-bullhorn"
              title="Media Desa"
              description="Media sosial desa. Informasi yang disajikan berupa berita, foto, dan informasi lainnya yang berhubungan dengan media sosial desa."
            />
            <MenuGridItem
              icon="fas fa-building"
              title="Info BUMDes"
              description="Informasi BUMDes. Informasi yang disajikan berupa profil, visi misi, struktur organisasi, dan informasi lainnya yang berhubungan dengan BUMDes."
            />
            <MenuGridItem
              icon="fas fa-book-open"
              title="Riset Akademik"
              description="Riset akademik. Informasi yang disajikan berupa jurnal, buku, dan informasi lainnya yang berhubungan dengan riset akademik."
            />
             <MenuGridItem
              icon="fas fa-file-signature"
              title="Surat Desa"
              description="Pengajuan berbagai surat resmi desa dapat dilakukan secara online melalui aplikasi iDesa."
            />
            <MenuGridItem
              icon="fa-solid fa-user-doctor"
              title="Puskesmas Desa"
              description="Layanan Puskesmas Desa dapat dilakukan secara online melalui aplikasi iDesa."
            />
             <MenuGridItem
              icon="fa-solid fa-comment"
              title="Chat Langsung"
              description="Interaksi dengan agent secara langsung untuk mendapatkan bantuan dan layanan pelayanan desa lebih cepat."
            />
          </div>
        )}

        {menu === "Pesan Masuk" && (
          <div className="card p-3 mt-2">
            <div className="d-flex w-100">
              <i className="fas fa-envelope me-2 mt-1" />
              <h6 className="my-1">Selamat datang di iDesa!</h6>
            </div>
            <p className="my-1 text-secondary small">
              Selamat datang di iDesa! Kami senang Anda telah bergabung dengan
              kami. Kami berharap Anda akan menemukan informasi yang Anda
              butuhkan di sini. Jika Anda memiliki pertanyaan atau membutuhkan
              bantuan, silakan hubungi kami di{" "}
              <a href="mailto:admin@idesa.id">admin@idesa.id</a>.
            </p>
          </div>
        )}

        {menu === "Notifikasi" && (
          <>
            <div className="alert alert-light text-center px-5" role="alert">
              <i className="fas fa-exclamation-circle me-2" />
              Tidak ada notifikasi terbaru.
            </div>
            <img
              src="notification.png"
              alt="Notifikasi"
              className="w-50 d-block mx-auto"
            ></img>
          </>
        )}

        {menu === "Pengguna iDesa" && isLogin == false && (
          <div className="d-grid gap-2">
            <div className="d-flex justify-content-center">
              <div className="profile-picture me-3 my-3 pt-2">
                <div className="d-flex justify-content-center">
                  <img
                    src={isLoginPage || isRegisterPage ? "user-3.png" : "user.png"}
                    alt="dummy profile picture"
                    className="rounded-circle w-50 h-50"
                  />
                </div>
              </div>
            </div>
            {isRegisterPage ? (
              <div className="text-center mb-3 card p-3 shadow">
                <h3 className="mt-3 mb-4">Registrasi<span className="text-orange fw-bold"> iDesa</span></h3>
                <p className="text-secondary">Silahkan isi form dibawah ini untuk mendaftar di iDesa</p>
                <div className="mt-2 mx-3">

                   {isNotFilled == true && (
                    <>
                      <div className="alert alert-danger text-center px-5" role="alert">
                        <i className="fas fa-exclamation-circle me-2" />
                        Data registrasi tidak boleh kosong.
                      </div>
                    </>
                  )}

                  {isPasswordNotMatch == true && (
                    <>
                      <div className="alert alert-danger text-center px-5" role="alert">
                        <i className="fas fa-exclamation-circle me-2" />
                        Konfirmasi kata sandi tidak sama.
                      </div>
                    </>
                  )}

                  {isUserAlreadyExists == true && (
                   <>
                      <div className="alert alert-danger text-center px-5" role="alert">
                        <i className="fas fa-exclamation-circle me-2" />
                        Nama pengguna telah terdaftar.
                      </div>
                    </>
                  )}

                  {loading == true && (
                   <>
                      <div className="alert alert-warning text-center px-5" role="alert">
                        <i className="fas fa-exclamation-circle me-2" />
                        Harap tunggu...
                      </div>
                    </>
                  )}

                  {isErrorCPAAS == true && (
                   <>
                      <div className="alert alert-danger text-center px-5" role="alert">
                        <i className="fas fa-exclamation-circle me-2" />
                        CPAAS Error : {reasonErrorCPAAS}
                      </div>
                    </>
                  )}

                  {isRegisterSuccess == true && (
                    <>
                      <div className="alert alert-success text-center px-5" role="alert">
                        <i className="fas fa-exclamation-circle me-2" />
                        Registrasi Berhasil.
                      </div>
                    </>
                  )}

                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control rounded-4 py-2"
                      id="name"
                      aria-describedby="nameHelp"
                      placeholder="Nama Lengkap"
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control rounded-4 py-2"
                      id="username"
                      aria-describedby="usernameHelp"
                      placeholder="Nama Pengguna"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="password"
                      className="form-control rounded-4 py-2"
                      id="password"
                      placeholder="Kata Sandi"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="password"
                      className="form-control rounded-4 py-2"
                      id="retype-password"
                      placeholder="Ulang Kata Sandi"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <div className="d-grid gap-2">
                    <button className="btn btn-dark mt-3"
                      onClick={() => handleRegister()}>
                      Registrasi
                    </button>
                     <button className="btn btn-register btn-outline-dark mt-2 mb-3"
                      onClick={() => setIsRegisterPage(false) }>
                      Kembali
                    </button>
                  </div>
                </div>
              </div>
            ) : isLoginPage ? (
              <div className="text-center mb-3 card p-3 shadow">
                <h3 className="mt-3 mb-4">Masuk<span className="text-orange fw-bold"> iDesa</span></h3>
                <p className="text-secondary">Silahkan masuk ke akun iDesa Anda</p>
                <div className="mt-2 mx-3">

                  {isNotFilled == true && (
                    <>
                      <div className="alert alert-danger text-center px-5" role="alert">
                        <i className="fas fa-exclamation-circle me-2" />
                        Data masuk tidak boleh kosong.
                      </div>
                    </>
                  )}

                   {isUserNotFound == true && (
                    <>
                      <div className="alert alert-danger text-center px-5" role="alert">
                        <i className="fas fa-exclamation-circle me-2" />
                        Pengguna atau kata sandi salah.
                      </div>
                    </>
                  )}

                  {isPasswordFalse == true && (
                    <>
                      <div className="alert alert-danger text-center px-5" role="alert">
                        <i className="fas fa-exclamation-circle me-2" />
                        Pengguna atau kata sandi salah.
                      </div>
                    </>
                  )}

                  {loading == true && (
                   <>
                      <div className="alert alert-warning text-center px-5" role="alert">
                        <i className="fas fa-exclamation-circle me-2" />
                        Harap tunggu...
                      </div>
                    </>
                  )}

                  {isErrorCPAAS == true && (
                   <>
                      <div className="alert alert-danger text-center px-5" role="alert">
                        <i className="fas fa-exclamation-circle me-2" />
                        CPAAS Error : {reasonErrorCPAAS}
                      </div>
                    </>
                  )}

                  {isLoginSuccess == true && (
                    <>
                      <div className="alert alert-success text-center px-5" role="alert">
                        <i className="fas fa-exclamation-circle me-2" />
                        Login Berhasil.
                      </div>
                    </>
                  )}

                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control rounded-4 py-2"
                      id="username"
                      aria-describedby="usernameHelp"
                      placeholder="Nama Pengguna"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="password"
                      className="form-control rounded-4 py-2"
                      id="password"
                      placeholder="Kata Sandi"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="d-grid gap-2">
                    <button className="btn btn-dark mt-3"
                      onClick={() => handleLogin()}>
                      Masuk
                    </button>
                     <button className="btn btn-register btn-outline-dark mt-2 mb-3"
                      onClick={() => setIsLoginPage(false)}>
                      Kembali
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="text-center mb-3">
                  <p className="mt-3 mx-3">
                    Masuk ke akun Anda untuk mengakses fitur-fitur idesa yang
                    lebih luas dan untuk memperbarui data Anda.
                  </p>
                </div>
                <div className="btn btn-primary btn-dark w-100 mb-2" onClick={() => setIsLoginPage(true)}>Masuk</div>
                <div className="btn btn-outline-dark w-100" onClick={() => setIsRegisterPage(true)}>Registrasi</div>
              </>
            )}
          </div>
        )}

        {menu === "Pengguna iDesa" && isLogin == true && (

          <div className="col-12">
            <div className="text-center mb-3">
              <div className="d-flex justify-content-center">
                <div className="profile-picture me-3 my-3 pt-2">
                  <div className="d-flex justify-content-center">
                    <img
                      src={loginData?.image ? loginData?.image : "user.png"}
                      alt="dummy profile picture"
                      className="rounded-circle w-50 h-50"
                    />
                  </div>
                </div>
              </div>
              <div className="card mt-3 shadow rounded-3 m-2">
                <div className="card-header fw-bold py-3">Informasi Pengguna</div>
                <div className="card-body pt-2">
                  <p className="mt-3 mb-2 small">Nama Lengkap</p>
                  <input
                    type="text"
                    className="form-control mt-3 fw-bold w-75 text-center mb-3 d-flex justify-content-center mx-auto"
                    value={loginData?.name}
                    disabled
                  />
                  <div className="btn-dark small text-white p-1 rounded-3 mx-auto fw-bold px-4 mb-4 d-flex justify-content-center mt-4" style={{ width: "fit-content", filter: "saturate(0.7)" }}>
                    <i className="fa-solid fa-leaf me-2" style={{ marginTop: "2px" }}/>
                    Warga Satu iDesa
                  </div>
                  <hr/>
                  <p className="mt-3 mb-2 small">Bergabung Sejak</p>
                  <div className="btn-dark small text-white p-1 rounded-3 fw-bold mx-auto px-4 my-2 mt-3 d-flex justify-content-center" style={{ width: "fit-content", filter: "saturate(0.7)" }}>
                    <i className="fa-solid fa-calendar-days me-2" style={{ marginTop: "2px" }}/>
                    {formatDate(loginData?.created_at || "")}
                  </div>
                </div>
            </div>

            {loading == true && (
              <>
                <div className="alert alert-warning text-center px-5 mt-4" role="alert">
                  <i className="fas fa-exclamation-circle me-2" />
                  Harap tunggu...
                </div>
              </>
            )}
            
            {isErrorCPAAS == true && (
                <>
                  <div className="alert alert-danger text-center px-5 mt-4" role="alert">
                    <i className="fas fa-exclamation-circle me-2" />
                    CPAAS Error : {reasonErrorCPAAS}
                  </div>
                </>
              )}

              <div className="btn btn-danger rounded-5 w-100 my-4" onClick={() => logout()}>
                <i className="fa-solid fa-right-from-bracket me-3" />
                Keluar 
              </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default Drawer;
