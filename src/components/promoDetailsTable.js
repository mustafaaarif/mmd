import React, {useState} from "react";
import { Col, Row, Button } from "reactstrap";
import ToolkitProvider, { Search, CSVExport} from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import axios from "axios";
import { getCookie } from "../jwt/_helpers/cookie";

const API_URL = process.env.REACT_APP_API_URL_BASE;
const X_API_KEY = process.env.REACT_APP_X_API_KEY;

const pagination = paginationFactory({
  sizePerPageList: [
    { text: "10", value: 10 },
    { text: "25", value: 25 },
    { text: "50", value: 50 },
    { text: "100", value: 100 }
  ]
});

const PromoDetailsTable = ({
  dataTable,
  promotionID,
  setShareLink,
  setToggleModal,
  dataShare,
  setDataShare
}) => {
  const { SearchBar, ClearSearchButton } = Search;

  const { ExportCSVButton } = CSVExport;

  


  const dateFormatter = cell => {
    return cell.substr(0, 10);
  };
  const recipientFormatter = cell => <span className="fontWeight700">{cell.name}</span>
  const commentFormatter = cell => <span className="fontWeight700">{cell}</span>
  const columns = [
    {
      dataField: "recipient",
      text: "Recipient",
      sort: true,
      csvExport: false,
      formatter: recipientFormatter
    },
    {
      dataField: "recipient",
      text: "Recipient",
      sort: false,
      hidden: true,
      csvExport: true,
      csvFormatter: cell => cell.name
    },
    {
      dataField: "comment",
      text: "Comment",
      sort: true,
      formatter: commentFormatter
    },
    {
      dataField: "rating",
      text: "Rating",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "120px" };
      }
    },
    {
      dataField: "created",
      text: "Created at",
      sort: true,
      formatter: dateFormatter,
      headerStyle: (colum, colIndex) => {
        return { width: "130px" };
      }
    },
    {
      dataField: "downloaded_wavs",
      text: "Downloaded",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      }
    },
    {
      dataField: "played",
      text: "Played",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "120px" };
      }
    },
    {
      dataField: "favorite",
      text: "Favorite",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      }
    }
  ];

  const handleShare = () => {
    const tokenAPI = getCookie("token");
    const options = {
      method: "POST",
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${tokenAPI}`,
        "x-api-key": X_API_KEY,
        "Content-Type": "application/json"
      }
    };

    axios
    .post(`${API_URL}promo-feedbacks-share/ `, {"promotion": promotionID}, options)
    .then(res => {
      if (res.status === 201 ){
        setShareLink(res.data.token);
        setDataShare(res.data)
        setToggleModal(true);
      }
    })
    .catch(err => {
      console.log(err);
    });
  }

  const openShareLink = () => {
    setShareLink(dataShare.token);
    setToggleModal(true);
  }

  const deleteShareLink = () => {
    const tokenAPI = getCookie("token");
    const options = {
      method: "DELETE",
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${tokenAPI}`,
        "x-api-key": X_API_KEY,
        "Content-Type": "application/json"
      }
    };

    const tokenId = dataShare.id

    axios
    .delete(`${API_URL}promo-feedbacks-share/${tokenId}`, options)
    .then(res => {
      if (res.status === 204 ){
        setShareLink(res.data.token);
        setDataShare({});
      }
    })
    .catch(err => {
      console.log(err);
    });
  }


  return (
    <>

      {dataTable.length > 0 && (
        <>
        <ToolkitProvider
          keyField="comment"
          data={dataTable}
          columns={columns}
          search={{
            searchFormatted: true
          }}
          exportCSV={ {
            fileName: 'promotion-details.csv',
          } }
        >
          {props => (
            <div>
              <Row>
                <Col>
                  <div className="customSearch">
                    <SearchBar {...props.searchProps} />
                    <ClearSearchButton
                      className="customClear"
                      text="x"
                      {...props.searchProps}
                    />
                  </div>
                </Col>
                <Col>
                  <div className="flexEndContainer">
                    {
                      dataShare?.id  ? (
                        <>
                        <Button
                          color="danger"
                          className="mr-2"
                          onClick={() => deleteShareLink()}
                        >
                          Delete share link
                        </Button>
                        <Button
                          className="btn btn-outline-info mr-2"
                          onClick={() => openShareLink()}
                        >
                          Copy share link
                        </Button>
                        </>
                      ) :
                        <Button
                          className="btn btn-outline-info mr-2"
                          onClick={() => handleShare()}
                        >
                          Share
                        </Button>
                    }

                    
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
                version="4"
                {...props.baseProps}
                pagination={pagination}
                bordered={false}
              />
            </div>
          )}
        </ToolkitProvider>
        
        </>
      )}
    </>
  );
};

export default PromoDetailsTable;
