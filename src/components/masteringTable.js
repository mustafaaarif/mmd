import React from "react";
import moment from "moment";
import { Col, Row, Input } from "reactstrap";
import ToolkitProvider, {
  CSVExport
} from "react-bootstrap-table2-toolkit";
import { Link } from 'react-router-dom';
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";


const MasteringTable = ({ tableData, searchQuery, defaultSorted }) => {
  const { ExportCSVButton } = CSVExport;

  const dateFormatter = (cell, row) => {
    return (
      moment(cell).format('YYYY-MM-DD')
    );
  };
 
const actionFormatter = (cell, row) =>
  row.songs_uploaded ?
  (
    <Link to={`/mastering/${row.id}/view`} style={{width: '70px'}} className="btn btn-outline-primary">OPEN</Link>
  ) :     
  (
    <Link to={`/mastering/${row.id}/update`} style={{width: '65px'}} className="btn btn-primary">EDIT</Link>
  );


  const columns = [
    {
      dataField: "created_by",
      text: "Created By",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "130px" };
      }
    },
    {
      dataField: "total_songs",
      text: "Number of Songs",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "130px" };
      }
    },
    {
      dataField: "mastered_songs",
      text: "Total Mastered Songs",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "130px" };
      }
    },    
    {
      dataField: "created",
      text: "Date Created",
      formatter: dateFormatter,
      csvFormatter: dateFormatter,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "130px" };
      }
    },
    {
      dataField: "action",
      text: "Action",
      formatter: actionFormatter,
      csvExport: false,
      headerStyle: (colum, colIndex) => {
        return { width: "40px" };
      }
    },
  ];

  const handleTableChange = (type, { sortField, sortOrder, data }) => {
    const ascDesc = sortOrder === "desc" ? "-" : "";
    if (sortField === "created" || sortField === "total_songs") {
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
        fileName: 'audio-masterings.csv',
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
            remote={ { sort: true } }
            defaultSorted={defaultSorted}
            onTableChange={handleTableChange}
          />
        </div>
      )}
    </ToolkitProvider>
  );
};

export default MasteringTable;
