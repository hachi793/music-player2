import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useStateValue } from "./context/stateProvider";

const PrivateRoute = () => {
  const [{ user }] = useStateValue();

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
