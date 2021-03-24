/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AddAddressInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: addAddress
// ====================================================

export interface addAddress_addAddress {
  __typename: "AddAddressOutput";
  ok: boolean;
  error: string | null;
}

export interface addAddress {
  addAddress: addAddress_addAddress;
}

export interface addAddressVariables {
  input: AddAddressInput;
}
