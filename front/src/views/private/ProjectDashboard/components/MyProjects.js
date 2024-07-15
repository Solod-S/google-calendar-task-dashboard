import React, { useMemo } from "react";
import { Card, Button, Table, Badge, Avatar } from "components/ui";
import { useNavigate } from "react-router-dom";
import { UsersAvatarGroup, ActionLink } from "components/shared";
import { useTable } from "react-table";
import { FiPackage } from "react-icons/fi";

const { Tr, Th, Td, THead, TBody } = Table;

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

const NameColumn = ({ row }) => {
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

const MyProjects = ({ data = [] }) => {
  const navigate = useNavigate();

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "projectName",
        Cell: props => {
          const { projectName, img } = props.row.original;
          return <NameColumn row={{ name: projectName, img }} />;
        },
      },
      {
        Header: "Telegram Group",
        accessor: "tgGroup",
        Cell: props => {
          const { tgGroup, tgGroupId } = props.row.original;
          return (
            <ActionLink
              themeColor={false}
              className="font-semibold"
              to="#"
              title={`Group ID: ${tgGroupId}`}
            >
              {tgGroup}
            </ActionLink>
          );
        },
      },

      {
        Header: "Status",
        accessor: "active",
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
        Header: "Integration",
        accessor: "integrations",
        Cell: props => {
          const { integrations } = props.row.original;
          return <UsersAvatarGroup users={integrations} />;
        },
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, prepareRow, headerGroups, rows } =
    useTable({ columns, data, initialState: { pageIndex: 0 } });

  const onViewAllTask = () => {
    navigate("/projects");
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h4>My project(s)</h4>
        <Button onClick={onViewAllTask} size="sm">
          View All
        </Button>
      </div>
      <Table compact {...getTableProps()}>
        <THead>
          {headerGroups.map(headerGroup => (
            <Tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <Th {...column.getHeaderProps()}>{column.render("Header")}</Th>
              ))}
            </Tr>
          ))}
        </THead>
        <TBody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <Tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return (
                    <Td {...cell.getCellProps()}>{cell.render("Cell")}</Td>
                  );
                })}
              </Tr>
            );
          })}
        </TBody>
      </Table>
    </Card>
  );
};

export default MyProjects;
