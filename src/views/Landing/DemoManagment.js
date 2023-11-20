import React, { useEffect, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import ViewLayout from "../../components/viewLayout";
import {getCookie} from "../../jwt/_helpers";
import axios from "axios";
import TableHelper from "../../components/tableHelper";
import ToolkitProvider, {CSVExport} from "react-bootstrap-table2-toolkit";
import {Button, Col, Input, Row} from "reactstrap";
import ManagmentDropdown from "./ManagmentDropdown";

const API_URL = process.env.REACT_APP_API_URL_BASE;
const X_API_KEY = process.env.REACT_APP_X_API_KEY;


const LandingPage = props => {
  const tokenAPI = getCookie("token");
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { ExportCSVButton } = CSVExport;

  const options = {
    method: "POST",
    mode: 'cors',
    headers: {
      Authorization: `Bearer ${tokenAPI}`,
      "x-api-key": X_API_KEY,
      "Content-Type": "application/json"
    }
  }

  React.useEffect(() => {
    async function getDemoSubmissions(){
      setLoading(true)
      try{
        const resp = await axios.get(`${API_URL}demo-landingpage/submissions/`, options);
        if(resp.data){
          setTableData(resp.data)
          setLoading(false)
        }
      }catch (err){
        console.log('error', err)
        setLoading(false)
      }
    }

    getDemoSubmissions()
  }, [])

  const [forceUpdate, setForceUpdate] = useState(0);
  const [successAction, setSuccessAction] = useState(false);
  const actionFormatter = (cell, row) => {
    return (
      <ManagmentDropdown
        data={{...row}}
        action={{
          successAction,
          setSuccessAction,
          forceUpdate,
          setForceUpdate
        }}
      >{''}</ManagmentDropdown>
    );
  };

   const statusFormatter = cell => {
    return (
      <>
        {cell === 1 ? (
          <Button className="btn-status-big" disabled color="danger">
            SENT
          </Button>
        ) : cell === 2 ? (
          <Button className="btn-status-big" disabled color="warning">
            OPENED
          </Button>
        ) : cell === 3 ? (
          <Button className="btn-status-big" disabled color="success">
            REVIEWED
          </Button>
        ) : (
          <Button className="btn-status" disabled>N/A</Button>
        )}
      </>
    );
  };

  const columns = [
    {
      dataField: 'id',
      text: 'Landing Page Id'
    }, {
      dataField: 'artist_name',
      text: 'Artist'
    }, {
      dataField: 'created',
      text: 'Submission Date',
      formatter: (cell, row) => {
        const MyDate = new Date();
        return ('0' + MyDate.getDate()).slice(-2) + '.'
                + ('0' + (MyDate.getMonth()+1)).slice(-2) + '.'
                + MyDate.getFullYear();
      }
    }, {
      dataField: 'rating',
      text: 'Rating'
    }, {
      dataField: 'decision',
      text: 'Decision'
    },{
      dataField: 'status',
      text: 'Status',
      formatter: statusFormatter
    },
    {
      dataField: "action",
      text: "Action",
      formatter: actionFormatter,
      sort: false,
      csvExport: false,
      headerStyle: (colum, colIndex) => {
        return { width: "111px" };
      }
    }
  ];

  return (
    <>
      {loading ? (
        <TableHelper loading />
      ): (
        <ViewLayout title={"Demo submissions"}>

          {tableData.length > 0 && (
            <ToolkitProvider
              keyField="id"
              data={ tableData }
              columns={ columns }
              search={{
                searchFormatted: true
              }}
              exportCSV={ {
                fileName: 'release.csv',
              } }
            >
              {props => (
                <div>
                  <Row className="pb-3">
                    <Col>
                      <div className="customSearch">
                        <Input placeholder="Search..."/>
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
        </ViewLayout>
      )}
    </>
  );
};

export default LandingPage;
