import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  Notification,
  toast,
  Switcher,
  Avatar,
  Card,
} from "components/ui";
import isEmpty from "lodash/isEmpty";
import { apiGetAccountSettingIntegrationData } from "services/AccountServices";
import cloneDeep from "lodash/cloneDeep";

const Integration = () => {
  const [data, setData] = useState({
    installed: [
      {
        name: "Google Drive",
        desc: "Upload your files to Google Drive",
        img: "/img/thumbs/google-drive.png",
        type: "Cloud storage",
        active: true,
      },
      {
        name: "Slack",
        desc: "Post to a Slack channel",
        img: "/img/thumbs/slack.png",
        type: "Notifications and events",
        active: true,
      },
      {
        name: "Notion",
        desc: "Retrieve notion note to your project",
        img: "/img/thumbs/notion.png",
        type: "Content management",
        active: false,
      },
    ],
    available: [
      {
        name: "Jira",
        desc: "Create Jira issues",
        img: "/img/thumbs/jira.png",
        type: "Project management",
        active: false,
      },
      {
        name: "Zendesk",
        desc: "Exchange data with Zendesk",
        img: "/img/thumbs/zendesk.png",
        type: "Customer service",
        active: false,
      },
      {
        name: "Dropbox",
        desc: "Exchange data with Dropbox",
        img: "/img/thumbs/dropbox.png",
        type: "Cloud storage",
        active: false,
      },
      {
        name: "Github",
        desc: "Exchange files with a GitHub repository",
        img: "/img/thumbs/github.png",
        type: "Code repositories",
        active: false,
      },
      {
        name: "Gitlab",
        desc: "Exchange files with a Gitlab repository",
        type: "Code repositories",
        img: "/img/thumbs/gitlab.png",
        active: false,
      },
      {
        name: "Figma",
        desc: "Exchange screenshots with Figma",
        img: "/img/thumbs/figma.png",
        type: "Design tools",
        active: false,
      },
      {
        name: "Adobe XD",
        desc: "Exchange screenshots with Adobe XD",
        img: "/img/thumbs/adobe-xd.png",
        type: "Design tools",
        active: false,
      },
      {
        name: "Sketch",
        desc: "Exchange screenshots with Sketch",
        img: "/img/thumbs/sketch.png",
        type: "Design tools",
        active: false,
      },
      {
        name: "Hubspot",
        desc: "Exchange data with Hubspot",
        img: "/img/thumbs/hubspot.png",
        type: "Content management",
        active: false,
      },
      {
        name: "Zapier",
        desc: "Integrate with hundreds of services.",
        img: "/img/thumbs/zapier.png",
        type: "Notifications and events",
        active: false,
      },
    ],
    id: "1",
  });
  const [viewIntegration, setViewIntegration] = useState(false);
  const [intergrationDetails, setIntergrationDetails] = useState({});
  const [installing, setInstalling] = useState(false);

  // const fetchData = async () => {
  //   const response = await apiGetAccountSettingIntegrationData();
  //   // setData(response.data);
  //   console.log(`response.data`, response.data);
  // };

  // useEffect(() => {
  //   if (isEmpty(data)) {
  //     fetchData();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

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
    setIntergrationDetails({ ...details, installed });
  };

  const onViewIntegrationClose = () => {
    setViewIntegration(false);
  };

  const handleInstall = details => {
    setInstalling(true);
    setTimeout(() => {
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
    }, 1000);
  };

  return (
    <>
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
                View Intergration
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
                  View Intergration
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
      <Dialog
        width={650}
        isOpen={viewIntegration}
        onClose={onViewIntegrationClose}
        onRequestClose={onViewIntegrationClose}
      >
        <div className="flex items-center">
          <Avatar
            className="bg-transparent dark:bg-transparent"
            src={intergrationDetails.img}
          />
          <div className="ltr:ml-3 rtl:mr-3">
            <h6>{intergrationDetails.name}</h6>
            <span>{intergrationDetails.type}</span>
          </div>
        </div>
        <div className="mt-6">
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            About {intergrationDetails.name}
          </span>
          <p className="mt-2 mb-4">
            Wings medium plunger pot, redeye doppio siphon froth iced. Latte,
            and, barista cultivar fair trade grinder caramelization spoon.
            Whipped, grinder to go brewed est single shot half and half. Plunger
            pot blue mountain et blue mountain grinder carajillo, saucer half
            and half milk instant strong.
          </p>
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            Key Features
          </span>
          <ul className="list-disc mt-2 ltr:ml-4 rtl:mr-4">
            <li className="mb-1">
              Fair trade, cortado con panna, crema foam cinnamon aged.{" "}
            </li>
            <li className="mb-1">
              Mug saucer acerbic, caffeine organic kopi-luwak galão siphon.{" "}
            </li>
            <li className="mb-1">
              To go half and half cultivar single origin ut, french press.{" "}
            </li>
            <li className="mb-1">
              Mocha latte flavour cortado cup kopi-luwak.{" "}
            </li>
          </ul>
        </div>
        <div className="text-right mt-6">
          <Button
            className="ltr:mr-2 rtl:ml-2"
            variant="plain"
            onClick={onViewIntegrationClose}
          >
            Cancel
          </Button>
          {intergrationDetails.installed ? (
            <Button disabled variant="solid">
              Installed
            </Button>
          ) : (
            <Button
              variant="solid"
              onClick={() => handleInstall(intergrationDetails)}
              loading={installing}
            >
              Install
            </Button>
          )}
        </div>
      </Dialog>
    </>
  );
};

export default Integration;
