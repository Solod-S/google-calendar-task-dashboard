import React, { useRef } from "react";
import { Button, toast, Notification } from "components/ui";
import { getSchedule, setTableData, setFilterData } from "../store/dataSlice";
import TableSearch from "./TableSearch";
import TableFilter from "./TableFilter";
import { useDispatch, useSelector } from "react-redux";
import cloneDeep from "lodash/cloneDeep";
import { setDrawerOpen } from "../store/stateSlice";

const TableTools = () => {
  const dispatch = useDispatch();

  const inputRef = useRef();

  const tableData = useSelector(state => state.firebaseSchedule.data.tableData);

  const handleInputChange = val => {
    const newTableData = cloneDeep(tableData);
    newTableData.query = val;
    newTableData.pageIndex = 1;
    if (typeof val === "string" && val.length > 1) {
      fetchData(newTableData);
    }

    if (typeof val === "string" && val.length === 0) {
      fetchData(newTableData);
    }
  };

  const fetchData = data => {
    dispatch(setTableData(data));
    dispatch(getSchedule(data));
  };

  const onClearAll = () => {
    const newTableData = cloneDeep(tableData);
    newTableData.query = "";
    inputRef.current.value = "";
    dispatch(setFilterData({ status: "" }));
    fetchData(newTableData);
  };

  const addNewSchedule = () => {
    dispatch(setDrawerOpen());
  };

  return (
    <div className="md:flex items-center justify-between">
      <div className="md:flex items-center gap-4">
        <TableSearch ref={inputRef} onInputChange={handleInputChange} />
        {/* <TableFilter /> */}
      </div>
      <div className="mb-4">
        <Button size="sm" onClick={addNewSchedule}>
          Add new
        </Button>
      </div>
    </div>
  );
};

export default TableTools;
