import { useState, useEffect, useRef } from 'react'
import axios from "axios";

interface ProductData {
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

interface ProductDrawerProps {
    product_id: string;
    onAddToCart: (quantity: number) => void;
}

const ProductDrawer = ({ product_id, onAddToCart }: ProductDrawerProps) => {

    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState<ProductData>();
    const [price, setPrice] = useState(0);
    const closeBtnRef = useRef<HTMLButtonElement | null>(null);

    const handleIncrement = () => {
        setQuantity(quantity + 1);
        setPrice(product?.price?? 0 * quantity);
    }

    const handleDecrement = () => {
        if (quantity > 1){
            setQuantity(quantity - 1);
            setPrice(product?.price?? 0 * quantity);
        }
    }

    function formatRupiah(amount: number): string {
        return amount.toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        });
    }

    const fetchDetailProduct = () => {
        axios
        .get<ProductData>(`${import.meta.env.VITE_API_URL}/product/detail`, {
            params: {
                product_id: product_id
            }
        }) 
        .then((response) => {

            const cartString = localStorage.getItem('cart');
            const localProduct = cartString ? JSON.parse(cartString).find((item: ProductData) => item.id === response.data.id) : null;
            
            if (localProduct) {
                setProduct(localProduct); 
                setPrice(Number(localProduct.price));
                setQuantity(localProduct.quantity);
            } else {
                setProduct(response.data); 
                setPrice(Number(response.data.price));
                setQuantity(1);
                localStorage.setItem(`cart-${product_id}`, JSON.stringify({...response.data, quantity: 1}));
            }
        })
        .catch((error) => {
            console.error("There was an error fetching the forum data.", error);
        });
    };

    useEffect(() => {

        if (!product_id) return;
        fetchDetailProduct(); 

    }, [product_id, onAddToCart]);


    const addToCart = () => {
        onAddToCart(quantity);
        setQuantity(1);
        setPrice(product?.price ?? 0);
        closeBtnRef.current?.click();
    }

    return (
        <div className={`offcanvas offcanvas-bottom h-100 drawer`} id="productDrawer" aria-labelledby="productDrawerLabel">
        <div className="offcanvas-header">
            <h5 className="offcanvas-title ms-3 fw-bold" id="productDrawerLabel">{product?.name}</h5>
            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" ref={closeBtnRef}></button>
        </div>
        <div className="offcanvas-body">
            <div className="container-fluid">
            <div className="row">
                <div className="col-12">
                <img src={product?.images} className="img-fluid rounded-3 product-image" alt="Product Image" />
                </div>
                <div className="col-12">
                <div className="mt-4 mb-2">{product?.description}</div>
                <small className="text-muted">{product?.merchant_name}</small>
                <h5 className="text-orange mt-3 mb-3 pb-1 fw-bold">{formatRupiah(price * quantity)}</h5>
                <hr/>
                <div className="row">
                    <div className="col-5 pt-3">
                        <h6 className="mb-3">Jumlah</h6>
                    </div>
                    <div className="col-7 d-flex justify-content-end align-items-center">
                        <button className={`btn ${quantity === 1 ? "btn-secondary rounded-4" : "btn-dark"} px-3 py-1 me-2 fw-bold`} onClick={handleDecrement}>-</button>
                        <input type="number" className="input-quantity form-control-sm w-25 text-center" value={quantity} min="1" readOnly style={{ height: 35 }} onChange={(e) => setQuantity(Number(e.target.value))}/>
                        <button className="btn btn-dark btn-success px-3 py-1 ms-2 fw-bold" onClick={handleIncrement}>+</button>
                    </div>
                </div>
                <button className="btn btn-dark w-100 mt-4 mb-3 py-2" onClick={addToCart}><i className="fa-solid fa-sm fa-cart-shopping me-3"></i>Tambahkan Keranjang</button>
                </div>
            </div>
            </div>
        </div>
    </div>
  )
}

export default ProductDrawer

