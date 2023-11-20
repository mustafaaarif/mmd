
import React from "react";
import { Progress } from "reactstrap";
import ScrollBar from "react-perfect-scrollbar";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";


const LinkLandingPageFeaturedLinks = ({ topFeaturedLinksData }) => {

  const totalClicksPctFormatter = (cell, row) => {
    const totalClicksPct = row.times_clicked_pct;
    return (
      <div>
        <p className="fontWeight700">{totalClicksPct} %</p>
        <Progress color="success" value={totalClicksPct} /> 
      </div>
    );
  };

  const columns = [
    {
      dataField: "title",
      text: "Label",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "60px" };
      }
    },
    {
      dataField: "destination_url",
      text: "Destination Url",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "90px" };
      }
    },
    {
      dataField: "times_clicked",
      text: "Clicks",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "50px" };
      }
    },
    {
      dataField: "times_clicked_pct",
      text: "Clicks (%)",
      sort: true,
      formatter: totalClicksPctFormatter,
      headerStyle: (colum, colIndex) => {
        return { width: "50px" };
      }
    },
  ];

  return (
    <div className="chart-wrapper" style={{ width: '100%', margin: '0 auto', height: 300 }}>
        <ScrollBar>
            <ToolkitProvider
            keyField="destination_url"
            data={topFeaturedLinksData}
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
        </ScrollBar>
    </div>
  );
};

export default LinkLandingPageFeaturedLinks;