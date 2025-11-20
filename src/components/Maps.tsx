import { useEffect, useRef } from "react";

declare global {
  interface Window {
    google: any;
  }
}

const Maps = ({ currentLocation }: { currentLocation: string }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerRef = useRef<any>(null);

  const [lat, lng] = currentLocation.split(",").map(Number);
  const coords = { lat, lng };

  useEffect(() => {
    if (mapRef.current && window.google) {
      if (!mapInstance.current) {

        mapInstance.current = new window.google.maps.Map(mapRef.current, {
          center: coords,
          zoom: 15,
        });

        markerRef.current = new window.google.maps.Marker({
          position: coords,
          map: mapInstance.current,
        });
      } else {

        markerRef.current.setPosition(coords);
        mapInstance.current.setCenter(coords);
      }
    }
  }, [currentLocation]);

  return <div ref={mapRef} style={{ width: "100%", height: "405px" }} />;
};

export default Maps;
