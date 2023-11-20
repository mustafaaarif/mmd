import React, { useState, useEffect, useRef, useContext } from "react";
import Pagination from "../../components/pagination/pagination";
import { Alert } from "reactstrap";
import TableModal from "../../components/tableModal";
import LinkLandingPagesTable from "../../components/linkLandingPagesTable";
import ViewLayout from "../../components/viewLayout";
import TableHelper from "../../components/tableHelper";
import { getCookie } from "../../jwt/_helpers/cookie";
import { useFetch } from "../../utils/fetchHook";
import { StateContext } from "../../utils/context";

const LinkLandingPages = () => {
  
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
  const [apiData, error, loading] = useFetch("GET",`link-landingpages/?ordering=${ordering.order + ordering.name}&page=${currrentPage}&page_size=${pageSize}&search=${query}`,token,false,forceUpdate);
  const [tableData, setTableData] = useState([]);

  const [openModal, setToggleModal] = useState(false);
  const [dataModal, setDataModal] = useState(null);
  const [deleteBody, setDeleteBody] = useState(false);
  
  //ajax handlers
  const [success, setSuccess] = useState(false);
  const [errorPut, setError] = useState(false);

  const handlerValues = { setSuccess, setError, forceUpdate, setForce };

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

  return (
    <>
    {
      (!currentUser.link_in_bio && !loading) ? (
          <Alert color="danger">
            Currently this feature is only offered to few selected users but the good news is that you will also be able to use it really soon. Keep watching this space!
          </Alert>
      ): (currentUser.link_in_bio && loading) ? (
        <TableHelper loading />
      ) : error ? (
        <TableHelper error />
      ) :  (
        <div>
            <ViewLayout title={"Your link landing pages"}>
            <LinkLandingPagesTable
              setToggleModal={setToggleModal}
              setDataModal={setDataModal}
              setDeleteBody={setDeleteBody}
              forceUpdate={forceUpdate}
              tableData={tableData}
              defaultSorted={defaultSorted}
              searchQuery={{setQuery, query, ordering, setOrdering}}
            />
            </ViewLayout>
            <Pagination pagination={paginationProps}/>
        </div>
      )}

      {dataModal && (
        <TableModal
          openModal={openModal}
          setToggleModal={setToggleModal}
          dataModal={dataModal}
          values={handlerValues}
          title={
            deleteBody ? `Delete ${dataModal.title}?` : `Edit ${dataModal.name}?`
          }
          body={"Are you sure you want to delete this link landing page?"}
          apiURL={`link-landingpages/${dataModal.id}/`}
          bodyID={dataModal.id}
          deleteBody={deleteBody}
        />
      )}
      {success && <Alert color="success">Link Landing Page has been removed!</Alert>}
      {errorPut && (
        <Alert color="danger">
          Something went wrong! Please refresh page and try again!
        </Alert>
      )}
    </>
  );
};

export default LinkLandingPages;
