import React, { useEffect, useState, useRef, useContext } from "react";
import Pagination from '../../components/pagination/pagination';
import MasteringTable from "../../components/masteringTable";
import ViewLayout from "../../components/viewLayout";
import { useFetch } from "../../utils/fetchHook";
import { getCookie } from "../../jwt/_helpers/cookie";
import TableHelper from "../../components/tableHelper";
import {StateContext} from "../../utils/context";
import { Alert } from "reactstrap";

const Mastering = () => {
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

  const [apiData, error, loading] = useFetch("GET", `audio-masterings/?ordering=${ordering.order + ordering.name}&page=${currrentPage}&page_size=${pageSize}&search=${query}`, token, false, forceUpdate);
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

  const tableProps = {
    tableData,
    defaultSorted
  };

  return (
    <>
      {loading ? (
        <TableHelper loading />
      ) : error ? (
        <TableHelper error />
      ) : (
        <div>
          {
            (!currentUser.mastering) &&
            <Alert color="danger">
              You don't have access to this module, please contact the support team for further information.
            </Alert>
          }
          {
            (currentUser.mastering && currentUser.credits<=0) &&
            <Alert color="danger">
              You don’t have any audio mastering credits left.  Find more about credits <a href="http://help.movemusic.io/en/articles/6183325-how-to-get-audio-mastering-credits" target="blank">here</a> and please reach out to our support team.
            </Alert>
          }
          {
            (currentUser.mastering && currentUser.credits>0) &&
            <Alert color="warning">
              Learn all about Audio Mastering <a href="http://help.movemusic.io/en/articles/6172115-how-to-create-mastering-in-the-mmd-platform" target="blank">here</a>. For more information and <a href="http://help.movemusic.io/en/articles/6183325-how-to-get-audio-mastering-credits" target="blank">credits</a>, please reach out to our support team.
            </Alert>
          }
          {
            (currentUser.mastering) &&
            <>
              <ViewLayout title={"Your Mastering List"}>
                <MasteringTable
                  {...tableProps} 
                  searchQuery={{setQuery, query, ordering, setOrdering}}
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

export default Mastering;