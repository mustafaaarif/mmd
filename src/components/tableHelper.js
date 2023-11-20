import React from "react";
import {Spinner } from "reactstrap";

const TableHelper = ({ loading, error, padding }) => {
  return (
    <>
      {loading ? (
        <div className="tableHelper" style={{padding: padding ? "20px" : 0}} >
          <p style={{ color: "#000a60" }}>Loading</p>
          <Spinner size="sm" color="primary" />
        </div>
      ) : error ? (
        <div className="tableHelper">
          <p style={{ color: "#f62d51" }}>Error occured</p>
        </div>
      ) : (
        <div className="tableHelper" style={{flexDirection: 'column', alignItems: 'flex-start'}}>
          <p style={{ color: "#000a60" }}>There is no data available</p>
        </div>
      )}
    </>
  );
};

export default TableHelper;
