import React, { useEffect, useState, useRef, useContext } from "react";
import { Alert } from "reactstrap";
import ListsTable from "../../components/listsTable";
import Pagination from '../../components/pagination/pagination';
import TableModal from "../../components/tableModal";
import ViewLayout from "../../components/viewLayout";
import { useFetch } from "../../utils/fetchHook";
import { getCookie } from "../../jwt/_helpers/cookie";
import TableHelper from "../../components/tableHelper";
import { StateContext } from "../../utils/context";

const Lists = props => {
  const token = getCookie("token");
  const {currentUser} = useContext(StateContext);

  const didEff1 = useRef(false);
  const didEff2 = useRef(false);
  const [forceUpdate, setForce] = useState(1);
  const [dataCount, setDataCount] = useState(0);
  const [currrentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [query, setQuery] = useState('');
  const [ordering, setOrdering] = useState({order: '', name: 'name', sort: 'name'});
  const [subUser, setSubUser] = useState('');
  const [subUserEndpoint, setSubUserEndpoint] = useState('');
  const [parentUserOnly, setParentUserOnly] = useState('&parent_user_only=true');

  const [apiData, error, loading] = useFetch(
    "GET",
    `recipient-lists/${subUserEndpoint}?ordering=${ordering.order + ordering.name}&page=${currrentPage}&page_size=${pageSize}&search=${query}${parentUserOnly}`,
    token,
    false,
    forceUpdate
  );
  const [tableData, setTableData] = useState([]);

  const [openModal, setToggleModal] = useState(false);
  const [dataModal, setDataModal] = useState(null);

  //ajax handlers
  const [success, setSuccess] = useState(false);
  const [errorPut, setError] = useState(false);
  const [deleteBody, setDeleteBody] = useState(false);


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
    defaultSorted
  };


  const handlerValues = { setSuccess, setError, forceUpdate, setForce };
  return (
    <>
      {loading ? (
        <TableHelper loading />
      ) : error ? (
        <TableHelper error />
      ) : (
        <div>
          { 
            (!currentUser.promotions) &&
            <Alert color="danger">
              You don't have access to this module, please contact the support team for further information.
            </Alert>
          }
          { 
            (currentUser.promotions) &&
            <>
              <ViewLayout title={"Recipient Lists"}>
                <ListsTable
                  {...tableProps}
                  setToggleModal={setToggleModal}
                  setDataModal={setDataModal}
                  forceUpdate={forceUpdate}
                  setDeleteBody={setDeleteBody}
                  searchQuery={{setQuery, query, ordering, setOrdering}}
                  subUserData={{subUser, setSubUser, subUserEndpoint, setSubUserEndpoint, setParentUserOnly}}
                />
              </ViewLayout>
              <Pagination pagination={paginationProps}/>
            </>
          }
        </div>
      ) }

      {dataModal && (
        <TableModal
          openModal={openModal}
          setToggleModal={setToggleModal}
          dataModal={dataModal}
          values={handlerValues}
          title={`Delete list ${dataModal.name}?`}
          apiURL={`recipient-lists/${dataModal.id}`}
          bodyID={dataModal.id}
          deleteBody={deleteBody}
        />
      )}
      {success && <Alert color="success">List has been removed!</Alert>}
      {errorPut && (
        <Alert color="danger">
          Something went wrong! Please refresh page and try again!
        </Alert>
      )}
    </>
  );
};

export default Lists;
