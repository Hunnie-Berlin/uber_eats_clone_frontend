import { gql, useQuery } from "@apollo/client";
import React from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import NotFound from "../pages/404";
import Restaurants from "../pages/client/restaurants";
import { meQuery } from "../__generated__/meQuery";

const ClientRoutes = () => (
  <>
    <Route path="/" exact>
      <Restaurants />
    </Route>
  </>
);

const ME_QUERY = gql`
  query meQuery {
    me {
      id
      email
      role
      verified
    }
  }
`;

const LoggedInRouter = () => {
  const { data, loading, error } = useQuery<meQuery>(ME_QUERY);
  if (!data || loading || error) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">loading...</span>
      </div>
    );
  }
  return (
    <Router>
      <Switch>{data.me.role === "Client" && <ClientRoutes />}</Switch>
      <Route>
        <NotFound />
      </Route>
    </Router>
  );
};

export default LoggedInRouter;
