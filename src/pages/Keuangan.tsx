import { useEffect, useState } from "react";
import './Keuangan.css'
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
import axios from "axios";

ChartJS.register(CategoryScale, LinearScale, ArcElement, Title, Tooltip, Legend)

interface KeuanganData {
  id: number;
  total_budget: number;
  infrastructure_funds: number;
  education_funds: number;
  economic_funds: number;
  other_funds: number;
  total_realization: number;
  problematic_expenses: number;
  remaining_budget: number;
}

interface DistributionData {
  id: number;
  distribution_id: string;
  name: string;
  amount: number;
}

interface TransactionsVillages {
  id: number;
  transaction_id: string;
  transaction: string;
  amount: number;
  created_at: string;
}

const Keuangan = () => {
    const [keuangan, setKeuangan] = useState<KeuanganData>();
    const [distribution, setDistribution] = useState<DistributionData[]>([]);
    const [transactions, setTransactions] = useState<TransactionsVillages[]>([]);

    useEffect(() => {
      axios
        .get<KeuanganData>(`${import.meta.env.VITE_API_URL}/dashboard`)
        .then((response) => {
          setKeuangan(response.data);
        })
        .catch((error) => {
          console.error("There was an error fetching the keuangan data.", error);
        });

        axios
        .get<DistributionData[]>(`${import.meta.env.VITE_API_URL}/distribution`)
        .then((response) => {
          setDistribution(response.data);
        })
        .catch((error) => {
          console.error("There was an error fetching the distribution data.", error);
        });

        axios
        .get<TransactionsVillages[]>(`${import.meta.env.VITE_API_URL}/transactions_villages`)
        .then((response) => {
          setTransactions(response.data);
        })
        .catch((error) => {
          console.error("There was an error fetching the distribution data.", error);
        });
    }, []);


    const options = {
      responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            datalabels: {
              display: false,
            },
        }
    }

    const data = {
        labels: distribution.map(item => item.name),
        datasets: [
            {
                data: distribution.map(item => item.amount),
                backgroundColor: distribution.map((_item, index) => {
                  const colors = [
                    "rgba(54, 162, 235, 1)", 
                    "rgba(255, 159, 64, 1)",
                    "rgba(75, 192, 192, 1)", 
                    "rgba(255, 99, 132, 1)",
                  ];
                  return colors[index % colors.length];
                }),
                borderWidth: 0,
                cutout: "60%",
            },
        ],
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
  function formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
    };
    return new Date(dateString).toLocaleString("id-ID", options);
  }

  return (

    <div className="main-container">
      <div className="background">
        <div className="header py-3">
          <div className="d-flex">
            <Link to="/" replace className="header-icon" style={{ fontSize: '24px', color: 'white', textDecoration: 'none' }}>
              <i className="fa-solid fa-arrow-left"></i>
            </Link>
            <h1 className="ms-3" style={{ marginTop: '0.35rem' }}>Keuangan Desa</h1>
          </div>
        </div>
      </div>

      <div className="container-keuangan">
        <div className="card-keuangan">
          <div className="card-header-keuangan px-3 pt-3 pb-1">Ringkasan Anggaran : <span className="text-orange">{formatRupiahSmall(keuangan?.total_budget || 0)}</span></div>
          <div className="p-3">
            <div className="progress mb-3">
              <div className="progress-bar" style={{ width: `${((keuangan?.total_realization ?? 0) / (keuangan?.total_budget ?? 1)) * 100}%` }}></div>
            </div>
            <h6>Realisasi : <span className="text-orange">{formatRupiahSmall(keuangan?.total_realization || 0)}</span> <span className="text-success">({`${Math.round(((keuangan?.total_realization ?? 0) / (keuangan?.total_budget ?? 1)) * 100)}%`})</span></h6>
          </div>
        </div>
        <div className="card-keuangan">
          <div className="card-header-keuangan pt-3 px-3">Distribusi Realisasi</div>
          <div className="p-3">
            <div className="row align-items-center">
              <div className="col-6">
                <Doughnut data={data} options={options} />
              </div>
              <div className="col-6">
                {distribution.map((item) => (
                  <div className="legend-item" key={item.id}>
                    <div
                      className="legend-color"
                      style={{ backgroundColor: distribution.map((_item, index) => {
                        const colors = [
                          "rgba(54, 162, 235, 1)",
                          "rgba(255, 159, 64, 1)",
                          "rgba(75, 192, 192, 1)",
                          "rgba(255, 99, 132, 1)",
                        ];
                        return colors[index % colors.length];
                      })[distribution.indexOf(item)] }}
                    ></div>
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="card-keuangan">
          <div className="card-header-keuangan px-3 pt-3 pb-1">Kategori Pengeluaran</div>
          <div className="px-3 pb-3 pt-1">
            <div className="category-item-keuangan">
              <div className="d-flex align-items-center">
                <i className="me-2 fas fa-building category-icon"></i>
                <span className="ms-3">Infrastruktur</span>
              </div>
              <span>{formatRupiahSmall(Number(keuangan?.infrastructure_funds))}</span>
            </div>
            <div className="category-item-keuangan">
              <div className="d-flex align-items-center">
                <i className="me-2 fas fa-graduation-cap category-icon"></i>
                <span className="ms-2">Pendidikan</span>
              </div>
              <span>{formatRupiahSmall(Number(keuangan?.education_funds))}</span>
            </div>
            <div className="category-item-keuangan">
              <div className="d-flex align-items-center">
                <i className="me-2 fas fa-coins category-icon"></i>
                <span className="ms-2 ps-1">Ekonomi</span>
              </div>
              <span>{formatRupiahSmall(Number(keuangan?.economic_funds))}</span>
            </div>
            <div className="category-item-keuangan">
              <div className="d-flex align-items-center">
                <i className="me-2 fas fa-ellipsis-h category-icon"></i>
                <span className="ms-3">Lainnya</span>
              </div>
              <span>{formatRupiahSmall(Number(keuangan?.other_funds))}</span>
            </div>
          </div>
        </div>
        <div className="card-keuangan mb-5">
          <div className="card-header-keuangan px-3 pt-3 pb-1">Transaksi Terbaru</div>
          <div className="px-3 pb-3 pt-1">
            {transactions.map((transaction) => (
              <div className="transaction-item" key={transaction.id}>
                <div className="d-flex align-items-center">
                  <span className="transaction-date">{formatDate(transaction.created_at)}</span>
                  <span className="ms-3">{transaction.transaction}</span>
                </div>
                <span className="transaction-amount">{formatRupiahSmall(Number(transaction.amount))}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Keuangan
