import React from "react";
import TableBlank from "./TableBlank";
import Loading from "./Loading";

const TableComponent = ({ columns, data, isLoading, renderActions, actionLabel = "Action", skeletonRowCount = 10, onRowClick }) => {

  const renderSkeletonRows = () => {
    return Array.from({ length: skeletonRowCount }).map((_, rowIndex) => (
      <tr key={`skeleton-${rowIndex}`}>
        {columns.map((_, colIndex) => (
          <td key={`skeleton-cell-${rowIndex}-${colIndex}`}>
            <Loading height={65} />
          </td>
        ))}
        {renderActions && (
          <td>
            <Loading height={65} />
          </td>
        )}
      </tr>
    ));
  };

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
            renderSkeletonRows()
          ) : data.length > 0 ? (
            data.map((row) => (
              <tr 
                key={row.id}
                onClick={() => onRowClick && onRowClick(row)}
                style={{ cursor: onRowClick ? "pointer" : "default" }}
              >
                {columns.map((column) => (
                  <td key={column.key}>{column.render ? column.render(row) : row[column.key]}</td>
                ))}
                {renderActions && (
                  <td>
                    <div className="table_action" onClick={(e) => e.stopPropagation()}>
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
