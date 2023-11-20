import React from "react";
import { Col, Row, Button, Input, Alert } from "reactstrap";
import ToolkitProvider, {
  CSVExport
} from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import TableHelper from "../components/tableHelper";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import AccountingModalConfirm from "../components/accountingModalConfirm";
import  { useState } from "react";

const AccountingItemsTable = ({
  tableData,
  error,
  loading,
}) => {


  const { ExportCSVButton } = CSVExport;

    //ajax handlers
    const [success, setSuccess] = useState(false);
    const [errorPut, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("Something went wrong! Please refresh page and try again!");
    const [openModal, setToggleModal] = useState(false);
    const [dataModal, setDataModal] = useState(null);
    const [rowId, setRowId] = useState(false);

  const sendReport = (report_id, email) => {
    setError(false);
    setErrorMsg("");
    setRowId(report_id);

    if(email)
    {
        setDataModal({
          report_id: report_id,
        });

        setToggleModal(true);
    }

    else
    {
      setError(true)
      setErrorMsg("Email for shareholder not present!")
    }
  }
  
  const downloadFormatter = cell =>
  cell ?
  (
    <a href={cell} target="blank">
    <Button className="btn-status" color="primary">
      <b>Download PDF</b>
    </Button>
    </a>
  ) : <b>Generating PDF</b>;

  const actionFormatter = (cell, row) => {
    return (
      <Button className="btn fa fa-lg fa-paper-plane p-2" color="primary" disabled={!row.email} onClick={() => sendReport(row.id, row.email)}></Button>
    );
  };
 
  const emailSentFormatter = (cell, row) =>
  cell ?
  (
    <span className="p-4">
      <i className="fas fa-2x fa-check-circle text-success" id={`${row.id}`}></i>
    </span>
  ) :     
  (
    <span className="p-4">
      <i className="fas fa-2x fa-times-circle text-danger" id={`${row.id}`}></i>
    </span>
  );

  const columns = [
    {
      dataField: "revenue_share_holder",
      text: "Shareholder",
      sort: true,
      formatter: cell => <span className="fontWeight700">{cell}</span>,
      headerStyle: (colum, colIndex) => {
        return { width: "80px" };
      }
    },
    {
      dataField: "revenue",
      text: "Net Shareholder Royalty",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "80px" };
      }
    },
    {
      dataField: "report_pdf",
      text: "Download PDF",
      formatter: downloadFormatter,
      headerStyle: (colum, colIndex) => {
        return { width: "80px" };
      }
    },
    {
      dataField: "action",
      text: "Action",
      formatter: actionFormatter,
      headerStyle: (colum, colIndex) => {
        return { width: "80px" };
      }
    },
    {
      dataField: "email_sent",
      text: "Email Sent",
      sort: true,
      formatter: emailSentFormatter,
      headerStyle: (colum, colIndex) => {
        return { width: "80px" };
      }
    },
  ];

  return (
    <>
      {
        <div>
            {success && (
              <Alert color="success">Accounting report has been sent!</Alert>
            )}
            {errorPut && (
              <Alert color="danger">
                {errorMsg}
              </Alert>
            )}
        </div>
      }
      {loading ? (
        <TableHelper loading />
      ) : error ? (
        <TableHelper error />
      ) : (
        <ToolkitProvider
          keyField="id"
          data={tableData}
          columns={columns}
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
      {
        <AccountingModalConfirm
          openModal={openModal}
          setToggleModal={setToggleModal}
          dataModal={dataModal}
          title={`Send Report To Shareholder`}
          setSuccess={setSuccess}
          setError={setError}
          body={`Are you sure you want to send report to shareholder ?`}
          apiURL={`accounting_reports/send-shareholder-report`}
          successMsg={`Report sent successfully!`}
          rowId={`${rowId}`}
        />
      }
    </>
  );
};

export default AccountingItemsTable;