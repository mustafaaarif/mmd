import React, { useEffect, useState, useRef, useContext } from "react";
import {
  Button,
  Alert,
} from "reactstrap";
import { useFetch } from "../../utils/fetchHook";
import { getCookie } from "../../jwt/_helpers/cookie";
import InvoiceModalConfirm from "../../components/invoiceModalConfirm";
import { Redirect } from "react-router-dom";
import TableHelper from "../../components/tableHelper"
import "react-day-picker/lib/style.css";

import Pagination from '../../components/pagination/pagination';
import StatementTable from "../../components/statementTable";
import ViewLayout from "../../components/viewLayout";

import { StateContext } from "../../utils/context";
import { getUser } from "../../utils/getUser";

const InvoiceAdd = () => {
  const token = getCookie("token");
  const {currentUser, setCurrentUser} = useContext(StateContext);
  const [tableData, setTableData] = useState([]);

  //ajax handlers
  const [success, setSuccess] = useState(false);
  const [errorPut, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("Something went wrong! Please refresh page and try again!");
  const [openModal, setToggleModal] = useState(false);
  const [redirect, setRedirect] = useState(false);


  const didEff1 = useRef(false);
  const didEff2 = useRef(false);
  const [forceUpdate, setForce] = useState(1);
  const [dataCount, setDataCount] = useState(0);
  const [currrentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [query, setQuery] = useState('');
  const [ordering, setOrdering] = useState({order: '-', name: 'created', sort: 'created'});

  const [openStatements, error, loading] = useFetch("GET", `statements/?ordering=${ordering.order + ordering.name}&page=${currrentPage}&page_size=${pageSize}&search=${query}&status=0&invoice_generated=false`, token, false, forceUpdate);

  useEffect(() => {
    setTableData(openStatements.results);
  }, [openStatements]);

  useEffect(() => {
    setTableData(openStatements.results);
    setDataCount(openStatements.count);
  }, [openStatements]);

  useEffect(() => {
    getUser(token, currentUser, setCurrentUser);
    setForce( prev => prev + 1);
  }, [success, error]);


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

  function generateInvoice() {

    if(dataCount>0)
    {
      setToggleModal(true)
    }

    else
    {
      setError(true)
      setErrorMsg("No statement available for invoicing.")
    }
  }

  return (
    <>
      {loading ? (
        <TableHelper loading />
      ) : error ? (
        <TableHelper error />
      ) : (
        <div className="mb-5">

          <div>
              {success && (
                <Alert color="success">Invoice has been added!</Alert>
              )}
              {redirect ? <Redirect to="/invoices" /> : null}
              {errorPut && (
                <Alert color="danger">
                  {errorMsg}
                </Alert>
              )}
          </div>

          <ViewLayout title={"Statements available for invoicing"}>
            <StatementTable {...tableProps} searchQuery={{setQuery, query, ordering, setOrdering}} displaySubUserFilter={false} />
          </ViewLayout>
          <Pagination pagination={paginationProps}/>

          <Button
            onClick={() => generateInvoice()}
            className="pull-right"
            color="success"
          >
            Generate Invoice
          </Button>
        </div>
      )}

      {
        <InvoiceModalConfirm
          openModal={openModal}
          setToggleModal={setToggleModal}
          title={`Add Invoice`}
          setSuccess={setSuccess}
          setError={setError}
          body={`Are you sure you want to create invoice for currently OPEN Statements?`}
          apiURL={`invoices/generate-invoice`}
          setRedirect={setRedirect}
        />
      }
    </>
  );
};

export default InvoiceAdd;
