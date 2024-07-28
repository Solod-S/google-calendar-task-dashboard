import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import dayjs from "dayjs";

export const getCustomerStatistic = createAsyncThunk(
  "crmCustomers/data/getCustomerStatistic",
  async values => {
    const total = values?.length || 0;
    const active = values?.filter(obj => obj.status)?.length || 0;
    const inactive = values?.filter(obj => !obj.status)?.length || 0;
    const data = {
      totalCustomers: {
        value: total,
        growShrink: 17.2,
      },
      activeCustomers: {
        value: active,
        growShrink: 32.7,
      },
      inactiveCustomers: {
        value: inactive,
        growShrink: -2.3,
      },
    };
    return data;
  }
);

// export const getCustomers = createAsyncThunk(
//   "crmCustomers/data/getCustomers",
//   async params => {
//     console.log(params);
//     const { generalData, pageIndex, pageSize, sort } = params;
//     const { integrations } = generalData;
//     const firebaseScheduleIntegrations = integrations.find(
//       int => int.name === "Firebase Schedule"
//     );

//     let scheduleData = firebaseScheduleIntegrations?.scheduleData
//       ? firebaseScheduleIntegrations.scheduleData
//       : [];

//     const data = {
//       data: scheduleData,
//       total: scheduleData.length,
//     };
//     console.log("Before sorting:", scheduleData);
//     console.log("Sort key:", sort.key);
//     console.log("Sort order:", sort.order);
//     if (sort.key && scheduleData.length > 0) {
//       const sortedData = scheduleData.sort((a, b) => {
//         // Добавьте дополнительные проверки и отладочные сообщения при необходимости
//         if (sort.key === "dateCreated" || sort.key === "dateUpdated") {
//           console.log(`1`);
//           return sort.order === "asc"
//             ? (a[sort.key]?.seconds || 0) - (b[sort.key]?.seconds || 0)
//             : (b[sort.key]?.seconds || 0) - (a[sort.key]?.seconds || 0);
//         } else if (sort.key === "status") {
//           console.log(`2`);
//           return sort.order === "asc"
//             ? a[sort.key] === b[sort.key]
//               ? 0
//               : a[sort.key]
//               ? -1
//               : 1
//             : a[sort.key] === b[sort.key]
//             ? 0
//             : a[sort.key]
//             ? 1
//             : -1;
//         } else {
//           console.log(`3`);
//           return sort.order === "asc"
//             ? a[sort.key]?.localeCompare(b[sort.key]) || 0
//             : b[sort.key]?.localeCompare(a[sort.key]) || 0;
//         }
//       });
//       console.log("After sorting:", sortedData);
//     }

//     const startIndex = (pageIndex - 1) * pageSize;
//     const endIndex = startIndex + pageSize;
//     const paginatedData = data.data.slice(startIndex, endIndex);

//     return {
//       ...data,
//       data: paginatedData, // Обновляем только данные, которые будут возвращены
//     };
//   }
// );

export const getCustomers = createAsyncThunk(
  "crmCustomers/data/getCustomers",
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
    setCustomerList: (state, action) => {
      state.customerList = action.payload;
    },
    setFilterData: (state, action) => {
      state.filterData = action.payload;
    },
    removeCustomerById: (state, action) => {
      const id = action.payload;
      state.customerList = state.customerList.filter(
        customer => customer.id !== id
      );
      state.tableData.total -= 1;
    },
  },
  extraReducers: {
    [getCustomers.fulfilled]: (state, action) => {
      state.customerList = action.payload.data;
      state.allData = action.payload.totalData;
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

export const {
  setStartIndex,
  setTableData,
  setCustomerList,
  setFilterData,
  removeCustomerById,
} = dataSlice.actions;

export default dataSlice.reducer;
