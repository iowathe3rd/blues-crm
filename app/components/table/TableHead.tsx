import React, { useState } from "react";
import ArrowUp from "~/components/icons/ArrowUp";
import ArrowDown from "~/components/icons/ArrowDown";
import ArrowsUpDown from "~/components/icons/ArrowsUpDown";

type TableHeadProps = {
  columns: {
    label: string;
    accessor: string;
    sortable: boolean;
  }[];
  handleSorting: (sortField: string, sortOrder: string) => void;
  link: boolean;
};

const TableHead: React.FC<TableHeadProps> = ({
  columns,
  handleSorting,
  link,
}) => {
  const [sortField, setSortField] = useState<string>("");
  const [order, setOrder] = useState<string>("asc");

  const handleSortingChange = (accessor: string) => {
    const sortOrder =
      accessor === sortField && order === "asc" ? "desc" : "asc";
    setSortField(accessor);
    setOrder(sortOrder);
    handleSorting(accessor, sortOrder);
  };

  return (
    <thead>
      <tr>
        {columns.map(({ label, accessor, sortable }) => {
          return (
            <th
              key={accessor}
              onClick={sortable ? () => handleSortingChange(accessor) : null}
            >
              <span className={"flex items-center justify-start gap-2"}>
                {label}
                {sortable && (
                  <button className={"btn-ghost btn-xs btn bg-gray-300"}>
                    {sortable ? (
                      sortField === accessor && order === "asc" ? (
                        <ArrowUp />
                      ) : sortField === accessor && order === "desc" ? (
                        <ArrowDown />
                      ) : (
                        <ArrowsUpDown />
                      )
                    ) : (
                      ""
                    )}
                  </button>
                )}
              </span>
            </th>
          );
        })}
        {link && <th>Перейти</th>}
      </tr>
    </thead>
  );
};

export default TableHead;
