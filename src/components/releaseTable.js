import React, { useState, useContext } from "react";
import { Col, Row, Button, Alert, Input } from "reactstrap";
import ToolkitProvider, {CSVExport} from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import ReleaseDropdown from "./releaseDropdown";
import ReleaseStoreUrls from "./releaseStoreUrls";
import QCNote from "./qcNote";
import ViewLayout from "../components/viewLayout";
import SubUserFilter from "./subUserFilter";

import { StateContext } from "../utils/context";

export const statusFormatter = cell => {
  return (
    <>
      {cell === "ready" ? (
        <Button className="btn-status-big" disabled color="info">
          Ready
        </Button>
      ) : cell === "approval" ? (
        <Button className="btn-status-big" disabled color="warning">
          Waiting approval
        </Button>
      ) : cell === "takedown_request" ? (
        <Button className="btn-status-big" disabled color="warning">
          Takedown request
        </Button>
      ) : cell === "taken_down" ? (
        <Button className="btn-status-big" disabled color="danger">
          Taken down
        </Button>
      ) : cell === "distributed" ? (
        <Button className="btn-status-big" disabled color="scooter">
          Distributed
        </Button>
      ) : cell === "locked" ? (
        <Button className="btn-status-big" disabled color="info">
          In Progress - Locked
        </Button>
      ) : cell === "unlocked" ? (
        <Button className="btn-status-big" disabled color="warning">
          Please Edit
        </Button>
      ) : cell === "offline" ? (
        <Button className="btn-status-big" disabled color="danger">
          Offline
        </Button>
      ) : cell === "re_delivery-delivery" ? (
        <Button className="btn-status-big" disabled color="warning">
          Re-delivery
        </Button>
      ) : cell === "re_delivery-editing" ? (
        <Button className="btn-status-big" disabled color="warning">
          Re-delivery Editing
        </Button>
      ) : (
        <Button className="btn-status" disabled>Unknown Status</Button>
      )}
    </>
  );
};

const qcNoteFormatter = (cell, row) => {
  return (
    <QCNote {...row} noteType={"Release"}></QCNote>
  );
};

const ReleaseTable = ({
  tableData,
  defaultSorted,
  forceUpdate,
  setForceUpdate,
  searchQuery,
  subUserData,
  todUrl,
  touUrl,
  ppUrl,
  canAddTakedown,
}) => {
  const { currentUser } = useContext(StateContext);

  const { ExportCSVButton } = CSVExport;

  const [successAction, setSuccessAction] = useState(false);

  function rowHighlightStyle(row, rowIndex) {
    let hasQCFeedback = !row.qc_passed && !row.edited_after_qc && row.qc_feedback.results && Object.keys(row.qc_feedback.results).length !== 0;
    if (hasQCFeedback) {
      return "qc-issues-alert";
    }
    return "";
  }

  const nameFormatter = (cell, row) => {
    const SRC = row.artwork ? row.artwork.thumb_small : null;
    return (
      <div className="flexContainer">
        {SRC && <img style={{width: 40, height: 40, borderRadius: '100%'}} src={SRC} alt={cell}/> }
        <p className="fontWeight700">{cell}</p>
      </div>
    );
  };

  const artistFormatter = (cell, row) => {
    return (
        <p className="fontWeight700">{cell}</p>
    );
  };

  const dateFormatter = (cell, row) => {
    return (
      <div className="releaseDate">
        <p>{cell}: Official</p>
        {row.exclusive_date ? (
          <p>{row.exclusive_date}: Exclusive</p>
        ) : (
          <p>No exclusive date</p>
        )}
      </div>
    );
  };

  const actionFormatter = (cell, row) => {
    return (
      <ReleaseDropdown
        {...row}
        action={{
          successAction,
          setSuccessAction,
          forceUpdate,
          setForceUpdate
        }}
        todUrl={todUrl}
        touUrl={touUrl}
        ppUrl={ppUrl}
        canAddTakedown={canAddTakedown}
      ></ReleaseDropdown>
    );
  };

  const storeUrlsFormatter = (cell, row) => {
    return (
      <ReleaseStoreUrls {...row}></ReleaseStoreUrls>
    );
  };

  const columns = [
    {
      dataField: "name",
      text: "Name",
      formatter: nameFormatter,
      sort: true,
    },
    {
      dataField: "name",
      hidden: true,
      csvExport: false
    },
    {
      dataField: "get_artists",
      text: "Artist",
      sort: false,
      formatter: artistFormatter
    },
    {
      dataField: "catalogue_number",
      text: "Cat. No.",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "175px" };
      }
    },
    {
      dataField: "official_date",
      text: "Release Date",
      sort: true,
      formatter: dateFormatter,
      headerStyle: (colum, colIndex) => {
        return { width: "180px" };
      }
    },
    {
      //date for search
      dataField: "official_date",
      hidden: true,
      csvExport: false,
    },
    {
      dataField: "status",
      text: "Status",
      sort: true,
      formatter: statusFormatter,
      headerStyle: (colum, colIndex) => {
        return { width: "160px" };
      }
    },
    {
      //action for search
      dataField: "status",
      hidden: true,
      csvExport: false
    },
    {
      dataField: "store_urls",
      text: "Store Urls",
      formatter: storeUrlsFormatter,
      sort: false,
      csvExport: false,
      headerStyle: (colum, colIndex) => {
        return { width: "80px" };
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
    }
  ];

  const handleTableChange = (type, { sortField, sortOrder, data }) => {
    const ascDesc = sortOrder === "desc" ? "-" : "";
    if (sortField === "name" || sortField === "status" || sortField === "official_date" || sortField === "catalogue_number") {
      searchQuery.setOrdering({order: ascDesc, name: sortField, sort: sortField});
    }
  }

  return (
    <>
      <ViewLayout title={"My releases list"}>
        <ToolkitProvider
          keyField="id"
          data={tableData}
          columns={columns}
          search={{
            searchFormatted: true
          }}
          exportCSV={ {
            fileName: 'release.csv',
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
                {
                  currentUser.is_premium_user && <SubUserFilter subUserData={subUserData} />
                }
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
                rowClasses={rowHighlightStyle}
                {...props.baseProps}
                bordered={ false }
                remote={ { sort: true } }
                defaultSorted={defaultSorted}
                onTableChange={handleTableChange}
              />
            </div>
          )}
        </ToolkitProvider>
      </ViewLayout>
      {successAction && (
        <Alert style={{ marginTop: 20, marginBottom: 0 }} color="success">
          Release updated!
        </Alert>
      )}
    </>
  );
};

export default ReleaseTable;
