import React, { useEffect, useCallback, useMemo, useState } from "react";
import { Avatar, Badge, toast, Notification } from "components/ui";
import { ConfirmDialog, DataTable } from "components/shared";
import { useDispatch, useSelector } from "react-redux";
import {
  getSchedule,
  removeScheduleById,
  setStartIndex,
  setTableData,
} from "../store/dataSlice";
import {
  setSelectedSchedule,
  setDrawerOpen,
  setSortedColumn,
} from "../store/stateSlice";
import useThemeClass from "utils/hooks/useThemeClass";
import EditDialog from "./EditDialog";

import cloneDeep from "lodash/cloneDeep";
import {
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineExclamationCircle,
} from "react-icons/hi";
import { Modal } from "antd";
import dayjs from "dayjs";

const inventoryStatusColor = {
  true: {
    label: "Enabled",
    dotClass: "bg-emerald-500",
    textClass: "text-emerald-500",
  },
  false: {
    label: "Disabled",
    dotClass: "bg-red-500",
    textClass: "text-red-500",
  },
};

const ActionColumn = ({ row, setGeneralData }) => {
  const { textTheme } = useThemeClass();
  const [isWarningVisible, setIsWarningVisible] = useState(false);
  const dispatch = useDispatch();

  const onEdit = () => {
    dispatch(setDrawerOpen());
    dispatch(setSelectedSchedule(row));
  };

  const onDelete = async () => {
    try {
      dispatch(removeScheduleById(row.id));

      const updateScheduleData = id => {
        setGeneralData(prevState => {
          const updatedIntegrations = prevState.integrations.map(
            integration => {
              if (integration.key === "firebase_schedule") {
                return {
                  ...integration,
                  scheduleData: integration.scheduleData.filter(
                    data => data.id !== id
                  ),
                };
              }
              return integration;
            }
          );
          return {
            ...prevState,
            integrations: updatedIntegrations,
          };
        });
      };
      updateScheduleData(row.id);
      toast.push(
        <Notification
          title={
            "Firebase schedule event have been successfully removed from the list"
          }
          type="success"
        />,
        {
          placement: "top-center",
        }
      );
    } catch (error) {
      toast.push(
        <Notification title={"Oops, something went wrong"} type="danger" />,
        {
          placement: "top-center",
        }
      );
    }
  };

  return (
    <div className="flex justify-end text-lg">
      <span
        className={`cursor-pointer p-2 hover:${textTheme}`}
        onClick={() => onEdit(row)}
      >
        <HiOutlinePencil />
      </span>
      <span
        className="cursor-pointer p-2 hover:text-red-500"
        onClick={() => setIsWarningVisible(true)}
      >
        <HiOutlineTrash />
      </span>
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center" }}>
            <HiOutlineExclamationCircle size={60} color="#EF4444" />{" "}
            <p style={{ marginLeft: "5px" }}> Warning</p>
          </div>
        }
        okButtonProps={{
          style: { backgroundColor: "#EF4444" },
        }}
        open={isWarningVisible}
        onOk={() => {
          onDelete();
          setIsWarningVisible(false);
        }}
        onCancel={() => setIsWarningVisible(false)}
      >
        <p>
          Are you sure you want to delete this? All data at this schedule will
          be deleted as well.
        </p>
      </Modal>
    </div>
  );
};

const NameColumn = ({ row }) => {
  return (
    <div className="flex items-center">
      <span className="ml-2 rtl:mr-2 capitalize"> {row.name}</span>
    </div>
  );
};

const columns = [
  {
    Header: "Name",
    accessor: "name",
    sortable: true,
    Cell: props => {
      const row = props.row.original;
      return <NameColumn row={row} />;
    },
  },
  {
    Header: "Status",
    accessor: "status",
    sortable: true,
    Cell: props => {
      const { status } = props.row.original;
      return (
        <div className="flex items-center gap-2">
          <Badge className={inventoryStatusColor[status].dotClass} />
          <span
            className={`capitalize font-semibold ${inventoryStatusColor[status].textClass}`}
          >
            {inventoryStatusColor[status].label}
          </span>
        </div>
      );
    },
  },
  {
    Header: "Created",
    accessor: "created",
    sortable: true,
    Cell: props => {
      const row = props.row.original;
      return (
        <div className="flex items-center">
          {dayjs.unix(row.createdUnix).format("MM/DD/YYYY, HH:mm")}
        </div>
      );
    },
  },
  {
    Header: "Updated",
    accessor: "updated",
    sortable: true,
    Cell: props => {
      const row = props.row.original;
      return (
        <div className="flex items-center">
          {dayjs.unix(row.updatedUnix).format("MM/DD/YYYY, HH:mm")}
        </div>
      );
    },
  },
  {
    Header: "",
    id: "action",
    accessor: row => row,
    Cell: props => (
      <ActionColumn
        row={props.row.original}
        setGeneralData={props.setGeneralData}
      />
    ),
  },
];

const Table = ({ generalData, setGeneralData }) => {
  const dispatch = useDispatch();
  const data = useSelector(state => state.firebaseSchedule.data.scheduleList);
  const loading = useSelector(state => state.firebaseSchedule.data.loading);
  const filterData = useSelector(
    state => state.firebaseSchedule.data.filterData
  );

  const { pageIndex, pageSize, sort, query, total } = useSelector(
    state => state.firebaseSchedule.data.tableData
  );

  const fetchData = useCallback(() => {
    dispatch(
      getSchedule({
        pageIndex,
        pageSize,
        sort,
        query,
        filterData,
        generalData,
      })
    );
  }, [pageIndex, pageSize, sort, query, filterData, dispatch, generalData]);

  useEffect(() => {
    dispatch(setStartIndex(1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchData();
  }, [pageIndex, pageSize, sort, filterData, fetchData]);

  const tableData = useMemo(
    () => ({ pageIndex, pageSize, sort, query, total }),
    [pageIndex, pageSize, sort, query, total]
  );

  const onPaginationChange = page => {
    const newTableData = cloneDeep(tableData);
    newTableData.pageIndex = page;
    dispatch(setTableData(newTableData));
  };

  const onSelectChange = value => {
    const newTableData = cloneDeep(tableData);
    newTableData.pageSize = Number(value);
    newTableData.pageIndex = 1;
    dispatch(setTableData(newTableData));
  };

  const onSort = (sort, sortingColumn) => {
    const newTableData = cloneDeep(tableData);
    newTableData.sort = sort;
    dispatch(setTableData(newTableData));
    dispatch(setSortedColumn(sortingColumn));
  };

  return (
    <>
      <DataTable
        columns={columns.map(col => ({
          ...col,
          Cell: props => {
            if (col.id === "action") {
              return (
                <ActionColumn
                  row={props.row.original}
                  setGeneralData={setGeneralData}
                />
              );
            }
            return col.Cell(props);
          },
        }))}
        data={data}
        skeletonAvatarColumns={[0]}
        skeletonAvatarProps={{ width: 28, height: 28 }}
        loading={loading}
        pagingData={{ pageIndex, pageSize, sort, query, total }}
        onPaginationChange={onPaginationChange}
        onSelectChange={onSelectChange}
        onSort={onSort}
      />
      <EditDialog setGeneralData={setGeneralData} />
    </>
  );
};

export default Table;
