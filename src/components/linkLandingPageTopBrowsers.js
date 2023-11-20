import React from "react";
import { Progress } from "reactstrap";
import ScrollBar from "react-perfect-scrollbar";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";

import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

import chrome from '../assets/images/browser/svg/chrome.svg';
import firefox from '../assets/images/browser/svg/firefox.svg';
import safari from '../assets/images/browser/svg/safari.svg';
import opera from '../assets/images/browser/svg/opera.svg';
import internet_explorer from '../assets/images/browser/svg/internetexplorer.svg';
import edge from '../assets/images/browser/svg/edge.svg';
import brave from '../assets/images/browser/svg/brave.svg';
import duck_duck_go from '../assets/images/browser/svg/duckduckgo.svg';


const LinkLandingPageTopBrowsers = ({ topBrowsersData }) => {

  const totalViewsPctFormatter = (cell, row) => {
    const totalViewsPct = row.total_views_pct;
    return (
      <div>
        <p className="fontWeight700">{totalViewsPct} %</p>
        <Progress color="success" value={totalViewsPct} /> 
      </div>
    );
  };

  const browserFormatter = (cell, row) => {
    const browser = row.browser;

    const is_chrome = browser.toLowerCase().includes("chrome");
    const is_safari = browser.toLowerCase().includes("safari");
    const is_firefox = browser.toLowerCase().includes("firefox");
    const is_opera = browser.toLowerCase().includes("opera");
    const is_edge = browser.toLowerCase().includes("edge");
    const is_internet_explorer = browser.toLowerCase().includes("internet explorer");
    const is_brave = browser.toLowerCase().includes("brave");
    const is_duck_duck_go = browser.toLowerCase().includes("duck duck go");

    const other_browser = (!is_chrome && !is_safari && !is_firefox && !is_opera && !is_edge && !is_internet_explorer && !is_brave && !is_duck_duck_go);

    let icon = "";

    if (is_chrome) {
        icon = chrome;
    } else if (is_safari) {
        icon = safari;
    } else if (is_firefox) {
        icon = firefox;
    } else if (is_opera) {
        icon = opera;
    } else if (is_edge) {
        icon = edge;
    } else if (is_internet_explorer) {
        icon = internet_explorer;
    } else if (is_brave) {
        icon = brave;
    }    
    else if (is_duck_duck_go) {
        icon = duck_duck_go;
    }
    else if (other_browser) {
        icon = "";
    }

    return (
        <div className="flexContainer">
          {!other_browser && <img style={{width: 40, height: 40, borderRadius: '100%'}} src={icon} alt={cell}/> }
          {other_browser && <i className="fa fa-3x fa-window-maximize text-primary mr-2"></i>}
          <p className="fontWeight700">{browser}</p>
        </div>
      );
  };

  const columns = [
    {
      dataField: "browser",
      text: "Browser",
      sort: true,
      formatter: browserFormatter,
      headerStyle: (colum, colIndex) => {
        return { width: "60px" };
      }
    },
    {
      dataField: "total_views",
      text: "Views",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "60px" };
      }
    },
    {
      dataField: "total_views_pct",
      text: "Views (%)",
      sort: true,
      formatter: totalViewsPctFormatter,
      headerStyle: (colum, colIndex) => {
        return { width: "100px" };
      }
    },
  ];

  return (
    <div className="chart-wrapper" style={{ width: '100%', margin: '0 auto', height: 300 }}>
      <ScrollBar>
        <ToolkitProvider
            keyField="browser"
            data={topBrowsersData}
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

export default LinkLandingPageTopBrowsers;