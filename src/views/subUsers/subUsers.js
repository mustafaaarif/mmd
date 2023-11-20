import React, { useState, useEffect, useRef, useContext } from "react";
import { Alert } from "reactstrap";
import Pagination from '../../components/pagination/pagination';
import SubUsersTable from "../../components/subUsersTable";
import SubUsersTableModal from "../../components/subUsersTableModal";
import ViewLayout from "../../components/viewLayout";
import TableHelper from "../../components/tableHelper";
import { getCookie } from "../../jwt/_helpers/cookie";
import { useFetch } from "../../utils/fetchHook";

import {StateContext} from "../../utils/context";

const SubUsers = props => {
  const [openModal, setToggleModal] = useState(false);
  const [dataModal, setDataModal] = useState(null);
  const [updateBody, setUpdateBody] = useState(false);
  
  const token = getCookie("token");
  const {currentUser} = useContext(StateContext);

  const didEff1 = useRef(false);
  const didEff2 = useRef(false);
  const [forceUpdate, setForce] = useState(1);
  const [dataCount, setDataCount] = useState(0);
  const [currrentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [query, setQuery] = useState('');
  const [ordering, setOrdering] = useState({order: '', name: 'id', sort: 'id'});


  const [apiData, error, loading] = useFetch("GET",`sub-users/?ordering=${ordering.order + ordering.name}&page=${currrentPage}&page_size=${pageSize}&search=${query}`,token,false,forceUpdate);
  const [tableData, setTableData] = useState([]);

  //ajax handlers
  const [success, setSuccess] = useState(false);
  const [errorPut, setError] = useState(false);
 
  const [lastAction, setLastAction] = useState("updated");

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

  const handlerValues = { setSuccess, setError, forceUpdate, setForce };

  return (
    <>
      {
        !currentUser.is_premium_user && (
          <Alert color="danger">
            This feature is offered to Premium Users only. Please contact support team if
            you want to upgrade your account.
          </Alert>        
        )
      }

      {
        loading ? (
          <TableHelper loading />
        ) : error ? (
          <TableHelper error />
        ) :  (
        <div>
          <ViewLayout title={"Your sub-users list"}>
            <SubUsersTable
              setToggleModal={setToggleModal}
              setDataModal={setDataModal}
              setUpdateBody={setUpdateBody}
              setLastAction={setLastAction}
              forceUpdate={forceUpdate}
              data={tableData}
              defaultSorted={defaultSorted}
              searchQuery={{setQuery, query, ordering, setOrdering}}
            />
          </ViewLayout>
          <Pagination pagination={paginationProps}/>
        </div>
      ) }
        
      
      {dataModal && (
        <SubUsersTableModal
          openModal={openModal}
          setToggleModal={setToggleModal}
          dataModal={dataModal}
          values={handlerValues}
          title={
            dataModal.is_active ? `De-Activate Sub-user` : `Activate Sub-user`
          }
          body={
            dataModal.is_active? `Are you sure you want to De-Activate Sub-User ${dataModal.username}?`
            : `Are you sure you want to Activate Sub-User ${dataModal.username}?`
          }
          apiURL={`sub-users/${dataModal.id}`}
          bodyID={dataModal.id}
          activateUser={dataModal.is_active? false: true}
          updateBody={updateBody}
        />
      )}
      {success && <Alert color="success">Sub-user account has been {lastAction}!</Alert>}
      {errorPut && (
        <Alert color="danger">
          Something went wrong! Please refresh page and try again!
        </Alert>
      )}
    </>
  );
};

export default SubUsers;
