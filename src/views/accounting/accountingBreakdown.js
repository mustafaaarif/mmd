import React, { useEffect, useState, useContext, useRef } from "react";
import AccountingItemsTable from "../../components/accountingItemsTable";
import ViewLayout from "../../components/viewLayout";
import TableHelper from "../../components/tableHelper";
import { useFetch } from "../../utils/fetchHook";
import { useLocation } from "react-router-dom";
import { getCookie } from "../../jwt/_helpers/cookie";

import {StateContext} from "../../utils/context";

const AccountingBreakdown = props => {

  const {currentUser} = useContext(StateContext);

  const token = getCookie("token");

  const location = useLocation();
  const accountingReportID = location.pathname.split("/")[2];
  const [apiData, error, loading] = useFetch("GET",`accounting_reports/${accountingReportID}/`, token);

  const [tableData, setTableData] = useState([]);


  useEffect(() => {
    if(apiData.revenueshareholder_reports)
    {
      setTableData(apiData.revenueshareholder_reports);
    }
  }, [apiData]);

  const tableProps = {
    tableData,
    error,
    loading,
  };

  return (
    <>
      {loading ? (
        <TableHelper loading />
      ) : error ? (
        <TableHelper error />
      ) :  (
        <div>
          <ViewLayout title={"Accounting Breakdown"}>
            <AccountingItemsTable
              {...tableProps}
            />
          </ViewLayout>
        </div>
      )}
    </>
  );
};

export default AccountingBreakdown;
