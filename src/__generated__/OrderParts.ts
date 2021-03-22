/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OrderStatus } from "./globalTypes";

// ====================================================
// GraphQL fragment: OrderParts
// ====================================================

export interface OrderParts_driver {
  __typename: "User";
  email: string;
}

export interface OrderParts_customer {
  __typename: "User";
  email: string;
}

export interface OrderParts_restaurant {
  __typename: "Restaurant";
  name: string;
}

export interface OrderParts {
  __typename: "Order";
  id: number;
  status: OrderStatus;
  total: number | null;
  driver: OrderParts_driver | null;
  customer: OrderParts_customer | null;
  restaurant: OrderParts_restaurant | null;
}
