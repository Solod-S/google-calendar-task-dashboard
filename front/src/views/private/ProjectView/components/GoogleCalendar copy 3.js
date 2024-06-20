import React, { useEffect, useState } from "react";
import { gapi } from "gapi-script";
import axios from "axios";

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const SERVER_URL = process.env.REACT_APP_SERVER_URL;
// const SCOPES = [
//   "https://www.googleapis.com/auth/calendar.readonly",
//   "https://www.googleapis.com/auth/tasks.readonly",
// ];
const SCOPES = "https://www.googleapis.com/auth/tasks.readonly";

const GoogleCalendar = () => {
  const [events, setEvents] = useState([]);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: CLIENT_ID,
        scope: SCOPES,
      });
    }
    gapi.load("client:auth2", start);
  }, []);

  const handleAuthClick = async () => {
    try {
      const authInstance = gapi.auth2.getAuthInstance();
      console.log(`authInstance`, authInstance);
      const response = await authInstance.grantOfflineAccess({
        prompt: "consent",
      });
      console.log("Authorization Code:", response.code);

      // Отправляем код авторизации на сервер для обмена на токены
      const res = await axios.post(`${SERVER_URL}/exchange_code`, {
        code: response.code,
      });

      const data = res.data;
      console.log("Tokens:", data);
      setIsAuthorized(true);
      // loadCalendarEvents();
    } catch (error) {
      console.error("Error exchanging code:", error);
    }
  };

  const loadCalendarEvents = () => {
    gapi.client.calendar.events
      .list({
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: "startTime",
      })
      .then(response => {
        const events = response.result.items;
        setEvents(events);
      })
      .catch(error => {
        console.error("Error loading calendar events:", error);
      });
  };

  return (
    <div>
      <h1>Google Calendar Integration</h1>
      {!isAuthorized ? (
        <button onClick={handleAuthClick}>Authorize Google Calendar</button>
      ) : (
        <>
          <h2>Upcoming Events</h2>
          <ul>
            {events.map(event => (
              <li key={event.id}>
                {event.summary} ({event.start.dateTime || event.start.date})
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default GoogleCalendar;
