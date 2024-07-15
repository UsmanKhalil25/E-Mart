import React from "react";
import Link from "next/link";
import { LinkObj } from "@/lib/type";

interface TableColumn {
  key: string;
  label: string;
}

interface TableBodyProps {
  redirectionUrl?: LinkObj;
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
            <td
              key={`${index}-${column.key}`}
              className="px-4 py-2 text-center"
            >
              {redirectionUrl ? (
                <Link
                  href={{
                    pathname: `${redirectionUrl.pathname}/${item.id}`,
                    query: redirectionUrl.query,
                  }}
                >
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
