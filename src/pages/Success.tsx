import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const Success = () => {

    const [showSuccess, setShowSuccess] = useState(false);

    const transaction = () => {
        axios.post(`${import.meta.env.VITE_API_URL}/transaction`, {
            cart: JSON.parse(localStorage.getItem('cart') || '[]'),
            f_pin: JSON.parse(localStorage.getItem("loginData") || "{}").f_pin,
        })
        .then((res) => {
            console.log(res.data);
        })
        .catch((err) => {
            console.error(err);
        })
    }

    useEffect(() => {
        transaction();
        localStorage.removeItem('cart');
        setTimeout(() => setShowSuccess(true), 2000);
    }, [])

    return (
    <div className="main-container d-flex justify-content-center align-items-center" style={{ height: '100vh', backgroundColor: '#f7f7f7' }}>
        <div className="text-white text-center">
            <img src="success.gif" className="w-100"></img>
            <div className="success-late" style={{ opacity: showSuccess ? 1 : 0, transition: 'opacity 1s ease-in-out' }}>
                <h1 className="mt-3 text-success">Transaksi Berhasil</h1>
                <p className="mt-3 text-dark my-5 mx-5">Terima kasih telah melakukan transaksi di Aplikasi iDesa.</p>
                <Link to="/" replace className="btn btn-success mt-3 text-light fw-bold rounded-5 px-4 py-2">
                    Kembali
                </Link>
            </div>
        </div>
    </div>
    )
}

export default Success

