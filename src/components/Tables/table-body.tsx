import React from "react";
import Link from "next/link";
interface TableColumn {
  key: string;
  label: string;
}

interface TableBodyProps {
  redirectionUrl?: string;
  columns: TableColumn[];
  data?: any[];
}

const TableBody: React.FC<TableBodyProps> = ({
  redirectionUrl,
  columns,
  data,
}) => {
  return (
    <tbody className="bg-zinc-300">
      {data?.map((item, index) => (
        <tr key={index} className="hover:bg-zinc-200">
          {columns.map((column) => (
            <td key={`${index}-${column.key}`} className="px-4 py-2">
              {redirectionUrl ? (
                <Link href={`${redirectionUrl}/${item.id}`}>
                  {item[column.key]}
                </Link>
              ) : (
                item[column.key]
              )}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};

export default TableBody;
