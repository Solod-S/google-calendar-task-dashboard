import React, { useState, useEffect, Suspense, lazy } from "react";
import { Tabs } from "components/ui";
import { AdaptableCard, Container } from "components/shared";
import { useNavigate, useLocation } from "react-router-dom";
import isEmpty from "lodash/isEmpty";
import { apiGetAccountSettingData } from "services/AccountServices";

const General = lazy(() => import("./components/General"));
const Integration = lazy(() => import("./components/Integration"));

const { TabNav, TabList } = Tabs;

const settingsMenu = {
  profile: { label: "General", path: "profile" },
  integration: { label: "Integration", path: "integration" },
};

const ProjectView = ({ handleOk, handleCancel }) => {
  const [currentTab, setCurrentTab] = useState("profile");

  const navigate = useNavigate();

  const location = useLocation();

  const onTabChange = val => {
    console.log(`val`, val);
    setCurrentTab(val);
    // navigate(`/app/account/settings/${val}`);
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
          <Suspense fallback={<></>}>
            {currentTab === "profile" && (
              <General handleOk={handleOk} handleCancel={handleCancel} />
            )}
            {currentTab === "integration" && <Integration />}
          </Suspense>
        </div>
      </AdaptableCard>
    </Container>
  );
};

export default ProjectView;
