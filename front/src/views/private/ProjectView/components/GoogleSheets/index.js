import React from "react";

const GoogleSheets = ({ show, generalData, setGeneralData }) => {
  return (
    <div
      style={{
        visibility: show ? "visible" : "hidden",
        position: show ? "" : "absolute",
      }}
    >
      Google Sheets Schedule
    </div>
  );
};

export default GoogleSheets;
