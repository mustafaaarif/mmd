import React, { useEffect, useState, useRef, useContext } from "react";
import { Alert } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";

import MusicLinkUrlpartTable from "../../components/musicLinkUrlpartTable";
import Pagination from "../../components/pagination/pagination";
import TableModal from "../../components/tableModal";
import ViewLayout from "../../components/viewLayout";
import { useFetch } from "../../utils/fetchHook";

import {StateContext} from "../../utils/context";

import { getCookie } from "../../jwt/_helpers/cookie";
import TableHelper from "../../components/tableHelper";

import { getMusicLinks, setMusicLinks } from "../../redux/musicLinks/action";

const MusicLinkUrlpart = (props) => {
  const dispatch = useDispatch();
  const [openModal, setToggleModal] = useState(false);
  const [dataModal, setDataModal] = useState(null);
  const [deleteBody, setDeleteBody] = useState(false);
  //ajax handlers
  const [success, setSuccess] = useState(false);
  const [errorPut, setError] = useState(false);

  const [forceUpdate, setForce] = useState(1);

  const handlerValues = { setSuccess, setError, forceUpdate, setForce };
  const [tableData, setTableData] = useState([]);

  const musicLinksUrlParts = useSelector((state) => state.musicLinks);

  const didEff1 = useRef(false);
  const didEff2 = useRef(false);
  const [dataCount, setDataCount] = useState(0);
  const [currrentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [query, setQuery] = useState("");
  const [ordering, setOrdering] = useState({
    order: "",
    name: "part",
    sort: "part",
  });

  const token = getCookie("token");
  const {currentUser} = useContext(StateContext);

  const [urlparts, errorUrlparts, loadingUrlparts] = useFetch(
    "GET",
    `musiclinks_urlparts/?ordering=${ordering.order + ordering.name}&page=${currrentPage}&page_size=${pageSize}&search=${query}`,
    token,
    false,
    forceUpdate
  );

  const defaultSorted = [
    {
      dataField: ordering.sort,
    },
  ];

  const tableProps = {
    tableData,
    defaultSorted,
  };

  useEffect(() => {
    if (urlparts.results && urlparts.results) {
      setTableData(urlparts.results);
      setDataCount(urlparts.count);
      if (!musicLinksUrlParts.length || musicLinksUrlParts.length !== urlparts.count) {
        dispatch(setMusicLinks(urlparts.results));
      }
    }
  }, [urlparts]);

  useEffect(() => {
    if (!didEff1.current) {
      didEff1.current = true;
      return;
    }
    setForce((prev) => prev + 1);
  }, [currrentPage, pageSize, ordering.order, ordering.name]);

  useEffect(() => {
    if (!didEff2.current) {
      didEff2.current = true;
      return;
    }
    const timeout = setTimeout(() => {
      setForce((prev) => prev + 1);
    }, 500);
    return () => clearTimeout(timeout);
  }, [query]);

  const paginationProps = {
    pageSize,
    setPageSize,
    dataCount,
    setCurrentPage,
    currrentPage,
  };

  return (
    <>
      {              
        (!currentUser.music_link && !loadingUrlparts) ? (
          <Alert color="danger">
            Currently this feature is only offered to few selected users but the good news is that you will also be able to use it really soon. Keep watching this space!
          </Alert>
        ) : (currentUser.music_link && loadingUrlparts) ? (
          <TableHelper loading />
        ) : errorUrlparts ? (
          <TableHelper error />
        ) :  (
        <div>
          <ViewLayout title={"Your music links urlpart list"}>
            <MusicLinkUrlpartTable
              {...tableProps}
              setToggleModal={setToggleModal}
              setDataModal={setDataModal}
              setDeleteBody={setDeleteBody}
              forceUpdate={forceUpdate}
              searchQuery={{ setQuery, query, ordering, setOrdering }}
            />
          </ViewLayout>

          <Pagination pagination={paginationProps} />
        </div>
      )
    }

      {dataModal && (
        <TableModal
          openModal={openModal}
          setToggleModal={setToggleModal}
          dataModal={dataModal}
          values={handlerValues}
          title={dataModal.can_be_deleted?`Delete ${dataModal.part}?`: `Can't Delete music-link-urlpart ${dataModal.part}`}
          body={
            !dataModal.can_be_deleted?
            `Music-link-urlpart ${dataModal.part} can't be deleted as it is already associated with a Music Link.`:
            "Are you really sure you really want to delete this music-link-urlpart?"
          }
          apiURL={`musiclinks_urlparts/${dataModal.id}/`}
          bodyID={dataModal.id}
          deleteBody={deleteBody}
          can_be_deleted={dataModal.can_be_deleted}
        />
      )}
      {success && <Alert color="success">Music Link Urlpart has been removed!</Alert>}
      {errorPut && (
        <Alert color="danger">
          Something went wrong! Please refresh page and try again!
        </Alert>
      )}
    </>
  );
};

export default MusicLinkUrlpart;
