import React, { useEffect, useState, useRef } from "react";
import Pagination from '../../components/pagination/pagination';
import DeliveryConfirmationTable from "../../components/deliveryConfirmationTable";
import ViewLayout from "../../components/viewLayout";
import { useFetch } from "../../utils/fetchHook";
import { getCookie } from "../../jwt/_helpers/cookie";
import TableHelper from "../../components/tableHelper";

const DeliveryConfirmation = props => {
  const token = getCookie("token");
  const didEff1 = useRef(false);
  const didEff2 = useRef(false);

  let releaseID = window.location.pathname.split("/")[2];

  const [forceUpdate, setForce] = useState(1);

  const [dataCount, setDataCount] = useState(0);
  const [currrentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [query, setQuery] = useState('');

  const [apiData, error, loading] = useFetch("GET", `ddex-delivery-confirmations/?release=${releaseID}&page=${currrentPage}&page_size=${pageSize}&search=${query}`, token, false, forceUpdate);
  const [tableData, setTableData] = useState([]);


  useEffect(() => {
    if (apiData?.detail === "Invalid page.") {
      setCurrentPage(1);
      return;
    }
    setTableData(apiData.results);
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
            <div>
              <ViewLayout title={"Delivered List"}>
                <DeliveryConfirmationTable
                  {...tableProps} searchQuery={{setQuery, query}}
                />
              </ViewLayout>
              <Pagination pagination={paginationProps}/> 
            </div>
        </div>
      )}
    </>
  );
};

export default DeliveryConfirmation;
