import React from "react";
import moment from "moment";
import { Col, Row, Button, Input } from "reactstrap";
import ToolkitProvider, {
  CSVExport
} from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";


const PurchaseHistoryTable = ({ tableData, searchQuery, defaultSorted }) => {
  const { ExportCSVButton } = CSVExport;

  const creditsFormatter = (cell, row) => <b>{cell}</b>;

  const dateFormatter = (cell, row) => {
    return (
      moment(cell).format('YYYY-MM-DD')
    );
  };
  
  const receiptFormatter = cell =>
    cell ?
    (
      <a href={cell} target="blank">
      <Button className="btn-status" color="primary">
        <b>View</b>
      </Button>
      </a>
    ) : null;

  const columns = [    
    {
      dataField: "amount",
      text: "Credits Purchased",
      sort: true,
      formatter: creditsFormatter,
    },
    {
      dataField: "credits_balance",
      text: "Credits Balance",
      sort: true,
    },
    {
      dataField: "created",
      text: "Date of Purchase",
      sort: true,
      formatter: dateFormatter,
      csvFormatter: dateFormatter,
    },
    {
      dataField: "stripe_receipt_url",
      text: "Receipt",
      sort: false,
      formatter: receiptFormatter,
      headerStyle: (colum, colIndex) => {
        return { width: "120px" };
      }
    },
  ];

  const handleTableChange = (type, { sortField, sortOrder, data }) => {
    const ascDesc = sortOrder === "desc" ? "-" : "";
    if (sortField === "amount" || sortField === "credits_balance" || sortField === "created") {
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
        fileName: 'purchase-history.csv',
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

export default PurchaseHistoryTable;
