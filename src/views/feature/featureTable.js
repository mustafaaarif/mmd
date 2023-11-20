import React, { useContext } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, {
  CSVExport
} from "react-bootstrap-table2-toolkit";
import { Col, Row, Input } from "reactstrap";
// import "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css";
// import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import SubUserFilter from "../../components/subUserFilter";

import { StateContext } from "../../utils/context";

const FeatureTable = ({ tableData, searchQuery, defaultSorted, subUserData }) => {
  const { currentUser } = useContext(StateContext);
  const { ExportCSVButton } = CSVExport;
  const columns = [
    {
      dataField: "release_name",
      text: "Name",
      sort: true,
      formatter: (cell) => <span className="fontWeight700">{cell}</span>
    },
    {
      dataField: "release_artist_name",
      text: "Release Artist Name",
      sort: true
    },
    {
      dataField: "release_date",
      text: "Release Date",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "170px" };
      }
    },
    {
      dataField: "exclusive_date",
      text: "Exclusive Date",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "170px" };
      }
    }
    
  ];

  const handleTableChange = (type, { sortField, sortOrder, data }) => {
    const ascDesc = sortOrder === "desc" ? "-" : "";
    if (sortField === "release_name") {
      searchQuery.setOrdering({order: ascDesc, name: "release__name", sort: sortField});
    }
    if (sortField === "release_artist_name") {
      searchQuery.setOrdering({order: ascDesc, name: "artist_remixer", sort: sortField});
    }
    if (sortField === "exclusive_date") {
      searchQuery.setOrdering({order: ascDesc, name: "release__exclusive_date", sort: sortField});
    }
    if (sortField === "release_date") {
      searchQuery.setOrdering({order: ascDesc, name: "release__official_date", sort: sortField});
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
        fileName: 'feature-requests.csv',
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

export default FeatureTable;
