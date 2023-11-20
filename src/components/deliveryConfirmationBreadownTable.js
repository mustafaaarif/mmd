import React from "react";
import { Col, Row, Button } from "reactstrap";
import ToolkitProvider, {
  CSVExport
} from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import TableHelper from "../components/tableHelper";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

const DeliveryConfirmationBreakdownTable = ({
  tableData,
  error,
  loading,
}) => {

  const { ExportCSVButton } = CSVExport;

  const statusFormatter = cell => {
    return (
      <>
        {cell? (
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

  const statusCsvFormatter = cell => {
    let status = "UNDELIVERED";
    if (cell) {
      status = "DELIVERED";
    }
    return status;
  };

  const storeFormatter = cell => {
    return (
      <b>{cell}</b>
    );
  };

  const noteFormatter = cell => {
    let textColorClassName = "";
    if (cell.includes("Apple Music") || cell.includes("iTunes")) {
      textColorClassName = "text-danger";
    }
    else if(cell === "No deliveries possible at the moment") {
      textColorClassName = "text-warning";
    }
    return (
      <p className={textColorClassName}>{cell}</p>
    );
  };

  const columns = [
    {
      dataField: "store",
      text: "Store",
      formatter: storeFormatter,
      sort: false,
      csvExport: true,
      headerStyle: (colum, colIndex) => {
        return { width: "50px" };
      }
    },
    {
      dataField: "additionalNote",
      text: "Additional Notes",
      formatter: noteFormatter,
      sort: false,
      csvExport: true,
      headerStyle: (colum, colIndex) => {
        return { width: "100px" };
      }
    },
    {
      dataField: "status",
      text: "Status",
      formatter: statusFormatter,
      csvFormatter: statusCsvFormatter,
      sort: false,
      csvExport: true,
      headerStyle: (colum, colIndex) => {
        return { width: "50px" };
      }
    },
  ];

  return (
    <>
      {loading ? (
        <TableHelper loading />
      ) : error ? (
        <TableHelper error />
      ) : (
        <ToolkitProvider
          keyField="store"
          data={tableData}
          columns={columns}
          exportCSV={{
            fileName: 'dsp-delivery-details.csv',
          }}
        >
          {props => (
            <div>
              <Row>
                <Col>
                  <div className="m-5 m-5">
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
              />
            </div>
          )}
        </ToolkitProvider>
      )}
    </>
  );
};

export default DeliveryConfirmationBreakdownTable;