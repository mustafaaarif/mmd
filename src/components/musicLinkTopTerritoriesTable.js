
import React from "react";
import { Col, Row, Progress } from "reactstrap";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

import ReactCountryFlag from "react-country-flag";

const MusicLinkTopTerritoriesTable = ({ topTerritoriesData }) => {

  const totalViewsPctFormatter = (cell, row) => {
    const totalViewsPct = row.total_views_pct;
    return (
      <div>
        <p className="fontWeight700">{totalViewsPct} %</p>
        <Progress color="success" value={totalViewsPct} /> 
      </div>
    );
  };

  const territoryFormatter = (cell, row) => {
    const territory = row.territory;
    const iso_code = row.iso_code;
    const other_territories = territory.includes("Other Territories");

    return (
      <div className="flexContainer">
        {!other_territories &&                 
          <ReactCountryFlag
              countryCode={iso_code}
              svg
              cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/1x1/"
              cdnSuffix="svg"
              style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: '100%',
              }}
              aria-label={territory}
          />
        }
        <p className="fontWeight700">{territory}</p>
      </div>
    );
  };

  const columns = [
    {
      dataField: "territory",
      text: "Territory",
      sort: true,
      formatter: territoryFormatter,
      headerStyle: (colum, colIndex) => {
        return { width: "60px" };
      }
    },
    {
      dataField: "total_views",
      text: "No Of Views",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "60px" };
      }
    },
    {
      dataField: "total_views_pct",
      text: "No Of Views (%)",
      sort: true,
      formatter: totalViewsPctFormatter,
      headerStyle: (colum, colIndex) => {
        return { width: "100px" };
      }
    },
  ];

  return (
    <ToolkitProvider
      keyField="iso_code"
      data={topTerritoriesData}
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

export default MusicLinkTopTerritoriesTable;