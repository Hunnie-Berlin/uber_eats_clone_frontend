/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RestaurantInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: restaurantQuery
// ====================================================

export interface restaurantQuery_restaurant_restaurant_category {
  __typename: "Category";
  name: string;
  slug: string;
}

export interface restaurantQuery_restaurant_restaurant_menu_options_choices {
  __typename: "DishChoice";
  name: string;
  extraCharge: number | null;
}

export interface restaurantQuery_restaurant_restaurant_menu_options {
  __typename: "DishOption";
  name: string;
  extraCharge: number | null;
  choices: restaurantQuery_restaurant_restaurant_menu_options_choices[] | null;
}

export interface restaurantQuery_restaurant_restaurant_menu {
  __typename: "Dish";
  id: number;
  name: string;
  price: number;
  photo: string | null;
  description: string;
  options: restaurantQuery_restaurant_restaurant_menu_options[] | null;
}

export interface restaurantQuery_restaurant_restaurant {
  __typename: "Restaurant";
  id: number;
  name: string;
  coverImg: string;
  category: restaurantQuery_restaurant_restaurant_category | null;
  address: string;
  isPromoted: boolean;
  menu: restaurantQuery_restaurant_restaurant_menu[];
}

export interface restaurantQuery_restaurant {
  __typename: "RestaurantOutput";
  ok: boolean;
  error: string | null;
  restaurant: restaurantQuery_restaurant_restaurant | null;
}

export interface restaurantQuery {
  restaurant: restaurantQuery_restaurant;
}

export interface restaurantQueryVariables {
  input: RestaurantInput;
}
