import React from "react";
import { 
  Col, 
  Row, 
  Button, 
  Input} from "reactstrap";

import ToolkitProvider, {
  CSVExport
} from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

const SubuserStatementViewOnlyTable = ({ tableData, searchQuery, defaultSorted }) => {  

  const { ExportCSVButton } = CSVExport;

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

  const currencies = ["€", "$", "£"];

  const monthFormatter = (cell, row) => {
    cell = months[cell - 1];
    return cell;
  };

  const nameFormatter = (cell, row) => {
    let cellFormatted = cell.replaceAll("Subuser", "User");
    return cellFormatted;
  };

  const amountFormatter = (cell, row) => `${cell}${currencies[row.currency]}`;

  const quartalFormatter = cell =>
    cell === 0
      ? "Q1"
      : cell === 1
      ? "Q2"
      : cell === 2
      ? "Q3"
      : cell === 3
      ? "Q4"
      : null;

  const statusFormatter = cell =>
    cell === 0 ? (
      <Button className="btn-status" disabled color="warning">
        Open
      </Button>
    ) : cell === 1 ? (
      <Button className="btn-status" disabled color="success">
        Paid
      </Button>
    ) : null;

  const typeFormatter = cell =>
    cell === 1
      ? (cell = "Licensing")
      : cell === 2
      ? "Regular"
      : cell === 3
      ? "Audio Mastering - Services"
      : cell === 4
      ? "Vinyl Earnings"
      : cell === 5
      ? "Offset"
      : "Not known";
    
  const downloadFormatter = cell =>
    cell ?
    (
      <a href={cell} download="">
      <Button className="btn-status" color="primary">
        <b>Download</b>
      </Button>
      </a>
    ) : null;

  const columns = [
    {
      dataField: "name",
      text: "Statement name",
      formatter: nameFormatter,
      csvFormatter: nameFormatter,
      sort: true
    },
    {
      dataField: "sts_kind",
      text: "Type",
      sort: true,
      formatter: typeFormatter,
      csvFormatter: typeFormatter,
      headerStyle: (colum, colIndex) => {
        return { width: "120px" };
      }
    },
    {
      dataField: "quartal",
      text: "Quarter",
      sort: true,
      formatter: quartalFormatter,
      csvFormatter: quartalFormatter,
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
      dataField: "month",
      text: "Month",
      sort: true,
      formatter: monthFormatter,
      csvFormatter: cell => months[cell - 1],
      headerStyle: (colum, colIndex) => {
        return { width: "120px" };
      }
    },
    {
      dataField: "short_description",
      text: "Description"
    },
    {
      dataField: "price",
      text: "Amount",
      sort: true,
      formatter: amountFormatter,
      csvFormatter: amountFormatter,
      headerStyle: (colum, colIndex) => {
        return { width: "120px" };
      }
    },
    {
      dataField: "status",
      text: "Status",
      sort: true,
      formatter: statusFormatter,
      csvFormatter: cell =>
        cell === 0 ? "Open" : cell === 1 ? "  Paid" : null,
      headerStyle: (colum, colIndex) => {
        return { width: "120px" };
      }
    },
    {
      dataField: "overview",
      text: "Overview",
      formatter: downloadFormatter,
      headerStyle: (colum, colIndex) => {
        return { width: "120px" };
      }
    },
    {
    dataField: "details",
      text: "Details",
      formatter: downloadFormatter,
      headerStyle: (colum, colIndex) => {
        return { width: "120px" };
      }
    },

    //data for search
    {
      dataField: "status",
      sort: false,
      csvExport: false,
      hidden: true,
      formatter: cell => (cell === 0 ? "Open" : cell === 1 ? "Paid" : null)
    }
  ];

  const handleTableChange = (type, { sortField, sortOrder, data }) => {
    const ascDesc = sortOrder === "desc" ? "-" : "";
    if (sortField === "kind" || sortField === "sts_kind" || sortField === "quartal" || sortField === "month" || sortField === "year" || sortField === "price") {
      searchQuery.setOrdering({order: ascDesc, name: sortField, sort: sortField});
    }
    if (sortField === "name") {
      searchQuery.setOrdering({order: ascDesc, name: "id", sort: sortField});
    }
  }


  return (
    <div>
      <ToolkitProvider
        keyField="id"
        data={tableData}
        columns={columns}
        search={{
          searchFormatted: true
        }}
        exportCSV={ {
          fileName: "subuser-statements.csv",
        } }
      >
        {props => (
          <div>
            <Row>
              <Col>
                <div className="customSearch">
                  <Input placeholder="Search..." value={searchQuery.query} style={{marginBottom: 10}} onChange={e => searchQuery.setQuery(e.target.value)}/>
                </div>
              </Col>
              <Col>
                <div className="flexEndContainer">
                                 
                  <ExportCSVButton
                    className="btn btn-outline-info"
                    {...props.csvProps}
                  >
                    Export CSV
                  </ExportCSVButton>
                </div>
              </Col>
            </Row>
            <BootstrapTable
              {...props.baseProps}
              bordered={ false }
              remote={ { sort: true } }
              defaultSorted={defaultSorted}
              onTableChange={handleTableChange}
            />
          </div>
        )}
      </ToolkitProvider>
    </div>
  );
};

export default SubuserStatementViewOnlyTable;
