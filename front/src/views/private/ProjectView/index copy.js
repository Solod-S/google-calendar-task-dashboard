import React, { useState, useEffect } from "react";
import { Tabs, toast, Notification } from "components/ui";
import { AdaptableCard, Container } from "components/shared";

import isEmpty from "lodash/isEmpty";
import { Button } from "antd";
import FirebaseMyProjectsService from "services/FirebaseMyProjectsService";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "store/projects/projectDataSlice";

import General from "./components/General";
import Integration from "./components/Integration";
import Calendar from "./components/Calendar";

const { TabNav, TabList } = Tabs;

const settingsMenu = {
  profile: { label: "General", path: "profile" },
  integration: { label: "Integration", path: "integration" },
  Calendar: { label: "Calendar", path: "calendar" },
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
      toast.push(<Notification title={"Project updated"} type="success" />, {
        placement: "top-center",
      });

      setIsSubmitting(false);

      handleOk();
    } catch (error) {
      console.log(`error`, error);
    } finally {
      setIsSubmitting(false);
      setCurrentTab("profile");
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
          <Calendar
            show={currentTab === "Calendar"}
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
