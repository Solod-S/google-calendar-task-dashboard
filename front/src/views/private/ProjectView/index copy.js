import React, { useState, useEffect, lazy } from "react";
import { Tabs } from "components/ui";
import { AdaptableCard, Container } from "components/shared";

import isEmpty from "lodash/isEmpty";
import { apiGetAccountSettingData } from "services/AccountServices";
import { Button } from "antd";

const General = lazy(() => import("./components/General"));
const Integration = lazy(() => import("./components/Integration"));

const { TabNav, TabList } = Tabs;

const settingsMenu = {
  profile: { label: "General", path: "profile" },
  integration: { label: "Integration", path: "integration" },
};

const ProjectView = ({ handleOk, handleCancel, currentProjectData }) => {
  const [currentTab, setCurrentTab] = useState("profile");

  const onTabChange = val => {
    setCurrentTab(val);
  };

  const fetchData = async () => {
    // const response = await apiGetAccountSettingData();
    // console.log(`response`, response);
    // setData(response.data);
  };

  useEffect(() => {
    setCurrentTab("profile");
    // if (isEmpty(data)) {
    //   fetchData();
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <AdaptableCard>
        <Tabs value={currentTab} onChange={val => onTabChange(val)}>
          <TabList>
            {Object.keys(settingsMenu).map(key => (
              <TabNav key={key} value={key}>
                {settingsMenu[key].label}
              </TabNav>
            ))}
          </TabList>
        </Tabs>
        <div className="px-4 py-6">
          <General
            handleOk={handleOk}
            show={currentTab === "profile"}
            handleCancel={handleCancel}
            currentProjectData={currentProjectData}
          />
          <Integration show={currentTab === "integration"} />
          <div className="mt-4 ltr:text-right">
            <Button
              className="ltr:mr-2 rtl:ml-2"
              color="red"
              type="button"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button variant="solid" type="submit">
              Save
            </Button>
          </div>
        </div>
      </AdaptableCard>
    </Container>
  );
};

export default ProjectView;
