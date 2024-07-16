import React from "react";

const FirebaseSchedule = ({ show, generalData, setGeneralData }) => {
  return (
    <div
      style={{
        visibility: show ? "visible" : "hidden",
        position: show ? "" : "absolute",
      }}
    >
      Firebase Schedule
    </div>
  );
};

export default FirebaseSchedule;
