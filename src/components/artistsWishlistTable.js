import React, { useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { Col, Row, Input, Progress, Alert } from "reactstrap";
import ArtistsWishlistTableDropdown from "./artistsWishlistTableDropdown";
import TableModal from "./tableModal";
// import "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css";
// import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";

const ArtistsWishlistTable = ({
  tableData,
  defaultSorted,
  forceUpdate,
  setForce,
  searchQuery,
  subUserData,
}) => {

  const [success, setSuccess] = useState(false);
  const [errorPut, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("Something went wrong! Please refresh page and try again!");
  const [openModal, setToggleModal] = useState(false);
  const [dataModal, setDataModal] = useState(null);
  const [deleteId, setDeleteID] = useState(null);

  const handlerValues = { setSuccess, setError, forceUpdate, setForce };

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

  const popularityPctFormatter = (cell, row) => {
    const popularityPct = row.popularity;
    return (
      <div>
        <p className="fontWeight700">{popularityPct} %</p>
        <Progress color="success" value={popularityPct} /> 
      </div>
    );
  };

  const followersFormatter = (cell, row) => {
    return <b>{cell? Number(cell).toLocaleString({minimumFractionDigits: 0}): "N/A"}</b>
  };

  const actionFormatter = (cell, row) => {
    return (
      <ArtistsWishlistTableDropdown
        data={row}
        setToggleModal={setToggleModal}
        setDataModal={setDataModal}
        setDeleteID={setDeleteID}
      />
    );
  };

  const columns = [
    {
      dataField: "name",
      formatter: nameFormatter,
      text: "Artist Name",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "100px" };
      }
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
        return { width: "100px" };
      }
    },
    {
      dataField: "followers",
      text: "Followers",
      formatter: followersFormatter,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "60px" };
      }
    },
    {
      dataField: "popularity",
      text: "Popularity (%)",
      formatter: popularityPctFormatter,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "100px" };
      }
    },
    {
      dataField: "action",
      text: "Action",
      sort: false,
      formatter: actionFormatter,
      headerStyle: (colum, colIndex) => {
        return { width: "45px" };
      }
    },
  ];


  const handleTableChange = (type, { sortField, sortOrder, data }) => {
    const ascDesc = sortOrder === "desc" ? "-" : "";
    if (sortField === "name" || sortField === "spotify_identifier" || sortField === "popularity" || sortField === "followers") {
      searchQuery.setOrdering({order: ascDesc, name: sortField, sort: sortField});
    }
  }

  return (
    <>
      {
        <div>
          {success ? window.location.reload() : null}
          {errorPut && (
            <Alert color="danger">
              {errorMsg}
            </Alert>
          )}
        </div>
      }
      <ToolkitProvider
        keyField="id"
        data={tableData}
        columns={columns}
        search={{
          searchFormatted: true
        }}
        exportCSV={ {
          fileName: 'artists-wishlist.csv',
        }}
      >
        {props => (
          <div>
            <Row>
              <Col>
                <div className="customSearch">
                  <Input placeholder="Search..." value={searchQuery.query} style={{marginBottom: 10}} onChange={e => searchQuery.setQuery(e.target.value)}/>
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
      <TableModal
        openModal={openModal}
        setToggleModal={setToggleModal}
        values={handlerValues}
        title={dataModal ? `Remove Artist ${dataModal.name} From Wishlist`: 'Remove Artist From Wishlist'}
        body={dataModal? `Are you sure that you want to remove artist ${dataModal.name} from your wishlist?`: 'Are you sure that you want remove this artist from your wishlist?'}
        apiURL={`artist-wishlist/${deleteId}/`}
        bodyID={deleteId}
        can_be_deleted={true}
        deleteBody={true}
      />
    </>
  );
};

export default ArtistsWishlistTable;
