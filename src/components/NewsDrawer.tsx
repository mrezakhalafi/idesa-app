interface Media {
  id: number;
  media_id: string;
  title: string;
  description: string;
  image: string;
  source: string;
  category_id: number;
  type: number;
  created_at: string;
  category_name: string;
}

type NewsDrawerProps = {
  media?: Media;
};

const NewsDrawerMobile = ({ media }: NewsDrawerProps) => {

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
    <div
      className="offcanvas offcanvas-bottom h-100 border-0 mobile-drawer"
      aria-labelledby={`${media?.id}-label`}
      style={{ borderTopLeftRadius: 18, borderTopRightRadius: 18, overflow: "hidden" }}
      id="newsDrawer"
    >

      <div className="position-relative mobile-hero">
        <div
          className="w-100 h-100"
          style={{
            backgroundImage: media?.image
              ? `linear-gradient(to top, rgba(0,0,0,.55), rgba(0,0,0,0)), url(${media.image})`
              : "linear-gradient(135deg, #f8f9fa, #e9ecef)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: media?.image ? "saturate(1.05)" : "none",
          }}
        />

        <button
          type="button"
          className="btn btn-light position-absolute rounded-circle shadow mobile-close"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        >
          <i className="fas fa-times"></i>
        </button>

        <div className="position-absolute bottom-0 w-100 text-white px-3 pb-3">
          <h1 className="mobile-title" id={`${media?.id}-label`}>
            {media?.title ?? "Judul"}
          </h1>
          <div className="d-flex flex-wrap gap-2 align-items-center mobile-meta mt-2">
            {media?.source && <span><i className="far fa-user me-2"></i>{media.source}</span>}
            {media?.created_at && <span>• {formatDate(media.created_at)}</span>}
          </div>
        </div>
      </div>

      <div className="offcanvas-body p-0 d-flex flex-column bg-body">
        <div className="px-3 py-2 border-bottom mobile-tags">
          <div className="d-flex gap-2 overflow-auto no-scrollbar mt-2">
            
              {media?.category_id && (
                <span key={media.category_id} className="news-category px-3">
                 {media.category_name}
                </span>
              )}
          </div>
        </div>

        <div className="px-3 py-3 overflow-auto mobile-content">
          {media?.description && (
            <div className="mobile-text">
              {media.description}
              <div className="source-text mt-3 fw-bold">Sumber : {media.source}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NewsDrawerMobile