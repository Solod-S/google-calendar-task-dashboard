import React from "react";

const ProjectDashboardHeader = ({ data }) => {
  return (
    <div>
      <h4 className="mb-1">Hello, {data.userName}!</h4>
      <p>You have {data.taskCount} task(s) on hand.</p>
    </div>
  );
};

export default ProjectDashboardHeader;
