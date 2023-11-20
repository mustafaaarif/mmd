import React from "react";
import moment from "moment";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, {
  CSVExport
} from "react-bootstrap-table2-toolkit";
import { Col, Row, Input } from "reactstrap";
import { Link } from "react-router-dom";
import TableDropdown from "./tableDropdown";

// import "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css";
// import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import LinkLandingPageUrl from "./linkLandingPageUrl";

const LinkLandingPagesTable = ({
  setToggleModal,
  setDataModal,
  setDeleteBody,
  forceUpdate,
  tableData,
  defaultSorted,
  searchQuery,
}) => {

  const { ExportCSVButton } = CSVExport;

  const titleFormatter = (cell, row) => {
    const SRC = row.logo.thumb_small ? row.logo.thumb_small : null;
    return (
      <div className="flexContainer">
        {SRC && <img style={{width: 40, height: 40, borderRadius: '100%'}} src={SRC} alt={cell}/> }
        <p className="fontWeight700">{cell}</p>
      </div>
    );
  };

  const landingPageFormatter = (cell, row) => {
    return (
        <Link className="btn btn-outline-primary" to={`/b/${cell}/`}>View</Link>
    );
  };

  const dateFormatter = (cell, row) => {
    return (
      moment(cell).format('YYYY-MM-DD')
    );
  };

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


  const storeUrlsFormatter = (cell, row) => {
    let full_urls = {
      "id": row.id,
      "full_urls": [cell]
    };
    return (
      <LinkLandingPageUrl {...full_urls} />
    );
  };

  const columns = [
    {
      dataField: "title",
      formatter: titleFormatter,
      text: "Title",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "111px" };
      }
    },
    {
      dataField: "short_description",
      text: "Description",
      sort: false,
      csvExport: true,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      }
    },
    {
      dataField: "back_url",
      text: "Back Url",
      sort: true,
      csvExport: true,
      headerStyle: (colum, colIndex) => {
        return { width: "50px" };
      }
    },
    {
      dataField: "created",
      text: "Created",
      formatter: dateFormatter,
      sort: true,
      csvExport: false,
      headerStyle: (colum, colIndex) => {
        return { width: "70px" };
      }
    },
    {
      dataField: "full_url",
      text: "Landing Page",
      formatter: storeUrlsFormatter,
      sort: false,
      csvExport: false,
      headerStyle: (colum, colIndex) => {
        return { width: "50px" };
      }
    },
    {
      dataField: "action",
      text: "Action",
      formatter: actionFormatter,
      sort: false,
      csvExport: false,
      headerStyle: (colum, colIndex) => {
        return { width: "40px" };
      }
    }
  ];


  const handleTableChange = (type, { sortField, sortOrder, data }) => {
    const ascDesc = sortOrder === "desc" ? "-" : "";
    if (sortField === "title" || sortField === "created" || sortField === "back_url") {
      searchQuery.setOrdering({order: ascDesc, name: sortField, sort: sortField});
    }
  }

  return (
    <>
      <ToolkitProvider
        keyField="id"
        data={tableData}
        columns={columns}
        search={{
          searchFormatted: true
        }}
        exportCSV={ {
          fileName: 'link-landing-pages.csv',
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
              defaultSorted={defaultSorted}
              remote={ { sort: true } }
              onTableChange={handleTableChange}
            />
          </div>
        )}
      </ToolkitProvider>
    </>
  );
};

export default LinkLandingPagesTable;
