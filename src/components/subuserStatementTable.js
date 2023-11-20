import React, { useContext } from "react";
import { 
  Col, 
  Row, 
  Button, 
  Input,
} from "reactstrap";
import ToolkitProvider, {
  CSVExport
} from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import SubUserFilterCustom from "./subUserFilterCustom";
import SubUserStatementTableDropdown from "./subuserStatementTableDropdown";
import { StateContext } from "../utils/context";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import StatementUnavailbleTooltip from "./statementUnavailableTooltip";
 
const SubuserStatementTable = ({ tableData, setSuccess, setError, setToggleModal, setDataModal, setLastAction, forceUpdate, searchQuery, defaultSorted, subUserData }) => {  

  const { currentUser } = useContext(StateContext);

  const { ExportCSVButton } = CSVExport;

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  const currencies = ["€", "$", "£"];

  const monthFormatter = (cell, row) => {
    cell = months[cell - 1];
    return cell;
  };

  const amountFormatter = (cell, row) => `${cell}${currencies[row.currency]}`;

  const statusFormatter = cell =>
    cell === 0 ? (
      <Button className="btn-status" disabled color="warning">
        Open
      </Button>
    ) : cell === 1 ? (
      <Button className="btn-status" disabled color="success">
        Paid
      </Button>
    ) : null;

  const typeFormatter = cell =>
    cell === 1
      ? (cell = "Licensing")
      : cell === 2
      ? "Regular"
      : cell === 3
      ? "Audio Mastering - Services"
      : cell === 4
      ? "Vinyl Earnings"
      : cell === 5
      ? "Offset"
      : "Not known";

  const downloadFormatter = (cell, row) =>
    cell ?
    (
      <a href={cell} target="blank">
      <Button className="btn-status" color="primary">
        <b>Download</b>
      </Button>
      </a>
    ) :
      <center>
        <StatementUnavailbleTooltip id={row.id} />
      </center>;

    const actionFormatter = (cell, row) => {
        return (
          <SubUserStatementTableDropdown
            data={{id: row.id, status: row.status, name: row.name}}
            setSuccess={setSuccess}
            setError={setError}
            setToggleModal={setToggleModal}
            setDataModal={setDataModal}
            setLastAction={setLastAction}
          />
        );
      };

  const columns = [
    {
      dataField: "sts_kind",
      text: "Type",
      sort: true,
      formatter: typeFormatter,
      csvFormatter: typeFormatter,
      headerStyle: (colum, colIndex) => {
        return { width: "80px" };
      }
    },
    {
      dataField: "year",
      text: "Year",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "80px" };
      }
    },
    {
      dataField: "month",
      text: "Month",
      sort: true,
      formatter: monthFormatter,
      csvFormatter: cell => months[cell - 1],
      headerStyle: (colum, colIndex) => {
        return { width: "80px" };
      }
    },
    {
      dataField: "issue_year",
      text: "Issue Year",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "100px" };
      }
    },
    {
      dataField: "issue_month",
      text: "Issue Month",
      sort: true,
      formatter: monthFormatter,
      csvFormatter: cell => months[cell - 1],
      headerStyle: (colum, colIndex) => {
        return { width: "110px" };
      }
    },
    {
      dataField: "short_description",
      text: "Description",
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      }
    },
    {
      dataField: "price",
      text: "Amount",
      sort: true,
      formatter: amountFormatter,
      csvFormatter: amountFormatter,
      headerStyle: (colum, colIndex) => {
        return { width: "100px" };
      }
    },
    {
      dataField: "status",
      text: "Status",
      sort: true,
      formatter: statusFormatter,
      csvFormatter: cell =>
        cell === 0 ? "Open" : cell === 1 ? "  Paid" : null,
      headerStyle: (colum, colIndex) => {
        return { width: "100px" };
      }
    },
    {
      dataField: "new_details",
      text: "Details",
      headerAlign: "center",
      align: "center",
      formatter: downloadFormatter,
      headerStyle: (colum, colIndex) => {
        return { width: "100px" };
      }
    },
    {
      dataField: "new_overview",
      text: "Overview",
      headerAlign: "center",
      align: "center",
      formatter: downloadFormatter,
      headerStyle: (colum, colIndex) => {
        return { width: "100px" };
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
    },

    //data for search
    {
      dataField: "status",
      sort: false,
      csvExport: false,
      hidden: true,
      formatter: cell => (cell === 0 ? "Open" : cell === 1 ? "Paid" : null)
    }
  ];

  const handleTableChange = (type, { sortField, sortOrder, data }) => {
    const ascDesc = sortOrder === "desc" ? "-" : "";
    if (sortField === "kind" || sortField === "sts_kind" || sortField === "month" || sortField === "year" || sortField === "issue_month" || sortField === "issue_year" || sortField === "price") {
      searchQuery.setOrdering({order: ascDesc, name: sortField, sort: sortField});
    }
    if (sortField === "name") {
      searchQuery.setOrdering({order: ascDesc, name: "id", sort: sortField});
    }
  }


  return (
    <div>
      <ToolkitProvider
        keyField="id"
        data={tableData}
        columns={columns}
        search={{
          searchFormatted: true
        }}
        exportCSV={ {
          fileName: "subuser-statements.csv",
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
                currentUser.is_premium_user && <SubUserFilterCustom subUserData={subUserData} />
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
    </div>
  );
};

export default SubuserStatementTable;
