import React, { useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";
import { ORDER_FRAGEMENT } from "../../fragments";
import { gql, useMutation, useSubscription } from "@apollo/client";
import { cookedOrders } from "../../__generated__/cookedOrders";
import { useHistory } from "react-router-dom";
import {
  takeOrderMutation,
  takeOrderMutationVariables,
} from "../../__generated__/takeOrderMutation";

const COOKED_ORDERS_SUBSCRIPTION = gql`
  subscription cookedOrders {
    cookedOrders {
      ...OrderParts
    }
  }
  ${ORDER_FRAGEMENT}
`;

const TAKE_ORDER_MUTATION = gql`
  mutation takeOrderMutation($input: TakeOrderInput!) {
    takeOrder(input: $input) {
      ok
      error
    }
  }
`;

interface ICoords {
  lat: number;
  lng: number;
}

interface IProps {
  lat: number;
  lng: number;
  $hover?: any;
}

const DriverMarker: React.FC<IProps> = () => <div className="text-xl">🛵</div>;
const CustomerMarker: React.FC<IProps> = () => (
  <div className="text-xl">🏠</div>
);
const RestaurantMarker: React.FC<IProps> = () => (
  <div className="text-xl">🌮</div>
);

const Dashboard = () => {
  const [driverCoords, setDriverCoords] = useState<ICoords>({
    lat: 52.519239728282656,
    lng: 13.401119386507174,
  });

  const [restaurantCoords, setRestaurantCoords] = useState<ICoords>({
    lat: 52.519239728282656,
    lng: 13.401119386507174,
  });

  const [customerCoords, setCustomerCoords] = useState<ICoords>({
    lat: 52.519239728282656,
    lng: 13.401119386507174,
  });

  const [isCoords, setIsCoords] = useState<boolean>(false);

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
    }
  }, [driverCoords.lat, driverCoords.lng, map]);

  const onApiLoaded = ({ map, maps }: { map: any; maps: any }) => {
    map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
    setMap(map);
  };

  const { data: cookedOrdersData } = useSubscription<cookedOrders>(
    COOKED_ORDERS_SUBSCRIPTION
  );

  const setCoords = () => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode(
      { address: cookedOrdersData?.cookedOrders.restaurant?.address },
      async (results, status) => {
        if (status === "OK") {
          setRestaurantCoords({
            lat: await results![0].geometry.location.lat(),
            lng: await results![0].geometry.location.lng(),
          });
        }
      }
    );
    geocoder.geocode(
      { address: cookedOrdersData?.cookedOrders.customer?.address },
      async (results, status) => {
        if (status === "OK") {
          setCustomerCoords({
            lat: await results![0].geometry.location.lat(),
            lng: await results![0].geometry.location.lng(),
          });
        }
      }
    );
    setIsCoords(true);
  };

  const makeRoute = () => {
    console.log(customerCoords, restaurantCoords, driverCoords);
    if (map) {
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer();
      directionsRenderer.setMap(map);
      directionsService.route(
        {
          origin: {
            location: new google.maps.LatLng(
              restaurantCoords.lat,
              restaurantCoords.lng
            ),
          },
          destination: {
            location: new google.maps.LatLng(
              customerCoords.lat,
              customerCoords.lng
            ),
          },
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          directionsRenderer.setDirections(result);
        }
      );
    }
  };

  useEffect(() => {
    if (cookedOrdersData?.cookedOrders.id) {
      setCoords();
    }
  }, [cookedOrdersData]);

  useEffect(() => {
    if (cookedOrdersData?.cookedOrders.id && isCoords) {
      makeRoute();
    }
  }, [customerCoords]);

  const history = useHistory();

  const onCompleted = (data: takeOrderMutation) => {
    if (data.takeOrder.ok) {
      history.push(`/orders/${cookedOrdersData?.cookedOrders.id}`);
    }
  };

  const [takeOrder] = useMutation<
    takeOrderMutation,
    takeOrderMutationVariables
  >(TAKE_ORDER_MUTATION, { onCompleted });

  const onAcceptButtonClick = (orderId: number) => {
    takeOrder({
      variables: {
        input: {
          id: orderId,
        },
      },
    });
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
          <DriverMarker lat={driverCoords.lat} lng={driverCoords.lng} />
          {isCoords && (
            <RestaurantMarker
              lat={restaurantCoords.lat}
              lng={restaurantCoords.lng}
            />
          )}
          {isCoords && (
            <CustomerMarker lat={customerCoords.lat} lng={customerCoords.lng} />
          )}
        </GoogleMapReact>
      </div>
      <div className="max-w-screen-sm mx-auto bg-white relative -top-10 shadow-lg py-8 px-5">
        {cookedOrdersData?.cookedOrders ? (
          <>
            <h1 className="text-2xl font-medium text-center text-red-800">
              New Cooked Order Arrived
            </h1>
            <h4 className="mt-3 text-gray-500 font-light ">
              Restaurant: {cookedOrdersData?.cookedOrders.restaurant?.name} (
              {cookedOrdersData.cookedOrders.restaurant?.address})
            </h4>
            <h4 className="mt-3 text-gray-500 font-light ">
              Customer: {cookedOrdersData?.cookedOrders.customer?.address}
            </h4>
            <div
              className="btn bg-red-400 mt-5 w-full rounded-lg text-center cursor-pointer"
              onClick={() =>
                onAcceptButtonClick(cookedOrdersData?.cookedOrders.id)
              }
            >
              Accept this order.
            </div>
            <div
              className="btn bg-gray-400 mt-5 w-full rounded-lg text-center cursor-pointer"
              onClick={() => window.location.reload()}
            >
              Skip this order
            </div>
          </>
        ) : (
          <div className="text-2xl text-center text-lime-700 font-medium tracking-wide">
            No new orders yet 😅
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
