import { createSlice } from "@reduxjs/toolkit";

const stateSlice = createSlice({
  name: "firebaseSchedule/state",
  initialState: {
    drawerOpen: false,
    selectedSchedule: {},
    sortedColumn: () => {},
  },
  reducers: {
    setSelectedSchedule: (state, action) => {
      state.selectedSchedule = action.payload;
    },
    setSortedColumn: (state, action) => {
      state.sortedColumn = action.payload;
    },
    setDrawerOpen: state => {
      state.drawerOpen = true;
    },
    setDrawerClose: state => {
      state.drawerOpen = false;
    },
  },
});

export const {
  setSelectedSchedule,
  setDrawerOpen,
  setDrawerClose,
  setSortedColumn,
} = stateSlice.actions;

export default stateSlice.reducer;
