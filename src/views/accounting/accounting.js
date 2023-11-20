import React, { useEffect, useState, useContext, useRef } from "react";
import Pagination from '../../components/pagination/pagination';
import AccountingTable from "../../components/accountingTable";
import ViewLayout from "../../components/viewLayout";
import { useFetch } from "../../utils/fetchHook";
import { getCookie } from "../../jwt/_helpers/cookie";
import TableHelper from "../../components/tableHelper";

import {
  Alert
} from "reactstrap";

import {StateContext} from "../../utils/context";

const Accounting = props => {
  const token = getCookie("token");
  const {currentUser} = useContext(StateContext);

  const didEff1 = useRef(false);
  const didEff2 = useRef(false);
  const [forceUpdate, setForce] = useState(1);

  const [dataCount, setDataCount] = useState(0);
  const [currrentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [query, setQuery] = useState('');

  const [apiData, error, loading] = useFetch("GET", `accounting_reports/?page=${currrentPage}&page_size=${pageSize}&search=${query}&parent_user_only=true`, token, false, forceUpdate);
  const [tableData, setTableData] = useState([]);


  useEffect(() => {
    if (apiData?.detail === "Invalid page.") {
      setCurrentPage(1);
      return;
    }
    setTableData(apiData.results ?? []);
    setDataCount(apiData.count);
  }, [apiData]);


  useEffect(() => {
    if (!didEff1.current) {
      didEff1.current = true;
      return;
    }
    setForce(prev => prev + 1);
  }, [currrentPage, pageSize]);

  useEffect(() => {
    if (!didEff2.current) {
      didEff2.current = true;
      return;
    }
    const timeout = setTimeout(() => {
      setForce(prev => prev + 1);
    }, 500)
    return () => clearTimeout(timeout)
  }, [query])



  const paginationProps = {
    pageSize, setPageSize, dataCount, setCurrentPage, currrentPage
  }

  const tableProps = {
    tableData,
  };

  return (
    <>
      {loading ? (
        <TableHelper loading />
      ) : error ? (
        <TableHelper error />
      ) :  (
        <div>
          { !currentUser.artists_accounting &&
            <Alert color="danger">
              Unfortunately, you can not currently add accounting. 
              This feature will be available for our labels on Wednesday, 01.12.2021. 
            </Alert>
          }
          { currentUser.artists_accounting && tableProps &&
            <div>
              <ViewLayout title={"Accounting List"}>
                <AccountingTable
                  {...tableProps} searchQuery={{setQuery, query}}
                />
              </ViewLayout>
              <Pagination pagination={paginationProps}/> 
            </div>
          }
        </div>
      )}
    </>
  );
};

export default Accounting;
