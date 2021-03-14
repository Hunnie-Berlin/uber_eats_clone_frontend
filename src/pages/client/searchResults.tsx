import { gql, useLazyQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";
import PageTitle from "../../components/page-title";
import Pagination from "../../components/pagination";
import Restaurant from "../../components/restaurant";
import Search from "../../components/search";
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

const SearchResults = () => {
  const [page, setPage] = useState(1);
  const location = useLocation();
  const history = useHistory();
  const [startToSearch, { data, loading }] = useLazyQuery<
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
  const onNextPageClick = () => {
    setPage(page + 1);
  };
  const onPreviousPageClick = () => {
    setPage(page - 1);
  };
  return (
    <div>
      <PageTitle title="Search" />
      <Search />
      {!loading && data?.searchRestaurant.restaurants && (
        <div className="max-w-screen-xl mx-auto mt-8 pb-20">
          <div className="flex justify-center items-center py-5 mx-5 bg-lime-500 rounded-full text-white text-xl font-medium tracking-wide">
            {`We found ${data.searchRestaurant.totalResults} ${
              data.searchRestaurant.totalResults === 1 ? "Result" : "Results"
            }`}
          </div>
          <div className="grid md:grid-cols-3 gap-x-7 gap-y-10 mt-16 mx-5">
            {data?.searchRestaurant.restaurants.map((restaurant) => (
              <Restaurant
                id={restaurant.id + ""}
                key={restaurant.id}
                coverImg={restaurant.coverImg}
                name={restaurant.name}
                categoryName={restaurant.category?.name}
              />
            ))}
          </div>
          {data?.searchRestaurant.totalPages ? (
            <Pagination
              page={page}
              totalPages={data?.searchRestaurant.totalPages || 1}
              onNextPageClick={onNextPageClick}
              onPreviousPageClick={onPreviousPageClick}
            />
          ) : (
            <div
              className="py-28 mx-5 bg-repeat-round bg-contain bg-center"
              style={{
                backgroundImage: `url(https://i.pinimg.com/736x/21/a4/3e/21a43e4f2635228f5daa6e8382595b1a.jpg)`,
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
