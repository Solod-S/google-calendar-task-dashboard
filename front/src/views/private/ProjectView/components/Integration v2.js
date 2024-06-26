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

  const listUpcomingEvents = () => {
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

  const listTasks = () => {
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
    listUpcomingEvents();
    listTasks();
  };

  return (
    <div
      style={{
        visibility: show ? "visible" : "hidden",
        position: show ? "" : "absolute",
      }}
    >
      <h5>Installed</h5>

      <div className="grid lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mt-4">
        {data?.installed?.map(app => (
          <Card
            bodyClass="p-0"
            key={app.name}
            footerClass="flex justify-end p-2"
            footer={
              <Button
                variant="plain"
                size="sm"
                onClick={() => onViewIntegrationOpen(app, true)}
              >
                View Integration
              </Button>
            }
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar
                    className="bg-transparent dark:bg-transparent"
                    src={app.img}
                  />
                  <div className="ltr:ml-2 rtl:mr-2">
                    <h6>{app.name}</h6>
                  </div>
                </div>
                <Switcher
                  onChange={val => handleToggle(val, app.name, "installed")}
                  checked={app.active}
                />
              </div>
              <p className="mt-6">{app.desc}</p>
              <Button
                variant="plain"
                size="sm"
                onClick={handleGetEventsAndTasks}
              >
                Get Events and Tasks
              </Button>
            </div>
          </Card>
        ))}
      </div>
      <div className="mt-10">
        <h5>Available</h5>
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mt-4">
          {data?.available?.map(app => (
            <Card
              bodyClass="p-0"
              key={app.name}
              footerClass="flex justify-end p-2"
              footer={
                <Button
                  variant="plain"
                  size="sm"
                  onClick={() => onViewIntegrationOpen(app, false)}
                >
                  View Integration
                </Button>
              }
            >
              <div className="p-6">
                <div className="flex items-center">
                  <Avatar
                    className="bg-transparent dark:bg-transparent"
                    src={app.img}
                  />
                  <div className="ltr:ml-2 rtl:mr-2">
                    <h6>{app.name}</h6>
                  </div>
                </div>
                <p className="mt-6">{app.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <Modal
        width={650}
        open={viewIntegration}
        onCancel={onViewIntegrationClose}
        footer={[
          <Button key="cancel" onClick={onViewIntegrationClose}>
            Cancel
          </Button>,
          integrationDetails.installed ? (
            <Button
              key="uninstall"
              type="primary"
              danger
              style={{ background: "red", color: "white" }}
              loading={installing}
              onClick={() => handleUninstall(integrationDetails)}
            >
              {installing ? "Uninstalling" : "Uninstall"}
            </Button>
          ) : (
            <Button
              key="install"
              type="primary"
              onClick={() => handleInstall(integrationDetails)}
              loading={installing}
            >
              {installing ? "Installing" : "Install"}
            </Button>
          ),
        ]}
      >
        <div className="flex items-center">
          <Avatar
            className="bg-transparent dark:bg-transparent"
            src={integrationDetails.img}
          />
          <div className="ltr:ml-3 rtl:mr-3">
            <h6>{integrationDetails.name}</h6>
            <span>{integrationDetails.type}</span>
          </div>
        </div>
        <div className="mt-6">
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            About {integrationDetails.name}
          </span>
          <div
            className="mt-2 mb-4"
            dangerouslySetInnerHTML={{ __html: integrationDetails.detailet }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Integration;
