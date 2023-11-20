import React, { useEffect, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import ViewLayout from "../../components/viewLayout";
import {getCookie} from "../../jwt/_helpers";
import axios from "axios";
import TableHelper from "../../components/tableHelper";
import ToolkitProvider, {CSVExport} from "react-bootstrap-table2-toolkit";
import {Alert, Col, Input, PopoverBody, Row, UncontrolledPopover} from "reactstrap";
import ReleaseDropdown from "../../components/releaseDropdown";
import { UrlSuffixFormatter } from "../../components/landingUrlSuffixFormatter";
import { setLandings } from "../../redux/landings/action";
import { connect } from 'react-redux';

const API_URL = process.env.REACT_APP_API_URL_BASE;
const X_API_KEY = process.env.REACT_APP_X_API_KEY;

const LandingPage = ({setLandings, tableData}) => {
  const tokenAPI = getCookie("token");
  const [loading, setLoading] = useState(false);
  const [testTableData, setTableData] = useState(tableData);
  const { ExportCSVButton } = CSVExport;
  const [successAction, setSuccessAction] = useState(false);

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
    async function getLandings(){
      setLoading(true)
      try{
        const resp = await axios.get(`${API_URL}demo-landingpage/`, options);
        if(resp.data.results){
          setLandings(resp.data.results)
          setLoading(false)
        }
      }catch (err){
        console.log('error', err)
        setLoading(false)
      }
    }

    getLandings()
  }, [])

  const actionFormatter = (cell, row) => {
    return (
      <ReleaseDropdown
        {...row}
        action={{
          successAction,
          setSuccessAction,
        }}
      >{''}</ReleaseDropdown>
    );
  };

  const urlSuffixFormatter = (cell, row) => {
    return <UrlSuffixFormatter {...row}>{''}</UrlSuffixFormatter>
  }

  const labels = {
    "2": 'Test Records',
    "3": 'asdasd',
    "4": 'Fabio Records',
    "6": 'fzgh',
    "1": 'Solamente',
    "8": 'Blasting Recordings',
    "9": 'Baile Musik Test',
    "7": 'SolamenteXXXX',
    "10": 'Hoss The Boss',
    "11": 'Lalala Records',
    "12": 'Future Is Now Records',
    "13": 'Sub User Label',
    "14": 'Crazy Tunes',
    "15": 'Volodymir Records',
  }

  const columns = [
    {
      dataField: 'name',
      text: 'Landing Page Name',
      headerStyle: (colum, colIndex) => {
        return { width: "200px" };
      }
    }, {
      dataField: 'label',
      text: 'Label',
      formatter: (cell) => labels[cell],
      headerStyle: (colum, colIndex) => {
        return { width: "180px" };
      }
    }, {
      dataField: 'theme',
      text: 'Mode',
      formatter: (cell) => cell === 1 ? 'Dark' : 'Light',
      headerStyle: (colum, colIndex) => {
        return { width: "180px" };
      }
    }, {
      dataField: 'url_suffix',
      text: 'Copy/Direct URL',
      formatter: urlSuffixFormatter ,
      headerStyle: () => ({
        width: "100px",
      })
    }, {
      dataField: "action",
      text: "Action",
      formatter: actionFormatter,
      headerStyle: (colum, colIndex) => {
        return { width: "111px" };
      }
    },
  ];


  return (
    <>
      {loading ? (
        <TableHelper loading />
      ): (
        <ViewLayout title={"landing pages list"}>
          {tableData.length > 0 && (
            <ToolkitProvider
              keyField="url_suffix"
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
                        <Input placeholder="Search..." />
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


const mapStateToProps = state => ({
  tableData: state.landings
});

const mapDispatchToProps = {
  setLandings,
};

export default connect(mapStateToProps, mapDispatchToProps)(LandingPage);
