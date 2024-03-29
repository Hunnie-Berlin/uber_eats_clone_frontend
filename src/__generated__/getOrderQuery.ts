/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GetOrderInput, OrderStatus } from "./globalTypes";

// ====================================================
// GraphQL query operation: getOrderQuery
// ====================================================

export interface getOrderQuery_getOrder_order_driver {
  __typename: "User";
  email: string;
}

export interface getOrderQuery_getOrder_order_customer {
  __typename: "User";
  email: string;
  address: string | null;
}

export interface getOrderQuery_getOrder_order_restaurant {
  __typename: "Restaurant";
  name: string;
  address: string;
}

export interface getOrderQuery_getOrder_order {
  __typename: "Order";
  id: number;
  status: OrderStatus;
  total: number | null;
  driver: getOrderQuery_getOrder_order_driver | null;
  customer: getOrderQuery_getOrder_order_customer | null;
  restaurant: getOrderQuery_getOrder_order_restaurant | null;
}

export interface getOrderQuery_getOrder {
  __typename: "GetOrderOutput";
  ok: boolean;
  error: string | null;
  order: getOrderQuery_getOrder_order | null;
}

export interface getOrderQuery {
  getOrder: getOrderQuery_getOrder;
}

export interface getOrderQueryVariables {
  input: GetOrderInput;
}
