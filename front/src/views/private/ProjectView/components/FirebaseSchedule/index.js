import React, { useState } from "react";
import ScheduleView from "./ScheduleView";

const FirebaseSchedule = ({ show, generalData, setGeneralData }) => {
  return (
    <div
      style={{
        visibility: show ? "visible" : "hidden",
        position: show ? "" : "absolute",
      }}
    >
      <ScheduleView generalData={generalData} setGeneralData={setGeneralData} />
    </div>
  );
};

export default FirebaseSchedule;
