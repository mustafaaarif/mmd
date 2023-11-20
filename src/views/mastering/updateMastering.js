import React, { useEffect, useState, useRef, useContext } from "react";
import { Row, Col, Card, CardBody, CardTitle, Label, Alert, Button} from "reactstrap";
import MasteringModalConfirm from "./masteringModelConfirm";
import { getCookie } from "../../jwt/_helpers/cookie";
import {StateContext} from "../../utils/context";
import { useFetch } from "../../utils/fetchHook";
import SongRow from "./songRow";
import {  uploadS3, validateSongs } from "./helperFunctions";
import { Redirect } from "react-router-dom";

const UpdateMastering = ({ match, name }) => {
  const token = getCookie("token");
  const {currentUser} = useContext(StateContext);
  const masteringID = match.url.split("/")[2];

  const [masteringData, error, loading] = useFetch(
    "GET",
    `audio-masterings/${masteringID}/`,
    token
  );

  const [songsUploaded, setSongsUploaded] = useState(false);
  const [totalSongs, setTotalSongs] = useState(0);
  const [redirect, setRedirect] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errorPut, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [openUploadModal, setToggleUploadModal] = useState(false);
  const [uploadDataModal, setUploadDataModal] = useState(null);
  const songsListREF = useRef();
  const [listOfSongs, listOfSongsSET] = useState([{ key: 0, genre: "", tag: "", preset: "", dynamic_obj: true, intensity: "80", loudness_obj: true, loudness: "-14", base_file: "" }]);

  songsListREF.current = listOfSongs;

  useEffect(() => {
    if (masteringData.total_songs) {
        setTotalSongs(masteringData.total_songs);
        let noOfSongs = masteringData.total_songs;
        let songsList = [];
        for (let i = 0; i < noOfSongs; i++) 
        { 
          let song = { key: i, genre: "", tag: "", preset: "", dynamic_obj: true, intensity: "80", loudness_obj: true, loudness: "-14", base_file: "" };
          songsList.push(song); 
        }
        listOfSongsSET(songsList);
    }
    if(masteringData.songs_uploaded)
    {
        setSongsUploaded(true);
        // setRedirect(true);
    }
  }, [masteringData]);

  const manageSongData = (index, key, value) => {
    const newList = listOfSongs.map((element, i) => {
      if (index === i) {
        element[key] = value;
      }
      return element;
    });
    listOfSongsSET(newList);
  };

  const manageSongDataFile = async (index, key, value, file_key) => {
      // add song's file to listOfSongs
      const uploadResponse = await uploadS3(value,token, file_key);
      manageSongData(index, 'base_file', uploadResponse);
  };

  const songProps = {
    listOfSongs,
    manageSongData,
    manageSongDataFile,
    listOfSongsSET,
  };

  const uploadSongs = (e) => {
    
    const dataObject = {
      songs: []
    };

    listOfSongs.map((song, i) => {
        let songObject = {};
        songObject['base_file'] = song.base_file;
        songObject['genre'] = song.genre;
        songObject['tag'] = song.tag;
        if (song.dynamic_obj)
        {
          songObject['intensity'] = song.intensity;
          songObject['preset'] = song.preset.value;
        }
        if (song.loudness_obj)
        {
          songObject['target_level'] = song.loudness;
        }
        songObject['loudness_object'] = song.loudness_obj;
        songObject['dynamic_object'] = song.loudness_obj;
        dataObject['songs'].push(songObject);
    });

    setUploadDataModal(dataObject);


    const songsErrors = validateSongs(songsListREF.current, [
      "song_genre", "song_tag", "song_preset", "song_intensity", "song_loudness", "song_file"
    ]);

    if(songsErrors === 0)
    {
      setToggleUploadModal(true);
    }
  }

  return (
    <>
        <div>
            {uploadSuccess && (<Alert color="success">Audio Mastering updated Successfully!</Alert>)}
            {redirect ? <Redirect to="/mastering" /> : null}
            {errorPut && (
                <Alert color="danger">
                {errorMsg}
                </Alert>
            )}
        </div>

        {
            songsUploaded && (
                <Alert color="danger">
                    Audio Mastering can not be updated once the songs are uploaded!
                </Alert>
            )
        }

        {
          totalSongs<=0 && (
            <Alert color="danger">
              Mastering can not be updated as it does not exist!
            </Alert>
          )
        }

        {
            (!songsUploaded && totalSongs>0 && !loading) && (
                <Row>
                    <Col>
                        <Card>
                            <CardBody>
                                <CardTitle>
                                    <h3>Select your songs for mastering</h3>
                                </CardTitle>
                                <SongRow
                                    values={songProps}
                                    id="releaseTracks"
                                    name="releaseTracks"
                                />
                                <div className="float-right mt-3">
                                    <Button className="btn btn-success" onClick={()=>{uploadSongs()}}>Save</Button>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            )
        }

        {
          <MasteringModalConfirm
            openModal={openUploadModal}
            setToggleModal={setToggleUploadModal}
            dataModal={uploadDataModal}
            title={`Are you sure you want to save Audio Mastering?`}
            setSuccess={setUploadSuccess}
            setError={setError}
            setErrorMsg={setErrorMsg}
            body={` Note: Please make sure to upload correct audio files as they can not be modified once saved.`}
            apiURL={`audio-masterings/${masteringID}`}
            method={'PUT'}
            setRedirect={setRedirect}
          />
        }
    </>
  );
};

export default UpdateMastering;
