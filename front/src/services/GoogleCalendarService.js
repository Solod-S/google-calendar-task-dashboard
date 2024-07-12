import axios from "axios";
import { isAfter } from "date-fns";
import { gapi } from "gapi-script";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const GOOGLE_CALENDAR_CLIENT_ID =
  process.env.REACT_APP_GOOGLE_CALENDAR_CLIENT_ID;
const SCOPES = [
  "https://www.googleapis.com/auth/calendar.readonly",
  "https://www.googleapis.com/auth/tasks.readonly",
];
const hasTag = (tags, title) => {
  return tags.some(tag => title?.includes(tag));
};

const transformEvents = ({ events, tgSelectors }) => {
  const filteredEvents = events.filter(
    event => event?.summary && event?.description && event?.start
  );

  console.log(`filteredEvents`, filteredEvents[0]);
  return filteredEvents.map(event => {
    const { id, summary, colorId = 3, htmlLink, hangoutLink } = event;

    // Определение цвета события на основе colorId (здесь можно добавить свои цвета)
    // const eventColor = getColorFromId(colorId);
    // const eventColor = getColorFromId(3);
    return {
      id,
      title: summary,
      start: event?.start?.dateTime?.split("T")[0] || event.start.date,
      end: event?.end?.dateTime || null,
      time:
        event?.start?.dateTime
          ?.split("T")[1]
          .replace(/\+.*/, "")
          .substring(0, 5) ||
        "11:00:00+03:00".replace(/\+.*/, "").substring(0, 5),
      description: event?.description || null,
      eventColor: hasTag(tgSelectors, summary)
        ? getColorFromId(1)
        : getColorFromId(3),
      link: htmlLink || hangoutLink || "",
    };
  });
};

const getColorFromId = colorId => {
  const colorMap = {
    1: "blue",
    2: "green",
    3: "red",
    4: "yellow",
    5: "purple",
  };

  return colorMap[colorId] || "defaultColor";
};

const GoogleCalendarService = {
  async initGoogleCalendar() {
    return new Promise((resolve, reject) => {
      function start() {
        gapi.client
          .init({
            clientId: GOOGLE_CALENDAR_CLIENT_ID,
            scope: SCOPES.join(" "),
          })
          .then(() => {
            return gapi.client.load("calendar", "v3");
          })
          .then(() => {
            return gapi.client.load("tasks", "v1");
          })
          .then(() => {
            resolve(gapi.auth2.getAuthInstance());
          })
          .catch(error => {
            console.error("Error initializing gapi client:", error);
            reject(error);
          });
      }

      gapi.load("client:auth2", start);
    });
  },

  async exchangeCodeForTokens() {
    try {
      const authInstance = gapi.auth2.getAuthInstance();
      const response = await authInstance.grantOfflineAccess({
        prompt: "consent",
      });

      const res = await axios.post(`${SERVER_URL}/exchange-code-to-token`, {
        code: response.code,
      });

      return res.data;
    } catch (error) {
      console.error("Error exchanging code:", error);
      return null;
    }
  },
  async getGoogleCalendarEvents(credentials) {
    try {
      gapi.client.setToken({ access_token: credentials.access_token });

      // Определяем текущую дату и дату через год
      const now = new Date();
      const oneYearFromNow = new Date(now);
      oneYearFromNow.setFullYear(now.getFullYear() + 1);

      const response = await gapi.client.calendar.events.list({
        calendarId: "primary",
        timeMin: now.toISOString(),
        timeMax: oneYearFromNow.toISOString(),
        showDeleted: false,
        singleEvents: true,
        orderBy: "startTime",
      });

      const events = response.result.items.filter(event => {
        if (
          !event?.summary ||
          !event?.description ||
          !event?.start ||
          !event?.start?.dateTime
        ) {
          return false; // Фильтруем, если нет необходимых полей
        }

        const eventStartDateTime = new Date(event.start.dateTime);

        return isAfter(eventStartDateTime, now); // Фильтруем, если событие начинается позже текущей даты и времени
      });

      const transformedEvents = transformEvents({
        events,
        tgSelectors: credentials.tgSelectors,
      });

      return transformedEvents;
    } catch (error) {
      console.error("Error listing events:", error);
    }
  },
  // async getGoogleCalendarEvents(credentials) {
  //   try {
  //     gapi.client.setToken({ access_token: credentials.access_token });
  //     // Определяем текущую дату и дату через год
  //     const now = new Date();
  //     const oneYearFromNow = new Date(now);
  //     oneYearFromNow.setFullYear(now.getFullYear() + 1);

  //     const response = await gapi.client.calendar.events.list({
  //       calendarId: "primary",
  //       timeMin: new Date().toISOString(),
  //       showDeleted: false,
  //       singleEvents: true,
  //       // maxResults: 99,
  //       showCompleted: false,
  //       orderBy: "startTime",
  //       timeMax: oneYearFromNow.toISOString(), // Добавляем параметр timeMax
  //     });

  //     const events = transformEvents({
  //       events: response.result.items,
  //       tgSelectors: credentials.tgSelectors,
  //     });
  //     return events;
  //   } catch (error) {
  //     console.error("Error listing events:", error);
  //   }
  // },

  async getGoogleCalendarTasks(credentials) {
    gapi.client.setToken({ access_token: credentials.access_token });
    gapi.client.tasks.tasks
      .list({
        tasklist: "@default",
        maxResults: 99,
        showCompleted: false,
      })
      .then(response => {
        const tasks = response.result.items;
        console.log("Tasks:");
        if (tasks && tasks.length > 0) {
          const now = new Date();
          const upcomingTasks = tasks.filter(task => {
            if (!task.due) return true;
            const dueDate = new Date(task.due);
            return dueDate >= now;
          });

          if (upcomingTasks.length > 0) {
            upcomingTasks.forEach(task => {
              console.log(`Task: ${task.title}`);
              console.log("Task details:", task);
            });
          } else {
            console.log("No upcoming tasks found.");
          }
        } else {
          console.log("No tasks found.");
        }
      })
      .catch(error => {
        console.error("Error listing tasks:", error);
      });
  },

  async refreshGoogleCalendarTokens(credentials) {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: GOOGLE_CALENDAR_CLIENT_ID,
        client_secret: process.env.REACT_APP_GOOGLE_CALENDAR_SECRET_ID,
        refresh_token: credentials.refresh_token,
        grant_type: "refresh_token",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to refresh access token");
    }

    const data = await response.json();
    return data;
  },
};

export default GoogleCalendarService;
