import React, { useEffect, useState, useRef, useContext } from "react";
import { Alert } from "reactstrap";
import ArtistsWishlistTable from "../../components/artistsWishlistTable";
import Pagination from '../../components/pagination/pagination';
import ViewLayout from "../../components/viewLayout";
import { useFetch } from "../../utils/fetchHook";
import { getCookie } from "../../jwt/_helpers/cookie";
import TableHelper from "../../components/tableHelper";
import { StateContext } from "../../utils/context";

const ArtistsWishlist = props => {

  const [forceUpdate, setForce] = useState(1);

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
    `artist-wishlist/${subUserEndpoint}?ordering=${ordering.order + ordering.name}&page=${currrentPage}&page_size=${pageSize}&search=${query}${parentUserOnly}`,
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
              <ViewLayout title={"Your artists wishlist"}>
                <ArtistsWishlistTable
                  {...tableProps}
                  forceUpdate={forceUpdate}
                  setForce={setForce}
                  searchQuery={{setQuery, query, ordering, setOrdering}}
                  // subUserData={{subUser, setSubUser, subUserEndpoint, setSubUserEndpoint, setParentUserOnly}}
                  />
              </ViewLayout>
              <Pagination pagination={paginationProps}/>           
            </>
          }
        </div>
      )}
    </>
  );
};

export default ArtistsWishlist;
