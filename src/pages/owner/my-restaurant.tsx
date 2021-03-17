import { gql, useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import Dish from "../../components/dish";
import * as V from "victory";
import PageTitle from "../../components/page-title";
import {
  DISH_FRAGMENT,
  ORDER_CHART_FRAGMENT,
  RESTAURANT_FRAGMENT,
} from "../../fragments";
import {
  myRestaurantQuery,
  myRestaurantQueryVariables,
} from "../../__generated__/myRestaurantQuery";

export const MY_RESTAURANT_QUERY = gql`
  query myRestaurantQuery($input: MyRestaurantInput!) {
    myRestaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
        menu {
          ...DishParts
        }
        orders {
          ...OrderChartParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
  ${ORDER_CHART_FRAGMENT}
`;

interface IParams {
  id: string;
}

const MyRestaurant = () => {
  const { id } = useParams<IParams>();
  const { data } = useQuery<myRestaurantQuery, myRestaurantQueryVariables>(
    MY_RESTAURANT_QUERY,
    {
      variables: {
        input: {
          id: +id,
        },
      },
    }
  );
  let chartData: any[] = [];
  if (data) {
    chartData = [...data.myRestaurant.restaurant.orders]
      .sort((a, b) => {
        return a.id - b.id;
      })
      .map((item) => ({
        x: item.createdAt,
        y: item.total,
      }));
  }
  return (
    <div className="container">
      <PageTitle
        title={data?.myRestaurant.restaurant.name || "My Restaurant"}
      />
      <div
        className="bg-grey-200 py-28 bg-center bg-cover "
        style={{
          backgroundImage: `url(${data?.myRestaurant.restaurant.coverImg})`,
        }}
      ></div>
      <div className="mt-10">
        <h2 className="text-4xl font-bold mb-10 text-center">
          {data?.myRestaurant.restaurant.name || "Loading..."}
        </h2>
      </div>
      <div>
        {data?.myRestaurant.restaurant.menu.length === 0 ? (
          <>
            <div
              className="py-32 flex justify-center items-center bg-contain bg-center bg-no-repeat opacity-60 mt-5"
              style={{
                backgroundImage:
                  "url(https://www.creativefabrica.com/wp-content/uploads/2018/12/Restaurant-icon-EPS-10-by-Hoeda80-1.jpg)",
              }}
            ></div>
            <div className="pb-5 flex justify-center items-center text-2xl font-medium text-red-400">
              No Dishes yet. Create one!
            </div>
          </>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-7 gap-y-10 mt-16 mb-5 mx-5 xl:mx-0">
            {data?.myRestaurant.restaurant.menu.map((dish) => (
              <Dish
                key={dish.id}
                name={dish.name}
                price={dish.price}
                photo={dish.photo}
                description={dish.description}
              />
            ))}
          </div>
        )}
        <div className="flex flex-col md:flex-row md:justify-center items-center mt-3">
          <Link
            to={`/restaurants/${id}/add-dish`}
            className="w-60 mr-8 text-white bg-red-300 hover:bg-red-400 transition-colors py-3 px-10 rounded-md  text-center active:animate-clickAnimationmt mt-2"
          >
            Add Dish &rarr;
          </Link>
          <Link
            to={``}
            className="w-60 mr-8 text-white bg-lime-500 hover:bg-lime-600 transition-colors py-3 px-10 rounded-md  text-center active:animate-clickAnimation mt-2"
          >
            Buy Promotion &rarr;
          </Link>
        </div>
        <div className="mt-20 mb-10">
          <h2 className="text-2xl font-medium text-center">sales</h2>
          <div className="mt-5 mx-10">
            <V.VictoryChart
              theme={V.VictoryTheme.material}
              domainPadding={40}
              height={400}
              width={window.innerWidth}
              containerComponent={
                <V.VictoryZoomContainer
                  zoomDimension="x"
                  minimumZoom={{ x: 4 }}
                />
              }
            >
              <V.VictoryLine
                labels={({ datum }) => `$${datum.y}`}
                style={{
                  data: { stroke: "tomato", strokeWidth: 2 },
                  labels: { fill: "teal", fontSize: 20 },
                }}
                interpolation={"monotoneX"}
                data={chartData}
              />
              <V.VictoryAxis
                tickLabelComponent={<V.VictoryLabel renderInPortal />}
                style={{
                  tickLabels: {
                    fontSize: 20,
                    fontWeight: 500,
                    fill: "black",
                    angle: 45,
                  },
                }}
                tickFormat={(tick) => `${new Date(tick).toLocaleDateString()}`}
              />
            </V.VictoryChart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyRestaurant;
