import React, { useEffect, useState, useRef, useContext } from "react";
import Pagination from '../../components/pagination/pagination';
import InvoiceTable from "../../components/invoiceTable";
import ViewLayout from "../../components/viewLayout";
import { useFetch } from "../../utils/fetchHook";
import { getCookie } from "../../jwt/_helpers/cookie";
import TableHelper from "../../components/tableHelper";
import {  Alert } from "reactstrap";

import {StateContext} from "../../utils/context";

const Invoices = () => {
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

  const [apiData, error, loading] = useFetch("GET", `invoices/?ordering=${ordering.order + ordering.name}&page=${currrentPage}&page_size=${pageSize}&search=${query}`, token, false, forceUpdate);
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
          { (!currentUser.can_add_invoices) &&
            <Alert color="danger">
              Unfortunately, you can not currently add invoices. Either your tax or payment
              account data is not fully completed. In order to unlock this feature, please 
              contact our support team. 
            </Alert>
          }
          { (currentUser.can_add_invoices && !currentUser.invoicing_available) &&
            <Alert color="danger">
              Generate invoices from the 2nd to the 23rd of each month. Please note that invoice 
              generation is not possible from the 23rd until the end of the month, as automated 
              payments are processed during this period. Thank you for your understanding. 
            </Alert>
          }
          { (currentUser.can_add_invoices && currentUser.invoicing_available && currentUser.invoices_generating>0) &&
            <Alert color="danger">
              You can not add invoices at the moment as you have invoices which are currently generating. Please check back later.
            </Alert>
          }
          { (currentUser.invoices) &&
            <>
              <ViewLayout title={"Your Invoices list"}>
                <InvoiceTable {...tableProps} searchQuery={{setQuery, query, ordering, setOrdering}}/>
              </ViewLayout>
              <Pagination pagination={paginationProps}/>
            </>
          }
        </div>
      )}
    </>
  );
};

export default Invoices;
