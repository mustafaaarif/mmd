import React from "react";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";

const TrendsTable = ({ tableData }) => {
  
  return (
    <>
      <BootstrapTable
        hover
        condensed
        search={false}
        bordered={false}
        data={tableData}
        deleteRow={false}
        insertRow={false}
        tableHeaderClass="mb-0"
      >
        <TableHeaderColumn width="100" dataField="artist_name" dataSort={true}>
          Artist
        </TableHeaderColumn>
        <TableHeaderColumn width="100" dataField="song_name" dataSort={true}>
          Song/Mix Name
        </TableHeaderColumn>
        <TableHeaderColumn width="100" dataField="number_of_sales" isKey={true} dataSort={true}>
          Number Of Sales
        </TableHeaderColumn>
      </BootstrapTable>
    </>
  );
};

export default TrendsTable;
