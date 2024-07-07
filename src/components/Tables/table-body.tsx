import React from "react";

interface TableColumn {
  key: string;
  label: string;
}

interface TableBodyProps {
  columns: TableColumn[];
  data: any[];
}

const TableBody: React.FC<TableBodyProps> = ({ columns, data }) => {
  return (
    <tbody className="bg-zinc-200">
      {data.map((item, index) => (
        <tr key={index}>
          {columns.map((column) => (
            <td key={`${index}-${column.key}`} className="px-4 py-2">
              {item[column.key]}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};

export default TableBody;
