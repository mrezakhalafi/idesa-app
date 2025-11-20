import { useState, useEffect } from "react";
import './PotensiDesa.css'
import { Link } from 'react-router-dom'
import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import ChartDataLabels from "chartjs-plugin-datalabels";
import axios from "axios";

ChartJS.register(CategoryScale, LinearScale, ArcElement, Title, Tooltip, Legend, ChartDataLabels)

interface Potensi {
  id: string;
  potention_id: string;
  title: string;
  icon: string;
  description: string;
  graph: string;
}

const PotensiDesa = () => {

  const [potention, setPotention] = useState<Potensi[]>([]);
  const [selected, setSelected] = useState<Potensi>();
  const [loading, setLoading] = useState(true);

  const fetchPotention = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/potention`)
      .then((res) => {
        console.log(res.data);
        setPotention(res.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchPotention();
  }, []);

const options = {
  plugins: {
    legend: {
      position: "right" as const,
      labels: {
        boxWidth: 12,  
        boxHeight: 12, 
        padding: 10,
        borderRadius: 100
      },
    },
    
    datalabels: {
      formatter: (value: number, context: any) => {
        const datapoints = context.chart.data.datasets[0].data;
        const total = datapoints.reduce((acc: number, val: number) => acc + val, 0);
        const percentage = ((value / total) * 100).toFixed(1) + "%";
        return percentage;
      },
      color: "#fff",
      font: {
        weight: "bold" as const,
        size: 12,
      },
    },
  },
};

  const parsedGraph = selected?.graph ? JSON.parse(selected.graph) : {};

  const labels = Object.keys(parsedGraph || {});
  const values = Object.values(parsedGraph || {});

  const data = {
    labels: labels,
    datasets: [
      {
        data: values,
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

  const goToWisataDesa = () => {
    
    if ((window as any).Android && typeof (window as any).Android.openWisataDesa === "function") {

      console.log("CPAAS Open Wisata Desa");

      (window as any).Android.openWisataDesa();
      
    } else {
      console.log("Android interface not available");
    }

  }

  const gradients = [
    "linear-gradient(135deg, #f78484, #ce443c)",
    "linear-gradient(135deg, #4ecdc4, #44a08d)",
    "linear-gradient(135deg, #64b5f6, #2196f3)",
    "linear-gradient(135deg, #f093fb, #f5576c)",
    "linear-gradient(135deg, #ffe647, #dd8867)",
    "linear-gradient(135deg, #70829b, #8e44ad)",
    "linear-gradient(135deg, #4ecd51, #44a08d)",
  ];

  return (
    <div className="main-container">
      <div className="background">
        <div className="header py-3">
          <div className="d-flex">
            <Link to="/" replace className="header-icon" style={{ fontSize: '24px', color: 'white', textDecoration: 'none' }}>
              <i className="fa-solid fa-arrow-left"></i>
            </Link>
            <h1 className="ms-3" style={{ marginTop: '0.35rem' }}>Potensi Desa</h1>
          </div>
        </div>
        <section className="sheet">
            <div className="p-3">
              <p className="mb-1"><i className="fa-solid fa-location-dot me-3"></i>Satu iDesa</p>
              <small className="text-muted">Potensi desa adalah sesuatu yang dimiliki desa untuk meningkatkan kesejahteraan masyarakat.</small>
            </div>

            {loading && (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status" />
                <div className="mt-2">Memuat Data...</div>
              </div>
            )}

            {!loading && !potention.length && (
              <>
                <div className="alert alert-light text-center px-5" role="alert">
                  <i className="fas fa-exclamation-circle me-2" />
                  Belum ada potensi yang tersedia.
                </div>
                <img
                  src="post.png"
                  alt="Notifikasi"
                  className="w-50 d-block mx-auto"
                />
              </>
            )}

          <div className="menu-grid-potensi-desa">
            {!loading &&
            potention.map((item) => (
              <button
                key={item.id}
                className="menu-item-potensi-desa shadow"
                data-bs-toggle="modal"
                data-bs-target="#modalPotensi"
                onClick={() => setSelected(item)}
              >
                <div className="menu-icon-potensi-desa"
                  style={{ background: gradients[(Number(item.id) - 1) % gradients.length] }}
                >
                  <i className={`fas fs-50 ${item.icon}`}></i>
                </div>
                <div className="menu-title mt-3" style={{ fontSize: '0.9rem' }}>{item.title}</div>
              </button>
            ))}

          </div>

          <div
            className="modal fade"
            id="modalPotensi"
            tabIndex={-1}
            aria-labelledby="modalPotensiLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                {selected && (
                  <div className="modal-body text-center pt-2">
                    <div className="menu-item-potensi-desa">
                      <h5 className="">{selected.title}</h5>
                    </div>
                    <div className="row">
                      <div className="col-12">
                        <div className="chart-container" style={{ marginTop: '-2.7rem', marginBottom: '2.5rem'}}>
                          <Doughnut data={data} options={options} />
                        </div>
                      </div>

                      { selected.title === "Pariwisata" && (
                        <div onClick={goToWisataDesa} className="btn btn-dark w-75 d-flex justify-content-center mt-2 mb-3 mx-auto"><i className="fa-solid fa-location-dot me-3 pt-1"></i>Wisata Desa Digital</div>
                      )}
                      </div>
                      <div className="card p-3 text-center">
                        <p className="card-text small">{selected.description}</p>
                      </div>
                      <button
                        type="button"
                        className="btn btn-secondary w-100 mt-4 rounded-5"
                        data-bs-dismiss="modal"
                      >
                        Tutup
                      </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default PotensiDesa

