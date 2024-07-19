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
      <Customers />
    </div>
  );
};

export default FirebaseSchedule;
