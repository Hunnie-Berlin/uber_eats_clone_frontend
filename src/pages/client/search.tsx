import { gql, useLazyQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useHistory, useLocation } from "react-router";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import {
  searchQuery,
  searchQueryVariables,
} from "../../__generated__/searchQuery";

const SEARCH_RESTAURANT = gql`
  query searchQuery($input: SearchRestaurantInput!) {
    searchRestaurant(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

const Search = () => {
  const location = useLocation();
  const history = useHistory();
  const [startToSearch, { data, loading, called }] = useLazyQuery<
    searchQuery,
    searchQueryVariables
  >(SEARCH_RESTAURANT);
  useEffect(() => {
    const query = location.search.split("?term=")[1];
    if (!query) {
      return history.replace("/");
    }
    startToSearch({
      variables: {
        input: {
          query,
          page: 1,
        },
      },
    });
  }, [history, location.search, startToSearch]);
  console.log(loading, data, called);
  return (
    <div>
      <Helmet>
        <title> Search | Uber Eats Clone</title>
      </Helmet>
      Search
    </div>
  );
};

export default Search;
