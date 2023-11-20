import React from "react";
import moment from "moment";
import { Link } from 'react-router-dom';
import { Col, Row, Button, Input } from "reactstrap";
import ToolkitProvider, {
  CSVExport
} from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

const DeliveryConfirmationTable = ({ tableData, searchQuery }) => {

  const { ExportCSVButton } = CSVExport;
  const statusFormatter = cell => {
    return (
      <>
        {cell === "PARTIALLY DELIVERED" ? (
          <Button className="btn-status" disabled color="warning">
            PARTIALLY
          </Button>
        ) : cell === "DELIVERED" ? (
          <Button className="btn-status" disabled color="primary">
            DELIVERED
          </Button>
        ) : (
          <Button className="btn-status" disabled color="danger">
            UNDELIVERED
          </Button>
        )}
      </>
    );
  };

  const ddexActionFormatter = cell => {
    return (
      <>
        {cell === "INSERT" ? (
          <Button className="btn-status" disabled color="primary">
            INSERT
          </Button>
        ) : cell === "FULL_UPDATE" ? (
          <Button className="btn-status" disabled color="info">
            FULL UPDATE
          </Button>
        ) : cell === "METADATA_UPDATE" ? (
          <Button className="btn-status" disabled color="secondary">
            META. UPDATE
          </Button>
        ) : cell === "TAKEDOWN" ? (
          <Button className="btn-status" disabled color="danger">
            TAKEDOWN
          </Button>
        ) : (
          <></>
        )}
      </>
    );
  };

  const actionFormatter = (cell, row) => {
    return (
      <Link to={`/delivery-list/${row.id}/view`} className="btn btn-outline-primary">OPEN</Link>
    );
  };

  const releaseFormatter = (cell, row) => {
    const SRC = row.release_artwork ? row.release_artwork.thumb_small : null;
    return (
      <div className="flexContainer">
        {SRC && <img style={{width: 40, height: 40, borderRadius: '100%'}} src={SRC} alt={cell}/> }
        <p className="fontWeight700">{cell}</p>
      </div>
    );
  };

  const dateFormatter = (cell, row) => {
    return (
      moment(cell).format('YYYY-MM-DD')
    );
  };

  const columns = [
    {
      dataField: "release_name",
      text: "Release",
      sort: false,
      csvExport: true,
      formatter: releaseFormatter,
      headerStyle: (colum, colIndex) => {
        return { width: "60px" };
      }
    },
    {
      dataField: "upc",
      text: "UPC Number",
      sort: false,
      csvExport: true,
      headerStyle: (colum, colIndex) => {
        return { width: "60px" };
      }
    },
    {
      dataField: "action",
      text: "Action",
      formatter: ddexActionFormatter,
      sort: false,
      csvExport: true,
      headerStyle: (colum, colIndex) => {
        return { width: "60px" };
      }
    },
    {
      dataField: "status",
      text: "Status",
      formatter: statusFormatter,
      sort: true,
      csvExport: true,
      headerStyle: (colum, colIndex) => {
        return { width: "60px" };
      }
    },
    {
      dataField: "created",
      text: "Delivery Date",
      formatter: dateFormatter,
      csvFormatter: dateFormatter,
      sort: true,
      csvExport: true,
      headerStyle: (colum, colIndex) => {
        return { width: "60px" };
      },
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
        fileName: 'release-delivery-list.csv',
      }}
    >
      {props => (
        <div>
          <Row>
            <Col>
              <div className="customSearch">
                 <Input placeholder="Search..."  value={searchQuery.query} style={{marginBottom: 10}} onChange={e => searchQuery.setQuery(e.target.value)} />
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
            remote={ { sort: false } }
          />
        </div>
      )}
    </ToolkitProvider>
  );
};

export default DeliveryConfirmationTable;