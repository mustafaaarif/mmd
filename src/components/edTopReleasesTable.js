import React from "react";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";

const  EdTopReleasesTable = ({ topReleasesData }) => {
  
  return (
    <>
      <BootstrapTable
        hover
        condensed
        search={false}
        bordered={false}
        data={topReleasesData}
        deleteRow={false}
        insertRow={false}
        tableHeaderClass="mb-0"
      >
        <TableHeaderColumn width="100" dataField="release_name" isKey={true} dataSort={true}>
          Release Name
        </TableHeaderColumn>
        
        <TableHeaderColumn width="100" dataField="release_revenue" dataSort={true}>
         Revenue
        </TableHeaderColumn>
      </BootstrapTable>
    </>
  );
};

export default EdTopReleasesTable;
