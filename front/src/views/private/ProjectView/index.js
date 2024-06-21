import React, { useState, useEffect, lazy } from "react";
import { Tabs, toast, Notification } from "components/ui";
import { AdaptableCard, Container } from "components/shared";

import isEmpty from "lodash/isEmpty";
import { apiGetAccountSettingData } from "services/AccountServices";
import { Button } from "antd";
import FirebaseMyProjectsService from "services/FirebaseMyProjectsService";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "store/projects/projectDataSlice";

const General = lazy(() => import("./components/General"));
const Integration = lazy(() => import("./components/Integration"));

const { TabNav, TabList } = Tabs;

const settingsMenu = {
  profile: { label: "General", path: "profile" },
  integration: { label: "Integration", path: "integration" },
};

const ProjectView = ({
  handleOk,
  handleCancel,
  currentProjectData,
  setCurrentProjectData,
}) => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalData, setGeneralData] = useState({});
  const [currentTab, setCurrentTab] = useState("profile");

  const { pageIndex, pageSize, sort, query, total } = useSelector(
    state => state.projects.data.tableData
  );
  const filterData = useSelector(state => state.projects.data.filterData);

  const onTabChange = val => {
    setCurrentTab(val);
  };

  const fetchData = async () => {
    // const response = await apiGetAccountSettingData();
    // console.log(`response`, response);
    // setData(response.data);
  };

  const handleSubmit = async () => {
    try {
      if (generalData?.projectId) {
        await FirebaseMyProjectsService.edditProject({
          ...generalData,
          projectId: generalData.projectId,
        });
      } else {
        await FirebaseMyProjectsService.addProject(generalData);
      }

      dispatch(fetchProjects({ pageIndex, pageSize, sort, query, filterData }));
      setCurrentProjectData(null);
      toast.push(<Notification title={"Profile updated"} type="success" />, {
        placement: "top-center",
      });

      setIsSubmitting(false);
      handleOk();
    } catch (error) {
      console.log(`error`, error);
    } finally {
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    if (currentProjectData) {
      setGeneralData(currentProjectData);
    } else
      setGeneralData({
        name: "",
        category: "",
        description: "",
        active: false,
        img: "",
      });
  }, [currentProjectData]);

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
            generalData={generalData}
            setGeneralData={setGeneralData}
          />
          <Integration
            show={currentTab === "integration"}
            generalData={generalData}
            setGeneralData={setGeneralData}
          />
          <div className="mt-4 ltr:text-right">
            <Button
              className="ltr:mr-2 rtl:ml-2"
              color="red"
              type="button"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              variant="solid"
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving" : "Save"}
            </Button>
          </div>
        </div>
      </AdaptableCard>
    </Container>
  );
};

export default ProjectView;
