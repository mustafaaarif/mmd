import React, { useContext } from "react";
import { Col, Row, Button, Input } from "reactstrap";
import ToolkitProvider, {
  CSVExport
} from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import TableHelper from "../components/tableHelper";
import PromoDropdown from "../components/promoDropdown";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import SubUserFilter from "./subUserFilter";

import { StateContext } from "../utils/context";

// BE status -> FE status
// ready -> Ready
// sending -> Sending
// sent -> Sent
// new_recipients -> New recipients
// reminder -> Reminder sent

const PromotionsTable = ({
  tableData,
  setToggleModal,
  setDataModal,
  handlerValues,
  setDeleteBody,
  data,
  error,
  loading,
  actionValues,
  searchQuery,
  defaultSorted,
  subUserData
}) => {

  const { currentUser } = useContext(StateContext);

  const { ExportCSVButton } = CSVExport;
  const statusFormatter = cell => {
    return (
      <>
        {cell === "ready" ? (
          <Button className="btn-status" disabled color="success">
            Ready
          </Button>
        ) : cell === "sent" ? (
          <Button className="btn-status" disabled color="primary">
            Sent
          </Button>
        ) : cell === "sending" ? (
          <Button className="btn-status" disabled color="warning">
            Sending
          </Button>
        ) : cell === "new_recipients" ? (
          <Button className="btn-status" disabled color="success">
            New recipients
          </Button>
        ) : cell === "reminder" ? (
          <Button className="btn-status" disabled color="primary">
            Sent
          </Button>
        ) : (
          <Button className="btn-status" disabled color="warning">
            Not Ready
          </Button>
        )}
      </>
    );
  };

  const csvFormatter = cell => (cell === "ready" ? " Ready" : "Not ready");

  const actionFormatter = (cell, row) => {
    return (
      <PromoDropdown
        data={row}
        setToggleModal={setToggleModal}
        setDataModal={setDataModal}
        setDeleteBody={setDeleteBody}
        actionValues={actionValues}
        handlerValues={handlerValues}
      >
        Action
      </PromoDropdown>
    );
  };


  const reminderFormatter = cell => {
    return `${cell} weeks`;
  };

  const columns = [
    {
      dataField: "name",
      text: "Release",
      sort: true,
      formatter: cell => <span className="fontWeight700">{cell}</span>
    },
    {
      dataField: "send_date",
      text: "Send Date",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      }
    },
    {
      dataField: "send_reminder",
      text: "Reminder",
      sort: true,
      formatter: reminderFormatter,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      }
    },
    {
      dataField: "catalogue_number",
      text: "Catalogue number",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "180px" };
      }
    },
    {
      dataField: "score",
      text: "Score",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      }
    },
    {
      dataField: "responses_sent_number",
      text: "Responded/Sent",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "170px" };
      }
    },
    {
      dataField: "promotion_status",
      text: "Status",
      formatter: statusFormatter,
      sort: true,
      csvFormatter: csvFormatter,
      headerStyle: (colum, colIndex) => {
        return { width: "140px" };
      }
    },
    {
      dataField: "promotion_status",
      hidden: true,
      csvExport: false,
      csvFormatter: csvFormatter,

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
    if (sortField === "name" || sortField === "send_date" || sortField === "send_reminder" || sortField === 'promotion_status') {
      searchQuery.setOrdering({order: ascDesc, name: sortField, sort: sortField});
    }

    if (sortField === "catalogue_number") {
      searchQuery.setOrdering({order: ascDesc, name: "release__catalogue_number", sort: sortField});
    }

    if (sortField === "score") {
      searchQuery.setOrdering({order: ascDesc, name: "by_score", sort: sortField});
    }
    if (sortField === "responses_sent_number") {
      searchQuery.setOrdering({order: ascDesc, name: "responses_sent", sort: sortField});
    }
  }

  return (
    <>
      {loading ? (
        <TableHelper loading />
      ) : error ? (
        <TableHelper error />
      ) : (
        <ToolkitProvider
          keyField="id"
          data={tableData}
          columns={columns}
          search={{
            searchFormatted: true
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
      )}
    </>
  );
};

export default PromotionsTable;
