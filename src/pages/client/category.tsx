import { gql, useQuery } from "@apollo/client";
import React from "react";
import { useParams } from "react-router";
import { Helmet } from "react-helmet-async";
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import {
  categoryQuery,
  categoryQueryVariables,
} from "../../__generated__/categoryQuery";

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
  const params = useParams<ICategoryParams>();
  const { loading, data } = useQuery<categoryQuery, categoryQueryVariables>(
    CATEGORY_QUERY,
    {
      variables: {
        input: {
          page: 1,
          slug: params.slug,
        },
      },
    }
  );
  return (
    <div>
      <Helmet>
        <title> Food | Uber Eats Clone</title>
      </Helmet>
      <div className="bg-gray-800  w-full py-40 flex items-center justify-center" style={{backgroundImage: `url(${})`}}></div>
    </div>
  );
};

export default Category;
