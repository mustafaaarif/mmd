import React, { useContext } from "react";
import moment from "moment";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, {
  CSVExport
} from "react-bootstrap-table2-toolkit";
import { Col, Row, Input } from "reactstrap";
// import "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css";
// import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import TableDropdown from "./tableDropdown";
import MusicLinkUrl from "./musicLinkUrl";
import SubUserFilter from "./subUserFilter";

import { StateContext } from "../utils/context";

const MusicLinkTable = ({
  tableData,
  defaultSorted,
  setToggleModal,
  setDataModal,
  forceUpdate,
  setDeleteBody,
  searchQuery,
  urlpartsData,
  subUserData
}) => {
  const { currentUser } = useContext(StateContext);

  const { ExportCSVButton } = CSVExport;

  const actionFormatter = (cell, row) => {
    return (
      <TableDropdown
        data={row}
        setToggleModal={setToggleModal}
        setDataModal={setDataModal}
        setDeleteBody={setDeleteBody}
      />
    );
  };

  const nameFormatter = (cell, row) => {
    const SRC = row.image_small ? row.image_small : null;
    return (
      <div className="flexContainer">
        {SRC && <img style={{width: 40, height: 40, borderRadius: '100%'}} src={SRC} alt={cell}/> }
        <p className="fontWeight700">{cell}</p>
      </div>
    );
  };

  const storeUrlsFormatter = (cell, row) => {
    return (
      <MusicLinkUrl {...row} />
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
      formatter: nameFormatter,
      text: "Release Name",
      sort: true
    },
    {
      dataField: "artist_name",
      text: "Artists",
      sort: true
    },
    {
      dataField: "owner",
      text: "Owner",
      sort: true,
      csvExport: true,
    },
    {
      dataField: "created",
      text: "Created",
      formatter: dateFormatter,
      sort: true,
      csvExport: false,
    },
    {
      dataField: "spotify_url",
      text: "Music Link",
      formatter: storeUrlsFormatter,
      sort: false,
      csvExport: false,
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
    if (sortField === "release_name" || sortField === "artist_name" || sortField === "created") {
      searchQuery.setOrdering({order: ascDesc, name: sortField, sort: sortField});
    }
    if(sortField === "owner") {
      searchQuery.setOrdering({order: ascDesc, name: "created_by__username", sort: "created_by__username"});
    }
  }

  return (
    <>
      <ToolkitProvider
        keyField="id"
        data={tableData}
        columns={columns}
        search={{
          searchFormatted: true
        }}
        exportCSV={ {
          fileName: 'music-links.csv',
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
              {...props.baseProps}
              bordered={ false }
              defaultSorted={defaultSorted}
              remote={ { sort: true } }
              onTableChange={handleTableChange}
            />
          </div>
        )}
      </ToolkitProvider>
    </>
  );
};

export default MusicLinkTable;
