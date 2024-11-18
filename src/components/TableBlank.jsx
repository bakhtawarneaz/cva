import React from "react";
import { FaRegFileAlt } from "react-icons/fa";

const TableBlank = ({ message = "No records available." }) => {
  return (
    <div className="table_blank">
        <FaRegFileAlt />
      <div className="table_blank_content">
        <p>{message}</p>
      </div>
    </div>
  );
};

export default TableBlank;
