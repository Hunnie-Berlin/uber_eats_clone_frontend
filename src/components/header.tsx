import { useApolloClient } from "@apollo/client";
import { faSignOutAlt, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link, useHistory } from "react-router-dom";
import { restaurantsPage, isLoggedInVar, authTokenVar } from "../apollo";
import { LOCALSTORAGE_TOKEN } from "../constants";
import useMe from "../hooks/useMe";
import Logo from "../images/eats-logo.png";

const Header: React.FC = () => {
  const { data } = useMe();
  const history = useHistory();
  const client = useApolloClient();
  const onLogoutClick = () => {
    localStorage.removeItem(LOCALSTORAGE_TOKEN);
    isLoggedInVar(false);
    authTokenVar(null);
    client.clearStore();
    history.push("/");
  };
  return (
    <>
      {!data?.me.verified && (
        <div className="bg-red-500 p-3 text-center text-base text-white tracking-wide">
          <span>Please verify your email.</span>
        </div>
      )}
      <header className="py-4">
        <div className="w-full px-5 max-w-screen-xl mx-auto flex items-center justify-between">
          <Link to="/" onClick={() => restaurantsPage(1)}>
            <img src={Logo} alt={"logo"} className="w-44" />
          </Link>
          <span className="text-xs">
            <Link to="/edit-profile">
              <FontAwesomeIcon icon={faUser} className="text-xl" />
            </Link>
            <FontAwesomeIcon
              icon={faSignOutAlt}
              className="text-xl ml-10 cursor-pointer"
              onClick={onLogoutClick}
            />
          </span>
        </div>
      </header>
    </>
  );
};

export default Header;
