import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { useParams } from "react-router";
import { Helmet } from "react-helmet-async";
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import {
  categoryQuery,
  categoryQueryVariables,
} from "../../__generated__/categoryQuery";
import Search from "../../components/search";
import Restaurant from "../../components/restaurant";
import Pagination from "../../components/pagination";
import GoBackBtn from "../../components/go-back-button";

const CATEGORY_QUERY = gql`
  query categoryQuery($input: CategoryInput!) {
    category(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
      category {
        ...CategoryParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;

interface ICategoryParams {
  slug: string;
}

const Category = () => {
  const [page, setPage] = useState(1);
  const params = useParams<ICategoryParams>();
  const { loading, data } = useQuery<categoryQuery, categoryQueryVariables>(
    CATEGORY_QUERY,
    {
      variables: {
        input: {
          page,
          slug: params.slug,
        },
      },
    }
  );
  const onNextPageClick = () => {
    setPage(page + 1);
  };
  const onPreviousPageClick = () => {
    setPage(page - 1);
  };
  return (
    <div>
      <Helmet>
        <title>
          {params.slug.charAt(0).toUpperCase() + params.slug.slice(1)} | Uber
          Eats Clone
        </title>
      </Helmet>
      <Search />
      {!loading && data?.category.restaurants && (
        <div className="max-w-screen-xl mx-auto mt-8 pb-20">
          <div className="flex justify-center items-center py-5 mx-5 bg-lime-500 rounded-full text-white text-xl font-medium tracking-wide">
            {`We found ${data.category.totalResults} ${
              params.slug.charAt(0).toUpperCase() + params.slug.slice(1)
            } ${
              data.category.totalResults === 1 ? "Restaurant" : "Restaurants"
            }`}
          </div>
          <div className="grid md:grid-cols-3 gap-x-7 gap-y-10 mt-16 mx-5">
            {data?.category.restaurants.map((restaurant) => (
              <Restaurant
                id={restaurant.id + ""}
                key={restaurant.id}
                coverImg={restaurant.coverImg}
                name={restaurant.name}
                categoryName={restaurant.category?.name}
              />
            ))}
          </div>
          <GoBackBtn />
          <Pagination
            page={page}
            totalPages={data?.category.totalPages || 1}
            onNextPageClick={onNextPageClick}
            onPreviousPageClick={onPreviousPageClick}
          />
        </div>
      )}
    </div>
  );
};

export default Category;
