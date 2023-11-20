import React, {useState, useEffect, useContext} from 'react';
import {FormGroup, Button, Input, Row, Col} from "reactstrap";
import {StateContext} from "../../utils/context";

const arrowStyleWrap = {
  display: 'flex'
}
const arrowStyle = {
  padding: 3,
  cursor: 'pointer'
}

const RowSelect = ({values, landingData, trackErrors, setTrackErrors, fileType, setFileType}) => {
  const {
    track,
    removeTrack,
    index,
    manageTrackData,
    manageTrackDataFile,
    manageTrackDataDetails,
    trackOrderChange,
    listOfTracks,
    listOfTracksSET,
    updateRelease,
    status,
    blockedValeues,
    validateMixName
  } = values;
  const key = track.key;
  const [mix, setMix] = useState(0);

  //track_mix_select
  // 1 -> mix is selected
  // -1 -> orginal is selected
  // 2 -> changed on first render

  const [loading, setLoading] = useState(true);
  const [mixOuter, setMixOuter] = useState(updateRelease && track.track_mix_name.length > 0 ? 'mix' : 'orginal');

  useEffect(() => {
    if (updateRelease && track.track_mix_select === 1) {
      setMix(1);
    } else if (updateRelease && track.track_mix_select === 2) {
      setMix(2);
    } else {
      setMix(-1)
    }
  }, [track])

  return (
    <div className="artistWrap" style={{flexDirection: "column"}}>
      <div className="artistWrap align-items-start" style={{margin: "0"}}>
        <Col xs="1" style={arrowStyleWrap}>
          <div style={arrowStyle}
               onClick={() => trackOrderChange('up', key, index, track.order, listOfTracks, listOfTracksSET)}>▲
          </div>
          <div style={arrowStyle}
               onClick={() => trackOrderChange('down', key, index, track.order, listOfTracks, listOfTracksSET)}>▼
          </div>
        </Col>
        <Col xs="2">
          <Input
            type="url"
            disabled={landingData}
            name={`url_${key}`}
            value={track.url}
            className={
              "form-control" +
              ((trackErrors.url && key === trackErrors.key) ? " is-invalid" : "")
            }
            onChange={(e) => {
              manageTrackData(index, 'url', e.target.value);
              setTrackErrors(prev => ({...prev, url: ''}))
              if(e.target.value){
                setFileType('URL')
              }else {
                setFileType('')
              }
            }}
          />
          {trackErrors.url && key === trackErrors.key &&  <div className="error d-block">{trackErrors.url}</div>}
        </Col>
        <Col xs="2">
          <Input
            type="text"
            disabled={landingData}
            name={`track_name_${key}`}
            value={track.demo_song_name}
            className={
              "form-control" +
              ((trackErrors.name && key === trackErrors.key) ? " is-invalid" : "")
            }
            onChange={(e) => {
              if (updateRelease && blockedValeues !== null && blockedValeues.blockedSubmit) {
                blockedValeues.setBlockedSubmit(false);
              }
              manageTrackData(index, 'demo_song_name', e.target.value);
              setTrackErrors(prev => ({...prev, name: ''}))
            }}
          />
          {trackErrors.name && key === trackErrors.key &&  <div className="error d-block">{trackErrors.name}</div>}
        </Col>
        <Col xs="4">
          <div>
            { track.file ?
                <div className={"releaseFileRow"}>
                  <p className="releaseFileRowName">{track.file.name}</p>
                  {listOfTracks.length < 2 && (
                    <p className={'releaseRemoveFile'} onClick={() => {
                      manageTrackDataFile(index, 'track_file', "", key)
                      setFileType('')
                    }}
                    >Remove?</p>
                  )}
                </div>
                :
                <>
                  { landingData ? (
                    <input disabled type="text" className="form-control" value="" />
                  ) :
                    <input
                      type="file"
                      name={`track_${key}`}
                      id={`track_${key}`}
                      accept=".mp3"
                      className={
                        "form-control" +
                        ((trackErrors.file && key === trackErrors.key) ? " is-invalid" : "")
                      }
                      onChange={(e) => {
                        if (blockedValeues !== null && blockedValeues.blockedSubmit) {
                          blockedValeues.setBlockedSubmit(false);
                        }
                        manageTrackDataFile(index, 'track_file', e.target.files[0], key)
                        setTrackErrors(prev => ({...prev, file: ''}))
                        setFileType('FILE')
                      }}
                    />

                  }
                  <div className="artistUpload" id={`uploadProgress_${key}`}>
                  </div>
                  <div className="uploadProgresDiv">
                    <span id={`uploadProgress_text_${key}`}></span>
                  </div>
                  {trackErrors.file && key === trackErrors.key &&  <div className="error d-block">{trackErrors.file}</div>}
                </>
            }
          </div>
        </Col>
        <Col xs="1">
          {
            (status === "distributed" || status === "re_delivery-editing") ?
              <Button color={'danger'} disabled>Remove </Button>
              :
              <Button disabled={!!landingData} color={'danger'} onClick={() => {
                removeTrack(index);
                if (updateRelease && blockedValeues !== null && blockedValeues.blockedSubmit) {
                  blockedValeues.setBlockedSubmit(false);
                }
              }}>Remove </Button>

          }
        </Col>
      </div>
      <div style={{width: '100%', display: 'flex'}}>
        <Col xs="1"></Col>
        <Col xs="2"></Col>
        <Col xs="2">
          {
            updateRelease ?
              <Input
                style={{display: mix === 1 ? 'block' : 'none', marginTop: '10px'}}
                type="text"
                name={`track_mix_name_${key}`}
                className="track_mix_name_class"
                value={track.track_mix_name}
                onChange={(e) => {
                  validateMixName(e.target.value, key);
                  manageTrackData(index, 'track_mix_name', e.target.value);
                  if (updateRelease && blockedValeues !== null && blockedValeues.blockedSubmit) {
                    blockedValeues.setBlockedSubmit(false);
                  }
                }}
              />
              :
              <Input
                style={{display: mix === 1 ? 'block' : 'none', marginTop: '10px'}}
                type="text"
                name={`track_mix_name_${key}`}
                className="track_mix_name_class"
                value={track.track_mix_name}
                onChange={(e) => {
                  validateMixName(e.target.value, key);
                  manageTrackData(index, 'track_mix_name', e.target.value)
                }}
              />

          }
        </Col>
        <Col xs="3"></Col>
        <Col xs="2"></Col>
        <Col xs="1"></Col>
      </div>
      <div style={{width: '100%', display: 'flex'}}>
        <Col xs="1"></Col>
        <Col xs="2">
          <div className="fv-help-block" style={{display: 'none'}} id={`err_track_name_${key}`}>Please type track name
          </div>
        </Col>
        <Col xs="2">
          <div className="fv-help-block" style={{display: 'none'}} id={`err_track_mix_name_${key}`}>Please type mix
            name
          </div>
          <div className="fv-help-block" style={{display: 'none'}} id={`err_track_mix_name_regex_${key}`}>The mix name
            can only consist of alphabetical, number, space and underscore
          </div>
        </Col>
        <Col xs="3">
          <div className="fv-help-block" style={{display: 'none'}} id={`err_track_file_${key}`}>Please select track
            file
          </div>
        </Col>
        <Col xs="2"></Col>
        <Col xs="1"></Col>
      </div>
    </div>
  )
}

const RowSelectDisabled = ({data}) => {
  const {id, name, mix_name, resource, album_only} = data;


  return (
    <div className="artistWrap" style={{flexDirection: "column"}}>
      <div className="artistWrap" style={{margin: "0"}}>
        <Col xs="1" style={arrowStyleWrap}>
          <div style={arrowStyle}>▲</div>
          <div style={arrowStyle}>▼</div>
        </Col>
        <Col xs="2">
          <Input
            type="text"
            value={name}
            onChange={(e) => false}
            disabled={true}
          />
        </Col>
        <Col xs="3">
          <Input
            type="text"
            value={resource.split('/')[1]}
            onChange={(e) => false}
            disabled={true}
          />
        </Col>
        <Col xs="1">
          <Button color={'danger'} disabled>Remove </Button>
        </Col>
      </div>
      <div style={{width: '100%', display: 'flex'}}>
        <Col xs="1"></Col>
        <Col xs="2"></Col>
        <Col xs="2">
          <Input
            style={{display: mix_name.length > 0 ? 'block' : 'none', marginTop: '10px'}}
            type="text"
            value={mix_name}
            onChange={(e) => false}
            disabled={true}
          />
        </Col>
        <Col xs="3"></Col>
        <Col xs="2"></Col>
        <Col xs="1"></Col>
      </div>

    </div>
  )
}

const RowLabel = () => {
  return (
    <Row className="artistWrap labelRow">
      <Col xs="1">
        Order
      </Col>
      <Col xs="2">
        Url
      </Col>
      <Col xs="2">
        Track name
      </Col>
      <Col xs="3">
        File
      </Col>
      <Col xs="1">

      </Col>
    </Row>
  )
}


const TrackRow = ({
  values,
  disabled = false,
  dataView = null,
  updateRelease = false,
  status = 'offline',
  blockedValeues = null,
  landingData = null,
  trackErrors,
  setTrackErrors,
  fileType,
  setFileType
}) => {
  const {
    listOfTracks,
    manageTrackData,
    manageTrackDataFile,
    removeTrack,
    addNewTrack,
    trackOrderChange,
    listOfTracksSET,
    manageTrackDataDetails,
    validateMixName
  } = values;
  let key = Math.random().toString(36).substring(1);
  const {currentUser} = useContext(StateContext);

  const isDisabled =  false
  return (
    <>
      <FormGroup>
        <h3>Tracks</h3>
        <Row>
          <RowLabel/>
          { listOfTracks && listOfTracks.map((track, index) => {
                const itemVal = {
                  index,
                  track,
                  removeTrack,
                  manageTrackData,
                  manageTrackDataFile,
                  manageTrackDataDetails,
                  trackOrderChange,
                  listOfTracks,
                  listOfTracksSET,
                  updateRelease,
                  status,
                  blockedValeues,
                  validateMixName
                }
                return <RowSelect
                  landingData={landingData}
                  values={itemVal}
                  key={track.key}
                  trackErrors={trackErrors}
                  setTrackErrors={setTrackErrors}
                  fileType={fileType}
                  setFileType={setFileType}
                />
              })
          }
          <Col className="mb-2">
            {trackErrors.choseTwoMethods && <div className="error d-block">{trackErrors.choseTwoMethods}</div>}
          </Col>
        </Row>
        <div>
          {!landingData && (
            <Button disabled={isDisabled || !!landingData} color="primary" onClick={addNewTrack}>Add another</Button>
          )}
        </div>
      </FormGroup>
    </>
  );
};

export default TrackRow;
