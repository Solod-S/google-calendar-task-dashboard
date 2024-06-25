import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import GoogleCalendarService from "services/GoogleCalendarService";

export const getEvents = createAsyncThunk(
  "crmCalendar/data/getEvents",
  async data => {
    return GoogleCalendarService.getGoogleCalendarEvents(data);
    // return [
    //   {
    //     id: "0",
    //     title: "All Day Event",
    //     start: "2024-06-01",
    //     eventColor: "orange",
    //   },
    //   {
    //     id: "1",
    //     title: "Long Event",
    //     start: "2024-06-07",
    //     end: "2024-06-10",
    //     eventColor: "red",
    //   },
    //   {
    //     id: "2",
    //     groupId: "999",
    //     title: "Repeating Event",
    //     start: "2024-06-09T16:00:00+00:00",
    //     eventColor: "blue",
    //   },
    //   {
    //     id: "3",
    //     groupId: "999",
    //     title: "Repeating Event",
    //     start: "2024-06-16T16:00:00+00:00",
    //     eventColor: "blue",
    //   },
    //   {
    //     id: "4",
    //     title: "Conference",
    //     start: "YEAR-MONTH-17",
    //     end: "2024-06-19",
    //     eventColor: "blue",
    //   },
    //   {
    //     id: "5",
    //     title: "Meeting",
    //     start: "2024-06-18T10:30:00+00:00",
    //     end: "2024-06-18T12:30:00+00:00",
    //     eventColor: "blue",
    //   },
    //   {
    //     id: "6",
    //     title: "Lunch",
    //     start: "2024-06-18T12:00:00+00:00",
    //     eventColor: "emerald",
    //   },
    //   {
    //     id: "7",
    //     title: "Birthday Party",
    //     start: "2024-06-19T07:00:00+00:00",
    //     eventColor: "purple",
    //   },
    //   {
    //     id: "8",
    //     title: "Meeting",
    //     start: "2024-06-18T14:30:00+00:00",
    //     eventColor: "blue",
    //   },
    //   {
    //     id: "9",
    //     title: "Happy Hour",
    //     start: "2024-06-18T17:30:00+00:00",
    //     eventColor: "cyan",
    //   },
    //   {
    //     id: "10",
    //     title: "Dinner",
    //     start: "2024-06-18T20:00:00+00:00",
    //     eventColor: "emerald",
    //   },
    // ];
  }
);

const dataSlice = createSlice({
  name: "crmCalendar/data",
  initialState: {
    loading: false,
    eventList: [],
  },
  reducers: {
    updateEvent: (state, action) => {
      state.eventList = action.payload;
    },
  },
  extraReducers: {
    [getEvents.fulfilled]: (state, action) => {
      state.eventList = action.payload;
    },
  },
});

export const { updateEvent } = dataSlice.actions;

export default dataSlice.reducer;
