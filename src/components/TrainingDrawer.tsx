import { useRef } from 'react'

interface Training {
  id: number;
  training_id: string; 
  title: string;
  description: string;
  location: string;
  date: string;
  category_id: number;
  created_at: string;
  participants: number;
  institution: string;
}
interface TrainingDrawerProps {
  training?: Training
}
const TrainingDrawer = ({ training }: TrainingDrawerProps) => {

  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  function formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString)
      .toLocaleString("id-ID", options)
      .replace("pukul", "-");
  }

  return (
    <div className="offcanvas offcanvas-bottom drawer" id="trainingDrawer" style={{ height: "100%" }} aria-labelledby="trainingDrawerLabel">
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="trainingDrawerLabel">{training?.title}</h5>
        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" ref={closeBtnRef}></button>
      </div>
      <div className="offcanvas-body p-4">
        <div className="card shadow rounded-3 mb-3">
          <div className="card-body">
            <h6 className="mb-2">Deskripsi Pelatihan</h6>
            <p className="mb-0 mt-3 small">
              {training?.description}
            </p>
          </div>
        </div>
        {training?.institution !== "" && (
          <div className="card shadow rounded-3 mb-3">
            <div className="card-body">
              <h6 className="mb-2">Institusi</h6>
              <p className="mb-0 mt-3">
                <i className="fa-solid fa-university me-3 text-orange" />
                {training?.institution}
              </p>
            </div>
          </div>
        )}
        <div className="card shadow rounded-3 mb-3">
          <div className="card-body">
            <h6 className="mb-2">Waktu Pelatihan</h6>
            <p className="mb-0 mt-3">
              <i className="fa-solid fa-calendar me-3 text-orange" />
              {training?.date ? formatDate(training?.date) : "-"}
            </p>
          </div>
        </div>
        <div className="card shadow rounded-3 mb-3">
          <div className="card-body">
            <h6 className="mb-2">Lokasi Pelatihan</h6>
            <p className="mb-0 mt-3">
              <i className="fa-solid fa-location-dot me-3 text-orange" />
              {training?.location}
            </p>
          </div>
        </div>
        <div className="card shadow rounded-3 mb-3">
          <div className="card-body">
            <h6 className="mb-2">Jumlah Peserta</h6>
            <p className="mb-0 mt-3">
              <i className="fa-solid fa-users me-3 text-orange" />
              {training?.participants}
            </p>
          </div>
        </div>
      </div>
    </div>
    )
}

export default TrainingDrawer

