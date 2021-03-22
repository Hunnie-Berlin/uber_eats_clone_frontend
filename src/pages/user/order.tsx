import { gql, useQuery, useSubscription } from "@apollo/client";
import React, { useEffect } from "react";
import { useParams } from "react-router";
import PageTitle from "../../components/page-title";
import { ORDER_FRAGEMENT } from "../../fragments";
import {
  getOrderQuery,
  getOrderQueryVariables,
} from "../../__generated__/getOrderQuery";
import {
  orderUpdates,
  orderUpdatesVariables,
} from "../../__generated__/orderUpdates";

const GET_ORDER_QUERY = gql`
  query getOrderQuery($input: GetOrderInput!) {
    getOrder(input: $input) {
      ok
      error
      order {
        ...OrderParts
      }
    }
  }
  ${ORDER_FRAGEMENT}
`;

const ORDER_SUBSCRIPTION = gql`
  subscription orderUpdates($input: OrderUpdatesInput!) {
    orderUpdates(input: $input) {
      ...OrderParts
    }
  }
  ${ORDER_FRAGEMENT}
`;

interface IParams {
  id: string;
}

const Order = () => {
  const { id } = useParams<IParams>();
  const { data, subscribeToMore } = useQuery<
    getOrderQuery,
    getOrderQueryVariables
  >(GET_ORDER_QUERY, { variables: { input: { id: +id } } });

  useEffect(() => {
    if (data?.getOrder.ok) {
      subscribeToMore({
        document: ORDER_SUBSCRIPTION,
        variables: { input: { id: +id } },
        updateQuery: (
          prev,
          {
            subscriptionData: { data },
          }: { subscriptionData: { data: orderUpdates } }
        ) => {
          if (!data) {
            return prev;
          }
          return {
            getOrder: {
              ...prev.getOrder,
              order: {
                ...data.orderUpdates,
              },
            },
          };
        },
      });
    }
  }, [data, id, subscribeToMore]);

  return (
    <div className="mt-32 container flex justify-center">
      <PageTitle title={`Order #${id}` || "Order"} />
      <div className="border bg-blue-100 w-full max-w-screen-sm flex flex-col justify-center rounded-xl">
        <h4 className="bg-blue-400 w-full py-5 text-white text-center text-xl rounded-t-xl">
          Order #{id}
        </h4>
        <h5 className="p-5 pt-10 text-3xl text-center font-extralight ">
          ${data?.getOrder.order?.total}
        </h5>
        <div className="p-5 text-xl grid gap-6">
          <div className="border-t pt-5 border-blue-200">
            Prepared By:{" "}
            <span className="font-light">
              {data?.getOrder.order?.restaurant?.name}
            </span>
          </div>
          <div className="border-t pt-5 border-blue-200 ">
            Deliver To:{" "}
            <span className="font-light">
              {data?.getOrder.order?.customer?.email}
            </span>
          </div>
          <div className="border-t border-b py-5 border-blue-200">
            Driver:{" "}
            <span className="font-light">
              {data?.getOrder.order?.driver?.email || "Not yet."}
            </span>
          </div>
          <span className=" text-center mt-5 mb-3  text-2xl text-blue-400">
            Status: {data?.getOrder.order?.status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Order;
