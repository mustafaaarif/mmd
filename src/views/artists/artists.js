import React, { useEffect, useState, useRef, useContext } from "react";
import { Alert } from "reactstrap";
import ArtistsTable from "../../components/artistsTable";
import Pagination from '../../components/pagination/pagination';
import TableModal from "../../components/tableModal";
import ViewLayout from "../../components/viewLayout";
import { useFetch } from "../../utils/fetchHook";
import { StateContext } from "../../utils/context";

import { getCookie } from "../../jwt/_helpers/cookie";
import TableHelper from "../../components/tableHelper";

const Artists = props => {
  const [openModal, setToggleModal] = useState(false);
  const [dataModal, setDataModal] = useState(null);
  const [deleteBody, setDeleteBody] = useState(false);
  //ajax handlers
  const [success, setSuccess] = useState(false);
  const [errorPut, setError] = useState(false);

  const [forceUpdate, setForce] = useState(1);

  const handlerValues = { setSuccess, setError, forceUpdate, setForce };
  const [tableData, setTableData] = useState([]);

  const didEff1 = useRef(false);
  const didEff2 = useRef(false);
  const [dataCount, setDataCount] = useState(0);
  const [currrentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [query, setQuery] = useState('');
  const [ordering, setOrdering] = useState({order: '', name: 'name', sort: 'name'});
  const [subUser, setSubUser] = useState('');
  const [subUserEndpoint, setSubUserEndpoint] = useState('');
  const [parentUserOnly, setParentUserOnly] = useState('&parent_user_only=true');

  const token = getCookie("token");
  const {currentUser} = useContext(StateContext);

  const [apiData, error, loading] = useFetch(
    "GET",
    `artists/${subUserEndpoint}?ordering=${ordering.order + ordering.name}&page=${currrentPage}&page_size=${pageSize}&search=${query}${parentUserOnly}`,
    token,
    false,
    forceUpdate
  );

  const defaultSorted = [{
    dataField: ordering.sort,
    order: ordering.order === "-" ? "desc" : "asc"
  }] 

  const tableProps = {
    tableData,
    defaultSorted
  };

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

  return (
    <>
      {loading ? (
        <TableHelper loading />
      ) : error ? (
        <TableHelper error />
      ) :  (
        <div>
          { 
            (!currentUser.artists) &&
            <Alert color="danger">
              You don't have access to this module, please contact the support team for further information.
            </Alert>
          }
          {
            (currentUser.artists) &&
            <>
              <ViewLayout title={"Your artists list"}>
                <ArtistsTable
                  {...tableProps}
                  setToggleModal={setToggleModal}
                  setDataModal={setDataModal}
                  setDeleteBody={setDeleteBody}
                  forceUpdate={forceUpdate}
                  searchQuery={{setQuery, query, ordering, setOrdering}}
                  subUserData={{subUser, setSubUser, subUserEndpoint, setSubUserEndpoint, setParentUserOnly}}
                  />
              </ViewLayout>
              <Pagination pagination={paginationProps}/>
            </>
          }
        </div>
      )}

      {dataModal && (
        <TableModal
          openModal={openModal}
          setToggleModal={setToggleModal}
          dataModal={dataModal}
          values={handlerValues}
          title={
            deleteBody ? (!dataModal.can_be_deleted? `Artist ${dataModal.name} can't be deleted`: `Delete ${dataModal.name}?`) : `Edit ${dataModal.name}?`
          }
          body={
            deleteBody? (
              !dataModal.can_be_deleted?
                `Artist ${dataModal.name} can't be deleted as they already have Track(s)/Release(s) associated with them.`:
                "Are you really sure you really want to delete this artist? This action could detach your artist from the assigned release."
            ): "Are you really sure you want to change your artist name? This could have an effect on release metadata."
          }
          apiURL={`artists/${dataModal.id}/`}
          bodyID={dataModal.id}
          deleteBody={deleteBody}
          can_be_deleted={dataModal.can_be_deleted}
        />
      )}
      {success && <Alert color="success">Artist has been removed!</Alert>}
      {errorPut && (
        <Alert color="danger">
          Something went wrong! Please refresh page and try again!
        </Alert>
      )}
    </>
  );
};

export default Artists;
