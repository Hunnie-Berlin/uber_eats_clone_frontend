import { gql, useQuery } from "@apollo/client";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import PageTitle from "../../components/page-title";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import {
  restaurantQuery,
  restaurantQueryVariables,
} from "../../__generated__/restaurantQuery";

interface IRestaurantParams {
  id: string;
}

const RESTAURANT_QUERY = gql`
  query restaurantQuery($input: RestaurantInput!) {
    restaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

const RestaurantDetail = () => {
  const params = useParams<IRestaurantParams>();
  const { data } = useQuery<restaurantQuery, restaurantQueryVariables>(
    RESTAURANT_QUERY,
    {
      variables: {
        input: {
          restaurantId: +params.id,
        },
      },
    }
  );
  return (
    <div>
      <PageTitle
        title={data?.restaurant.restaurant?.name || "Restaurant Detail"}
      />
      <div
        className="py-48 bg-cover bg-center bg-gray-600"
        style={{
          backgroundImage: `url(${data?.restaurant.restaurant?.coverImg})`,
        }}
      >
        <div className="bg-white w-2/3 lg:w-1/4 py-4 pl-24 ">
          <h4 className="text-4xl font-medium mb-3 text-gray-600">
            {data?.restaurant.restaurant?.name}
          </h4>
          <Link to={`/category/${data?.restaurant.restaurant?.category?.slug}`}>
            <h5 className="text-sm font-light mb-1">
              {data?.restaurant.restaurant?.category?.name.toUpperCase()}
            </h5>
          </Link>
          <div className="flex items-center">
            <FontAwesomeIcon
              icon={faMapMarkerAlt}
              className="text-xs mr-1 text-blue-800"
            />
            <h6 className="text-sm font-light">
              {data?.restaurant.restaurant?.address}
            </h6>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;
