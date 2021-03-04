/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SearchRestaurantInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: searchQuery
// ====================================================

export interface searchQuery_searchRestaurant_restaurants_category {
  __typename: "Category";
  name: string;
  slug: string;
}

export interface searchQuery_searchRestaurant_restaurants {
  __typename: "Restaurant";
  id: number;
  name: string;
  coverImg: string;
  category: searchQuery_searchRestaurant_restaurants_category | null;
  address: string;
  isPromoted: boolean;
}

export interface searchQuery_searchRestaurant {
  __typename: "SearchRestaurantOutput";
  ok: boolean;
  error: string | null;
  totalPages: number | null;
  totalResults: number | null;
  restaurants: searchQuery_searchRestaurant_restaurants[] | null;
}

export interface searchQuery {
  searchRestaurant: searchQuery_searchRestaurant;
}

export interface searchQueryVariables {
  input: SearchRestaurantInput;
}
