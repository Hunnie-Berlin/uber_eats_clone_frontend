import React, { useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";

interface ICoords {
  lat: number;
  lng: number;
}

interface IDriverProps {
  lat: number;
  lng: number;
  $hover?: any;
}

const Driver: React.FC<IDriverProps> = () => <div className="text-xl">🛵</div>;

const Dashboard = () => {
  const [driverCoords, setDriverCoords] = useState<ICoords>({
    lat: 52.519239728282656,
    lng: 13.401119386507174,
  });
  const [map, setMap] = useState<google.maps.Map>();
  const onSuccess = ({
    coords: { latitude, longitude },
  }: GeolocationPosition) => {
    setDriverCoords({ lat: latitude, lng: longitude });
  };
  const onError = (error: GeolocationPositionError) => {
    console.log(error);
  };
  useEffect(() => {
    navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
    });
  }, []);
  useEffect(() => {
    if (map) {
      map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
      //   const geocoder = new google.maps.Geocoder();
      //   geocoder.geocode(
      //     {
      //       location: new google.maps.LatLng(driverCoords.lat, driverCoords.lng),
      //     },
      //     (results, status) => {
      //       console.log(status, results);
      //     }
      //   );
    }
  }, [driverCoords.lat, driverCoords.lng, map]);
  const onApiLoaded = ({ map, maps }: { map: any; maps: any }) => {
    map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
    setMap(map);
  };
  return (
    <div>
      <div style={{ width: window.innerWidth, height: "45vh" }}>
        <GoogleMapReact
          bootstrapURLKeys={{
            key: "AIzaSyD5HRxHCa2dlHti96X09CP6hziEsFlW6-E",
          }}
          defaultCenter={driverCoords}
          defaultZoom={13}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={onApiLoaded}
        >
          <Driver lat={driverCoords.lat} lng={driverCoords.lng} />
        </GoogleMapReact>
      </div>
    </div>
  );
};

export default Dashboard;
