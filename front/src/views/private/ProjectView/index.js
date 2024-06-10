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

const Settings = () => {
  const [currentTab, setCurrentTab] = useState("profile");
  const [data, setData] = useState({
    profile: {
      name: "Ron Vargas",
      email: "ronnie_vergas@infotech.io",
      title: "UI/UX Designer",
      avatar: "/img/avatars/thumb-3.jpg",
      timeZone: "GMT+8",
      lang: { value: "English", id: "1", label: "English" },
      syncData: false,
    },
    loginHistory: [
      {
        type: "Desktop",
        deviceName: "Desktop FKL-278",
        time: 1646818364,
        location: "Manhattan, United State",
      },
      {
        type: "Mobile",
        deviceName: "iPhone 13 Pro Max",
        time: 1646396117,
        location: "Manhattan, United State",
      },
      {
        type: "Tablet",
        deviceName: "iPad Air",
        time: 1646126117,
        location: "New York, United State",
      },
    ],
    notification: {
      news: ["app"],
      accountActivity: ["app"],
      signIn: ["app"],
      reminders: ["browser"],
      mentioned: ["email"],
      replies: ["email"],
      taskUpdate: ["email"],
      assigned: ["email", "app"],
      newProduct: ["browser", "app"],
      newOrder: ["browser"],
    },
    id: "1",
  });

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
            {currentTab === "profile" && <General data={data.profile} />}
            {currentTab === "integration" && <Integration />}
          </Suspense>
        </div>
      </AdaptableCard>
    </Container>
  );
};

export default Settings;
