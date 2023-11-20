import React, { useEffect, useState, useRef, useContext } from "react";
import { Alert } from "reactstrap";
import MusicLinkTable from "../../components/musicLinkTable";
import Pagination from '../../components/pagination/pagination';
import TableModal from "../../components/tableModal";
import ViewLayout from "../../components/viewLayout";
import { useFetch } from "../../utils/fetchHook";

import {StateContext} from "../../utils/context";

import { getCookie } from "../../jwt/_helpers/cookie";
import TableHelper from "../../components/tableHelper";

const MusicLink = props => {
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
  const [ordering, setOrdering] = useState({order: '-', name: 'created', sort: 'created'});
  const [subUser, setSubUser] = useState('');
  const [subUserEndpoint, setSubUserEndpoint] = useState('');
  const [parentUserOnly, setParentUserOnly] = useState('&parent_user_only=true');

  const MUSIC_LINK_URL = process.env.REACT_APP_MUSIC_LINK_URL;

  const token = getCookie("token");
  const {currentUser} = useContext(StateContext);

  const [urlparts, errorUrlparts, loadingUrlparts] = useFetch("GET",`musiclinks_urlparts/`, token);
  const [apiData, error, loading] = useFetch(
    "GET",
    `musiclinks/${subUserEndpoint}?ordering=${ordering.order + ordering.name}&page=${currrentPage}&page_size=${pageSize}&search=${query}${parentUserOnly}`,
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

    if(apiData.results && urlparts.results){
      // console.log(apiData.results, urlparts.results)
      setTableData(apiData.results.map(r => 
        ({ ...r, musiclink_url: `${MUSIC_LINK_URL}/l/${(urlparts?.results || []).find(u => r.url_part1 === u.id)?.part}/${r.url_part2}`})
      ));
      setDataCount(apiData.count);
    }
  }, [apiData, urlparts]);

  
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
      {
        (!currentUser.music_link && !loading) ? (
          <Alert color="danger">
            Currently this feature is only offered to few selected users but the good news is that you will also be able to use it really soon. Keep watching this space!
          </Alert>
        ): (currentUser.music_link && loading) ? (
        <TableHelper loading />
        ) : error ? (
          <TableHelper error />
        ) :  (
          <div>
            <ViewLayout title={"Your music links list"}>
              <MusicLinkTable
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
          </div>
        )
      }

      {dataModal && (
        <TableModal
          openModal={openModal}
          setToggleModal={setToggleModal}
          dataModal={dataModal}
          values={handlerValues}
          title={
            deleteBody ? `Delete ${dataModal.release_name}?` : `Edit ${dataModal.name}?`
          }
          body={"Are you really sure you really want to delete this music-link?"}
          apiURL={`musiclinks/${dataModal.id}/`}
          bodyID={dataModal.id}
          deleteBody={deleteBody}
        />
      )}
      {success && <Alert color="success">Music Link has been removed!</Alert>}
      {errorPut && (
        <Alert color="danger">
          Something went wrong! Please refresh page and try again!
        </Alert>
      )}
    </>
  );
};

export default MusicLink;
