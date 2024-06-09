import { createSlice } from "@reduxjs/toolkit";

const projectStateSlice = createSlice({
  name: "projectList/state",
  initialState: {
    deleteConfirmation: false,
    selectedProduct: "",
    sortedColumn: () => {},
  },
  reducers: {
    toggleDeleteConfirmation: (state, action) => {
      state.deleteConfirmation = action.payload;
    },
    setSortedColumn: (state, action) => {
      state.sortedColumn = action.payload;
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
  },
});

export const { toggleDeleteConfirmation, setSortedColumn, setSelectedProduct } =
  projectStateSlice.actions;

export default projectStateSlice.reducer;
