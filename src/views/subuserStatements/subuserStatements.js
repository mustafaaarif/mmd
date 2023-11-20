import React, { useEffect, useState, useRef } from "react";
import Pagination from '../../components/pagination/pagination';
import SubuserStatementTable from "../../components/subuserStatementTable";
import SubUserStatementTableModal from "../../components/subuserStatementTableModal";
import ViewLayout from "../../components/viewLayout";
import { useFetch } from "../../utils/fetchHook";
import { getCookie } from "../../jwt/_helpers/cookie";
import TableHelper from "../../components/tableHelper";
import { Alert } from "reactstrap";

const SubuserStatements = () => {
  const token = getCookie("token");

  const didEff1 = useRef(false);
  const didEff2 = useRef(false);
  const [forceUpdate, setForce] = useState(1);
  const [dataCount, setDataCount] = useState(0);
  const [currrentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [query, setQuery] = useState('');
  const [ordering, setOrdering] = useState({order: '-', name: 'created', sort: 'created'});
  const [subUser, setSubUser] = useState('');
  const [subUserEndpoint, setSubUserEndpoint] = useState('');
  const [subusersUserOnly, setSubusersOnly] = useState('&subusers_only=true');

  const [openModal, setToggleModal] = useState(false);
  const [dataModal, setDataModal] = useState(null);
  const [lastAction, setLastAction] = useState("");
  const [updateBody, setUpdateBody] = useState(false);

  //ajax handlers
  const [success, setSuccess] = useState(false);
  const [errorPut, setError] = useState(false);

  const handlerValues = { setSuccess, setError, forceUpdate, setForce };

  const [apiData, error, loading] = useFetch("GET", `subuser-statements/${subUserEndpoint}?ordering=${ordering.order + ordering.name}&page=${currrentPage}&page_size=${pageSize}&search=${query}${subusersUserOnly}`, token, false, forceUpdate);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if(apiData?.detail === "Invalid page.") {
      setCurrentPage(1);
      return;
    }

    if(apiData) {
      if(apiData.results) {
        setTableData(apiData.results);
      }
    }
  }, [apiData]);

  useEffect(() => {
    if (apiData?.detail === "Invalid page.") {
      setCurrentPage(1);
      return;
    }

    if (apiData) {
      if(apiData.count) {
        setDataCount(apiData.count);
      }
      if(apiData.results) {
        setTableData(apiData.results);
      }
    }
  }, [apiData]);

  useEffect(() => {
    if (!didEff1.current) {
      didEff1.current = true;
      return;
    }
    setForce(prev => prev + 1);
  }, [currrentPage, pageSize, ordering.order, ordering.name, subUser]);


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
    defaultSorted,
  };

  return (
    <>
      {loading ? (
        <TableHelper loading />
      ) : error ? (
        <TableHelper error />
      ) : (
        <div>
          <ViewLayout title={"Your Subuser's Statement list"}>
            <SubuserStatementTable
              {...tableProps}
              setSuccess={setSuccess}
              setError={setError}
              setToggleModal={setToggleModal}
              setDataModal={setDataModal}
              setLastAction={setLastAction}
              forceUpdate={forceUpdate}
              searchQuery={{setQuery, query, ordering, setOrdering}}
              subUserData={{subUser, setSubUser, subUserEndpoint, setSubUserEndpoint, setSubusersOnly}}
            />
          </ViewLayout>
          <Pagination pagination={paginationProps}/>
        </div>
      )}

      {dataModal && (
        <SubUserStatementTableModal
          openModal={openModal}
          setToggleModal={setToggleModal}
          values={handlerValues}
          title={
            (dataModal.status === 0) ? `Mark statement as PAID` : `Mark statement as OPEN`
          }
          body={
            (dataModal.status === 0) ? `Are you sure you want to mark the statement ${dataModal.name} as PAID ?`
            : `Are you sure you want to mark the statement ${dataModal.name} as OPEN ?`
          }
          apiURL={'subuser-statements/update-status'}
          statementID={dataModal.id}
          statementStatus={dataModal.status}
        />
      )}
      {success && <Alert color="success">Subuser statement has been {lastAction}!</Alert>}
      {errorPut && (
        <Alert color="danger">
          Something went wrong! Please refresh page and try again!
        </Alert>
      )}
    </>
  );
};

export default SubuserStatements;
