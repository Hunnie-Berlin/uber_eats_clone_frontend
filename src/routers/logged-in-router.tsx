import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Header from "../components/header";
import useMe from "../hooks/useMe";
import NotFound from "../pages/404";
import Restaurants from "../pages/client/restaurants";
import Search from "../pages/client/search";
import ConfirmEmail from "../pages/user/confirm-email";
import EditProfile from "../pages/user/edit-profile";

const ClientRoutes = [
  <Route path="/" exact key={1}>
    <Restaurants />
  </Route>,
  <Route path="/confirm" exact key={2}>
    <ConfirmEmail />
  </Route>,
  <Route path="/edit-profile" exact key={3}>
    <EditProfile />
  </Route>,
  <Route path="/search" exact key={4}>
    <Search />
  </Route>,
];

const LoggedInRouter = () => {
  const { data, loading, error } = useMe();
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
        {data.me.role === "Client" && ClientRoutes}
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
};

export default LoggedInRouter;
