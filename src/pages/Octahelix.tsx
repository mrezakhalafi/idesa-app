interface CollaborationItemProps {
  icon: string;
  title: string;
  color: string;
}

const CollaborationItem = ({ icon, title, color }: CollaborationItemProps) => {
  return (
    <div
      className="d-flex flex-column align-items-center"
      style={{ position: "absolute", transform: "translate(-50%, -50%)" }}
    >
      <div
        className={`${color} rounded-circle d-flex align-items-center justify-content-center mb-1`}
        style={{ width: "36px", height: "36px" }}
      >
        <i
          className={`fas fa-${icon} text-white`}
          style={{ fontSize: "0.9rem" }}
        ></i>
      </div>
      <div
        className="text-dark text-center"
        style={{ fontSize: "0.72rem", whiteSpace: "nowrap", marginTop: "2px" }}
      >
        {title}
      </div>
    </div>
  );
};

// ====== MAIN OCTAGON COMPONENT ======
const OctagonCollaboration = () => {
  const size = 260;
  const center = size / 2;
  const radius = 80;
  const sides = 8;
  const angleStep = (2 * Math.PI) / sides;

  const items: CollaborationItemProps[] = [
    { icon: "hands-helping", title: "LSM", color: "bg-info" },
    { icon: "users", title: "Komunitas", color: "bg-secondary" },
    { icon: "graduation-cap", title: "Akademisi", color: "bg-danger" },
    { icon: "briefcase", title: "Dunia Usaha", color: "bg-success" },
    { icon: "microchip", title: "Teknologi", color: "bg-dark" },
    { icon: "newspaper", title: "Media", color: "bg-warning" },
    { icon: "landmark", title: "Pemerintah", color: "bg-pemerintah" },
    { icon: "people-arrows", title: "Masyarakat", color: "bg-masyarakat" },
  ];

  // Generate titik-titik oktagon
  const points = Array.from({ length: sides }, (_, i) => {
    const angle = angleStep * i - Math.PI / 8; // rotasi biar rata atas
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return `${x},${y}`;
  }).join(" ");

  return (
    <div
      className="position-relative d-flex justify-content-center align-items-center"
      style={{ width: size, height: size, margin: "auto" }}
    >
      <svg width={size} height={size} style={{ position: "absolute" }}>
        {/* Octagon */}
        <polygon points={points} fill="none" stroke="#1e2432" strokeWidth="2" />
      </svg>

      {/* Label tiap sudut */}
      {Array.from({ length: sides }, (_, i) => {
        const angle = angleStep * i - Math.PI / 8;
        const labelRadius = radius + 40; // jarak label dari garis
        const x = center + labelRadius * Math.cos(angle);
        const y = center + labelRadius * Math.sin(angle);

        const item = items[i];
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y }}>
            <CollaborationItem {...item} />
          </div>
        );
      })}
    </div>
  );
};

export default OctagonCollaboration;
