import React, { createContext, useContext, useReducer, useEffect } from "react";

export const StateContext = createContext();

export const StateProvider = ({ reducer, initialState, children }) => {
  const value = useReducer(reducer, initialState);
  // useEffect(() => {
  //   console.log("value changed");
  //   console.log(value);
  // }, [value]);
  return (
    <StateContext.Provider value={value}>{children}</StateContext.Provider>
  );
};

export const useStateValue = () => useContext(StateContext);
