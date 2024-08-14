import React, { useEffect, useMemo, useState } from "react";
import { Avatar, Badge } from "components/ui";
import { ActionLink, DataTable, UsersAvatarGroup } from "components/shared";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import { FiPackage } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProjects,
  setTableData,
} from "../../../../store/projects/projectDataSlice";
import {
  setSortedColumn,
  setSelectedProduct,
} from "../../../../store/projects/projectStateSlice";
import { toggleDeleteConfirmation } from "../../../../store/projects/projectStateSlice";
import useThemeClass from "utils/hooks/useThemeClass";
import ProductDeleteConfirmation from "./ProductDeleteConfirmation";
import cloneDeep from "lodash/cloneDeep";
import dayjs from "dayjs";
import FirebaseMyProjectsService from "services/FirebaseMyProjectsService";

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

const ActionColumn = ({ row, onEdit }) => {
  const dispatch = useDispatch();
  const { textTheme } = useThemeClass();

  const onDelete = async () => {
    dispatch(toggleDeleteConfirmation(true));
    dispatch(setSelectedProduct(row.projectId));
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
        onClick={onDelete}
      >
        <HiOutlineTrash />
      </span>
    </div>
  );
};

const ProductColumn = ({ row }) => {
  const avatar = row.img ? (
    <Avatar shape="circle" src={row.img} />
  ) : (
    <Avatar shape="circle" icon={<FiPackage />} />
  );

  return (
    <div className="flex items-center">
      {avatar}
      <span className={`ml-2 rtl:mr-2 font-semibold`}>{row.name}</span>
    </div>
  );
};

const ProductTable = ({ onEdit }) => {
  const dispatch = useDispatch();
  const [projects, setProjects] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const { pageIndex, pageSize, sort, query, total } = useSelector(
    state => state.projects.data.tableData
  );
  const filterData = useSelector(state => state.projects.data.filterData);
  const loading = useSelector(state => state.projects.data.loading);
  const data = useSelector(state => state.projects.data.projectList);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, pageSize, sort]);
  useEffect(() => {
    setProjects(data);
  }, [data]);

  useEffect(() => {
    const getCategories = async () => {
      const result = await FirebaseMyProjectsService.fetchProjectsCategories();

      if (result.data.length > 0) setCategoriesList(result.data);
    };
    getCategories();
  }, [projects]);

  const tableData = useMemo(
    () => ({ pageIndex, pageSize, sort, query, total }),
    [pageIndex, pageSize, sort, query, total]
  );

  const fetchData = () => {
    dispatch(fetchProjects({ pageIndex, pageSize, sort, query, filterData }));
  };

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
        sortable: true,
        Cell: props => {
          const row = props.row.original;
          return <ProductColumn row={row} />;
        },
      },
      {
        Header: "Category",
        accessor: "category",
        sortable: true,
        Cell: props => {
          const row = props.row.original;
          if (!categoriesList.length) return "none";

          const currentCategoryValue =
            categoriesList?.find(cat => cat.id === row.category)?.value ||
            "none";
          return <span className="capitalize">{currentCategoryValue}</span>;
        },
      },
      {
        Header: "Status",
        accessor: "active",
        sortable: true,
        Cell: props => {
          const { active } = props.row.original;
          return (
            <div className="flex items-center gap-2">
              <Badge className={inventoryStatusColor[active].dotClass} />
              <span
                className={`capitalize font-semibold ${inventoryStatusColor[active].textClass}`}
              >
                {inventoryStatusColor[active].label}
              </span>
            </div>
          );
        },
      },
      {
        Header: "Telegram Group",
        accessor: "tgGroup",
        Cell: props => {
          const { tgGroup } = props.row.original;
          return (
            <div className="flex items-center gap-2">
              <Badge
                className={inventoryStatusColor[Boolean(tgGroup)].dotClass}
              />
              <span
                className={`capitalize font-semibold ${
                  inventoryStatusColor[Boolean(tgGroup)].textClass
                }`}
              >
                {inventoryStatusColor[Boolean(tgGroup)].label}
              </span>
            </div>
          );
        },
      },
      {
        Header: "Created",
        accessor: "dateCreated",
        sortable: true,
        Cell: props => {
          const { dateCreated } = props.row.original;
          return (
            <span>
              {dayjs.unix(dateCreated.seconds).format("MM/DD/YYYY, HH:mm")}{" "}
            </span>
          );
        },
      },
      {
        Header: "Updated",
        accessor: "dateUpdated",
        sortable: true,
        Cell: props => {
          const { dateUpdated } = props.row.original;
          return (
            <span>
              {dayjs.unix(dateUpdated.seconds).format("MM/DD/YYYY, HH:mm")}{" "}
            </span>
          );
        },
      },
      {
        Header: "Active Integration",
        accessor: "integrations",
        Cell: props => {
          const { integrations } = props.row.original;
          const integrationsData = [];
          const googleCalendarIntegration = integrations.find(
            integration =>
              integration.name === "Google Calendar" && integration.active
          );

          const firebaseIntegration = integrations.find(
            integration =>
              integration.name === "Firebase Schedule" && integration.active
          );

          const googleSheetsIntegration = integrations.find(
            integration =>
              integration.name === "Google Sheets" && integration.active
          );

          if (googleCalendarIntegration) {
            integrationsData.push({
              id: "google calendar",
              name: "Google Calendar",
              img: "/img/thumbs/google-calendar.png",
            });
          }

          if (firebaseIntegration) {
            integrationsData.push({
              id: "firebase schedule",
              name: "Firebase Schedule",
              img: "/img/thumbs/firebase-schedule.png",
            });
          }

          if (googleSheetsIntegration) {
            integrationsData.push({
              id: "google sheets",
              name: "Google Sheets",
              img: "/img/thumbs/google-sheets.png",
            });
          }

          return <UsersAvatarGroup users={integrationsData} />;
        },
      },
      {
        Header: "",
        id: "action",
        accessor: row => row,
        Cell: props => (
          <ActionColumn row={props.row.original} onEdit={onEdit} />
        ),
      },
    ],
    [categoriesList, onEdit]
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
        data={projects}
        skeletonAvatarColumns={[0]}
        skeletonAvatarProps={{ className: "rounded-md" }}
        loading={loading}
        pagingData={tableData}
        onPaginationChange={onPaginationChange}
        onSelectChange={onSelectChange}
        onSort={onSort}
      />

      <ProductDeleteConfirmation />
    </>
  );
};

export default ProductTable;
