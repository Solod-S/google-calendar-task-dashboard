import { combineReducers } from "@reduxjs/toolkit";
import state from "./projectStateSlice";
import data from "./projectDataSlice";

const reducer = combineReducers({
  state,
  data,
});

export default reducer;
