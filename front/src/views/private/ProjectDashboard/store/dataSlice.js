import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import FirebaseDashboardService from "services/FirebaseDashboardService";

export const getProjectGoogleCalendarDashboardData = createAsyncThunk(
  "projectDashboard/data/getProjectGoogleCalendarDashboardData",
  async () => {
    const { weekly, displayName, activeEventsData } =
      await FirebaseDashboardService.fetchGoogleCalendarTaskOverview();

    const myProjects = await FirebaseDashboardService.fetchProjectsData();

    const data = {
      userName: displayName,
      taskCount: weekly.total,
      activeEventsData,
      projectOverviewData: {
        chart: {
          weekly,
        },
      },
      myProjects,

      id: "1",
    };
    return data;
  }
);

export const getProjectFireBaseDashboardData = createAsyncThunk(
  "projectDashboard/data/getProjectFireBaseDashboardData",
  async () => {
    const { weekly, displayName, activeEventsData } =
      await FirebaseDashboardService.fetchFirebaseTaskOverview();
    const myProjects = await FirebaseDashboardService.fetchProjectsData();

    const data = {
      userName: displayName,
      taskCount: weekly.total,
      activeEventsData,
      projectOverviewData: {
        chart: {
          weekly,
        },
      },
      myProjects,

      id: "1",
    };
    return data;
    // // const myProjects = await FirebaseDashboardService.fetchProjectsData();
    // // const data = {
    // //   userName: displayName,
    // //   taskCount: weekly.total,
    // //   activeEventsData,
    // //   projectOverviewData: {
    // //     chart: {
    // //       weekly,
    // //     },
    // //   },
    // //   myProjects,
    // //   projectsData: [
    // //     {
    // //       id: 27,
    // //       name: "EVO SaaS",
    // //       category: "Web Application",
    // //       desc: "Most of you are familiar with the virtues of a programmer",
    // //       attachmentCount: 12,
    // //       totalTask: 32,
    // //       completedTask: 27,
    // //       progression: 80,
    // //       dayleft: 21,
    // //       status: "none",
    // //       member: [
    // //         {
    // //           name: "Frederick Adams",
    // //           img: "/img/avatars/thumb-8.jpg",
    // //         },
    // //         {
    // //           name: "Joyce Freeman",
    // //           img: "/img/avatars/thumb-5.jpg",
    // //         },
    // //         {
    // //           name: "Clayton Bates",
    // //           img: "",
    // //         },
    // //         {
    // //           name: "Clayton Bates",
    // //           img: "",
    // //         },
    // //       ],
    // //     },
    // //     {
    // //       id: 28,
    // //       name: "AIA Bill App",
    // //       category: "Mobile Application",
    // //       desc: "We are not shipping your machine!",
    // //       attachmentCount: 5,
    // //       totalTask: 36,
    // //       completedTask: 15,
    // //       progression: 45,
    // //       dayleft: 19,
    // //       status: "none",
    // //       member: [
    // //         {
    // //           name: "Carolyn Perkins",
    // //           img: "/img/avatars/thumb-1.jpg",
    // //         },
    // //         {
    // //           name: "Gabriel Frazier",
    // //           img: "",
    // //         },
    // //       ],
    // //     },
    // //     {
    // //       id: 29,
    // //       name: "IOP Web",
    // //       category: "Web Backend Application",
    // //       desc: "There are two ways to write error-free programs; only the third one works.",
    // //       attachmentCount: 8,
    // //       totalTask: 27,
    // //       completedTask: 19,
    // //       progression: 73,
    // //       dayleft: 6,
    // //       status: "orange",
    // //       member: [
    // //         {
    // //           name: "Debra Hamilton",
    // //           img: "",
    // //         },
    // //         {
    // //           name: "Stacey Ward",
    // //           img: "",
    // //         },
    // //         {
    // //           name: "Ron Vargas",
    // //           img: "/img/avatars/thumb-3.jpg",
    // //         },
    // //         {
    // //           name: "Ron Vargas",
    // //           img: "/img/avatars/thumb-3.jpg",
    // //         },
    // //         {
    // //           name: "Ron Vargas",
    // //           img: "/img/avatars/thumb-3.jpg",
    // //         },
    // //         {
    // //           name: "Ron Vargas",
    // //           img: "/img/avatars/thumb-3.jpg",
    // //         },
    // //       ],
    // //     },
    // //     {
    // //       id: 31,
    // //       name: "Octonine POS",
    // //       category: "Backend Application",
    // //       desc: "Everything that can be invented has been invented.",
    // //       attachmentCount: 8,
    // //       totalTask: 78,
    // //       completedTask: 23,
    // //       progression: 21,
    // //       dayleft: 52,
    // //       status: "cyan",
    // //       member: [
    // //         {
    // //           name: "Brittany Hale",
    // //           img: "/img/avatars/thumb-10.jpg",
    // //         },
    // //         {
    // //           name: "Frederick Adams",
    // //           img: "/img/avatars/thumb-8.jpg",
    // //         },
    // //         {
    // //           name: "Samantha Phillips",
    // //           img: "/img/avatars/thumb-6.jpg",
    // //         },
    // //         {
    // //           name: "Samantha Phillips",
    // //           img: "/img/avatars/thumb-6.jpg",
    // //         },
    // //         {
    // //           name: "Samantha Phillips",
    // //           img: "/img/avatars/thumb-6.jpg",
    // //         },
    // //       ],
    // //     },
    // //   ],
    // //   activitiesData: [
    // //     {
    // //       type: "UPDATE-TICKET",
    // //       dateTime: 1646580000,
    // //       ticket: "PD-979",
    // //       status: 0,
    // //       userName: "Carolyn Perkins",
    // //       userImg: "",
    // //     },
    // //     {
    // //       type: "COMMENT",
    // //       dateTime: 1646578417,
    // //       userName: "Ron Vargas",
    // //       userImg: "/img/avatars/thumb-3.jpg",
    // //       comment:
    // //         "Fine, Java MIGHT be a good example of what a programming language should be like. But Java applications are good examples of what applications SHOULDN'T be like.",
    // //     },
    // //     {
    // //       type: "ADD-TAGS-TO-TICKET",
    // //       dateTime: 1646574027,
    // //       userName: "Joyce Freeman",
    // //       tags: ["Live Issue", "Backend"],
    // //     },
    // //     {
    // //       type: "ADD-FILES-TO-TICKET",
    // //       dateTime: 1646569123,
    // //       userName: "Luke Cook",
    // //       files: ["document.csv"],
    // //       ticket: "PD-1092",
    // //     },
    // //   ],
    // //   id: "1",
    // // };

    // // return data;
    // return {
    //   userName: "Sergey Nikolaevich",
    //   taskCount: 1,
    //   // activeEventsData: [
    //   //   {
    //   //     id: "455rq3k0t0a27nvjrr403k6hke_20241004T083000Z",
    //   //     title: "[TG_CONTENT] Плануваня контент",
    //   //     start: "2024-10-04",
    //   //     end: "2024-10-04T12:00:00+03:00",
    //   //     time: "11:30",
    //   //     description:
    //   //       '👀Майдан возле Мака 🍆🍆 <br>Посилання на канал: <a href="https://t.me/+CgRxSj84NlI2MmNh">https://t.me/+CgRxSj84NlI2MmNh</a>',
    //   //     eventColor: "blue",
    //   //     link: "https://www.google.com/calendar/event?eid=NDU1cnEzazB0MGEyN252anJyNDAzazZoa2VfMjAyNDEwMDRUMDgzMDAwWiBzLnNvbG9kQG1lZ2FiaXRlLmNvbS51YQ",
    //   //     name: "31-08-24 solod megabite",
    //   //   },
    //   // ],
    //   activeEventsData,
    //   projectOverviewData: {
    //     chart: {
    //       weekly: {
    //         series: [
    //           {
    //             name: "31-08-24 solod megabite",
    //             data: [0, 1, 0, 0, 0, 0, 0],
    //           },
    //         ],
    //         total: 1,
    //         range: [
    //           "03 Oct",
    //           "04 Oct",
    //           "05 Oct",
    //           "06 Oct",
    //           "07 Oct",
    //           "08 Oct",
    //           "09 Oct",
    //         ],
    //       },
    //     },
    //   },
    //   myProjects: [
    //     {
    //       tgGroup: "Test group",
    //       tgGroupId: -1002086154595,
    //       img: "",
    //       projectName: "31-08-24 solod megabite",
    //       active: true,
    //       integrations: [
    //         {
    //           id: "google calendar",
    //           name: "Google Calendar",
    //           img: "/img/thumbs/google-calendar.png",
    //         },
    //         {
    //           id: "firebase schedule",
    //           name: "Firebase Schedule",
    //           img: "/img/thumbs/firebase-schedule.png",
    //         },
    //       ],
    //     },
    //   ],
    //   projectsData: [
    //     {
    //       type: "COMMENT",
    //       dateTime: 1646578417,
    //       userName: "Ron Vargas",
    //       userImg: "/img/avatars/thumb-3.jpg",
    //       comment:
    //         "Fine, Java MIGHT be a good example of what a programming language should be like. But Java applications are good examples of what applications SHOULDN'T be like.",
    //     },
    //   ],
    //   id: "1",
    // };
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
    [getProjectGoogleCalendarDashboardData.pending]: state => {
      console.log(`Google calendar loading data...`);
      state.loading = true;
    },
    [getProjectGoogleCalendarDashboardData.fulfilled]: (state, action) => {
      console.log(`Google calendar data loaded successfully`);
      state.dashboardData = action.payload;
      state.loading = false;
    },
    [getProjectGoogleCalendarDashboardData.rejected]: (state, action) => {
      console.error(
        `Google calendar failed to load data: ${action.error.message}`
      );
      state.loading = false;
    },
    [getProjectFireBaseDashboardData.pending]: state => {
      console.log(`Firebase loading data...`);
      state.loading = true;
    },
    [getProjectFireBaseDashboardData.fulfilled]: (state, action) => {
      console.log(`Firebase data loaded successfully`);
      state.dashboardData = action.payload;
      state.loading = false;
    },
    [getProjectFireBaseDashboardData.rejected]: (state, action) => {
      console.error(`Firebase failed to load data: ${action.error.message}`);
      state.loading = false;
    },
  },
});

export default dataSlice.reducer;
