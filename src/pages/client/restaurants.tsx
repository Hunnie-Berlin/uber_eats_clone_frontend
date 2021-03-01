import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import Restaurant from "../../components/restaurant";
import {
  restaurantsPageQuery,
  restaurantsPageQueryVariables,
} from "../../__generated__/restaurantsPageQuery";

const RESTAURANTS_QUERY = gql`
  query restaurantsPageQuery($input: RestaurantsInput!) {
    allCategories {
      ok
      error
      categories {
        id
        name
        coverImg
        slug
        restaurantCount
      }
    }
    restaurants(input: $input) {
      ok
      error
      totalPages
      totalResults
      results {
        id
        name
        coverImg
        category {
          name
        }
        address
        isPromoted
      }
    }
  }
`;

const Restaurants = () => {
  const [page, setPage] = useState(1);
  const { loading, data } = useQuery<
    restaurantsPageQuery,
    restaurantsPageQueryVariables
  >(RESTAURANTS_QUERY, {
    variables: {
      input: {
        page,
      },
    },
  });
  const onNextPageClick = () => {
    setPage(page + 1);
  };
  const onPreviousPageClick = () => {
    setPage(page - 1);
  };
  return (
    <div>
      <form className="bg-gray-800  w-full py-40 flex items-center justify-center">
        <input
          type="search"
          placeholder="Search Restaurants..."
          className="input rounded-md border-0  w-6/12"
        />
      </form>
      {!loading && (
        <div className="max-w-screen-xl mx-auto mt-8 pb-20">
          <div className="flex justify-around">
            {data?.allCategories.categories?.map((category, index) => (
              <div key={index} className="flex flex-col items-center group">
                <div
                  className="w-20 h-20 bg-cover rounded-full group-hover:opacity-70 transition-opacity cursor-pointer"
                  style={{ backgroundImage: `url(${category.coverImg})` }}
                ></div>
                <span className="text-sm font-bold mt-2">{category.name}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-x-7 gap-y-10 mt-16">
            {data?.restaurants.results?.map((restaurant) => (
              <Restaurant
                id={restaurant.id + ""}
                key={restaurant.id}
                coverImg={restaurant.coverImg}
                name={restaurant.name}
                categoryName={restaurant.category?.name}
              />
            ))}
          </div>
          <div className="grid grid-cols-3 text-center max-w-md mx-auto place-items-center mt-10">
            {page > 1 ? (
              <button
                onClick={onPreviousPageClick}
                className="text-xl font-medium text-gray-100 hover:text-lime-700 transition-colors w-8 h-8 rounded-full bg-lime-500 focus:outline-none"
              >
                &larr;
              </button>
            ) : (
              <div></div>
            )}
            <span className="text-xl font-medium text-lime-600">
              Page {page} of {data?.restaurants.totalPages}
            </span>
            {page !== data?.restaurants.totalPages ? (
              <button
                onClick={onNextPageClick}
                className="text-xl font-medium text-gray-100 hover:text-lime-700 transition-colors w-8 h-8 rounded-full bg-lime-500 focus:outline-none"
              >
                &rarr;
              </button>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Restaurants;
