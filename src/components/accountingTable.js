import React, { useEffect } from "react";
import { Link } from 'react-router-dom';
import { Col, Row, Button, Input } from "reactstrap";
import ToolkitProvider, {
  CSVExport
} from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

// BE status -> FE status
// 0 -> Created
// 1 -> Generating
// 2 -> Generated
// 3 -> Not Generated/Error

const AccountingTable = ({ tableData, searchQuery }) => {

  const { ExportCSVButton } = CSVExport;
  const statusFormatter = cell => {
    return (
      <>
        {cell === 0 ? (
          <Button className="btn-status" disabled color="primary">
            Creating
          </Button>
        ) : cell === 1 ? (
          <Button className="btn-status" disabled color="warning">
            Generating
          </Button>
        ) : cell === 2 ? (
          <Button className="btn-status" disabled color="success">
            Generated
          </Button>
        ) : (
          <Button className="btn-status" disabled color="danger">
            Not Generated
          </Button>
        )}
      </>
    );
  };

  const actionFormatter = (cell, row) => {
    return (
      <Link to={`/accounting/${row.id}/view`} className="btn btn-outline-primary">OPEN</Link>
    );
  };

  const downloadFormatter = cell =>
    cell ?
      (
        <a href={cell} target="blank">
          <Button className="btn-status" color="primary">
            <b>Download PDF</b>
          </Button>
        </a>
      ) : <b>Generating PDF</b>;

  const releaseFormatter = (cell, row) => {
    const SRC = row.release_artwork ? row.release_artwork.thumb_small : null;
    return (
      <div className="flexContainer">
        {SRC && <img style={{ width: 40, height: 40, borderRadius: '100%' }} src={SRC} alt={cell} />}
        <p className="fontWeight700">{cell}</p>
      </div>
    );
  };

  const columns = [
    {
      dataField: "release",
      text: "Release",
      sort: true,
      formatter: releaseFormatter,
      headerStyle: (colum, colIndex) => {
        return { width: "60px" };
      }
    },
    {
      dataField: "period",
      text: "Period",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "60px" };
      }
    },
    {
      dataField: "royalties",
      text: "Royalties",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "60px" };
      }
    },
    {
      dataField: "costs",
      text: "Costs",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "60px" };
      }
    },
    {
      dataField: "net_revenue",
      text: "Net Revenue",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "60px" };
      }
    },
    {
      dataField: "status",
      text: "Status",
      formatter: statusFormatter,
      sort: true,
      csvExport: false,
      headerStyle: (colum, colIndex) => {
        return { width: "60px" };
      }
    },
    {
      dataField: "report_pdf",
      text: "Accounting Report",
      formatter: downloadFormatter,
      headerStyle: (colum, colIndex) => {
        return { width: "60px" };
      }
    },
    {
      dataField: "open",
      text: "Details",
      formatter: actionFormatter,
      sort: false,
      csvExport: false,
      headerStyle: (colum, colIndex) => {
        return { width: "20px" };
      }
    }
  ];

  return (
    <ToolkitProvider
      keyField="id"
      data={tableData}
      columns={columns}
      search={{
        searchFormatted: true
      }}
      exportCSV={{
        fileName: 'accounting_reports.csv',
      }}
    >
      {props => (
        <div>
          <Row>
            <Col>
              <div className="customSearch">
                <Input placeholder="Search..." value={searchQuery.query} style={{ marginBottom: 10 }} onChange={e => searchQuery.setQuery(e.target.value)} />
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
          {Object.keys(props).length &&
            <BootstrapTable
              {...props.baseProps}
              bordered={false}
              remote={{ sort: false }}
            />
          }
        </div>
      )}
    </ToolkitProvider>
  );
};

export default AccountingTable;