import "./src/styles/global.css"
import MainTemplate from "./src/components/layouts/MainTemplate";
import React from "react";
// Wraps every page in a component
export const wrapPageElement = ({ element, props }) => {
  return <MainTemplate {...props}>{element}</MainTemplate>;
};