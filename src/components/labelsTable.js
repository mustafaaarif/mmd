import React, {useContext} from "react";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, {
  CSVExport
} from "react-bootstrap-table2-toolkit";
import { Col, Row, Button, Input } from "reactstrap";
// import "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css";
// import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import { Link } from "react-router-dom";
import SubUserFilter from "./subUserFilter";

import { StateContext } from "../utils/context";

const LabelsTable = ({ 
    setToggleModal, 
    setDataModal, 
    forceUpdate, 
    data, 
    searchQuery, 
    defaultSorted, 
    subUserData 
  }) => {

  const { currentUser } = useContext(StateContext);
  const { ExportCSVButton } = CSVExport;

  const nameFormatter = (cell, row) => {
    return (
      <div className="flexContainer">
        {row.logo.thumb_small && (
          <img
            src={row.logo.thumb_small}
            alt={cell}
            width="40"
            className="rounded-circle"
          />
        )}
        <span className="fontWeight700">{cell}</span>
      </div>
    );
  };

  const buttonFormatter = cell => {
    return (
      <>
        {cell ? (
          <div className="btn btn-success btn-status-big disabled">Approved</div>
        ) : (
          <div className="btn btn-warning btn-status-big disabled">Waiting Approval</div>
        )}
      </>
    );
  };

  const csvFormatter = cell => (cell ? "Approved" : "Waiting Approval");
  const actionFormatter = (cell, row) => {
    return (
      <Button outline color="primary">
        <Link to={`/labels/${row.id}/update/`}>Edit</Link>
      </Button>
    );
  };
  const columns = [
    {
      dataField: "name",
      text: "Name",
      formatter: nameFormatter,
      sort: true
    },
    {
      dataField: "owner",
      text: "Owner",
      sort: true
    },
    {
      //name for search
      dataField: "name",
      hidden: true,
      csvExport: false
    },
    {
      dataField: "company",
      text: "Company",
      sort: true
    },
    {
      dataField: "contract_received",
      text: "Contract",
      formatter: buttonFormatter,
      csvFormatter: csvFormatter,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "200px" };
      }
    },
    {
      //data for search
      dataField: "contract_received",
      csvExport: false,
      formatter: csvFormatter,
      hidden: true
    },
    {
      dataField: "information_accepted",
      text: "Info",
      formatter: buttonFormatter,
      csvFormatter: csvFormatter,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "200px" };
      }
    },
    {
      //data for search
      dataField: "information_accepted",
      formatter: csvFormatter,
      csvExport: false,
      hidden: true
    },
    {
      dataField: "label_approved",
      text: "Status",
      formatter: buttonFormatter,
      csvFormatter: csvFormatter,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "200px" };
      }
    },
    {
      //data for search
      dataField: "label_approved",
      formatter: csvFormatter,
      csvExport: false,
      hidden: true
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
    if (sortField === "name" || sortField === "contract_received" || sortField === "information_accepted" || sortField === "label_approved") {
      searchQuery.setOrdering({order: ascDesc, name: sortField, sort: sortField});
    }
    if (sortField === "company") {
      searchQuery.setOrdering({order: ascDesc, name: "user__company", sort: sortField});
    }
    if(sortField === "owner") {
      searchQuery.setOrdering({order: ascDesc, name: "user__username", sort: "user__username"});
    }
  }

  return (
    <ToolkitProvider
    keyField="id"
    data={data}
    columns={columns}
    search={{
      searchFormatted: true
    }}
    exportCSV={ {
      fileName: 'labels.csv',
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
          remote={ { sort: true } }
          defaultSorted={defaultSorted}
          onTableChange={handleTableChange}
        />
      </div>
    )}
  </ToolkitProvider>
  );
};

export default LabelsTable;
