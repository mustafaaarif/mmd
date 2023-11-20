import React, { useEffect, useState, useContext, useRef } from "react";
import MasteringSongsTable from "../../components/masteringSongsTable";
import ViewLayout from "../../components/viewLayout";
import TableHelper from "../../components/tableHelper";
import { useFetch } from "../../utils/fetchHook";
import { useLocation } from "react-router-dom";
import { getCookie } from "../../jwt/_helpers/cookie";

import {StateContext} from "../../utils/context";

const MasteringSongs = props => {

  const {currentUser} = useContext(StateContext);

  const token = getCookie("token");

  const location = useLocation();
  const masteringID = location.pathname.split("/")[2];
  const [apiData, error, loading] = useFetch("GET",`audio-masterings/${masteringID}/`, token);

  const [tableData, setTableData] = useState([]);


  useEffect(() => {
    if(apiData.songs)
    {
      setTableData(apiData.songs);
    }
  }, [apiData]);

  const tableProps = {
    tableData,
    error,
    loading,
  };

  return (
    <>
      {loading ? (
        <TableHelper loading />
      ) : error ? (
        <TableHelper error />
      ) :  (
        <div>
          <ViewLayout title={"Audio Mastering Songs"}>
            <MasteringSongsTable
              {...tableProps}
            />
          </ViewLayout>
        </div>
      )}
    </>
  );
};

export default MasteringSongs;
