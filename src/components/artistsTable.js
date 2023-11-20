import React, { useContext } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, {
  CSVExport
} from "react-bootstrap-table2-toolkit";
import { Col, Row, Input } from "reactstrap";
// import "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css";
// import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import TableDropdown from "./tableDropdown";
import SubUserFilter from "./subUserFilter";

import { StateContext } from "../utils/context";

const ArtistsTable = ({
  tableData,
  defaultSorted,
  setToggleModal,
  setDataModal,
  forceUpdate,
  setDeleteBody,
  searchQuery,
  subUserData,
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
    return (
      <div className="flexContainer">
        {row.image_small? (
          <img
            src={row.image_small}
            alt={cell}
            width="40"
            height="40"
            className="rounded-circle"
          />
        ): (
            <i className="artist-avatar">{cell.charAt(0).toUpperCase()}</i>
        )}
        <span className="fontWeight700">{cell}</span>
      </div>
    );
  };

  const columns = [
    {
      dataField: "name",
      formatter: nameFormatter,
      text: "Artist Name",
      sort: true
    },
    {
      dataField: "owner",
      text: "Owner",
      sort: true
    },
    {
      dataField: "name",
      hidden: true,
      csvExport: false
    },
    {
      dataField: "spotify_identifier",
      text: "Spotify ID",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "370px" };
      }
    },
    {
      dataField: "apple_identifier",
      text: "Apple ID",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "370px" };
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
    if (sortField === "name" || sortField === "spotify_identifier" || sortField === "apple_identifier") {
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
          fileName: 'artists.csv',
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

export default ArtistsTable;
