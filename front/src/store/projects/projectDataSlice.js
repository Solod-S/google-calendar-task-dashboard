import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import FirebaseMyProjectsService from "services/FirebaseMyProjectsService";

export const fetchProjects = createAsyncThunk(
  "projectList/data/get",
  async data => {
    const response = await FirebaseMyProjectsService.fetchProjects(data);

    return response;
  }
);

export const deleteProject = async data => {
  const response = await FirebaseMyProjectsService.deleteProject(data.id);
  return response;
};

export const initialTableData = {
  total: 0,
  pageIndex: 1,
  pageSize: 10,
  query: "",
  sort: {
    order: "",
    key: "",
  },
};

export const initialFilterData = {
  name: "",
  category: [],
  active: [true, false],
};

const projectDataSlice = createSlice({
  name: "projectList/data",
  initialState: {
    loading: false,
    projectList: [],
    tableData: initialTableData,
    filterData: initialFilterData,
  },
  reducers: {
    updateProjectList: (state, action) => {
      state.projectList = action.payload;
    },
    setTableData: (state, action) => {
      state.tableData = action.payload;
    },
    setFilterData: (state, action) => {
      state.filterData = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchProjects.pending, state => {
        state.loading = true;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.projectList = action.payload.data;
        state.tableData.total = action.payload.total;
        state.loading = false;
      });
  },
});

export const { updateProjectList, setTableData, setFilterData } =
  projectDataSlice.actions;

export default projectDataSlice.reducer;
