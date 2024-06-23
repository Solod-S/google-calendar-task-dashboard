import React, { useState, useEffect } from "react";
import {
  Button,
  Notification,
  toast,
  Switcher,
  Avatar,
  Card,
} from "components/ui";
import isEmpty from "lodash/isEmpty";
import { apiGetAccountSettingIntegrationData } from "services/AccountServices";
import cloneDeep from "lodash/cloneDeep";
import { Modal } from "antd";
import { gapi } from "gapi-script";
import axios from "axios";

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const SCOPES = [
  "https://www.googleapis.com/auth/calendar.readonly",
  "https://www.googleapis.com/auth/tasks.readonly",
];

const initialData = {
  installed: [],
  available: [
    {
      name: "Google Calendar",
      key: "google_calendar",
      desc: "Integrate with Google Calendar",
      detailet: `
        <p class="font-semibold text-gray-900 dark:text-gray-100">Your Telegram bot can synchronize with tasks and events from Google Calendar! This functionality allows you to:</p>
        <ul class="list-disc mt-2 ltr:ml-4 rtl:mr-4">
        <li class="mb-1"><strong>Synchronize tasks and events:</strong> The bot automatically fetches and displays your tasks and events from Google Calendar in an easy-to-read format.</li>
        <li class="mb-1"><strong>Set selectors:</strong> You can choose which tasks and events to display using various filters and criteria.</li>
        <li class="mb-1"><strong>And much more:</strong> The bot enables you to manage your tasks and events, receive notifications about upcoming events, and much more.</li>
        </ul>
        <p class="font-semibold text-gray-900 dark:text-gray-100">Make managing your tasks and events simpler and more convenient with the integration of Google Calendar with your Telegram bot!</p>
       `,
      img: "/img/thumbs/google-calendar.png",
      type: "Notifications and events",
      active: false,
    },
  ],
  id: "1",
};

const Integration = ({ show, generalData, setGeneralData }) => {
  const [data, setData] = useState(initialData);
  const [viewIntegration, setViewIntegration] = useState(false);
  const [integrationDetails, setIntegrationDetails] = useState({});
  const [installing, setInstalling] = useState(false);

  const handleCalendarClick = async () => {
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

  const listUpcomingEvents = credentials => {
    gapi.client.setToken({ access_token: credentials.access_token });
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
        console.log("Upcoming events:");
        if (events.length > 0) {
          events.forEach(event => {
            const start = event.start.dateTime || event.start.date;
            console.log(`${start} - ${event.summary}`);
          });
        } else {
          console.log("No upcoming events found.");
        }
      });
  };

  const listTasks = credentials => {
    gapi.client.setToken({ access_token: credentials.access_token });
    gapi.client.tasks.tasks
      .list({
        tasklist: "@default",
      })
      .then(response => {
        const tasks = response.result.items;
        console.log("Tasks:");
        if (tasks && tasks.length > 0) {
          tasks.forEach(task => {
            console.log(`${task.title}`);
          });
        } else {
          console.log("No tasks found.");
        }
      })
      .catch(error => {
        console.error("Error listing tasks:", error);
      });
  };

  useEffect(() => {
    function start() {
      gapi.client
        .init({
          clientId: CLIENT_ID,
          scope: SCOPES.join(" "),
        })
        .then(() => {
          return gapi.client.load("calendar", "v3");
        })
        .then(() => {
          return gapi.client.load("tasks", "v1");
        })
        .then(() => {
          gapi.auth2.getAuthInstance();
        })
        .catch(error => {
          console.error("Error initializing gapi client:", error);
        });
    }

    gapi.load("client:auth2", start);
  }, []);

  useEffect(() => {
    if (generalData?.integrations) {
      console.log(`generalData?.integrations`, generalData?.integrations);
      const newData = { ...initialData, installed: [], available: [] };

      initialData.available.forEach(availableItem => {
        const integrationItem = generalData.integrations.find(
          integration => integration.key === availableItem.key
        );

        if (integrationItem) {
          const mergedItem = { ...availableItem, ...integrationItem };
          newData.installed.push(mergedItem);
        } else {
          newData.available.push(availableItem);
        }
      });

      setData(newData);
    }
  }, [generalData]);

  const handleToggle = (bool, name, category) => {
    const updatedIntegrations = data[category].map(app => ({
      ...generalData.integrations.find(
        integration => integration.key === app.key
      ),
      active: !bool,
    }));

    setGeneralData(prevData => ({
      ...prevData,
      integrations: updatedIntegrations,
    }));
  };

  const onViewIntegrationOpen = (details, installed) => {
    setViewIntegration(true);
    setIntegrationDetails({ ...details, installed });
  };

  const onViewIntegrationClose = () => {
    setViewIntegration(false);
  };

  const handleInstall = async details => {
    try {
      setInstalling(true);
      toast.push(
        <Notification
          title="Installation of the application has started and it may take a few minutes."
          type="success"
        />,
        {
          placement: "top-center",
        }
      );
      let credentials = null;
      switch (details.name) {
        case "Google Calendar":
          credentials = await handleCalendarClick();
          break;

        default:
          break;
      }
      console.log(`credentials`, credentials);
      setGeneralData(prevData => {
        const integrations = prevData?.integrations ?? [];
        return {
          ...prevData,
          integrations: [
            ...integrations,
            {
              ...credentials,
              active: false,
              key: details.key,
              name: details.name,
            },
          ],
        };
      });
      setData(prevState => {
        const nextState = cloneDeep(prevState);
        const nextAvailableApp = prevState.available.filter(
          app => app.name !== details.name
        );
        nextState.available = nextAvailableApp;
        nextState.installed.push(details);
        return nextState;
      });
      setInstalling(false);
      onViewIntegrationClose();
      toast.push(<Notification title="App installed" type="success" />, {
        placement: "top-center",
      });
    } catch (error) {
      console.log(`Error: ${error}`);
    } finally {
      setInstalling(false);
    }
  };

  const handleUninstall = async details => {
    try {
      setInstalling(true);
      toast.push(
        <Notification
          title="Uninstall process started, it may take a few minutes."
          type="success"
        />,
        {
          placement: "top-center",
        }
      );

      setTimeout(() => {
        setGeneralData(prevData => {
          const integrations = prevData?.integrations ?? [];
          const result = integrations.filter(
            integration => integration.key !== details.key
          );

          return {
            ...prevData,
            integrations: result,
          };
        });

        toast.push(
          <Notification title="App was successfully removed" type="success" />,
          {
            placement: "top-center",
          }
        );

        setInstalling(false);
        onViewIntegrationClose();
      }, 2000);
    } catch (error) {
      console.log(`Error: ${error}`);
      setInstalling(false);
    }
  };

  const handleGetEventsAndTasks = () => {
    const googleCalendarCredentials = generalData.integrations.find(
      integration => integration.key === "google_calendar"
    );

    if (googleCalendarCredentials) {
      listUpcomingEvents(googleCalendarCredentials);
      listTasks(googleCalendarCredentials);
    } else {
      console.error("Google Calendar credentials not found.");
    }
  };

  return (
    <div
      style={{
        visibility: show ? "visible" : "hidden",
        position: show ? "" : "absolute",
      }}
    >
      <h5>Installed</h5>

      {data.installed.length === 0 && <p>No Apps Installed</p>}

      {data.installed.length > 0 && (
        <>
          {data.installed.map((installedApp, i) => (
            <Card
              bordered
              key={`installed-${i}`}
              className="mb-4"
              headerClass="bg-emerald-500 text-white rounded-tl-lg rounded-tr-lg"
              header={
                <div className="flex items-center gap-2">
                  <Avatar
                    shape="circle"
                    src={installedApp.img}
                    style={{ border: "2px solid white" }}
                  />
                  <h4 className="text-white">{installedApp.name}</h4>
                </div>
              }
              headerExtraClass="text-white"
              headerExtra={
                <div className="flex items-center gap-2">
                  <span>Enabled</span>
                  <Switcher
                    checked={installedApp.active}
                    onChange={val =>
                      handleToggle(
                        installedApp.active,
                        installedApp.name,
                        "installed"
                      )
                    }
                  />
                </div>
              }
            >
              <p>{installedApp.desc}</p>

              {installedApp.name === "Google Calendar" && (
                <>
                  <Button
                    variant="solid"
                    color="red-500"
                    size="xs"
                    onClick={() => handleUninstall(installedApp)}
                    disabled={installing}
                    // icon={<HiOutlineTrash />}
                    block
                  >
                    Uninstall
                  </Button>

                  <Button
                    variant="solid"
                    color="blue-500"
                    size="xs"
                    onClick={handleGetEventsAndTasks}
                    disabled={installing}
                    // icon={<HiOutlineRefresh />}
                    block
                  >
                    Refresh Events and Tasks
                  </Button>
                </>
              )}
            </Card>
          ))}
        </>
      )}

      <h5>Available</h5>
      {data.available.length === 0 && <p>No Apps Available</p>}

      {data.available.length > 0 && (
        <>
          {data.available.map((availableApp, i) => (
            <Card
              bordered
              key={`available-${i}`}
              className="mb-4"
              headerClass="bg-gray-100 rounded-tl-lg rounded-tr-lg"
              header={
                <div className="flex items-center gap-2">
                  <Avatar
                    shape="circle"
                    src={availableApp.img}
                    style={{ border: "2px solid white" }}
                  />
                  <h4 className="text-gray-900">{availableApp.name}</h4>
                </div>
              }
              headerExtraClass="text-gray-900"
              headerExtra={
                <Button
                  size="xs"
                  onClick={() => onViewIntegrationOpen(availableApp, false)}
                >
                  View Details
                </Button>
              }
            >
              <p>{availableApp.desc}</p>
            </Card>
          ))}
        </>
      )}

      <Modal
        title={integrationDetails.name}
        visible={viewIntegration}
        onCancel={onViewIntegrationClose}
        footer={[
          <Button key="back" onClick={onViewIntegrationClose}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => handleInstall(integrationDetails)}
            loading={installing}
          >
            {integrationDetails.installed ? "Reinstall" : "Install"}
          </Button>,
        ]}
      >
        <div
          dangerouslySetInnerHTML={{
            __html: integrationDetails.detailet,
          }}
        />
      </Modal>
    </div>
  );
};

export default Integration;
