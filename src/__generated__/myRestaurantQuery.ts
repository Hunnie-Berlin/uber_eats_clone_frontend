/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { MyRestaurantInput, OrderStatus } from "./globalTypes";

// ====================================================
// GraphQL query operation: myRestaurantQuery
// ====================================================

export interface myRestaurantQuery_myRestaurant_restaurant_category {
  __typename: "Category";
  name: string;
  slug: string;
}

export interface myRestaurantQuery_myRestaurant_restaurant_menu_options_choices {
  __typename: "DishChoice";
  name: string;
  extraCharge: number | null;
}

export interface myRestaurantQuery_myRestaurant_restaurant_menu_options {
  __typename: "DishOption";
  name: string;
  extraCharge: number | null;
  choices: myRestaurantQuery_myRestaurant_restaurant_menu_options_choices[] | null;
}

export interface myRestaurantQuery_myRestaurant_restaurant_menu {
  __typename: "Dish";
  id: number;
  name: string;
  price: number;
  photo: string | null;
  description: string;
  options: myRestaurantQuery_myRestaurant_restaurant_menu_options[] | null;
}

export interface myRestaurantQuery_myRestaurant_restaurant_orders {
  __typename: "Order";
  id: number;
  createdAt: any;
  total: number | null;
  status: OrderStatus;
}

export interface myRestaurantQuery_myRestaurant_restaurant {
  __typename: "Restaurant";
  id: number;
  name: string;
  coverImg: string;
  category: myRestaurantQuery_myRestaurant_restaurant_category | null;
  address: string;
  isPromoted: boolean;
  menu: myRestaurantQuery_myRestaurant_restaurant_menu[];
  orders: myRestaurantQuery_myRestaurant_restaurant_orders[];
}

export interface myRestaurantQuery_myRestaurant {
  __typename: "MyRestaurantOutput";
  ok: boolean;
  error: string | null;
  restaurant: myRestaurantQuery_myRestaurant_restaurant;
}

export interface myRestaurantQuery {
  myRestaurant: myRestaurantQuery_myRestaurant;
}

export interface myRestaurantQueryVariables {
  input: MyRestaurantInput;
}
