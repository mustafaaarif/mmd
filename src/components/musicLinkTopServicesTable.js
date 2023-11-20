
import React from "react";
import { Col, Row, Progress } from "reactstrap";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";


import Am from "../assets/images/landingPage/svg/am.svg";
import Beatport from "../assets/images/landingPage/svg/beatport_green.svg";
import Juno from "../assets/images/landingPage/svg/juno.svg";
import Spotify from "../assets/images/landingPage/svg/spotify.svg";
import Tidal from "../assets/images/landingPage/svg/tidal.svg";
import Yt from "../assets/images/landingPage/svg/yt.svg";
import ScSvg from "../assets/images/landingPage/svg/Soundcloud_horizontal.svg";
import DeezerSvg from "../assets/images/landingPage/svg/deezer.svg";
import TraxsourceSvg from "../assets/images/landingPage/svg/Traxsource.svg";
import AmazonMusicSvg from "../assets/images/landingPage/svg/AmazonMusic.svg"


const MusicLinkTopServicesTable = ({ topServicesData }) => {

  const totalVisitsPctFormatter = (cell, row) => {
    const totalVisitsPct = row.total_visits_pct;
    return (
      <div>
        <p className="fontWeight700">{totalVisitsPct} %</p>
        <Progress color="success" value={totalVisitsPct} /> 
      </div>
    );
  };

  const storeIcons = {
    "traxsource": TraxsourceSvg,
    "youtube": Yt,
    "junodownload": Juno,
    "deezer": DeezerSvg,
    "beatport": Beatport,
    "soundcloud": ScSvg,
    "spotify": Spotify,
    "applemusic": Am,
    "tidal": Tidal,
    "amazonmusic": AmazonMusicSvg,
    "other": ""
  };

  const storeFormatter = (cell, row) => {
    const store_name = row.store_name;
    const other_stores = store_name.includes("other");
    const icon = storeIcons[store_name];
    const iconWidth = "150px"; 
    const iconHeight = "100%";

    return (
      <div>
        <Row>
          <Col lg="12">
            {
              !other_stores && <div className="brandlogo">
                  <img src={icon} alt="" height={iconHeight} width={iconWidth} />
              </div>
            }
            {
              other_stores && <p className="fontWeight700">Other Stores</p>
            }
          </Col>
        </Row>
      </div>
    );
  };

  const columns = [
    {
      dataField: "store_name",
      text: "Store",
      sort: true,
      formatter: storeFormatter,
      headerStyle: (colum, colIndex) => {
        return { width: "60px" };
      }
    },
    {
      dataField: "total_visits",
      text: "No Of Visits",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "60px" };
      }
    },
    {
      dataField: "total_visits_pct",
      text: "No Of Visits (%)",
      sort: true,
      formatter: totalVisitsPctFormatter,
      headerStyle: (colum, colIndex) => {
        return { width: "100px" };
      }
    },
  ];

  return (
    <ToolkitProvider
      keyField="store_name"
      data={topServicesData}
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

export default MusicLinkTopServicesTable;