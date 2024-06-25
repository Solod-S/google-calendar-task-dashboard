import axios from "axios";
import { gapi } from "gapi-script";

const GOOGLE_CALENDAR_CLIENT_ID =
  process.env.REACT_APP_GOOGLE_CALENDAR_CLIENT_ID;
const SCOPES = [
  "https://www.googleapis.com/auth/calendar.readonly",
  "https://www.googleapis.com/auth/tasks.readonly",
];

export const initGoogleApi = () => {
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
};

export const exchangeCodeForTokens = async SERVER_URL => {
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
};

export const listUpcomingEvents = async credentials => {
  try {
    gapi.client.setToken({ access_token: credentials.access_token });

    const response = await gapi.client.calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 99,
      showCompleted: false,
      orderBy: "startTime",
    });

    const events = response.result.items;
    console.log("Upcoming events:");
    if (events.length > 0) {
      console.log(`events`, events);
      // events.forEach(event => {
      //   console.log("Event details:");
      //   console.log("ID:", event.id);
      //   console.log("Summary:", event.summary);
      //   console.log("Description:", event.description || "No description");
      //   console.log("Location:", event.location || "No location");
      //   console.log("Start:", event.start.dateTime || event.start.date);
      //   console.log("End:", event.end.dateTime || event.end.date);
      //   console.log("Status:", event.status);
      //   console.log("HTML Link:", event.htmlLink);
      //   console.log("---");
      // });
    } else {
      console.log("No upcoming events found.");
    }
  } catch (error) {
    console.error("Error listing events:", error);
  }
};

export const listTasks = credentials => {
  gapi.client.setToken({ access_token: credentials.access_token });
  gapi.client.tasks.tasks
    .list({
      tasklist: "@default",
      maxResults: 99,
      showCompleted: false, // Исключить завершенные задачи
    })
    .then(response => {
      const tasks = response.result.items;
      console.log("Tasks:");
      if (tasks && tasks.length > 0) {
        const now = new Date();
        const upcomingTasks = tasks.filter(task => {
          if (!task.due) return true; // Включить задачи без даты завершения
          const dueDate = new Date(task.due);
          return dueDate >= now;
        });

        if (upcomingTasks.length > 0) {
          upcomingTasks.forEach(task => {
            console.log(`Task: ${task.title}`);
            console.log("Task details:", task); // Вывод всех параметров задачи
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
};

export const refreshGoogleCalendarTokens = async credentials => {
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
};
