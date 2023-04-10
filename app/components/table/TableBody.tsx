import React from "react";
import { Link } from "@remix-run/react";

type TableBodyProps = {
  columns: {
    label: string;
    accessor: string;
  }[];
  tableData: any;
  linkTitle: string;
  linkPath: string;
};

const TableBody: React.FC<TableBodyProps> = ({
  columns,
  tableData,
  linkTitle,
  linkPath,
}) => {
  return (
    <tbody>
      {tableData.map((data: any) => {
        return (
          <tr key={Math.random()}>
            {columns.map(({ accessor }) => {
              const tData = !data[accessor] ? "---" : data[accessor];
              return <td key={accessor}>{tData}</td>;
            })}
            {linkPath && (
              <th>
                <Link
                  className={"btn-primary btn-xs btn"}
                  to={`${linkPath}${data.id}`}
                >
                  {linkTitle}
                </Link>
              </th>
            )}
          </tr>
        );
      })}
    </tbody>
  );
};

export default TableBody;
