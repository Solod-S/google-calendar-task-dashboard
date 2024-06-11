import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import FirebaseMyProjectsService from "services/FirebaseMyProjectsService";
import { apiGetProjects, apiDeleteProjects } from "services/ProjectsService";

export const fetchProjects = createAsyncThunk(
  "projectList/data/get",
  async data => {
    const response = await FirebaseMyProjectsService.fetchProjects();
    // const response = await apiGetProjects(data);

    return response;
    // return response.data;
  }
);

export const deleteProject = async data => {
  const response = await apiDeleteProjects(data);
  return response.data;
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
  category: ["sales"],
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
  extraReducers: {
    [fetchProjects.fulfilled]: (state, action) => {
      state.projectList = action.payload.data;
      state.tableData.total = action.payload.total;
      state.loading = false;
    },
    [fetchProjects.pending]: state => {
      state.loading = true;
    },
  },
});

export const {
  updateProjectList,
  setTableData,
  setFilterData,
  setSortedColumn,
} = projectDataSlice.actions;

export default projectDataSlice.reducer;
