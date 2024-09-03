import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import dayjs from "dayjs";

export const getScheduleStatistic = createAsyncThunk(
  "firebaseSchedule/data/getScheduleStatistic",
  async values => {
    const total = values?.length || 0;
    const active = values?.filter(obj => obj.status)?.length || 0;
    const inactive = values?.filter(obj => !obj.status)?.length || 0;
    const data = {
      totalSchedule: {
        value: total,
        growShrink: 17.2,
      },
      activeSchedule: {
        value: active,
        growShrink: 32.7,
      },
      inactiveSchedule: {
        value: inactive,
        growShrink: -2.3,
      },
    };
    return data;
  }
);

export const getSchedule = createAsyncThunk(
  "firebaseSchedule/data/getSchedule",
  async params => {
    const { generalData, pageIndex, pageSize, sort, query } = params;
    const { integrations } = generalData;
    const firebaseScheduleIntegrations = integrations.find(
      int => int.name === "Firebase Schedule"
    );

    let scheduleData = firebaseScheduleIntegrations?.scheduleData
      ? firebaseScheduleIntegrations.scheduleData
      : [];
    if (query) {
      scheduleData = scheduleData.filter(project =>
        project.name.toLowerCase().includes(query.toLowerCase())
      );
    }
    const data = {
      data: scheduleData,
      totalData: firebaseScheduleIntegrations?.scheduleData
        ? firebaseScheduleIntegrations.scheduleData
        : [],
      total: scheduleData.length,
    };

    try {
      if (sort.key && scheduleData.length > 0) {
        const { key, order } = sort;

        const sortedData = [...scheduleData];

        if (key === "dateCreated" || key === "dateUpdated") {
          sortedData.sort((a, b) => {
            const aDate = dayjs(a[key]);
            const bDate = dayjs(b[key]);
            return order === "asc" ? aDate.diff(bDate) : bDate.diff(aDate);
          });
        } else if (key === "status") {
          sortedData.sort((a, b) => {
            if (a[key] === b[key]) return 0;
            return order === "asc" ? (a[key] ? -1 : 1) : a[key] ? 1 : -1;
          });
        } else if (typeof scheduleData[0][key] === "string") {
          sortedData.sort((a, b) => {
            return order === "asc"
              ? (a[key] || "").localeCompare(b[key] || "")
              : (b[key] || "").localeCompare(a[key] || "");
          });
        }

        data.data = sortedData; // Обновляем данные после сортировки
      }
    } catch (error) {
      console.error("Error during sorting:", error);
    }

    const startIndex = (pageIndex - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = data.data.slice(startIndex, endIndex);

    return {
      ...data,
      data: paginatedData,
    };
  }
);

export const putSchedule = createAsyncThunk(
  "firebaseSchedule/data/putSchedule",
  async data => {
    return data;

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
  name: "firebaseSchedule/data",
  initialState: {
    loading: false,
    scheduleList: [],
    statisticData: {},
    tableData: initialTableData,
    allData: [],
    filterData: initialFilterData,
  },
  reducers: {
    setStartIndex: (state, action) => {
      state.tableData.pageIndex = action.payload;
    },
    setTableData: (state, action) => {
      state.tableData = action.payload;
    },
    setScheduleList: (state, action) => {
      state.scheduleList = action.payload;
    },
    setFilterData: (state, action) => {
      state.filterData = action.payload;
    },
    removeScheduleById: (state, action) => {
      const id = action.payload;
      state.scheduleList = state.scheduleList.filter(
        schedule => schedule.id !== id
      );
      state.tableData.total -= 1;
    },
  },
  extraReducers: {
    [getSchedule.fulfilled]: (state, action) => {
      state.scheduleList = action.payload.data;
      state.allData = action.payload.totalData;
      state.tableData.total = action.payload.total;
      state.loading = false;
    },
    [getSchedule.pending]: state => {
      state.loading = true;
    },
    [getScheduleStatistic.pending]: state => {
      state.statisticLoading = true;
    },
    [getScheduleStatistic.fulfilled]: (state, action) => {
      state.statisticData = action.payload;
      state.statisticLoading = false;
    },
  },
});

export const {
  setStartIndex,
  setTableData,
  setScheduleList,
  setFilterData,
  removeScheduleById,
} = dataSlice.actions;

export default dataSlice.reducer;
