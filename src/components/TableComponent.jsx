import React from "react";
import TableBlank from "./TableBlank";

const TableComponent = ({ columns, data, isLoading, renderActions, actionLabel = "Action" }) => {
  return (
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
            {renderActions && <th>{actionLabel}</th>}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={columns.length + (renderActions ? 1 : 0)} className="load_noData">
                Loading...
              </td>
            </tr>
          ) : data.length > 0 ? (
            data.map((row) => (
              <tr key={row.id}>
                {columns.map((column) => (
                  <td key={column.key}>{column.render ? column.render(row) : row[column.key]}</td>
                ))}
                {renderActions && (
                  <td>
                    <div className="table_action">
                      {renderActions(row)}
                    </div>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + (renderActions ? 1 : 0)} className="load_noData">
                <TableBlank />
              </td>
            </tr>
          )}
        </tbody>
      </table>
  );
};

export default TableComponent;
