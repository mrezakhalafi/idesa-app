import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "react-bootstrap";

interface OrderItem {
  name: string;
  image: string;
  merchant: string;
  qty: number;
  price: number;
  created_at: string;
}

interface Transaction {
  transaction_id: string;
  total_amount: number;
  items: OrderItem[];
}

const OrderPages = () => {
  const [orders, setOrders] = useState<Transaction[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const loginData = JSON.parse(localStorage.getItem("loginData") || "{}");
        const res = await axios.post("http://localhost:3060/orders", {
          f_pin: loginData.f_pin,
        });

        if (res.status == 404) {
          setOrders([]);
          return;
        }

        setOrders(res.data);
      } catch (err) {
        console.error("Error fetch orders:", err);
      }
    };

    fetchOrders();
  }, []);

  const toggleExpand = (id: string) => {
    setExpanded(expanded === id ? "" : id);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className="main-container"
      style={{ background: "#f5f6fb", minHeight: "100vh" }}
    >
      {/* Header */}
      <div className="background">
        <div className="header-belanja py-3">
          <div className="d-flex align-items-center">
            <Link
              to="/"
              replace
              className="header-icon-belanja"
              style={{
                fontSize: "24px",
                color: "white",
                textDecoration: "none",
              }}
            >
              <i className="fa-solid fa-arrow-left"></i>
            </Link>
            <h1 className="ms-3 text-white m-0 fw-semibold">Pesanan Saya</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-4">
        <div className="d-flex flex-column gap-3">
          {orders.length === 0 ? (
              <>
                  <div
                    className="alert alert-light text-center px-5"
                    role="alert"
                  >
                    <i className="fas fa-exclamation-circle me-2" />
                    Belum ada transaksi yang dilakukan.
                  </div>
                  <img
                    src="cart.png"
                    alt="Notifikasi"
                    className="w-50 d-block mx-auto"
                  />
                </>
          ) : (
            orders.map(({ transaction_id, total_amount, items }) => (
              <Card
                key={transaction_id}
                className="border-0 shadow-sm"
                style={{ borderRadius: "16px", overflow: "hidden" }}
              >
                {/* Card Header */}
                <Card.Body
                  className="d-flex justify-content-between align-items-center p-3"
                  style={{ cursor: "pointer" }}
                  onClick={() => toggleExpand(transaction_id)}
                >
                  <div>
                    <h6 className="fw-bold mb-1">
                      {items.length > 1
                        ? items
                            .map((item) => item.name)
                            .slice(0, 2)
                            .join(", ")
                            .concat(items.length > 2 ? " and others" : "")
                        : items[0].name}
                    </h6>
                    <p className="text-muted small mb-0">Order No : {transaction_id}</p>
                    <p className="text-muted small mb-0">Total Items : {items.length}</p>
                  </div>
                  <div className="text-end">
                    <h6 className="fw-bold text-success mb-1">
                      Rp {total_amount.toLocaleString("id-ID")}
                    </h6>
                    <p className="text-muted small mb-0">
                      {formatDate(items[0].created_at)}
                    </p>
                    <i
                      className={`fa-solid fa-chevron-${
                        expanded === transaction_id ? "up" : "down"
                      } text-muted`}
                    ></i>
                  </div>
                </Card.Body>

                {/* Expandable Items */}
                <div
                  className={`expandable ${
                    expanded === transaction_id ? "open" : ""
                  }`}
                >
                  <div className="p-3 d-flex flex-column gap-3">
                    {items.map((item, idx) => (
                      <div
                        key={idx}
                        className="d-flex align-items-center border-bottom pb-2"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{
                            width: 50,
                            height: 50,
                            borderRadius: "8px",
                            objectFit: "cover",
                            marginRight: "12px",
                          }}
                        />
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{item.name}</h6>
                          <p className="text-muted small mb-0">{item.merchant}</p>
                          <p className="text-muted small mb-0">
                            {item.qty} × Rp {item.price.toLocaleString("id-ID")}
                          </p>
                        </div>
                        <h6 className="fw-bold mb-0">
                          Rp {(item.qty * item.price).toLocaleString("id-ID")}
                        </h6>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      <style>{`
        .expandable {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s ease, opacity 0.3s ease;
          opacity: 0;
        }
        .expandable.open {
          max-height: 500px;
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default OrderPages;
