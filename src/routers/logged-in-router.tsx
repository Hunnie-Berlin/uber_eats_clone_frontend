import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";
import Header from "../components/header";
import useMe from "../hooks/useMe";
import NotFound from "../pages/404";
import AddAddress from "../pages/client/add-address";
import Category from "../pages/client/category";
import RestaurantDetail from "../pages/client/restaurantDetail";
import Restaurants from "../pages/client/restaurants";
import SearchResults from "../pages/client/searchResults";
import Dashboard from "../pages/driver/dashboard";
import AddDish from "../pages/owner/add-dish";
import AddRestaurant from "../pages/owner/add-restaurant";
import MyRestaurant from "../pages/owner/my-restaurant";
import MyRestaurants from "../pages/owner/my-restaurants";
import ConfirmEmail from "../pages/user/confirm-email";
import EditProfile from "../pages/user/edit-profile";
import Order from "../pages/user/order";
import { UserRole } from "../__generated__/globalTypes";

const clientRoutes = [
  {
    path: "/",
    component: <Restaurants />,
  },
  {
    path: "/search",
    component: <SearchResults />,
  },
  {
    path: "/category/:slug",
    component: <Category />,
  },
  {
    path: "/restaurants/:id",
    component: <RestaurantDetail />,
  },
  {
    path: "/add-address",
    component: <AddAddress />,
  },
];

const commonRoutes = [
  {
    path: "/confirm",
    component: <ConfirmEmail />,
  },
  {
    path: "/edit-profile",
    component: <EditProfile />,
  },
  {
    path: "/orders/:id",
    component: <Order />,
  },
];

const ownerRoutes = [
  {
    path: "/",
    component: <MyRestaurants />,
  },
  {
    path: "/add-restaurant",
    component: <AddRestaurant />,
  },
  {
    path: "/restaurants/:id",
    component: <MyRestaurant />,
  },
  {
    path: "/restaurants/:id/add-dish",
    component: <AddDish />,
  },
];
const deliveryRoutes = [
  {
    path: "/",
    component: <Dashboard />,
  },
];

const LoggedInRouter = () => {
  const { data, loading, error } = useMe();
  const history = useHistory();
  if (!data || loading || error) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">
          {error ? error.message : "loading..."}
        </span>
      </div>
    );
  }
  return (
    <Router>
      <Header />
      <Switch>
        {data.me.role &&
          commonRoutes.map((route) => (
            <Route key={route.path} path={route.path} exact>
              {route.component}
            </Route>
          ))}
        {data.me.role === UserRole.Client && !data.me.address && (
          <Route>
            <AddAddress />
          </Route>
        )}
        {data.me.role === UserRole.Client &&
          clientRoutes.map((route) => (
            <Route key={route.path} path={route.path} exact>
              {route.component}
            </Route>
          ))}
        {data.me.role === UserRole.Owner &&
          ownerRoutes.map((route) => (
            <Route key={route.path} path={route.path} exact>
              {route.component}
            </Route>
          ))}
        {data.me.role === UserRole.Delivery &&
          deliveryRoutes.map((route) => (
            <Route key={route.path} path={route.path} exact>
              {route.component}
            </Route>
          ))}
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
};

export default LoggedInRouter;
