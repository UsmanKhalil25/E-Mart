import React from "react";

interface TableColumn {
  key: string;
  label: string;
}

interface TableHeaderProps {
  columns: TableColumn[];
}

const TableHeader: React.FC<TableHeaderProps> = ({ columns }) => {
  return (
    <thead className="bg-zinc-900">
      <tr>
        {columns.map((column) => (
          <th
            key={column.key}
            className="px-4 py-2 text-center text-white/65 text-nowrap"
          >
            {column.label}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
