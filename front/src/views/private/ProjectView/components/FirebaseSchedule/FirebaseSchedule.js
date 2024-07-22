import React, { useState } from "react";
import Customers from "./Customers";

const FirebaseSchedule = ({ show, generalData, setGeneralData }) => {
  return (
    <div
      style={{
        visibility: show ? "visible" : "hidden",
        position: show ? "" : "absolute",
      }}
    >
      <Customers generalData={generalData} setGeneralData={setGeneralData} />
    </div>
  );
};

export default FirebaseSchedule;
