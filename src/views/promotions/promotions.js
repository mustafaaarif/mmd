import React, { useEffect, useState, useContext, useRef } from "react";
import { Alert } from "reactstrap";
import PromotionsTable from "../../components/promotionsTable";
import Pagination from '../../components/pagination/pagination';
import TableModal from "../../components/tableModal";
import ViewLayout from "../../components/viewLayout";
import TableHelper from "../../components/tableHelper";
import { useFetch } from "../../utils/fetchHook";
import { getCookie } from "../../jwt/_helpers/cookie";
import { useLocation } from "react-router-dom";

import {StateContext} from "../../utils/context";

const Promotions = props => {
  //ajax handlers
  const [success, setSuccess] = useState(false);
  const [errorPut, setError] = useState(false);

  const {currentUser} = useContext(StateContext);

  const [forceUpdate, setForce] = useState(1);

  const [successAction, setSuccessAction] = useState(false);
  const [successActionText, setSuccessActionText] = useState(false);
  const [erorrAction, setErorrAction] = useState(false);

  const token = getCookie("token");
  const location = useLocation();

  const [openModal, setToggleModal] = useState(false);
  const [dataModal, setDataModal] = useState(null);
  const [deleteBody, setDeleteBody] = useState(false);

  const didEff1 = useRef(false);
  const didEff2 = useRef(false);
  const [dataCount, setDataCount] = useState(0);
  const [currrentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [query, setQuery] = useState('');
  const [ordering, setOrdering] = useState({order: '-', name: 'release__official_date', sort: 'release__official_date'});
  const [subUser, setSubUser] = useState('');
  const [subUserEndpoint, setSubUserEndpoint] = useState('');
  const [parentUserOnly, setParentUserOnly] = useState('&parent_user_only=true');

  const [apiData, error, loading] = useFetch("GET", `promotions/${subUserEndpoint}?ordering=${ordering.order + ordering.name}&page=${currrentPage}&page_size=${pageSize}&search=${query}${parentUserOnly}`, token, false, forceUpdate);
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

  const defaultSorted = [{
    dataField: ordering.sort,
    order: ordering.order === "-" ? "desc" : "asc"
  }]

  const tableProps = {
    tableData,
    error,
    loading,
    defaultSorted
  };


  const handlerValues = { setSuccess, setError, forceUpdate, setForce };

  const actionValues = {setSuccessAction, setErorrAction, setSuccessActionText}

  return (
    <>
      {loading ? (
        <TableHelper loading />
      ) : error ? (
        <TableHelper error />
      ) :  (
        <div>
          {
            (currentUser.promotions && currentUser.promotion_amount_left <= 0) &&  <Alert color="danger">
            You have no promotion coins left. To renew promo coins, please purchase the additional promo coins.
          </Alert>
          }
          { 
            (!currentUser.promotions) &&
            <Alert color="danger">
              You don't have access to this module, please contact the support team for further information.
            </Alert>
          }
          { 
            (currentUser.promotions) &&
            <>
              <ViewLayout title={"Promotions List"}>
                <PromotionsTable
                  {...tableProps}
                  setToggleModal={setToggleModal}
                  setDataModal={setDataModal}
                  handlerValues={handlerValues}
                  setDeleteBody={setDeleteBody}
                  actionValues={actionValues}
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
          title={`Delete promotion ${dataModal.name}?`}
          apiURL={`promotions/${dataModal.id}`}
          bodyID={dataModal.id}
          deleteBody={deleteBody}
        />
      )}
      {success && <Alert color="success">Promotion has been removed!</Alert>}
      {successAction && <Alert color="success">{successActionText}</Alert>}
      {(errorPut || erorrAction) && (
        <Alert color="danger">
          Something went wrong! Please refresh page and try again!
        </Alert>
      )}
    </>
  );
};

export default Promotions;
