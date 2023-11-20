import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, { CSVExport } from "react-bootstrap-table2-toolkit";
import { Col, Row, Input } from "reactstrap";
import "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import TableDropdown from "./tableDropdown";

const MusicLinkUrlpartTable = ({
  tableData,
  defaultSorted,
  setToggleModal,
  setDataModal,
  forceUpdate,
  setDeleteBody,
  searchQuery,
  urlpartsData,
}) => {
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
      dataField: "part",
      text: "Part",
      sort: true,
    },
    {
      dataField: "owner",
      text: "Owner",
      sort: true,
      csvExport: true

    },
    {
      dataField: "action",
      text: "Action",
      formatter: actionFormatter,
      sort: false,
      csvExport: false,
      headerStyle: (colum, colIndex) => {
        return { width: "111px" };
      },
    },
  ];

  const handleTableChange = (type, { sortField, sortOrder, data }) => {
    const ascDesc = sortOrder === "desc" ? "-" : "";
    if (sortField === "part") {
      searchQuery.setOrdering({
        order: ascDesc,
        name: sortField,
        sort: sortField,
      });
    }
    if(sortField === "owner") {
      searchQuery.setOrdering({
        order: ascDesc, 
        name: "created_by__username", 
        sort: "created_by__username"
      });
    }
  };

  return (
    <>
      <ToolkitProvider
        keyField="id"
        data={tableData}
        columns={columns}
        search={{
          searchFormatted: true,
        }}
        exportCSV={{
          fileName: "music-links-url.csv",
        }}
      >
        {(props) => (
          <div>
            <Row>
              <Col>
                <div className="customSearch">
                  <Input
                    placeholder="Search..."
                    value={searchQuery.query}
                    style={{ marginBottom: 10 }}
                    onChange={(e) => searchQuery.setQuery(e.target.value)}
                  />
                </div>
              </Col>
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
              bordered={false}
              defaultSorted={defaultSorted}
              remote={{ sort: true }}
              onTableChange={handleTableChange}
            />
          </div>
        )}
      </ToolkitProvider>
    </>
  );
};

export default MusicLinkUrlpartTable;
