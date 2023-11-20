import React from "react";
import { Col, Row, Button, Input } from "reactstrap";
import ToolkitProvider, {
  CSVExport
} from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";


const InvoiceTable = ({ tableData, searchQuery, defaultSorted }) => {
  const { ExportCSVButton } = CSVExport;

  const currencies = ["€", "$", "£"];

  const amountFormatter = (cell, row) => `${cell}${currencies[row.currency]}`;
  
  const downloadFormatter = cell =>
    cell ?
    (
      <a href={cell} target="blank">
      <Button className="btn-status" color="primary">
        <b>Download</b>
      </Button>
      </a>
    ) : null;

  const columns = [
    {
      dataField: "issue_date",
      text: "Issue Date",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "120px" };
      }
    },    
    {
      dataField: "invoice_number",
      text: "Invoice Number",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "120px" };
      }
    },
    {
      dataField: "status",
      text: "Status",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "120px" };
      }
    },
    {
      dataField: "total_amount",
      text: "Total Amount",
      sort: true,
      formatter: amountFormatter,
      csvFormatter: amountFormatter,
      headerStyle: (colum, colIndex) => {
        return { width: "120px" };
      }
    },
    {
      dataField: "invoice_pdf",
      text: "Download PDF",
      formatter: downloadFormatter,
      headerStyle: (colum, colIndex) => {
        return { width: "50px" };
      }
    },

    //data for search
    {
      dataField: "name",
      sort: false,
      csvExport: false,
      hidden: true,
    }
  ];

  const handleTableChange = (type, { sortField, sortOrder, data }) => {
    const ascDesc = sortOrder === "desc" ? "-" : "";
    if (sortField === "issue_date" || sortField === "invoice_number" || sortField === "status" || sortField === "total_due") {
      searchQuery.setOrdering({order: ascDesc, name: sortField, sort: sortField});
    }
  }

  return (
    <ToolkitProvider
      keyField="id"
      data={tableData}
      columns={columns}
      search={{
        searchFormatted: true
      }}
      exportCSV={ {
        fileName: 'invoices.csv',
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
  );
};

export default InvoiceTable;
