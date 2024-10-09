import React, { useEffect, useState } from "react";
import reducer from "./store";
import { injectReducer } from "store/index";
import {
  getProjectGoogleCalendarDashboardData,
  getProjectFireBaseDashboardData,
} from "./store/dataSlice";
import { Loading } from "components/shared";
import ProjectDashboardHeader from "./components/ProjectDashboardHeader";
import TaskOverviewGoogleCalendar from "./components/TaskOverviewGoogleCalendar";
import TaskOverviewFireBase from "./components/TaskOverviewFireBase";
import MyProjects from "./components/MyProjects";
import Schedule from "./components/Schedule";

import { useDispatch, useSelector } from "react-redux";

injectReducer("projectDashboard", reducer);

const ProjectDashboard = () => {
  const dispatch = useDispatch();
  const [dashboardType, setDashboardType] = useState("firebase");
  const {
    userName,
    taskCount,
    projectOverviewData,
    myProjects,
    activeEventsData,
    // projectsData,
    // activitiesData,
  } = useSelector(state => state.projectDashboard.data.dashboardData);
  const loading = useSelector(state => state.projectDashboard.data.loading);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dashboardType]);

  const fetchData = () => {
    switch (true) {
      case dashboardType === "google-calendar":
        dispatch(getProjectGoogleCalendarDashboardData());
        break;

      case dashboardType === "firebase":
        dispatch(getProjectFireBaseDashboardData());
        break;

      default:
        break;
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <Loading loading={loading}>
        <ProjectDashboardHeader
          data={{ userName, taskCount }}
          setDashboardType={setDashboardType}
          dashboardType={dashboardType}
        />

        {dashboardType === "google-calendar" && (
          <div className="flex flex-col xl:flex-row gap-4">
            <div className="flex flex-col gap-4 flex-auto">
              <TaskOverviewGoogleCalendar data={projectOverviewData} />
              <MyProjects data={myProjects} />
            </div>
            <div className="flex flex-col gap-4">
              <div className="xl:w-[380px]">
                <Schedule activeEventsData={activeEventsData} />
              </div>
            </div>
          </div>
        )}
        {dashboardType === "firebase" && (
          <div className="flex flex-col xl:flex-row gap-4">
            <div className="flex flex-col gap-4 flex-auto">
              <TaskOverviewFireBase data={projectOverviewData} />
              <MyProjects data={myProjects} />
            </div>
            <div className="flex flex-col gap-4">
              <div className="xl:w-[380px]">
                <Schedule activeEventsData={activeEventsData} />
              </div>
            </div>
          </div>
        )}
      </Loading>
    </div>
  );
};

export default ProjectDashboard;
