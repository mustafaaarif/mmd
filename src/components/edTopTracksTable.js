import React from "react";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";

const  EdTopTracksTable = ({ topTracksData }) => {

  return (
    <>
      <BootstrapTable
        hover
        condensed
        search={false}
        bordered={false}
        data={topTracksData}
        deleteRow={false}
        insertRow={false}
        tableHeaderClass="mb-0"
      >
        <TableHeaderColumn width="100" dataField="track_name" isKey={true} dataSort={true}>
          Track Name
        </TableHeaderColumn>
        
        <TableHeaderColumn width="100" dataField="track_revenue" dataSort={true}>
            Revenue
        </TableHeaderColumn>
      </BootstrapTable>
    </>
  );
};

export default EdTopTracksTable;
