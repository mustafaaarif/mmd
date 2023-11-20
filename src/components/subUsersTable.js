import React from "react";
import moment from "moment";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, {
  CSVExport
} from "react-bootstrap-table2-toolkit";
import { Col, Row, Input } from "reactstrap";
import "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import SubUsersTableDropdown from "./subUsersTableDropdown";


const SubUsersTable = ({ setToggleModal, setDataModal, setUpdateBody, setLastAction, forceUpdate, data, searchQuery, defaultSorted }) => {
  const { ExportCSVButton } = CSVExport;

  const usernameFormatter = (cell, row) => {
    return (
      <div className="flexContainer">
        {row.profile_image.thumb_small? (
          <img
            src={row.profile_image.thumb_small}
            alt={cell}
            width="40"
            className="rounded-circle"
          />
        ): (
            <i className="fas fa-3x fa-user-circle pr-2"></i>
        )}
        <span className="fontWeight700">{cell}</span>
      </div>
    );
  };

  const userActiveFormatter = cell => {
    return (
      <>
        {cell ? (
          <span className="p-2">
            <i className="fas fa-2x fa-check-circle text-success"></i>
          </span>
        )
        :
          (
            <span className="p-2">
              <i className="fas fa-2x fa-times-circle text-danger"></i>
            </span>
        )}
      </>
    );
  };

  const userActiveCsvFormatter = cell => {
    return (
      cell? "Yes" : "No"
    );
  };

  const contractExpiryDateFormatter = (cell, row) => {
    return (
      moment(cell).format('YYYY-MM-DD')
    );
  };

  const actionFormatter = (cell, row) => {
    return (
      <SubUsersTableDropdown
        data={row}
        setToggleModal={setToggleModal}
        setDataModal={setDataModal}
        setUpdateBody={setUpdateBody}
        setLastAction={setLastAction}
      />
    );
  };

  const columns = [
    {
      dataField: "username",
      text: "Username",
      formatter: usernameFormatter,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "200px" };
      }
    },
    {
      dataField: "email",
      text: "Email",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "140px" };
      }
    },
    {
      dataField: "first_name",
      text: "First Name",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      }
    },
    {
      dataField: "last_name",
      text: "Last Name",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      }
    },
    {
      dataField: "company",
      text: "Company",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      }
    },
    {
      dataField: "sub_user_deal",
      text: "Deal (%)",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "60px" };
      }
    },
    {
      dataField: "contract_expiry",
      text: "Contract Expiry",
      formatter: contractExpiryDateFormatter,
      csvFormatter: contractExpiryDateFormatter,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "170px" };
      }
    },
    {
      dataField: "is_active",
      text: "Active",
      formatter: userActiveFormatter,
      csvFormatter: userActiveCsvFormatter,
      sort: true,
      csvExport: true,
      headerStyle: (colum, colIndex) => {
        return { width: "70px" };
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
    }
  ];

  const handleTableChange = (type, { sortField, sortOrder, data }) => {
    const ascDesc = sortOrder === "desc" ? "-" : "";
    if (sortField === "first_name" || sortField === "last_name" || sortField === "email" || sortField === "username" || sortField === "deal" || sortField === "company" || sortField === "contract_expiry" || sortField === "is_active") {
      searchQuery.setOrdering({order: ascDesc, name: sortField, sort: sortField});
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
      fileName: 'sub_users.csv',
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

export default SubUsersTable;
