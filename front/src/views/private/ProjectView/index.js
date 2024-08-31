import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";

import FirebaseMyProjectsService from "services/FirebaseMyProjectsService";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "store/projects/projectDataSlice";

import Button from "../../../components/ui/Buttons";
import { Tabs, toast, Notification } from "components/ui";
import { AdaptableCard, Container } from "components/shared";

import General from "./components/General";
import Integration from "./components/Integration";
import Calendar from "./components/Calendar";
import FirebaseSchedule from "./components/FirebaseSchedule";
import GoogleSheets from "./components/GoogleSheets";

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
      setIsSubmitting(true);
      if (generalRef.current) {
        const isValid = await generalRef.current.validateForm();
        if (!isValid) {
          setIsSubmitting(false);
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
        setIsSubmitting(false);
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
      const hasActiveGoogleCalendar = generalData?.integrations?.find(
        integration =>
          integration.key === "google_calendar" && integration.active === true
      );

      const hasActiveFirebaseSchedule = generalData?.integrations?.find(
        integration =>
          integration.key === "firebase_schedule" && integration.active === true
      );

      const hasActiveGoogleSheets = generalData?.integrations?.find(
        integration =>
          integration.key === "google_sheets" && integration.active === true
      );

      const options = {
        general: { label: "General", path: "general" },
        integration: { label: "Integration", path: "integration" },
      };

      if (hasActiveGoogleCalendar)
        options.calendar = { label: "Calendar", path: "calendar" };

      if (hasActiveFirebaseSchedule)
        options.firebase_schedule = {
          label: "Firebase Schedule",
          path: "firebase-schedule",
        };

      if (hasActiveGoogleSheets)
        options.google_sheets = {
          label: "Google Sheets",
          path: "google-sheets",
        };

      setSettingsMenu(options);
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

            {settingsMenu.firebase_schedule && (
              <FirebaseSchedule
                show={currentTab === "firebase_schedule"}
                generalData={generalData}
                setGeneralData={setGeneralData}
              />
            )}
            {settingsMenu.google_sheets && (
              <GoogleSheets
                show={currentTab === "google_sheets"}
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
