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

import cloneDeep from "lodash/cloneDeep";
import { Divider, Modal } from "antd";

import GoogleCalendarService from "services/GoogleCalendarService";

const { exchangeCodeForTokens } = GoogleCalendarService;

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
    {
      name: "Firebase Schedule",
      key: "firebase_schedule",
      desc: "Integrate with Firebase",
      detailet: `
      <p class="font-semibold text-gray-900 dark:text-gray-100">Firebase Schedule allows you to create recurring or scheduled events for sending messages to Telegram groups! This functionality provides you with the ability to:</p>
      <ul class="list-disc mt-2 ltr:ml-4 rtl:mr-4">
      <li class="mb-1"><strong>Schedule messages:</strong> You can create events to send messages to selected groups at a specified time.</li>
      <li class="mb-1"><strong>Recurring events:</strong> Create recurring events to automatically send messages on a regular basis.</li>
      <li class="mb-1"><strong>Easy management:</strong> Easily set up and manage scheduled events through your bot's intuitive interface.</li>
      </ul>
      <p class="font-semibold text-gray-900 dark:text-gray-100">Make communication in your Telegram groups more organized and efficient with the new scheduling features!</p>
      `,
      img: "/img/thumbs/firebase-schedule.png",
      type: "Notifications and events",
      active: false,
    },
    {
      name: "Google Sheets",
      key: "google_sheets",
      desc: "Integrate with Google Sheets",
      detailet: `
      <p class="font-semibold text-gray-900 dark:text-gray-100">Google Sheets Schedule allows you to add your Google Sheets to create recurring or scheduled events for sending messages to Telegram groups! This functionality provides you with the ability to:</p>
      <ul class="list-disc mt-2 ltr:ml-4 rtl:mr-4">
      <li class="mb-1"><strong>Add Google Sheets:</strong> Easily integrate your Google Sheets to use them for scheduling messages.</li>
      <li class="mb-1"><strong>Schedule messages:</strong> Create events to send messages to selected groups at a specified time based on data from the sheets.</li>
      <li class="mb-1"><strong>Recurring events:</strong> Use data from the sheets to create recurring events to automatically send messages on a regular basis.</li>
      <li class="mb-1"><strong>Easy management:</strong> Easily set up and manage scheduled events through your bot's intuitive interface.</li>
      </ul>
      <p class="font-semibold text-gray-900 dark:text-gray-100">Make communication in your Telegram groups more organized and efficient with the new scheduling features using Google Sheets!</p>
      `,
      img: "/img/thumbs/google-sheets.png",
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
  const [isWarningVisible, setisWarningVisible] = useState(false);

  const closeAndReset = async () => {
    setisWarningVisible(false);
  };

  useEffect(() => {
    if (generalData?.integrations) {
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
    const updatedIntegrations = data[category].map(app => {
      if (app.name === name) {
        return { ...app, active: !bool };
      }
      return app;
    });

    setData(prevData => ({
      ...prevData,
      [category]: updatedIntegrations,
    }));

    setGeneralData(prevData => {
      const updatedGeneralIntegrations = prevData.integrations.map(
        integration => {
          if (integration.name === name) {
            return { ...integration, active: !bool };
          }
          return integration;
        }
      );
      return {
        ...prevData,
        integrations: updatedGeneralIntegrations,
      };
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
      const instalingData = {
        credentials: null,
        active: false,
        key: details.key,
        name: details.name,
      };

      switch (details.name) {
        case "Google Calendar":
          instalingData.tgSelectors = [];
          instalingData.credentials = await exchangeCodeForTokens();
          break;

        case "Firebase Schedule":
          instalingData.scheduleData = [];
          break;

        default:
          break;
      }

      setGeneralData(prevData => {
        const integrations = prevData?.integrations ?? [];
        return {
          ...prevData,
          integrations: [...integrations, instalingData],
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
      <Divider />
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
              // onClick={() => handleUninstall(integrationDetails)}
              onClick={() => setisWarningVisible(true)}
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
      <Modal
        title="Warning..."
        okButtonProps={{
          style: { backgroundColor: "#4F46E5" },
        }}
        open={isWarningVisible}
        onOk={() => {
          handleUninstall(integrationDetails);
          closeAndReset();
        }}
        onCancel={() => closeAndReset()}
      >
        <p>
          Are you sure you want to delete integration with{" "}
          {integrationDetails.name}?
        </p>
      </Modal>
    </div>
  );
};

export default Integration;
