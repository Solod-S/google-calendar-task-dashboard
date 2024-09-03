import React from "react";
import { AdaptableCard } from "components/shared";
import Table from "./components/Table";
import TableTools from "./components/TableTools";
import Statistic from "./components/Statistic";
import { injectReducer } from "store/index";
import reducer from "./store";

injectReducer("firebaseSchedule", reducer);

const ScheduleView = ({ generalData, setGeneralData }) => {
  return (
    <>
      <Statistic />
      <AdaptableCard className="h-full" bodyClass="h-full">
        <TableTools />
        <Table generalData={generalData} setGeneralData={setGeneralData} />
      </AdaptableCard>
    </>
  );
};

export default ScheduleView;
