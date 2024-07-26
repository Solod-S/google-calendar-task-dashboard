import React, { useEffect, useCallback, useMemo, useState } from "react";
import { Avatar, Badge } from "components/ui";
import { ConfirmDialog, DataTable } from "components/shared";
import { useDispatch, useSelector } from "react-redux";
import {
  getCustomers,
  removeCustomerById,
  setTableData,
} from "../store/dataSlice";
import {
  setSelectedCustomer,
  setDrawerOpen,
  setSortedColumn,
} from "../store/stateSlice";
import useThemeClass from "utils/hooks/useThemeClass";
import CustomerEditDialog from "./CustomerEditDialog";

import cloneDeep from "lodash/cloneDeep";
import {
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineExclamationCircle,
} from "react-icons/hi";
import { Modal } from "antd";

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

const ActionColumn = ({ row }) => {
  const { textTheme } = useThemeClass();
  const [isWarningVisible, setisWarningVisible] = useState(false);
  const dispatch = useDispatch();

  const onEdit = () => {
    dispatch(setDrawerOpen());
    dispatch(setSelectedCustomer(row));
  };

  const onDelete = () => {
    dispatch(removeCustomerById(row.id));
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
        onClick={() => setisWarningVisible(true)}
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
          setisWarningVisible(false);
        }}
        onCancel={() => setisWarningVisible(false)}
      >
        <p>
          Are you sure you want to delete this?All data at this schedule will be
          deleted as well.
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
  // const { textTheme } = useThemeClass();

  // return (
  //   <div className="flex items-center">
  //     <Link
  //       className={`hover:${textTheme} ml-2 rtl:mr-2 font-semibold`}
  //       to={`/app/crm/customer-details?id=${row.id}`}
  //     >
  //       {row.name}
  //     </Link>
  //   </div>
  // );
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
    Header: "Ceated",
    accessor: "created",
    sortable: true,
    Cell: props => {
      const row = props.row.original;
      return (
        <div className="flex items-center">
          {row.created}
          {/* {dayjs.unix(row.created).format("MM/DD/YYYY")} */}
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
          {row.updated}
          {/* {dayjs.unix(row.updated).format("MM/DD/YYYY")} */}
        </div>
      );
    },
  },
  {
    Header: "",
    id: "action",
    accessor: row => row,
    Cell: props => <ActionColumn row={props.row.original} />,
  },
];

const Customers = ({ generalData, setGeneralData }) => {
  const dispatch = useDispatch();
  const data = useSelector(state => state.crmCustomers.data.customerList);
  const loading = useSelector(state => state.crmCustomers.data.loading);
  const filterData = useSelector(state => state.crmCustomers.data.filterData);

  const { pageIndex, pageSize, sort, query, total } = useSelector(
    state => state.crmCustomers.data.tableData
  );

  const fetchData = useCallback(() => {
    dispatch(
      getCustomers({
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
    const integrations = generalData?.integrations;

    const updateScheduleData = data => {
      setGeneralData(prevState => {
        const updatedIntegrations = prevState.integrations.map(integration => {
          if (integration.key === "firebase_schedule") {
            return {
              ...integration,
              scheduleData: data,
            };
          }
          return integration;
        });
        return {
          ...prevState,
          integrations: updatedIntegrations,
        };
      });
    };

    if (integrations) {
      const fireBaseSchedule = integrations.find(
        integration => integration.key === "firebase_schedule"
      );

      if (fireBaseSchedule) {
        updateScheduleData(data);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, pageSize, sort, filterData]);

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
        columns={columns}
        data={data}
        skeletonAvatarColumns={[0]}
        skeletonAvatarProps={{ width: 28, height: 28 }}
        loading={loading}
        pagingData={{ pageIndex, pageSize, sort, query, total }}
        onPaginationChange={onPaginationChange}
        onSelectChange={onSelectChange}
        onSort={onSort}
      />
      <CustomerEditDialog setGeneralData={setGeneralData} />
    </>
  );
};

export default Customers;
