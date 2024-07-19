import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import {
//   apiGetCrmCustomers,
//   apPutCrmCustomer,
//   apiGetCrmCustomersStatistic,
// } from "services/CrmService";

export const getCustomerStatistic = createAsyncThunk(
  "crmCustomers/data/getCustomerStatistic",
  async () => {
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
    // const response = await apiGetCrmCustomers(params);
    const data = {
      data: [
        {
          id: "1",
          name: "Carolyn Perkins",
          email: "carolyn_h@hotmail.com",
          img: "/img/avatars/thumb-1.jpg",
          role: "Admin",
          lastOnline: 1623430400,
          status: "active",
          personalInfo: {
            location: "New York, US",
            title: "Product Manager",
            birthday: "10/10/1992",
            phoneNumber: "+12-123-1234",
            facebook: "facebook.com/sample",
            twitter: "twitter.com/sample",
            pinterest: "pinterest.com/sample",
            linkedIn: "linkedin/sample",
          },
          orderHistory: [
            {
              id: "#36223",
              item: "Mock premium pack",
              status: "pending",
              amount: 39.9,
              date: 1639132800,
            },
            {
              id: "#34283",
              item: "Business board pro subscription",
              status: "paid",
              amount: 59.9,
              date: 1636790880,
            },
            {
              id: "#32234",
              item: "Business board pro subscription",
              status: "paid",
              amount: 59.9,
              date: 1634090880,
            },
            {
              id: "#31354",
              item: "Business board pro subscription",
              status: "paid",
              amount: 59.9,
              date: 1631532800,
            },
          ],
          paymentMethod: [
            {
              cardHoldername: "Carolyn Perkins",
              cardType: "VISA",
              expMonth: "12",
              expYear: "25",
              last4Number: "0392",
              primary: true,
            },
            {
              cardHoldername: "Carolyn Perkins",
              cardType: "MASTER",
              expMonth: "06",
              expYear: "25",
              last4Number: "8461",
              primary: false,
            },
          ],
          subscription: [
            {
              plan: "Business board pro",
              status: "active",
              billing: "monthly",
              nextPaymentDate: 1639132800,
              amount: 59.9,
            },
          ],
        },
        {
          id: "2",
          name: "Terrance Moreno",
          email: "terrance_moreno@infotech.io",
          img: "/img/avatars/thumb-2.jpg",
          role: "User",
          lastOnline: 1632393600,
          status: "active",
          personalInfo: {
            location: "New York, US",
            title: "Software Engineer",
            birthday: "03/02/1984",
            phoneNumber: "+12-123-1234",
            facebook: "facebook.com/sample",
            twitter: "twitter.com/sample",
            pinterest: "pinterest.com/sample",
            linkedIn: "linkedin/sample",
          },
          orderHistory: [
            {
              id: "#36223",
              item: "Mock premium pack",
              status: "pending",
              amount: 39.9,
              date: 1639132800,
            },
            {
              id: "#34283",
              item: "Business board pro subscription",
              status: "paid",
              amount: 59.9,
              date: 1636790880,
            },
            {
              id: "#32234",
              item: "Business board pro subscription",
              status: "paid",
              amount: 59.9,
              date: 1634090880,
            },
            {
              id: "#31354",
              item: "Business board pro subscription",
              status: "paid",
              amount: 59.9,
              date: 1631532800,
            },
          ],
          paymentMethod: [
            {
              cardHolderName: "Terrance Moreno",
              cardType: "VISA",
              expMonth: "12",
              expYear: "25",
              last4Number: "0392",
              primary: true,
            },
            {
              cardHolderName: "Terrance Moreno",
              cardType: "MASTER",
              expMonth: "06",
              expYear: "25",
              last4Number: "8461",
              primary: false,
            },
          ],
          subscription: [
            {
              plan: "Business board pro",
              status: "active",
              billing: "monthly",
              nextPaymentDate: 1639132800,
              amount: 59.9,
            },
          ],
        },
        {
          id: "3",
          name: "Ron Vargas",
          email: "ronnie_vergas@infotech.io",
          img: "/img/avatars/thumb-3.jpg",
          role: "User",
          lastOnline: 1632393600,
          status: "blocked",
          personalInfo: {
            location: "New York, US",
            title: "UI/UX Designer",
            birthday: "07/11/1987",
            phoneNumber: "+12-123-1234",
            facebook: "facebook.com/sample",
            twitter: "twitter.com/sample",
            pinterest: "pinterest.com/sample",
            linkedIn: "linkedin/sample",
          },
          orderHistory: [
            {
              id: "#36223",
              item: "Mock premium pack",
              status: "pending",
              amount: 39.9,
              date: 1639132800,
            },
            {
              id: "#34283",
              item: "Business board pro subscription",
              status: "paid",
              amount: 59.9,
              date: 1636790880,
            },
            {
              id: "#32234",
              item: "Business board pro subscription",
              status: "paid",
              amount: 59.9,
              date: 1634090880,
            },
            {
              id: "#31354",
              item: "Business board pro subscription",
              status: "paid",
              amount: 59.9,
              date: 1631532800,
            },
          ],
          paymentMethod: [
            {
              cardHolderName: "Ron Vargas",
              cardType: "VISA",
              expMonth: "12",
              expYear: "25",
              last4Number: "0392",
              primary: true,
            },
            {
              cardHolderName: "Ron Vargas",
              cardType: "MASTER",
              expMonth: "06",
              expYear: "25",
              last4Number: "8461",
              primary: false,
            },
          ],
          subscription: [
            {
              plan: "Business board pro",
              status: "active",
              billing: "monthly",
              nextPaymentDate: 1639132800,
              amount: 59.9,
            },
          ],
        },
        {
          id: "4",
          name: "Luke Cook",
          email: "cookie_lukie@hotmail.com",
          img: "/img/avatars/thumb-4.jpg",
          role: "Admin",
          lastOnline: 1639132800,
          status: "active",
          personalInfo: {
            location: "New York, US",
            title: "HR Executive",
            birthday: "07/11/1987",
            phoneNumber: "+12-123-1234",
            facebook: "facebook.com/sample",
            twitter: "twitter.com/sample",
            pinterest: "pinterest.com/sample",
            linkedIn: "linkedin/sample",
          },
          orderHistory: [
            {
              id: "#36223",
              item: "Mock premium pack",
              status: "pending",
              amount: 39.9,
              date: 1639132800,
            },
            {
              id: "#34283",
              item: "Business board pro subscription",
              status: "paid",
              amount: 59.9,
              date: 1636790880,
            },
            {
              id: "#32234",
              item: "Business board pro subscription",
              status: "paid",
              amount: 59.9,
              date: 1634090880,
            },
            {
              id: "#31354",
              item: "Business board pro subscription",
              status: "paid",
              amount: 59.9,
              date: 1631532800,
            },
          ],
          paymentMethod: [
            {
              cardHolderName: "Luke Cook",
              cardType: "VISA",
              expMonth: "12",
              expYear: "25",
              last4Number: "0392",
              primary: true,
            },
            {
              cardHolderName: "Luke Cook",
              cardType: "MASTER",
              expMonth: "06",
              expYear: "25",
              last4Number: "8461",
              primary: false,
            },
          ],
          subscription: [
            {
              plan: "Business board pro",
              status: "active",
              billing: "monthly",
              nextPaymentDate: 1639132800,
              amount: 59.9,
            },
          ],
        },
        {
          id: "5",
          name: "Joyce Freeman",
          email: "joyce991@infotech.io",
          img: "/img/avatars/thumb-5.jpg",
          role: "User",
          lastOnline: 1632416000,
          status: "active",
          personalInfo: {
            location: "New York, US",
            title: "Frontend Developer",
            birthday: "17/11/1993",
            phoneNumber: "+12-123-1234",
            facebook: "facebook.com/sample",
            twitter: "twitter.com/sample",
            pinterest: "pinterest.com/sample",
            linkedIn: "linkedin/sample",
          },
          orderHistory: [
            {
              id: "#36223",
              item: "Mock premium pack",
              status: "pending",
              amount: 39.9,
              date: 1639132800,
            },
            {
              id: "#34283",
              item: "Business board pro subscription",
              status: "paid",
              amount: 59.9,
              date: 1636790880,
            },
            {
              id: "#32234",
              item: "Business board pro subscription",
              status: "paid",
              amount: 59.9,
              date: 1634090880,
            },
            {
              id: "#31354",
              item: "Business board pro subscription",
              status: "paid",
              amount: 59.9,
              date: 1631532800,
            },
          ],
          paymentMethod: [
            {
              cardHolderName: "Joyce Freeman",
              cardType: "VISA",
              expMonth: "12",
              expYear: "25",
              last4Number: "0392",
              primary: true,
            },
            {
              cardHolderName: "Joyce Freeman",
              cardType: "MASTER",
              expMonth: "06",
              expYear: "25",
              last4Number: "8461",
              primary: false,
            },
          ],
          subscription: [
            {
              plan: "Business board pro",
              status: "active",
              billing: "monthly",
              nextPaymentDate: 1639132800,
              amount: 59.9,
            },
          ],
        },
        {
          id: "6",
          name: "Samantha Phillips",
          email: "samanthaphil@infotech.io",
          img: "/img/avatars/thumb-6.jpg",
          role: "User",
          lastOnline: 1633107200,
          status: "active",
          personalInfo: {
            location: "London, UK",
            title: "Compliance Manager",
            birthday: "17/11/1993",
            phoneNumber: "+12-123-1234",
            facebook: "facebook.com/sample",
            twitter: "twitter.com/sample",
            pinterest: "pinterest.com/sample",
            linkedIn: "linkedin/sample",
          },
          orderHistory: [
            {
              id: "#36223",
              item: "Mock premium pack",
              status: "pending",
              amount: 39.9,
              date: 1639132800,
            },
            {
              id: "#34283",
              item: "Business board pro subscription",
              status: "paid",
              amount: 59.9,
              date: 1636790880,
            },
            {
              id: "#32234",
              item: "Business board pro subscription",
              status: "paid",
              amount: 59.9,
              date: 1634090880,
            },
            {
              id: "#31354",
              item: "Business board pro subscription",
              status: "paid",
              amount: 59.9,
              date: 1631532800,
            },
          ],
          paymentMethod: [
            {
              cardHolderName: "Samantha Phillips",
              cardType: "VISA",
              expMonth: "12",
              expYear: "25",
              last4Number: "0392",
              primary: true,
            },
            {
              cardHolderName: "Samantha Phillips",
              cardType: "MASTER",
              expMonth: "06",
              expYear: "25",
              last4Number: "8461",
              primary: false,
            },
          ],
          subscription: [
            {
              plan: "Business board pro",
              status: "active",
              billing: "monthly",
              nextPaymentDate: 1639132800,
              amount: 59.9,
            },
          ],
        },
      ],
      total: 6,
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
