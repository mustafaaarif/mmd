import React, { useContext } from "react";
import { Col, Row, Input } from "reactstrap";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, {
  CSVExport
} from "react-bootstrap-table2-toolkit";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import TableDropdown from "./tableDropdown";
import SubUserFilter from "./subUserFilter";

import { StateContext } from "../utils/context";

const ListsTable = ({
  tableData,
  setToggleModal,
  setDataModal,
  setDeleteBody,
  searchQuery,
  defaultSorted,
  subUserData,
}) => {

  const { currentUser } = useContext(StateContext);

  const { ExportCSVButton } = CSVExport;

  const actionFormatter = (cell, row) => {
    return (
      <TableDropdown
        data={row}
        setToggleModal={setToggleModal}
        setDataModal={setDataModal}
        setDeleteBody={setDeleteBody}
      />
    );
  };

  const columns = [
    {
      dataField: "name",
      text: "Name",
      sort: true,
      formatter: (cell,row) => <span className="fontWeight700">{cell}</span>
    },
    {
      dataField: "recipient_count",
      text: "Recipient number",
      sort: true,
      
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
    if (sortField === "name" || sortField === "recipient_count") {
      searchQuery.setOrdering({order: ascDesc, name: sortField, sort: sortField});
    }
  }


  return (
    <ToolkitProvider
      keyField="id"
      data={tableData}
      columns={columns}
      search={{
        searchFormatted: true
      }}
      exportCSV={ {
        fileName: 'lists.csv',
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
            exportCSV
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

export default ListsTable;
