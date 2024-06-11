import React, { useEffect, useMemo, useState } from "react";
import { Avatar, Badge } from "components/ui";
import { DataTable } from "components/shared";
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
import { useNavigate } from "react-router-dom";
import cloneDeep from "lodash/cloneDeep";
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

const ActionColumn = ({ row }) => {
  const dispatch = useDispatch();
  const { textTheme } = useThemeClass();
  const navigate = useNavigate();

  const onEdit = () => {
    navigate(`/app/sales/product-edit/${row.id}`);
  };

  const onDelete = () => {
    dispatch(toggleDeleteConfirmation(true));
    dispatch(setSelectedProduct(row.id));
  };

  return (
    <div className="flex justify-end text-lg">
      <span
        className={`cursor-pointer p-2 hover:${textTheme}`}
        onClick={onEdit}
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
    <Avatar src={row.img} />
  ) : (
    <Avatar icon={<FiPackage />} />
  );

  return (
    <div className="flex items-center">
      {avatar}
      <span className={`ml-2 rtl:mr-2 font-semibold`}>{row.name}</span>
    </div>
  );
};

const ProductTable = () => {
  const dispatch = useDispatch();
  const [projects, setProjects] = useState([]);
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
          return <span className="capitalize">{row.category}</span>;
        },
      },
      {
        Header: "Status",
        accessor: "status",
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
        Header: "Created",
        accessor: "created",
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
        accessor: "updated",
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
        Header: "",
        id: "action",
        accessor: row => row,
        Cell: props => <ActionColumn row={props.row.original} />,
      },
    ],
    []
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
