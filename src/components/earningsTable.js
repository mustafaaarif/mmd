import React from "react";
import { 
  Col, 
  Row, 
  Button
} from "reactstrap";

import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

const EarningsTable = ({ tableData }) => {  

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  const monthFormatter = (cell, row) => {
    cell = months[cell - 1];
    return cell;
  };

  const amountFormatter = (cell, row) => `${cell.toFixed(2)} €`;

  const statusFormatter = cell =>
    cell === 0 ? (
      <Button className="btn-status" disabled color="warning">
        Open
      </Button>
    ) : cell === 1 ? (
      <Button className="btn-status" disabled color="success">
        Accounted
      </Button>
    ) : null;

  const columns = [
    {
      dataField: "month",
      text: "Month",
      sort: true,
      formatter: monthFormatter,
      headerStyle: (colum, colIndex) => {
        return { width: "120px" };
      }
    },
    {
      dataField: "year",
      text: "Year",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "120px" };
      }
    },
    {
      dataField: "total_revenue",
      text: "Revenue",
      sort: true,
      formatter: amountFormatter,
      headerStyle: (colum, colIndex) => {
        return { width: "120px" };
      }
    },
    {
      dataField: "status",
      text: "Status",
      sort: true,
      formatter: statusFormatter,
      headerStyle: (colum, colIndex) => {
        return { width: "120px" };
      }
    },
  ];


  return (
    <div>
      <ToolkitProvider
        keyField="id"
        data={tableData}
        columns={columns}
      >
        {props => (
          <div>
            <Row>
              <Col>
              </Col>
              <Col>
                <div className="flexEndContainer">
                </div>
              </Col>
            </Row>
            <BootstrapTable
              {...props.baseProps}
              bordered={ false }
              remote={ { sort: false } }
            />
          </div>
        )}
      </ToolkitProvider>
    </div>
  );
};

export default EarningsTable;
