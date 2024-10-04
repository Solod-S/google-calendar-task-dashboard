import React, { useState, useEffect } from "react";
import { SegmentItemOption } from "components/shared";
import Segment from "components/ui/Segment";
import { HiOutlineCalendar, HiDatabase } from "react-icons/hi";

const roles = [
  {
    value: "google-calendar",
    label: "Google Calendar",
    icon: <HiOutlineCalendar />,
  },
  { value: "firebase", label: "Firebase", icon: <HiDatabase /> },
];

const DashboardSwitcher = ({ dashboardType, setDashboardType }) => {
  const [value, setValue] = useState(dashboardType);

  useEffect(() => {
    setValue(dashboardType);
  }, [dashboardType]);

  const handleChange = val => {
    setValue(val);
    setDashboardType(val);
  };

  return (
    <Segment value={value} onChange={handleChange}>
      <div className="flex flex-col xl:flex-row items-center gap-4">
        {roles.map(item => (
          <Segment.Item key={item.value} value={item.value}>
            {({ active, onSegmentItemClick }) => {
              return (
                <SegmentItemOption
                  hoverable
                  active={active}
                  className="bg-white dark:bg-gray-800 w-[250px]"
                  onSegmentItemClick={() => {
                    onSegmentItemClick();
                    handleChange(item.value); // Обновляем значение при клике
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <h6>{item.label}</h6>
                  </div>
                </SegmentItemOption>
              );
            }}
          </Segment.Item>
        ))}
      </div>
    </Segment>
  );
};

const ProjectDashboardHeader = ({ data, setDashboardType, dashboardType }) => {
  return (
    <div className="flex flex-col xl:flex-row justify-between gap-4">
      <div>
        <h4 className="mb-1">Hello, {data.userName}!</h4>
        <p>You have {data.taskCount} task(s) on hand.</p>
      </div>
      <DashboardSwitcher
        dashboardType={dashboardType}
        setDashboardType={setDashboardType}
      />
    </div>
  );
};

export default ProjectDashboardHeader;
