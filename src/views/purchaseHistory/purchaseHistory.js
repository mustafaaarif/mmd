import React, { useEffect, useState, useRef, useContext } from "react";
import Pagination from '../../components/pagination/pagination';
import PurchaseHistoryTable from "../../components/purchaseHistoryTable";
import ViewLayout from "../../components/viewLayout";
import { useFetch } from "../../utils/fetchHook";
import { getCookie } from "../../jwt/_helpers/cookie";
import TableHelper from "../../components/tableHelper";
import {StateContext} from "../../utils/context";

const PurchaseHistory = () => {
  const token = getCookie("token");
  const {currentUser} = useContext(StateContext);

  const didEff1 = useRef(false);
  const didEff2 = useRef(false);
  const [forceUpdate, setForce] = useState(1);
  const [dataCount, setDataCount] = useState(0);
  const [currrentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [query, setQuery] = useState('');
  const [ordering, setOrdering] = useState({order: '-', name: 'created', sort: 'created'});

  const [apiData, error, loading] = useFetch("GET", `purchase-history/?is_success=true&ordering=${ordering.order + ordering.name}&page=${currrentPage}&page_size=${pageSize}&search=${query}`, token, false, forceUpdate);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    setTableData(apiData.results);
  }, [apiData]);

  useEffect(() => {
    setTableData(apiData.results);
    setDataCount(apiData.count);
  }, [apiData]);

  useEffect(() => {
    if (!didEff1.current) {
      didEff1.current = true;
      return;
    }
    setForce(prev => prev + 1);
  }, [currrentPage, pageSize, ordering.order, ordering.name]);


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

  const defaultSorted = [{
    dataField: ordering.sort,
    order: ordering.order === "-" ? "desc" : "asc"
  }] 

  const tableProps = {
    tableData,
    defaultSorted
  };

  return (
    <>
      {      
        loading ? (
          <TableHelper loading />
        ) : error ? (
          <TableHelper error />
        ) : (
        <div>
          <ViewLayout title={"Your purchase history"}>
            <PurchaseHistoryTable {...tableProps} searchQuery={{setQuery, query, ordering, setOrdering}}/>
          </ViewLayout>
          <Pagination pagination={paginationProps}/>
        </div>
      )}
    </>
  );
};

export default PurchaseHistory;
