import React, { useEffect, useState } from "react";
import { gapi } from "gapi-script";

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const SCOPES = "https://www.googleapis.com/auth/calendar.events.readonly";

const GoogleCalendar = () => {
  const [events, setEvents] = useState([]);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    function start() {
      gapi.load("client:auth2", () => {
        gapi.client
          .init({
            clientId: CLIENT_ID,
            discoveryDocs: [
              "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
            ],
            scope: SCOPES,
          })
          .then(() => {
            const authInstance = gapi.auth2.getAuthInstance();
            setIsAuthorized(authInstance.isSignedIn.get());
          });
      });
    }

    start();
    window.gapi.client
      .init({
        clientId: CLIENT_ID,

        scope: SCOPES,
      })
      .then(() => {
        const authInstance = window.gapi.auth2.getAuthInstance();
        authInstance.grantOfflineAccess().then(res => {
          console.log(res);
        });
      });
  }, []);

  // const handleAuthClick = () => {
  //   gapi.auth2
  //     .getAuthInstance()
  //     .signIn()
  //     .then(() => {
  //       const authInstance = gapi.auth2.getAuthInstance();
  //       const user = authInstance.currentUser.get();
  //       const authResponse = user.getAuthResponse();
  //       console.log(`authResponse`, authResponse);
  //       console.log("Access Token:", authResponse.access_token);
  //       console.log("ID Token:", authResponse.id_token);
  //       console.log("Refresh Token:", authResponse.refresh_token); // Обратите внимание, что рефреш-токен может не быть доступен здесь
  //       console.log("User Info:", user.getBasicProfile());

  //       setIsAuthorized(true);
  //       loadCalendarEvents();
  //     });
  // };

  const handleAuthClick = () => {
    gapi.auth2
      .getAuthInstance()
      .signIn({
        access_type: "offline",
      })
      .then(() => {
        const authInstance = gapi.auth2.getAuthInstance();
        // .grantOfflineAccess();

        const user = authInstance.currentUser.get();
        const authResponse = user.getAuthResponse();
        console.log(`user`, user);
        console.log(`authResponse`, authResponse);
        console.log("Access Token:", authResponse.access_token);
        console.log("ID Token:", authResponse.id_token);
        console.log("Refresh Token:", authResponse.refresh_token); // Теперь вы получаете рефреш-токен
        console.log("User Info:", user.getBasicProfile());

        setIsAuthorized(true);
        loadCalendarEvents();
      });
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
      });
  };

  return (
    <div>
      <h1>Google Calendar Integration</h1>
      <button onClick={handleAuthClick}>Authorize Google Calendar</button>
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
