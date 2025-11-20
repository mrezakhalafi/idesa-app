import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const Waiting = () => {

    const [showWaiting, setShowWaiting] = useState(false);

    useEffect(() => {
        setTimeout(() => setShowWaiting(true), 500);
    }, [])

    return (
    <div className="main-container d-flex justify-content-center align-items-center" style={{ height: '100vh', backgroundColor: '#f7f7f7' }}>
        <div className="text-white text-center">
            <img src="waiting.gif" className="w-25"></img>
            <div className="waiting-lat mx-3" style={{ opacity: showWaiting ? 1 : 0, transition: 'opacity 1s ease-in-out' }}>
                <h1 className="mt-5" style={{ color: '#ff9307'  }}>Pengajuan Form Berhasil</h1>
                <p className="mt-3 text-dark my-5 mx-4">Harap menunggu 1 x 24 jam untuk menunggu pihak desa melakukan verifikasi.</p>
                <Link to="/" replace className="btn btn-warning mt-3 text-light fw-bold rounded-5 px-4 py-2" style={{ backgroundColor: '#ff9307' }}>
                    Kembali
                </Link>
            </div>
        </div>
    </div>
    )
}

export default Waiting

