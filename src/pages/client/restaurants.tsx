import { gql, useQuery, useReactiveVar } from "@apollo/client";
import React from "react";
import { Link } from "react-router-dom";
import { restaurantsPage } from "../../apollo";
import PageTitle from "../../components/page-title";
import Pagination from "../../components/pagination";
import Restaurant from "../../components/restaurant";
import Search from "../../components/search";
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
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
        ...CategoryParts
      }
    }
    restaurants(input: $input) {
      ok
      error
      totalPages
      totalResults
      results {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;

const Restaurants = () => {
  const page = useReactiveVar(restaurantsPage);
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
    restaurantsPage(page + 1);
  };
  const onPreviousPageClick = () => {
    restaurantsPage(page - 1);
  };
  return (
    <div>
      <PageTitle title="Home" />
      <Search />
      {!loading && (
        <div className="max-w-screen-xl mx-auto mt-8 pb-20">
          <div className="flex justify-around">
            {data?.allCategories.categories?.map((category) => (
              <Link key={category.id} to={`/category/${category.slug}`}>
                <div className="flex flex-col items-center group">
                  <div
                    className="w-20 h-20 bg-cover rounded-full group-hover:opacity-70 transition-opacity cursor-pointer"
                    style={{ backgroundImage: `url(${category.coverImg})` }}
                  ></div>
                  <span className="text-sm font-bold mt-2">
                    {category.name.charAt(0).toUpperCase() +
                      category.name.slice(1)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-x-7 gap-y-10 mt-16 mx-5">
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
          <Pagination
            page={page}
            totalPages={data?.restaurants.totalPages || 1}
            onNextPageClick={onNextPageClick}
            onPreviousPageClick={onPreviousPageClick}
          />
        </div>
      )}
    </div>
  );
};

export default Restaurants;
