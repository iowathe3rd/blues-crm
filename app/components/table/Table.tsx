import React from "react";
import TableHead from "~/components/table/TableHead";
import TableBody from "~/components/table/TableBody";
import { useSortableTable } from "~/utils/useSortableTable";

export type TableProps = {
  data: {}[];
  columns: {
    label: string;
    accessor: string;
    sortable: boolean;
  }[];
  link: boolean;
  linkPath: string;
  linkTitle: string;
  tableType?: string;
};

const Table: React.FC<TableProps> = ({
  data,
  columns,
  link,
  linkTitle,
  linkPath,
  tableType = "table-normal",
}) => {
  const [tableData, handleSorting] = useSortableTable(data);
  return (
    <div className=" overflow-x-auto">
      <table
        className={`table-zebra table-compact table w-full md:${tableType}`}
      >
        <TableHead
          columns={columns}
          handleSorting={handleSorting}
          link={link}
        />
        <TableBody
          columns={columns}
          tableData={tableData}
          linkTitle={linkTitle}
          linkPath={linkPath}
        />
      </table>
    </div>
  );
};

export default Table;
