import React, { useState, useEffect, useRef, useContext } from "react";
import { Alert } from "reactstrap";
import Pagination from '../../components/pagination/pagination';
import LabelsTable from "../../components/labelsTable";
import TableModal from "../../components/tableModal";
import ViewLayout from "../../components/viewLayout";
import TableHelper from "../../components/tableHelper";
import { getCookie } from "../../jwt/_helpers/cookie";
import { useFetch } from "../../utils/fetchHook";
import { StateContext } from "../../utils/context";

const Labels = props => {
  const [openModal, setToggleModal] = useState(false);
  const [dataModal, setDataModal] = useState(null);
  

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
  const [apiData, error, loading] = useFetch("GET",`labels/${subUserEndpoint}?ordering=${ordering.order + ordering.name}&page=${currrentPage}&page_size=${pageSize}&search=${query}${parentUserOnly}`,token,false,forceUpdate);
  const [tableData, setTableData] = useState([]);

  //ajax handlers
  const [success, setSuccess] = useState(false);
  const [errorPut, setError] = useState(false);
  

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

  const handlerValues = { setSuccess, setError, forceUpdate, setForce };

  return (
    <>
      

      {loading ? (
        <TableHelper loading />
      ) : error ? (
        <TableHelper error />
      ) :  (
        <div>
          { 
            (!currentUser.labels_enabled) &&
            <Alert color="danger">
              You don't have access to this module, please contact the support team for further information.
            </Alert>
          }
          {
            (currentUser.labels_enabled) &&
            <>
              <ViewLayout title={"Your labels list"}>
                <LabelsTable
                  setToggleModal={setToggleModal}
                  setDataModal={setDataModal}
                  forceUpdate={forceUpdate}
                  data={tableData}
                  defaultSorted={defaultSorted}
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
          title={`Delete label ${dataModal.name}?`}
          apiURL={`labels/${dataModal.id}`}
          bodyID={dataModal.id}
        />
      )}
      {success && <Alert color="success">Label has been removed!</Alert>}
      {errorPut && (
        <Alert color="danger">
          Something went wrong! Please refresh page and try again!
        </Alert>
      )}
    </>
  );
};

export default Labels;
