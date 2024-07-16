import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Tabs, toast, Notification } from "components/ui";
import { AdaptableCard, Container } from "components/shared";

import Button from "../../../components/ui/Buttons";
import FirebaseMyProjectsService from "services/FirebaseMyProjectsService";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "store/projects/projectDataSlice";
import General from "./components/General";
import Integration from "./components/Integration";
import Calendar from "./components/Calendar";
import FirebaseSchedule from "./components/FirebaseSchedule";

const { TabNav, TabList } = Tabs;

const ProjectView = forwardRef(
  (
    { handleOk, handleCancel, currentProjectData, setCurrentProjectData },
    ref
  ) => {
    const dispatch = useDispatch();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [generalData, setGeneralData] = useState({});
    const [currentTab, setCurrentTab] = useState("general");
    const [settingsMenu, setSettingsMenu] = useState({
      general: { label: "General", path: "general" },
      integration: { label: "Integration", path: "integration" },
    });

    const { pageIndex, pageSize, sort, query, total } = useSelector(
      state => state.projects.data.tableData
    );
    const filterData = useSelector(state => state.projects.data.filterData);

    const onTabChange = val => {
      setCurrentTab(val);
    };

    const generalRef = useRef();

    const handleSubmit = async () => {
      if (generalRef.current) {
        const isValid = await generalRef.current.validateForm();
        if (!isValid) {
          toast.push(
            <Notification title={"Validation failed"} type="danger" />,
            {
              placement: "top-center",
            }
          );
          setCurrentTab("general");
          return;
        }
        await generalRef.current.submitForm();
      }
      try {
        if (generalData?.projectId) {
          await FirebaseMyProjectsService.edditProject({
            ...generalData,
            projectId: generalData.projectId,
          });
        } else {
          console.log(`2`);
          await FirebaseMyProjectsService.addProject(generalData);
        }

        dispatch(
          fetchProjects({ pageIndex, pageSize, sort, query, filterData })
        );
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
        setCurrentTab("general");
      }
    };

    useEffect(() => {
      if (currentProjectData) {
        setGeneralData(currentProjectData);
      } else {
        setGeneralData({
          name: "",
          category: "",
          description: "",
          active: false,
          img: "",
          integrations: [],
        });
      }
    }, [currentProjectData]);

    useEffect(() => {
      const hasGoogleCalendar = generalData?.integrations?.find(
        integration => integration.key === "google_calendar"
      );
      const googleCalendarIsActive = generalData?.integrations?.find(
        integration => integration.active === true
      );

      if (hasGoogleCalendar && googleCalendarIsActive) {
        setSettingsMenu({
          general: { label: "General", path: "general" },
          integration: { label: "Integration", path: "integration" },
          calendar: { label: "Calendar", path: "calendar" },
          firebase_schedule: {
            label: "Firebase Schedule",
            path: "firebase schedule",
          },
        });
      } else {
        setSettingsMenu({
          general: { label: "General", path: "general" },
          integration: { label: "Integration", path: "integration" },
        });
      }
    }, [generalData]);

    useImperativeHandle(ref, () => ({
      getGeneralData: () => generalData,
    }));

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
              ref={generalRef}
              handleOk={handleOk}
              show={currentTab === "general"}
              generalData={generalData}
              setGeneralData={setGeneralData}
            />
            <Integration
              show={currentTab === "integration"}
              generalData={generalData}
              setGeneralData={setGeneralData}
            />
            <FirebaseSchedule />
            {settingsMenu.calendar && (
              <Calendar
                show={currentTab === "calendar"}
                generalData={generalData}
                setGeneralData={setGeneralData}
              />
            )}
            {settingsMenu.calendar && (
              <Calendar
                show={currentTab === "calendar"}
                generalData={generalData}
                setGeneralData={setGeneralData}
              />
            )}
            <div className="mt-4 ltr:text-right">
              <Button
                className="ltr:mr-2 rtl:ml-2"
                color="red"
                type="button"
                onClick={() => handleCancel(generalData)}
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
  }
);

export default ProjectView;
