import { gql, useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import PageTitle from "../../components/page-title";
import Restaurant from "../../components/restaurant";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import { myRestaurantsQuery } from "../../__generated__/myRestaurantsQuery";

export const MY_RESTAURANTS = gql`
  query myRestaurantsQuery {
    myRestaurants {
      ok
      error
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

const MyRestaurants = () => {
  const { data } = useQuery<myRestaurantsQuery>(MY_RESTAURANTS);
  console.log(data);
  return (
    <div className="container">
      <PageTitle title="My Restaurants" />
      <h1 className="py-5 w-80 mt-5 mx-auto rounded-full text-lime-700 text-4xl font-thin bg-lime-200 flex justify-center items-center ">
        My Restaurants
      </h1>
      {data?.myRestaurants.ok && data.myRestaurants.restaurants.length === 0 ? (
        <>
          <div
            className="py-40 flex justify-center items-center bg-contain bg-center bg-no-repeat opacity-60 mt-5"
            style={{
              backgroundImage:
                "url(https://www.creativefabrica.com/wp-content/uploads/2018/12/Restaurant-icon-EPS-10-by-Hoeda80-1.jpg)",
            }}
          ></div>
          <div className="pb-5 flex justify-center items-center text-2xl font-medium text-red-400">
            No Restaurants yet. Create one!
          </div>
        </>
      ) : (
        <div className="grid md:grid-cols-3 gap-x-7 gap-y-10 mt-16 mx-5">
          {data?.myRestaurants.restaurants.map((restaurant) => (
            <Restaurant
              id={restaurant.id + ""}
              key={restaurant.id}
              coverImg={restaurant.coverImg}
              name={restaurant.name}
              categoryName={restaurant.category?.name}
            />
          ))}
        </div>
      )}

      <div className="w-full h-full flex justify-center">
        <Link to="/add-restaurant">
          <button className="mt-5 py-3 px-5 rounded-lg focus:outline-none bg-red-300 hover:bg-red-400 transition-colors text-white active:animate-clickAnimation">
            Create Restaurant
          </button>
        </Link>
      </div>
    </div>
  );
};

export default MyRestaurants;
