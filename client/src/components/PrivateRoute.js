import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../firebase/AuthContext";

const PrivateRoute = ({ children }) => {
  let location = useLocation();
  const { currentUser } = useContext(AuthContext);
  return currentUser ? (
    children
  ) : (
    <Navigate to="/signup" state={{ from: location }} />
  );
};

export default PrivateRoute;