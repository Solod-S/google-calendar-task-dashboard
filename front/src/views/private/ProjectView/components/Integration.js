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

const Integration = ({ show, generalData, setGeneralData }) => {
  const [data, setData] = useState({
    installed: [],
    available: [
      {
        name: "Google Calendar",
        key: "integration_google_calendar",
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
  });
  const [viewIntegration, setViewIntegration] = useState(false);
  const [integrationDetails, setIntegrationDetails] = useState({});
  const [installing, setInstalling] = useState(false);

  const handleCalendarClick = async () => {
    try {
      const authInstance = gapi.auth2.getAuthInstance();
      const response = await authInstance.grantOfflineAccess({
        prompt: "consent",
      });
      console.log("Authorization Code:", response.code);

      // Отправляем код авторизации на сервер для обмена на токены
      const res = await axios.post(`${SERVER_URL}/exchange-code-to-token`, {
        code: response.code,
      });

      return res.data;
    } catch (error) {
      console.error("Error exchanging code:", error);
      return null;
    }
  };

  useEffect(() => {
    function start() {
      gapi.client
        .init({
          clientId: CLIENT_ID,
          scope: SCOPES.join(" "),
        })
        .then(() => {
          const authInstance = gapi.auth2.getAuthInstance();
          console.log("authInstance", authInstance);
        })
        .catch(error => {
          console.error("Error initializing gapi client:", error);
        });
    }

    gapi.load("client:auth2", start);
  }, []);

  useEffect(() => {
    // if (isEmpty(data)) {
    //   fetchData();
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggle = (bool, name, category) => {
    setData(prevState => {
      const nextState = cloneDeep(prevState);
      const nextCategoryValue = prevState[category].map(app => {
        if (app.name === name) {
          app.active = !bool;
        }
        return app;
      });
      nextState[category] = nextCategoryValue;
      return nextState;
    });
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
      setGeneralData(prevData => ({
        ...prevData,
        [details.key]: { ...credentials, active: false },
      }));
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
            <Button key="installed" type="primary" disabled>
              Installed
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
        // zIndex={1050}
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
