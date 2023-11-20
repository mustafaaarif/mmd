import React, { useEffect, useState, useContext, useRef } from "react";
import { Alert } from "reactstrap";
import ReleaseTable from "../../components/releaseTable";
import Pagination from '../../components/pagination/pagination';
import { useFetch } from "../../utils/fetchHook";
import { getCookie,setCookie } from "../../jwt/_helpers/cookie";
import TableHelper from "../../components/tableHelper";
import { StateContext } from "../../utils/context";

const Releases = () => {
  const token = getCookie("token");
  const { currentUser } = useContext(StateContext);
  const [forceUpdate, setForceUpdate] = useState(0);

  const didEff1 = useRef(false);
  const didEff2 = useRef(false);
  const [dataCount, setDataCount] = useState(0);
  const [currrentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [query, setQuery] = useState('');
  const [ordering, setOrdering] = useState({ order: '-', name: 'official_date', sort: 'official_date' });
  const [subUser, setSubUser] = useState('');
  const [subUserEndpoint, setSubUserEndpoint] = useState('');
  const [parentUserOnly, setParentUserOnly] = useState('&parent_user_only=true');
  const [todUrl, setTodUrl] = useState('#');
  const [touUrl, setTouUrl] = useState('#');
  const [ppUrl, setPpUrl] = useState('#');
  const [canAddTakedown, setCanAddTakedown] = useState(false);

  const [apiData, error, loading] = useFetch("GET", `releases/${subUserEndpoint}?ordering=${ordering.order + ordering.name}&page=${currrentPage}&page_size=${pageSize}&search=${query}${parentUserOnly}`, token, false, forceUpdate);
  const [appVariables] = useFetch("GET", `app-variables/`, token, false, forceUpdate);
  const [tableData, setTableData] = useState([]);


  useEffect(() => {
    // setCookie('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzAwMzUwMTEzLCJpYXQiOjE3MDAxNzczMTMsImp0aSI6IjQyOGVkNmYyNGU2YjRkZTc4ZTEwOTdhYzg4OGQ2MDQ5IiwidXNlcl9pZCI6MTJ9.9HVwcwh-nv9Z5wG39ULQleU7xeqiKjGZouUAahe9neY')
    if (apiData?.detail === "Invalid page.") {
      setCurrentPage(1);
      return;
    }

    if (apiData) {
      if (apiData.count) {
        setDataCount(apiData.count);
      }
      if (apiData.results) {
        setTableData(apiData.results);
      }
    }
  }, [apiData]);

  useEffect(() => {
    if (appVariables) {
      if (appVariables) {
        setTodUrl(appVariables['terms-of-distribution-url']);
        setTouUrl(appVariables['terms-of-use-url']);
        setPpUrl(appVariables['privacy-policy-url']);
      }
    }
  }, [appVariables]);

  useEffect(() => {
    if (currentUser && currentUser.can_add_takedown) {
      setCanAddTakedown(currentUser.can_add_takedown)
    }
  }, [currentUser]);


  useEffect(() => {
    if (!didEff1.current) {
      didEff1.current = true;
      return;
    }
    setForceUpdate(prev => prev + 1);
  }, [currrentPage, pageSize, ordering.order, ordering.name, subUser]);


  useEffect(() => {
    if (!didEff2.current) {
      didEff2.current = true;
      return;
    }
    const timeout = setTimeout(() => {
      setForceUpdate(prev => prev + 1);
    }, 500)
    return () => clearTimeout(timeout)
  }, [query])

  const defaultSorted = [{
    dataField: ordering.sort,
    order: ordering.order === "-" ? "desc" : "asc"
  }]

  const tableProps = {
    tableData,
    defaultSorted,
    forceUpdate,
    setForceUpdate
  };

  const paginationProps = {
    pageSize, setPageSize, dataCount, setCurrentPage, currrentPage
  }
  return (
    <>
      {loading ? (
        <TableHelper loading />
      ) : error ? (
        <TableHelper error />
      ) : (
        <div>
          {
            (currentUser.distribution && !currentUser.unlimited_track_amount && (currentUser.total_allowed_track_amount <= 0)) && <Alert color="danger">
              You have spent your track distribution allowance. In order to upload more tracks please upgrade your account or contact our support team.
            </Alert>
          }
          {
            (!currentUser.distribution) &&
            <Alert color="danger">
              You don't have access to this module, please contact the support team for further information.
            </Alert>
          }
          {
            (!currentUser.release_transfer) &&
            <Alert color="danger">
              Currently, you do not have permission to use release transfer feature. If you are transferring a bigger back catalog or wish to transfer more record labels catalogs to Move Music with just a few clicks, don't hesitate to contact our support team.
            </Alert>
          }
          {
            (currentUser.distribution) &&
            <>
              <ReleaseTable
                {...tableProps}
                searchQuery={{ setQuery, query, ordering, setOrdering }}
                subUserData={{ subUser, setSubUser, subUserEndpoint, setSubUserEndpoint, setParentUserOnly }}
                todUrl={todUrl}
                touUrl={touUrl}
                ppUrl={ppUrl}
                canAddTakedown={canAddTakedown}
              />
              <Pagination pagination={paginationProps} />
            </>
          }
        </div>
      )}
    </>
  );
};

export default Releases;
