import React, { useState } from "react";
import { Progress, Alert } from "reactstrap";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import PerfectScrollbar from 'react-perfect-scrollbar';
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";


const ArtistTopTracksTable = ({ topTracksData }) => {

  const nameFormatter = (cell, row) => {
    return (
        <span className="fontWeight700">{cell}</span>
    );
  };

  const albumFormatter = (cell, row) => {
    let albumImage = cell.images? cell.images[2] : null;
    let albumName = cell.name;
    return (
      <div className="flexContainer">
        {albumImage ? (
          <img
            src={albumImage.url}
            alt={albumName}
            width="50"
            height="50"
            className="rounded-circle"
          />
        ): (
            <i className="artist-avatar">{albumName.charAt(0).toUpperCase()}</i>
        )}
        <span className="fontWeight700">{albumName}</span>
      </div>
    );
  };

  const artistsFormatter = (cell, row) => {
    let artistNames = [];
    if(cell.length)
    {   
        cell.map(artist => {
            artistNames.push(artist.name);
        });
    }
    return (
        <span className="fontWeight700">{artistNames.join(', ')}</span>
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

  const audioPlayerFormatter = (cell, row) => {
    const trackRes = cell && cell.length > 0 ? cell : "";
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

  const columns = [
    {
        dataField: "name",
        text: "Track",
        formatter: nameFormatter,
        sort: true,
        headerStyle: (colum, colIndex) => {
            return { width: "40px" };
        }
    },
    {
        dataField: "album",
        text: "Release",
        formatter: albumFormatter,
        sort: true,
        headerStyle: (colum, colIndex) => {
            return { width: "40px" };
        }
    },
    {
        dataField: "artists",
        text: "Artist(s)",
        formatter: artistsFormatter,
        sort: false,
        headerStyle: (colum, colIndex) => {
            return { width: "40px" };
        }
    },
    {
        dataField: "popularity",
        text: "Popularity (%)",
        formatter: popularityPctFormatter,
        sort: true,
        headerStyle: (colum, colIndex) => {
            return { width: "40px" };
        }
    },
    {
        dataField: "preview_url",
        text: "Preview",
        formatter: audioPlayerFormatter,
        sort: false,
        headerStyle: (colum, colIndex) => {
            return { width: "50px" };
        }
    },
  ];

  return (
    <>
      <PerfectScrollbar>
        <div className="chart-wrapper" style={{ width: '100%', margin: '0 auto', height: 450 }}>
          <ToolkitProvider
            keyField="name"
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
        </div>
      </PerfectScrollbar>
    </>
  );
};

export default ArtistTopTracksTable;