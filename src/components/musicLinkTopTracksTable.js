
import React from "react";
import { Col, Row, Progress } from "reactstrap";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

const MusicLinkTopTracksTable = ({ topTracksData }) => {

  const totalStreamsPctFormatter = (cell, row) => {
    const totalStreamsPct = row.total_streams_pct;
    return (
      <div>
        <p className="fontWeight700">{totalStreamsPct} %</p>
        <Progress color="success" value={totalStreamsPct} /> 
      </div>
    );
  };

  const trackFormatter = (cell, row) => { 
    const track_name = row.track_name;
    const SRC = row.release_image;

    return (
      <div className="flexContainer">
        {SRC && <img style={{width: 40, height: 40, borderRadius: '100%'}} src={SRC} alt={cell}/> }
        <p className="fontWeight700">{track_name}</p>
      </div>
    );
  };

  const columns = [
    {
      dataField: "track_name",
      text: "Track Name",
      sort: true,
      formatter: trackFormatter,
      headerStyle: (colum, colIndex) => {
        return { width: "60px" };
      }
    },
    {
        dataField: "artist_name",
        text: "Artist Name",
        sort: true,
        headerStyle: (colum, colIndex) => {
          return { width: "60px" };
        }
      },
    {
      dataField: "total_streams",
      text: "No Of Plays",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "60px" };
      }
    },
    {
      dataField: "total_streams_pct",
      text: "No Of Plays (%)",
      sort: true,
      formatter: totalStreamsPctFormatter,
      headerStyle: (colum, colIndex) => {
        return { width: "100px" };
      }
    },
  ];

  return (
    <ToolkitProvider
      keyField="track_name"
      data={topTracksData}
      columns={columns}
    >
      {props => (
        <div>
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

export default MusicLinkTopTracksTable;