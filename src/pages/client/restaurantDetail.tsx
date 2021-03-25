import { gql, useMutation, useQuery } from "@apollo/client";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useHistory, useParams } from "react-router";
import { Link } from "react-router-dom";
import Dish from "../../components/dish";
import PageTitle from "../../components/page-title";
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import {
  restaurantQuery,
  restaurantQueryVariables,
} from "../../__generated__/restaurantQuery";
import { CreateOrderItemInput } from "../../__generated__/globalTypes";
import {
  createOrderMutation,
  createOrderMutationVariables,
} from "../../__generated__/createOrderMutation";

interface IRestaurantParams {
  id: string;
}

const RESTAURANT_QUERY = gql`
  query restaurantQuery($input: RestaurantInput!) {
    restaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
        menu {
          ...DishParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
`;

const CREATE_ORDER_MUTATION = gql`
  mutation createOrderMutation($input: CreateOrderInput!) {
    createOrder(input: $input) {
      ok
      error
      orderId
    }
  }
`;

const RestaurantDetail = () => {
  const params = useParams<IRestaurantParams>();
  const history = useHistory();
  const { data } = useQuery<restaurantQuery, restaurantQueryVariables>(
    RESTAURANT_QUERY,
    {
      variables: {
        input: {
          restaurantId: +params.id,
        },
      },
    }
  );
  const [canOrder, setCanOrder] = useState(true);
  const [orderItems, setOrderItems] = useState<CreateOrderItemInput[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const onCompleted = (data: createOrderMutation) => {
    const {
      createOrder: { orderId, ok },
    } = data;
    if (ok) {
      alert("Order Completed :-)");
      history.push(`/orders/${orderId}`);
    }
  };
  const [createOrder, { loading: placingOrder }] = useMutation<
    createOrderMutation,
    createOrderMutationVariables
  >(CREATE_ORDER_MUTATION, { onCompleted });
  const goToCheckout = () => {
    if (
      orderItems.length !== 0 &&
      window.confirm("Are you sure to order?") &&
      !placingOrder
    ) {
      setCanOrder(false);
      createOrder({
        variables: {
          input: {
            restaurantId: +params.id,
            items: orderItems,
          },
        },
      });
    }
  };

  const addPrice = (item: CreateOrderItemInput) => {
    data?.restaurant.restaurant?.menu.forEach((dish) => {
      if (dish.id === item.dishId) {
        setTotalPrice((current) => +(current + dish.price).toFixed(2));
        item.options?.forEach((itemOption) => {
          dish.options?.forEach((dishOption) => {
            if (dishOption.name === itemOption.name) {
              setTotalPrice(
                (current) =>
                  current + +(dishOption.extraCharge?.toFixed(2) || 0)
              );
            }
          });
        });
      }
    });
  };

  const removePrice = (dishId: number) => {
    orderItems.forEach((item) => {
      if (item.dishId === dishId) {
        data?.restaurant.restaurant?.menu.forEach((dish) => {
          if (dish.id === dishId) {
            setTotalPrice((current) => +(current - dish.price).toFixed(2));
            item.options?.forEach((itemOption) => {
              dish.options?.forEach((dishOption) => {
                if (dishOption.name === itemOption.name) {
                  setTotalPrice(
                    (current) =>
                      current - +(dishOption.extraCharge?.toFixed(2) || 0)
                  );
                }
              });
            });
          }
        });
      }
    });
  };

  const addItemToOrder = (item: CreateOrderItemInput) => {
    setOrderItems((current) => [...current, item]);
    addPrice(item);
  };
  const removeItem = (dishId: number) => {
    removePrice(dishId);
    setOrderItems((current) =>
      current.filter((item) => dishId !== item.dishId)
    );
  };
  return (
    <div>
      <PageTitle
        title={data?.restaurant.restaurant?.name || "Restaurant Detail"}
      />
      <div
        className="py-32 bg-cover bg-center bg-gray-600"
        style={{
          backgroundImage: `url(${data?.restaurant.restaurant?.coverImg})`,
        }}
      >
        <div className="bg-lime-50 w-2/3 lg:w-1/4 py-4 pl-24 ">
          <h4 className="text-4xl font-medium mb-3 text-gray-600 mr-5">
            {data?.restaurant.restaurant?.name}
          </h4>
          <Link to={`/category/${data?.restaurant.restaurant?.category?.slug}`}>
            <h5 className="text-sm font-light mb-1">
              {data?.restaurant.restaurant?.category?.name.toUpperCase()}
            </h5>
          </Link>
          <div className="flex items-center">
            <FontAwesomeIcon
              icon={faMapMarkerAlt}
              className="text-xs mr-1 text-blue-800"
            />
            <h6 className="text-sm font-light">
              {data?.restaurant.restaurant?.address}
            </h6>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="h-10 mt-5 grid md:grid-cols-6 gap-7">
          <div className="bg-gray-300 col-start-3 col-span-2 rounded-lg flex justify-center items-center">
            Total Price: $ {totalPrice.toFixed(2)}
          </div>
          {canOrder && (
            <button
              onClick={goToCheckout}
              className="btn bg-red-400 opacity-50 hover:opacity-100 rounded-lg mx-5 xl:mx-0 col-end-7 col-span-1"
            >
              ORDER
            </button>
          )}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-7 gap-y-10 mt-5 mb-5 mx-5 xl:mx-auto">
          {data?.restaurant.restaurant?.menu.map((dish) => (
            <Dish
              id={dish.id}
              addItemToOrder={addItemToOrder}
              removeItem={removeItem}
              key={dish.id}
              name={dish.name}
              price={dish.price}
              photo={dish.photo}
              description={dish.description}
              isCustomer={true}
              options={dish.options}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;
