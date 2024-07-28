import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import FirebaseDashboardService from "services/FirebaseDashboardService";

export const getProjectDashboardData = createAsyncThunk(
  "projectDashboard/data/getProjectDashboardData",
  async () => {
    const { weekly, displayName, activeEventsData } =
      await FirebaseDashboardService.fetchTaskOverview();
    const myProjects = await FirebaseDashboardService.fetchProjectsData();
    const data = {
      userName: displayName,
      taskCount: weekly.total,
      activeEventsData,
      projectOverviewData: {
        chart: {
          // daily: {
          //   onGoing: 13,
          //   notSelected: 9,
          //   total: 21,
          //   series: [
          //     {
          //       name: "On Going",
          //       data: [20, 19, 18, 14, 12, 10],
          //     },
          //     {
          //       name: "Not Selected",
          //       data: [1, 4, 8, 15, 16, 18],
          //     },
          //   ],
          //   range: [
          //     "6:00am",
          //     "9:00am",
          //     "12:00pm",
          //     "03:00pm",
          //     "06:00pm",
          //     "09:00pm",
          //   ],
          // },
          // 1!!!!!
          weekly,
          // weekly: {
          //   total: 999,
          //   series: [
          //     {
          //       name: "Project 1",
          //       data: [1, 1, 1, 1, 2, 2, 3],
          //     },
          //   ],
          //   range: [
          //     "21 Jan",
          //     "22 Jan",
          //     "23 Jan",
          //     "24 Jan",
          //     "25 Jan",
          //     "26 Jan",
          //     "27 Jan",
          //   ],
          // },
          // 11!!!!
          // monthly: {
          //   onGoing: 270,
          //   notSelected: 113,
          //   total: 383,
          //   series: [
          //     {
          //       name: "On Going",
          //       data: [28, 52, 91, 154, 227, 256, 270],
          //     },
          //     {
          //       name: "Not Selected",
          //       data: [22, 31, 74, 88, 97, 107, 113],
          //     },
          //   ],
          //   range: [
          //     "01 Jan",
          //     "05 Jan",
          //     "10 Jan",
          //     "15 Jan",
          //     "20 Jan",
          //     "25 Jan",
          //     "27 Jan",
          //   ],
          // },
        },
      },
      myProjects,
      projectsData: [
        {
          id: 27,
          name: "EVO SaaS",
          category: "Web Application",
          desc: "Most of you are familiar with the virtues of a programmer",
          attachmentCount: 12,
          totalTask: 32,
          completedTask: 27,
          progression: 80,
          dayleft: 21,
          status: "none",
          member: [
            {
              name: "Frederick Adams",
              img: "/img/avatars/thumb-8.jpg",
            },
            {
              name: "Joyce Freeman",
              img: "/img/avatars/thumb-5.jpg",
            },
            {
              name: "Clayton Bates",
              img: "",
            },
            {
              name: "Clayton Bates",
              img: "",
            },
          ],
        },
        {
          id: 28,
          name: "AIA Bill App",
          category: "Mobile Application",
          desc: "We are not shipping your machine!",
          attachmentCount: 5,
          totalTask: 36,
          completedTask: 15,
          progression: 45,
          dayleft: 19,
          status: "none",
          member: [
            {
              name: "Carolyn Perkins",
              img: "/img/avatars/thumb-1.jpg",
            },
            {
              name: "Gabriel Frazier",
              img: "",
            },
          ],
        },
        {
          id: 29,
          name: "IOP Web",
          category: "Web Backend Application",
          desc: "There are two ways to write error-free programs; only the third one works.",
          attachmentCount: 8,
          totalTask: 27,
          completedTask: 19,
          progression: 73,
          dayleft: 6,
          status: "orange",
          member: [
            {
              name: "Debra Hamilton",
              img: "",
            },
            {
              name: "Stacey Ward",
              img: "",
            },
            {
              name: "Ron Vargas",
              img: "/img/avatars/thumb-3.jpg",
            },
            {
              name: "Ron Vargas",
              img: "/img/avatars/thumb-3.jpg",
            },
            {
              name: "Ron Vargas",
              img: "/img/avatars/thumb-3.jpg",
            },
            {
              name: "Ron Vargas",
              img: "/img/avatars/thumb-3.jpg",
            },
          ],
        },
        {
          id: 31,
          name: "Octonine POS",
          category: "Backend Application",
          desc: "Everything that can be invented has been invented.",
          attachmentCount: 8,
          totalTask: 78,
          completedTask: 23,
          progression: 21,
          dayleft: 52,
          status: "cyan",
          member: [
            {
              name: "Brittany Hale",
              img: "/img/avatars/thumb-10.jpg",
            },
            {
              name: "Frederick Adams",
              img: "/img/avatars/thumb-8.jpg",
            },
            {
              name: "Samantha Phillips",
              img: "/img/avatars/thumb-6.jpg",
            },
            {
              name: "Samantha Phillips",
              img: "/img/avatars/thumb-6.jpg",
            },
            {
              name: "Samantha Phillips",
              img: "/img/avatars/thumb-6.jpg",
            },
          ],
        },
      ],
      activitiesData: [
        {
          type: "UPDATE-TICKET",
          dateTime: 1646580000,
          ticket: "PD-979",
          status: 0,
          userName: "Carolyn Perkins",
          userImg: "",
        },
        {
          type: "COMMENT",
          dateTime: 1646578417,
          userName: "Ron Vargas",
          userImg: "/img/avatars/thumb-3.jpg",
          comment:
            "Fine, Java MIGHT be a good example of what a programming language should be like. But Java applications are good examples of what applications SHOULDN'T be like.",
        },
        {
          type: "ADD-TAGS-TO-TICKET",
          dateTime: 1646574027,
          userName: "Joyce Freeman",
          tags: ["Live Issue", "Backend"],
        },
        {
          type: "ADD-FILES-TO-TICKET",
          dateTime: 1646569123,
          userName: "Luke Cook",
          files: ["document.csv"],
          ticket: "PD-1092",
        },
      ],
      id: "1",
    };

    return data;
  }
);

export const initialFilterData = {
  status: "",
};

const dataSlice = createSlice({
  name: "projectDashboard/data",
  initialState: {
    loading: true,
    dashboardData: {},
  },
  reducers: {},
  extraReducers: {
    [getProjectDashboardData.fulfilled]: (state, action) => {
      state.dashboardData = action.payload;
      state.loading = false;
    },
    [getProjectDashboardData.pending]: state => {
      state.loading = true;
    },
  },
});

export default dataSlice.reducer;
