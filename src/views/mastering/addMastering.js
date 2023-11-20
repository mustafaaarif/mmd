import React, { useEffect, useState, useRef, useContext } from "react";
import { Row, Col, Card, CardBody, CardTitle, Label, Alert, Button} from "reactstrap";
import MasteringModalConfirm from "./masteringModelConfirm";
import { getCookie } from "../../jwt/_helpers/cookie";
import Select from "react-select";
import {StateContext} from "../../utils/context";
import SongRow from "./songRow";
import {  uploadS3, validateSongs } from "./helperFunctions";
import {getUser} from "../../utils/getUser";
import { Redirect } from "react-router-dom";

const AddMastering = () => {
  const token = getCookie("token");
  const {currentUser, setCurrentUser} = useContext(StateContext);
  const didEff = useRef(false);
  const [forceUpdate, setForce] = useState(1);
  const [songs_count_ops, setSongsCountOps] = useState([]);
  const [songsCountTab, setSongsCountTab] = useState({
    label: "Select no of songs",
    value: -1,
  });
  const [success, setSuccess] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [masteringID, setMasteringID] = useState(true);
  const [errorPut, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [openModal, setToggleModal] = useState(false);
  const [dataModal, setDataModal] = useState(null);
  const [openUploadModal, setToggleUploadModal] = useState(false);
  const [uploadDataModal, setUploadDataModal] = useState(null);
  const songsListREF = useRef();
  const [listOfSongs, listOfSongsSET] = useState([{ key: 0, genre: "", tag: "", preset: "", dynamic_obj: true, intensity: "80", loudness_obj: true, loudness: "-14", base_file: "" }]);

  songsListREF.current = listOfSongs;

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

  useEffect(() => {
    let userCredits = (currentUser.credits && currentUser.credits > 10) ? 10 : currentUser.credits;
    let songsCountOps = [];
    for (let i = 1; i <= userCredits; i++) {
        let songsCountLabel = (i>1)?`${i} Songs`:`${i} Song`;
        songsCountOps.push({
            label: songsCountLabel,
            value: i,
        });
    }
    setSongsCountOps(songsCountOps);
    if(currentUser.id)
    {
        let masteringData = {
            created_by: currentUser.id,
            total_songs: songsCountTab.value,
            songs: []
        };

        setDataModal(masteringData);
    }
  }, [currentUser, songsCountTab]);

  useEffect(() => {
    if (!didEff.current) {
      didEff.current = true;
      return;
    }
    setForce(prev => prev + 1);
  }, [songsCountTab]);

  useEffect(() => {
      getUser(token, currentUser, setCurrentUser);
      setForce( prev => prev + 1);
  }, [success]);

  const handleSongCountChange = (e) => {
    let noOfSongs = e.value;
    let songsList = [];
    for (let i = 0; i < noOfSongs; i++) 
    { 
      let song = { key: i, genre: "", tag: "", preset: "", dynamic_obj: true, intensity: "80", loudness_obj: true, loudness: "-14", base_file: "" };
      songsList.push(song); 
    }
    listOfSongsSET(songsList);
    setSongsCountTab(e);
  }

  const continueToStep2 = () => {
    setToggleModal(true);
  }

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
            {uploadSuccess && (
                <Alert color="success">Audio Mastering Songs Uploaded Successfully!</Alert>
            )}
            {success && (
                <Alert color="success">Audio Mastering has been created! Now please select your songs in the section below</Alert>
            )}
            {redirect ? <Redirect to="/mastering" /> : null}
            {errorPut && (
                <Alert color="danger">
                {errorMsg}
                </Alert>
            )}
        </div>
        {!success && 
            <Row>
                <Col>
                    <Card>
                        <CardBody>
                            <CardTitle>
                                <h3>How many songs do you wish to master?</h3>
                            </CardTitle>
                            <Label>Number of Songs</Label>
                            <Select
                                components={{ IndicatorSeparator: () => null }}
                                name="songs_filter"
                                options={songs_count_ops}
                                value={songsCountTab}
                                onChange={(e) => handleSongCountChange(e)}
                            />
                            <div className="float-right mt-3">
                                <Button className="btn btn-success" disabled={currentUser.credits<1 || songsCountTab.value===-1} onClick={()=> {continueToStep2()}}>Continue</Button>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        }
        {success && 
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
        }
        {
        <MasteringModalConfirm
          openModal={openModal}
          setToggleModal={setToggleModal}
          setMasteringID={setMasteringID}
          dataModal={dataModal}
          title={`Are you sure you want to add new mastering?`}
          setSuccess={setSuccess}
          setError={setError}
          setErrorMsg={setErrorMsg}
          body={`Note: This will result in deduction of ${songsCountTab.value} credits.`}
          apiURL={`audio-masterings`}
          setRedirect={false}
        />
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

export default AddMastering;
