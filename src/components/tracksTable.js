import React, { useState, useEffect } from "react";
import axios from "axios";
import QCNote from "./qcNote";
import { Alert, Col, Button, Row, Card, CardBody, CardTitle } from "reactstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit";
import { useFetch } from "../utils/fetchHook";
import {  useLocation } from "react-router-dom";
import { getCookie } from "../jwt/_helpers/cookie";
import TableHelper from "../components/tableHelper";

import TracksUpdate from "../views/tracks/tracksUpdate";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

const API_URL = process.env.REACT_APP_API_URL_BASE;
const X_API_KEY = process.env.REACT_APP_X_API_KEY;

const pagination = paginationFactory({
  sizePerPageList: [
    { text: "10", value: 10 },
    { text: "25", value: 25 },
    { text: "50", value: 50 },
    { text: "100", value: 100 }
  ]
});

const TracksTable = () => {
  const { SearchBar, ClearSearchButton } = Search;
  const token = getCookie("token");
  const location = useLocation();
  const currentID = location.pathname.split("/")[2];

  const [selectedTrackToEdit, setTrackToEdit] = useState(false);
  const [successPATCH, successPATCHset] = useState(false);

  const [forceUpdate, forceUpdateSET] = useState(0);;

  const [data, error, loading] = useFetch("GET",`releases/${currentID}/`,token,false,forceUpdate);
  const [dataGenres] = useFetch( "GET", `genres/`, token, false);
  const [contributorRoles] = useFetch( "GET", `contributor-roles/`, token, false);
  const [shareholderRoles] = useFetch( "GET", `shareholder-roles/`, token, false);

  function rowHighlightStyle(row, rowIndex) {
    let hasQCFeedback = !row.qc_passed && !row.edited_after_qc;
    if (hasQCFeedback) {
      return "qc-issues-alert";
    }
    return "";
  }

  const setSuccessEdit = () => {
    successPATCHset(true);
    setTimeout(() => {
      successPATCHset(false);
    }, 3000);
  };

  const updateState = {
    forceUpdate,
    forceUpdateSET
  };
  const onEditClick = id => {
    setTrackToEdit(id);
    [].forEach.call(document.querySelectorAll("tbody tr"), function(el) {
      el.classList.remove("activeRow");
    });
    document
      .querySelector(`#rowEdit_${id}`)
      .closest("tr")
      .classList.add("activeRow");
  };

  const actionFormatter = (cell, row) => {
    return (
      <Button
        outline
        color="primary"
        id={`rowEdit_${row.id}`}
        onClick={() => onEditClick(row.id)}
      >
        Edit
      </Button>
    );
  };
  const mixFormatter = (cell, row) => (cell ? cell : "-");
  const nameFormatter = (cell, row) => <span className="fontWeight700">{cell}</span>;

  const lenghtFormatter = (cell, row) => {
    if (!cell) {
      return '';
    }
    let base = cell;
    let splited = base.split(":");
    splited[splited.length -1]  = splited[splited.length -1 ].substring(0,2)
    const newCell = splited.join(":");
    return newCell;
  };


  const trackCompleteFormatter = cell => {
    return (
      <>
        {cell ? (
          <Button className="btn-status" disabled color="success">
            Ready
          </Button>
        )
        :
          (
          <Button className="btn-status" disabled color="warning">
            Not Ready
          </Button>
        )}
      </>
    );
  };

  const trackAccStatusFormatter = cell => {
    return (
      <>
        {cell ? (
          <span className="p-4">
            <i className="fas fa-2x fa-check-circle text-success"></i>
          </span>
        )
        :
          (
            <span className="p-4">
              <i className="fas fa-2x fa-times-circle text-danger"></i>
            </span>
        )}
      </>
    );
  };

  const audioPlayerFormatter = (cell, row) => {
    const trackRes = cell && cell.length > 0 ? cell : row.resource;
    const trackType = cell && cell.length > 0 ? "audio/mp3" : "audio/wav";
    return (
      <audio
        controls
        id={'track_play_' + row.id}
        controlsList="nodownload"
        onPlay={() => handlePlayClick(row.id)}
      >
        <source src={trackRes} type={trackType} />
      Your browser does not support the audio element.
      </audio>
    )
  };

  const handlePlayClick = (id) => {
    const trArray = document.querySelectorAll('[id^="track_play_"]');
    trArray.forEach((audio) => {
      if ( !audio.paused && audio.id !== `track_play_${id}`){
          audio.pause();
      }
    });
  };

  const qcNoteFormatter = (cell, row) => {
    return (
      <QCNote {...row} noteType={"Track"}></QCNote>
    );
  };

  const columns = [
    {
      dataField: "name",
      text: "Name",
      sort: true,
      formatter: nameFormatter,
      headerStyle: (colum, colIndex) => {
        return { width: "190px" };
      }
    },
    {
      dataField: "mix_name",
      text: "Mix Name",
      sort: true,
      formatter: mixFormatter,
      headerStyle: (colum, colIndex) => {
        return { width: "135px" };
      }
    },
    {
      dataField: "track_lenght",
      text: "Mix Length",
      sort: true,
      formatter: lenghtFormatter,
      headerStyle: (colum, colIndex) => {
        return { width: "135px" };
      }
    },
    {
      dataField: "mp3_resource",
      text: "Player",
      sort: false,
      csvExport: false,
      formatter: audioPlayerFormatter,
      headerStyle: (colum, colIndex) => {
        return { width: "333px" };
      }
    },
    {
      dataField: "track_data_complete",
      text: "Status",
      sort: true,
      csvExport: false,
      formatter: trackCompleteFormatter,
      headerStyle: (colum, colIndex) => {
        return { width: "120px" };
      }
    },
    {
      dataField: "track_ready_for_accounting",
      text: "Acc Status",
      sort: true,
      csvExport: false,
      formatter: trackAccStatusFormatter,
      headerStyle: (colum, colIndex) => {
        return { width: "135px" };
      }
    },
    {
      dataField: "qc",
      text: "QC",
      formatter: qcNoteFormatter,
      sort: false,
      csvExport: false,
      headerStyle: (colum, colIndex) => {
        return { width: "80px" };
      }
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
    },
  ];

  const patchRelease = (ID, status) => {
    axios({
      method: "patch",
      mode: 'cors',
      url: `${API_URL}releases/${ID}/`,
      data: {
        status: status
      },
      headers: {
        Authorization: `Bearer ${token}`,
        "x-api-key": X_API_KEY,
        "Content-Type": "application/json"
      }
    }).then(function(response) {
      if (response.status === 200) {
        forceUpdateSET(forceUpdate + 1);
      }
    });
  };

  useEffect(() => {
    if (data.all_tracks_ready && data.status === "offline") {
      patchRelease(data.id, "ready");
    }
  }, [data]);

  return (
    <>
      <Card>
        <CardBody>
          <Row>
            <Col>
              <CardTitle tag="h4">Edit Tracks</CardTitle>
              {loading ? (
                <TableHelper loading />
              ) : error ? (
                <TableHelper error />
              ) : (
                <ToolkitProvider
                  keyField={"order"}
                  data={data.tracks}
                  columns={columns}
                  search={{
                    searchFormatted: true
                  }}
                  exportCSV
                >
                  {props => (
                    <div className="tracksTable">
                      <Row>
                        <Col>
                          <div className="customSearch">
                            <SearchBar {...props.searchProps} />
                            <ClearSearchButton
                              className="customClear"
                              text="x"
                              {...props.searchProps}
                            />
                          </div>
                        </Col>
                      </Row>
                      <BootstrapTable
                        rowClasses={rowHighlightStyle}
                        {...props.baseProps}
                        bordered={ false }
                        pagination={pagination}
                      />
                    </div>
                  )}
                </ToolkitProvider>
              )}
            </Col>
          </Row>
        </CardBody>
      </Card>

      {selectedTrackToEdit && (
        <TracksUpdate
          releaseData={data}
          id={selectedTrackToEdit}
          data={{
            dataGenres: dataGenres,
            contributorRoles,
            shareholderRoles
          }}
          updateState={updateState}
          setTrackToEdit={() => setTrackToEdit()}
          setSuccessEdit={() => setSuccessEdit()}
        />
      )}

      {successPATCH && (
        <Alert style={{ paddingTop: 20 }} color="success">
          Track has been updated!
        </Alert>
      )}
    </>
  );
};

export default TracksTable;
