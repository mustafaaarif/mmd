import React, { useEffect, useState, useRef, useContext } from "react";
import { Alert } from "reactstrap";
import RecipientsTable from "../../components/recipientsTable";
import Pagination from '../../components/pagination/pagination';
import ViewLayout from "../../components/viewLayout";
import { useFetch } from "../../utils/fetchHook";
import { getCookie } from "../../jwt/_helpers/cookie";
import TableHelper from "../../components/tableHelper";
import TableModal from "../../components/tableModal";
import { StateContext } from "../../utils/context";

const Recipients = props => {
  const token = getCookie("token");
  const {currentUser} = useContext(StateContext);
  const [forceUpdate, setForce] = useState(0);

  const [openModal, setToggleModal] = useState(false);
  const [dataModal, setDataModal] = useState(null);
  const [deleteBody, setDeleteBody] = useState(false);

  //ajax handlers
  const [successDeleteBulk, setSuccessDeleteBulk] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorPut, setError] = useState(false);

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

  const [apiData, error, loading] = useFetch("GET", `recipients/${subUserEndpoint}?ordering=${ordering.order + ordering.name}&page=${currrentPage}&page_size=${pageSize}&search=${query}${parentUserOnly}`, token, null, forceUpdate);
  const [tableData, setTableData] = useState([]);


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

  const handlerValues = { setSuccess, setError, forceUpdate, setForce, setSuccessDeleteBulk };

  const defaultSorted = [{
    dataField: ordering.sort,
    order: ordering.order === "-" ? "desc" : "asc"
  }]

  const tableProps = {
    defaultSorted,
    tableData
  };

  return (
    <>
      {loading ? (
        <TableHelper loading />
      ) : error ? (
        <TableHelper error />
      ) :  (
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
              <ViewLayout title={"My Recipients"}>
                <RecipientsTable
                  {...tableProps}
                  setToggleModal={setToggleModal}
                  setDataModal={setDataModal}
                  handlerValues={handlerValues}
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
      {successDeleteBulk && (
        <Alert style={{ marginTop: 0 }} color="success">
        Successfully deleted recipients
        </Alert>
      )}

      {dataModal && (
        <TableModal
          openModal={openModal}
          setToggleModal={setToggleModal}
          dataModal={dataModal}
          values={handlerValues}
          title={`Delete recipient ${dataModal.name}?`}
          apiURL={`recipients/${dataModal.token}`}
          bodyID={dataModal.token}
          deleteBody={deleteBody}
        />
      )}
      {success && <Alert color="success">Recipient has been removed!</Alert>}
      {errorPut && (
        <Alert color="danger">
          Something went wrong! Please refresh page and try again!
        </Alert>
      )}
    </>
  );
};

export default Recipients;
