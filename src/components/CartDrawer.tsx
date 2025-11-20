import { useState, useEffect } from 'react'
import { Link } from "react-router-dom";

interface Cart {
    id: number;
    product_id: string;
    merchant_id: string;
    category_id: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    images: string;
    created_at: string;
    merchant_name: string;
}

interface CartDrawerProps {
  cart: Cart[];
  onDeleteCart: () => void;
}

const CartDrawer = ({ cart, onDeleteCart }: CartDrawerProps) => {

    const [cartState, setCartState] = useState<Cart[]>([]);

    useEffect(() => {
        setCartState(cart);
    }, [cart]);

    function formatRupiah(amount: number): string {
        return amount.toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        });
    }

    const deleteCart = (id: number) => {
        const updatedCart = cart.filter((item) => item.id !== id);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        setCartState(updatedCart);
        onDeleteCart();
    }


  return (

    <div className="offcanvas offcanvas-end w-100 h-100" id="cartDrawer" aria-labelledby="cartDrawerLabel">
        <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="cartDrawerLabel">Keranjang Anda</h5>
            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
            {cartState.length == 0 && (
              <>
              <div className="alert alert-light text-center px-5 mt-3" role="alert">
                <i className="fas fa-exclamation-circle me-2" />
                Keranjang anda masih kosong.
              </div>
              <img src="cart.png" alt="Notifikasi" className="w-50 d-block mx-auto"></img>
              </>
            )}
            {cartState.map((item) => (
              <div className="product-card my-2" key={item.id}>
                <img src={item.images} alt={item.name} />
                <div className="flex-grow-1 ms-2">
                  <div className="fw-bold fs-14">{item.name} x {item.quantity}</div>
                  <div className="text-muted small mt-1">{item.merchant_name}</div>
                  <div
                    className="fw-bold mt-1"
                    style={{ color: "#3a3a3a", fontSize: "16px" }}
                  >
                    {formatRupiah(item.price * item.quantity)}
                  </div>
                </div>
                <i className="fas fa-trash-alt text-danger fs-5 me-2" onClick={() => deleteCart(item.id)}></i>
              </div>
            ))}
            {cartState.length > 0 && (
                <>       
                <div className="card pb-3 px-3 border-0 shadow">
                    <select className="form-select mt-3" aria-label="Metode Pembayaran">
                      <option value="1">Bayar di Tempat</option>
                    </select>
                     <div className="mt-3 pt-1 d-flex justify-content-between">
                        <div className="fw-bold fs-14">Pengiriman</div>
                        <div className="text-muted small">1 - 3 hari</div>
                    </div>
                </div>
                <div className="card border-0 shadow mt-2">
                    <div className="card-body">
                    <div className="d-flex justify-content-between">
                        <div className="fw-bold fs-14">Subtotal</div>
                        <div className="fw-bold fs-14">
                        {formatRupiah(cart.reduce((total, item) => total + item.price * item.quantity, 0))}
                        </div>
                    </div>
                    <div className="d-flex justify-content-between mt-2">
                        <div className="fs-14">Biaya Aplikasi</div>
                        <div className="fw-bold fs-14">{formatRupiah(0)}</div>
                    </div>
                    <div className="d-flex justify-content-between mt-2">
                        <div className="fs-14">Biaya Jasa Kirim</div>
                        <div className="fw-bold fs-14">{formatRupiah(0)}</div>
                    </div>
                    <div className="d-flex justify-content-between mt-3 pt-3 border-top pt-2">
                        <div className="fw-bold">Total</div>
                        <div className="fw-bold">
                        {formatRupiah(cart.reduce((total, item) => total + item.price * item.quantity, 0))}
                        </div>
                    </div>
                    </div>
                </div>
                <Link to="/success" className="btn btn-primary btn-dark w-100 mt-4"><i className="fa-solid fa-cart-arrow-down me-3"></i>Beli Sekarang</Link>
                </>
            )}
        </div>
    </div>
    )
}

export default CartDrawer
