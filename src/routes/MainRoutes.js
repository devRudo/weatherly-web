import React from "react";
import PropTypes from "prop-types";
import { Route, Routes, Navigate } from "react-router-dom";
import { Home } from "../pages";

const MainRoutes = (props) => {
  return (
    <Routes>
      <Route path="/" exact element={<Home />}></Route>
      {/* <Navigate to="/not-found" status="404" /> */}
    </Routes>
  );
};

MainRoutes.propTypes = {};

export default MainRoutes;
