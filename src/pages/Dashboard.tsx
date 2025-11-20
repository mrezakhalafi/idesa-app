import { useEffect, useState } from "react";
import "./Dashboard.css";
import { Link } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
import Carousel from "react-bootstrap/Carousel";
import Maps from "../components/Maps";
import { Modal, Button } from "react-bootstrap";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardData {
  id: number;
  total_villages: number;
  total_users: number;
  total_budget: number;
  infrastructure_funds: number;
  education_funds: number;
  economic_funds: number;
  other_funds: number;
  total_realization: number;
  problematic_expenses: number;
  remaining_budget: number;
  sig: string;
  way_access: number;
  electricity_access: number;
  water_access: number;
  internet_access: number;
  rt: string;
  rw: string;
  area: number;
  education: string;
  health: string;
  economy: string;
  welfare: string;
}

interface Project {
  id: number;
  id_desa: number;
  name: string;
  description: string;
  progress: number;
  status: number; // 0=perencanaan, 1=berjalan, 2=success
  photo_url: string;
  location: string;
  lat: number;
  lng: number;
  created_at: string;
}

interface Indicator {
  [key: string]: string;
}

const Dashboard = () => {
  const [id, setId] = useState(1);

  const [totalVillages, setTotalVillages] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalBudget, setTotalBudget] = useState(0);

  const [infrastructureFunds, setInfrastructureFunds] = useState(0);
  const [educationFunds, setEducationFunds] = useState(0);
  const [economicFunds, setEconomicFunds] = useState(0);
  const [otherFunds, setOtherFunds] = useState(0);

  const [totalRealization, setTotalRealization] = useState(0);
  const [problematicExpenses, setProblematicExpenses] = useState(0);
  const [remainingBudget, setRemainingBudget] = useState(0);

  const [wayAccess, setWayAccess] = useState(0);
  const [electricityAccess, setElectricityAccess] = useState(0);
  const [waterAccess, setWaterAccess] = useState(0);
  const [internetAccess, setInternetAccess] = useState(0);

  const [rt, setRt] = useState("");
  const [rw, setRw] = useState("");
  const [area, setArea] = useState(0);

  const [education, setEducation] = useState<Indicator>({});
  const [health, setHealth] = useState<Indicator>({});
  const [economy, setEconomy] = useState<Indicator>({});
  const [welfare, setWelfare] = useState<Indicator>({});

  const [projects, setProjects] = useState<Project[]>([]);
  const [showMap, setShowMap] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<string>("");
  const handleOpenMap = (lat: number, lng: number) => {
    setCurrentLocation(`${lat},${lng}`);
    setShowMap(true);
  };

  const handleCloseMap = () => setShowMap(false);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        grid: {
          display: false,
        },
        ticks: {
          stepSize: 20_000_000,
          callback: function (tickValue: string | number) {
            return formatRupiahSmall(Number(tickValue));
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        display: false,
      },
      title: {
        display: false,
        font: {
          size: window.innerWidth < 576 ? 16 : 18,
        },
      },
    },
  };

  const data = {
    labels: ["Infrastruktur", "Pendidikan", "Ekonomi", "Lainnya"],
    datasets: [
      {
        data: [infrastructureFunds, educationFunds, economicFunds, otherFunds],
        backgroundColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  function formatRupiah(amount: number): string {
    return amount.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });
  }

  function formatRupiahSmall(amount: number): string {
    if (amount >= 1_000_000_000) {
      return (
        (amount / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + " Milliar"
      );
    } else if (amount >= 1_000_000) {
      return (amount / 1_000_000).toFixed(1).replace(/\.0$/, "") + " Juta";
    } else if (amount >= 1_000) {
      return (amount / 1_000).toFixed(1).replace(/\.0$/, "") + " Ribu";
    } else {
      return amount.toString();
    }
  }

  useEffect(() => {
    axios
      .get<DashboardData>(`${import.meta.env.VITE_API_URL}/dashboard`)
      .then((response) => {
        const data = response.data;
        setId(data.id);

        setTotalVillages(data.total_villages);
        setTotalUsers(data.total_users);
        setTotalBudget(data.total_budget);

        setInfrastructureFunds(data.infrastructure_funds);
        setEducationFunds(data.education_funds);
        setEconomicFunds(data.economic_funds);
        setOtherFunds(data.other_funds);

        setTotalRealization(data.total_realization);
        setProblematicExpenses(data.problematic_expenses);
        setRemainingBudget(data.remaining_budget);

        setWayAccess(data.way_access);
        setElectricityAccess(data.electricity_access);
        setWaterAccess(data.water_access);
        setInternetAccess(data.internet_access);

        setRt(data.rt);
        setRw(data.rw);
        setArea(data.area);

        setEducation(JSON.parse(data.education));
        setHealth(JSON.parse(data.health));
        setEconomy(JSON.parse(data.economy));
        setWelfare(JSON.parse(data.welfare));
      })
      .catch((error) => {
        console.error("There was an error fetching the dashboard data.", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get<Project[]>(`${import.meta.env.VITE_API_URL}/projects/${id}`)
      .then((response) => {
        setProjects(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the project data.", error);
      });
  }, [id]);

  return (
    <div className="main-container">
      <div className="background">
        <div className="header py-3">
          <div className="d-flex">
            <Link
              to="/"
              replace
              className="header-icon"
              style={{
                fontSize: "24px",
                color: "white",
                textDecoration: "none",
              }}
            >
              <i className="fa-solid fa-arrow-left" />
            </Link>
            <h1 className="ms-3" style={{ marginTop: "0.35rem" }}>
              Dasbor
            </h1>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="menu-grid-dashboard">
          <button className="menu-item bg-light p-2 rounded-4 shadow">
            <div className="menu-icon">
              <i className="fas fa-house" />
            </div>
            <div className="menu-heading">{totalVillages}</div>
            <div className="menu-title text-muted">Dusun</div>
          </button>

          <button className="menu-item bg-light p-2 rounded-4 shadow">
            <div className="menu-icon">
              <i className="fas fa-user" />
            </div>
            <div className="menu-heading">{totalUsers}</div>
            <div className="menu-title text-muted">Penduduk</div>
          </button>

          <button className="menu-item bg-light p-2 rounded-4 shadow">
            <div className="menu-icon">
              <i className="fas fa-map" />
            </div>
            <div className="menu-heading">
              {area} KM<sup> 2</sup>
            </div>
            <div className="menu-title text-muted">Luas Wilayah</div>
          </button>
        </div>

        <div className="container d-flex justify-content-between mb-3">
          <div className="card w-100 mx-2">
            <div className="card-body text-center">
              <div className="menu-heading">
                <span
                  className="badge rounded-pill py-2 px-4 w-100"
                  style={{ filter: "saturate(0.7)", backgroundColor: "#2a8b29" }}
                >
                  <i className="fas fa-people-group me-2" />
                  {rt} RT
                </span>
              </div>
            </div>
          </div>
          <div className="card w-100 mx-2">
            <div className="card-body text-center">
              <div className="menu-heading">
                <span
                  className="badge rounded-pill py-2 px-4 w-100"
                  style={{ filter: "saturate(0.7)", backgroundColor: "#2a8b29" }}
                >
                  <i className="fas fa-people-group me-2" />
                  {rw} RW
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="chart card">
          <div className="card-body">
            <div className="card-title text-center">
              <h3>{formatRupiah(totalBudget)}</h3>
              <h6 className="text-muted">Total Dana Desa</h6>
            </div>
            <div className="chart-container">
              <Bar data={data} options={options} />
            </div>
          </div>
        </div>

        <div className="card mt-3">
          <div className="card-body bg-dashboard-details">
            <div className="card-title text-center mb-3 mt-1">
              <h5>Penggunaan Dana Desa</h5>
            </div>
            <div className="row align-items-center mb-2">
              <div className="col-6 px-1">
                <div className="card p-2 py-3">
                  <div className="container px-1">
                    <div className="row align-items-center">
                      <div className="col-3">
                        <div className="icon-circle icon-blue">
                          <i className="fas fa-coins" />
                        </div>
                      </div>
                      <div className="col-9">
                        <div className="amount">
                          {formatRupiahSmall(totalBudget)}
                        </div>
                        <div className="label">Anggaran</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-6 px-1">
                <div className="card p-2 py-3">
                  <div className="container px-1">
                    <div className="row align-items-center">
                      <div className="col-3">
                        <div className="icon-circle icon-green">
                          <i className="fas fa-pie-chart" />
                        </div>
                      </div>
                      <div className="col-9">
                        <div className="amount">
                          {formatRupiahSmall(totalRealization)}
                        </div>
                        <div className="label">Realisasi</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row align-items-center mb-2">
              <div className="col-6 px-1">
                <div className="card p-2 py-3">
                  <div className="container px-1">
                    <div className="row align-items-center">
                      <div className="col-3">
                        <div className="icon-circle icon-red">
                          <i className="fas fa-triangle-exclamation" />
                        </div>
                      </div>
                      <div className="col-9">
                        <div className="amount">
                          {formatRupiahSmall(problematicExpenses)}
                        </div>
                        <div className="label">Belanja Yang Bermasalah</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-6 px-1">
                <div className="card p-2 py-4">
                  <div className="container px-1">
                    <div className="row align-items-center">
                      <div className="col-3">
                        <div className="icon-circle icon-purple">
                          <i className="fas fa-up-right-from-square" />
                        </div>
                      </div>
                      <div className="col-9">
                        <div className="amount">
                          {formatRupiahSmall(remainingBudget)}
                        </div>
                        <div className="label">Sisa Anggaran</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-title text-center mt-4 mb-3">
              <h5>Akses Desa</h5>
            </div>
            <div className="row align-items-center mb-2">
              <div className="col-6 px-1">
                <div className="card p-2 py-3">
                  <div className="container px-1">
                    <div className="row align-items-center">
                      <div className="col-3">
                        <div className="icon-circle icon-purple">
                          <i className="fas fa-road" />
                        </div>
                      </div>
                      <div className="col-9">
                        <div className="amount">{wayAccess}%</div>
                        <div className="label">Akses Jalan</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-6 px-1">
                <div className="card p-2 py-3">
                  <div className="container px-1">
                    <div className="row align-items-center">
                      <div className="col-3">
                        <div className="icon-circle icon-red">
                          <i className="fas fa-bolt" />
                        </div>
                      </div>
                      <div className="col-9">
                        <div className="amount">{electricityAccess}%</div>
                        <div className="label">Akses Listrik</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row align-items-center mb-2">
              <div className="col-6 px-1">
                <div className="card p-2 py-3">
                  <div className="container px-1">
                    <div className="row align-items-center">
                      <div className="col-3">
                        <div className="icon-circle icon-green">
                          <i className="fas fa-wind" />
                        </div>
                      </div>
                      <div className="col-9">
                        <div className="amount">{waterAccess}%</div>
                        <div className="label">Akses Air Bersih</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-6 px-1">
                <div className="card p-2 py-3">
                  <div className="container px-1">
                    <div className="row align-items-center">
                      <div className="col-3">
                        <div className="icon-circle icon-blue">
                          <i className="fas fa-wifi" />
                        </div>
                      </div>
                      <div className="col-9">
                        <div className="amount">{internetAccess}%</div>
                        <div className="label">Akses Internet</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-title text-center mt-4 mb-3">
              <h5>Pembangunan Desa</h5>
            </div>
            <div className="row align-items-center mb-2">
              <div className="col-6 px-1">
                <div className="card p-2 py-3">
                  <div className="container px-1">
                    <div className="row align-items-center">
                      <div className="col-12 text-center d-flex justify-content-center">
                        <div className="icon-circle icon-red">
                          <i className="fas fa-graduation-cap" />
                        </div>
                      </div>
                      <div className="small text-center my-2">Pendidikan</div>

                      {Object.entries(education).map(([key, value], index) => (
                        <div className="col-12 text-center" key={index}>
                          <small className="label">{key}</small>
                          <div className="amount">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-6 px-1">
                <div className="card p-2 py-3">
                  <div className="container px-1">
                    <div className="row align-items-center">
                      <div className="col-12 text-center d-flex justify-content-center">
                        <div className="icon-circle icon-green">
                          <i className="fas fa-heartbeat" />
                        </div>
                      </div>
                      <div className="small text-center my-2">Kesehatan</div>

                      {Object.entries(health).map(([key, value], index) => (
                        <div className="col-12 text-center" key={index}>
                          <small className="label">{key}</small>
                          <div className="amount">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row align-items-center mb-2">
              <div className="col-6 px-1">
                <div className="card p-2 py-3">
                  <div className="container px-1">
                    <div className="row align-items-center">
                      <div className="col-12 text-center d-flex justify-content-center">
                        <div className="icon-circle icon-blue">
                          <i className="fas fa-briefcase" />
                        </div>
                      </div>
                      <div className="small text-center my-2">Ekonomi</div>

                      {Object.entries(economy).map(([key, value], index) => (
                        <div className="col-12 text-center" key={index}>
                          <small className="label">{key}</small>
                          <div className="amount">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-6 px-1">
                <div className="card p-2 py-3">
                  <div className="container px-1">
                    <div className="row align-items-center">
                      <div className="col-12 text-center d-flex justify-content-center">
                        <div className="icon-circle icon-purple">
                          <i className="fas fa-hand-holding-usd" />
                        </div>
                      </div>
                      <div className="small text-center my-2">
                        Kesejahteraan
                      </div>

                      {Object.entries(welfare).map(([key, value], index) => (
                        <div className="col-12 text-center" key={index}>
                          <small className="label">{key}</small>
                          <div className="amount">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-title text-center mt-4 mb-3">
              <h5>Progress Pembangunan</h5>
            </div>
            <div className="row align-items-center mb-3">
              <div className="col-12">
                <div className="card p-3 shadow-sm">
                  {projects.length === 0 ? (
                    <p className="text-muted text-center my-3">
                      Belum ada proyek yang tercatat.
                    </p>
                  ) : (
                    <Carousel interval={5000} indicators={true} controls={true}>
                      {projects.map((project) => (
                        <Carousel.Item key={project.id}>
                          <div className="row align-items-center">

                            <div className="col-md-6">
                              <h6 className="fw-bold">{project.name}</h6>
                              <small className="text-muted">
                                {project.description}
                              </small>

                              <div
                                className="progress mt-2"
                                style={{ height: "10px", border: "none" }}
                              >
                                <div
                                  className={`progress-bar                              `}
                                  role="progressbar"
                                  style={{ width: `${project.progress}%` }}
                                  aria-valuenow={project.progress}
                                  aria-valuemin={0}
                                  aria-valuemax={100}
                                >
                                  {project.progress}%
                                </div>
                              </div>

                              <div className="small my-3">
                                Status :{" "}
                                <span
                                  className={`badge py-1 px-3 ${
                                    project.status === 2
                                      ? "bg-success"
                                      : project.status === 1
                                      ? "bg-warning"
                                      : "bg-secondary"
                                  }`}
                                >
                                  {project.status === 0
                                    ? "Perencanaan"
                                    : project.status === 1
                                    ? "Berjalan"
                                    : "Selesai"}
                                </span>
                              </div>
                            </div>

                            <div className="col-md-6 text-center">
                              <div className="px-2 pb-2 pt-4 border rounded shadow-sm">
                                <img
                                  src={
                                    project.photo_url
                                      ? project.photo_url
                                      : "/no-image.png"
                                  }
                                  alt={project.name}
                                  className="img-fluid rounded"
                                  style={{
                                    width: "100%",
                                    height: "200px",
                                    objectFit: "cover",
                                  }}
                                />
                                <div className="pb-3 pt-3">
                                  <small className="text-muted d-block">
                                    Lokasi: {project.location}
                                  </small>
                                  <Button
                                    variant="outline-dark"
                                    size="sm"
                                    className="mt-2 px-4 rounded-4"
                                    onClick={() =>
                                      handleOpenMap(project.lat, project.lng)
                                    }
                                  >
                                    <i className="fas fa-map-marker-alt me-1" />
                                    Lihat di Maps
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Carousel.Item>
                      ))}
                    </Carousel>
                  )}
                </div>
              </div>
            </div>

            <Modal show={showMap} onHide={handleCloseMap} size="lg" centered>
              <Modal.Header closeButton>
                <Modal.Title>Peta Lokasi Proyek</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {currentLocation && <Maps currentLocation={currentLocation} />}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseMap}>
                  Tutup
                </Button>
              </Modal.Footer>
            </Modal>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
