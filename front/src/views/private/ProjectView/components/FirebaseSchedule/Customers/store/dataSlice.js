import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getCustomerStatistic = createAsyncThunk(
  "crmCustomers/data/getCustomerStatistic",
  async values => {
    // const response = await apiGetCrmCustomersStatistic()

    const data = {
      totalCustomers: {
        value: 2420,
        growShrink: 17.2,
      },
      activeCustomers: {
        value: 1897,
        growShrink: 32.7,
      },
      newCustomers: {
        value: 241,
        growShrink: -2.3,
      },
    };
    return data;
  }
);

export const getCustomers = createAsyncThunk(
  "crmCustomers/data/getCustomers",
  async params => {
    const { generalData } = params;
    const { integrations } = generalData;
    const firebaseScheduleIntegrations = integrations.find(
      int => int.name === "Firebase Schedule"
    );

    const scheduleData = firebaseScheduleIntegrations?.scheduleData
      ? firebaseScheduleIntegrations.scheduleData
      : [];

    const data = {
      data: scheduleData,
      total: scheduleData.length,
    };
    return data;
  }
);

export const putCustomer = createAsyncThunk(
  "crmCustomers/data/putCustomer",
  async data => {
    return data;
    // const response = await apPutCrmCustomer(data);
    // return response.data;
  }
);

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
  status: "",
};

const dataSlice = createSlice({
  name: "crmCustomers/data",
  initialState: {
    loading: false,
    customerList: [],
    statisticData: {},
    tableData: initialTableData,
    filterData: initialFilterData,
  },
  reducers: {
    setTableData: (state, action) => {
      state.tableData = action.payload;
    },
    setCustomerList: (state, action) => {
      state.customerList = action.payload;
    },
    setFilterData: (state, action) => {
      state.filterData = action.payload;
    },
  },
  extraReducers: {
    [getCustomers.fulfilled]: (state, action) => {
      state.customerList = action.payload.data;
      state.tableData.total = action.payload.total;
      state.loading = false;
    },
    [getCustomers.pending]: state => {
      state.loading = true;
    },
    [getCustomerStatistic.pending]: state => {
      state.statisticLoading = true;
    },
    [getCustomerStatistic.fulfilled]: (state, action) => {
      state.statisticData = action.payload;
      state.statisticLoading = false;
    },
  },
});

export const { setTableData, setCustomerList, setFilterData } =
  dataSlice.actions;

export default dataSlice.reducer;
