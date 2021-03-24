import React, { useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";
import PageTitle from "../../components/page-title";
import { useForm } from "react-hook-form";
import { gql, useMutation } from "@apollo/client";
import useMe from "../../hooks/useMe";
import {
  addAddress,
  addAddressVariables,
} from "../../__generated__/addAddress";
import { useHistory } from "react-router";

const ADD_ADDRESS_MUTATION = gql`
  mutation addAddress($input: AddAddressInput!) {
    addAddress(input: $input) {
      ok
      error
    }
  }
`;

interface ICoords {
  lat: number;
  lng: number;
}

interface IHomeProps {
  lat: number;
  lng: number;
  address?: string;
  $hover?: any;
}

const Home: React.FC<IHomeProps> = ({ address }) => (
  <div className="flex items-center">
    <div className="text-xl">🏠</div>
    <div className="text-xs font-medium bg-blue-50 rounded-lg py-4 px-4 w-96 ml-2">
      {address}
    </div>
  </div>
);

const AddAddress = () => {
  const { register, handleSubmit, setValue } = useForm();
  const { data: userData } = useMe();
  const [addAddress] = useMutation<addAddress, addAddressVariables>(
    ADD_ADDRESS_MUTATION
  );
  const [homeCoords, setHomeCoords] = useState<ICoords>({
    lat: 52.51922381031625,
    lng: 13.401119386507174,
  });
  const [map, setMap] = useState<google.maps.Map>();
  const [address, setAddress] = useState<string>();
  const onSuccess = ({
    coords: { latitude, longitude },
  }: GeolocationPosition) => {
    setHomeCoords({ lat: latitude, lng: longitude });
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
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        {
          location: new google.maps.LatLng(homeCoords.lat, homeCoords.lng),
        },
        (results, status) => {
          if (status === "OK") {
            setAddress(results![0].formatted_address);
            setValue("address", address);
          }
        }
      );
    }
  }, [address, homeCoords, map, setValue]);
  const onApiLoaded = ({ map, maps }: { map: any; maps: any }) => {
    map.panTo(new google.maps.LatLng(homeCoords.lat, homeCoords.lng));
    setMap(map);
  };

  const onSubmit = () => {
    if (userData?.me.id) {
      addAddress({
        variables: {
          input: {
            id: userData?.me.id,
            address,
          },
        },
      });
      window.location.reload();
    }
  };
  return (
    <div className="flex flex-col justify-center items-center">
      <PageTitle title="Add Address" />
      <div style={{ width: window.innerWidth, height: "45vh" }}>
        <GoogleMapReact
          bootstrapURLKeys={{
            key: "AIzaSyD5HRxHCa2dlHti96X09CP6hziEsFlW6-E",
          }}
          defaultCenter={homeCoords}
          defaultZoom={19}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={onApiLoaded}
        >
          <Home lat={homeCoords.lat} lng={homeCoords.lng} address={address} />
        </GoogleMapReact>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid max-w-screen-sm gap-6 mt-24 w-full"
      >
        <h1 className="py-2 bg-blue-200 w-full rounded-lg text-2xl text-blue-500 font-light text-center">
          Is it your correct address?
        </h1>
        <input
          ref={register({ required: true })}
          type="text"
          name="address"
          className="input rounded-lg"
        />
        <button className="btn bg-red-400 rounded-lg">Confirm</button>
      </form>
    </div>
  );
};

export default AddAddress;
