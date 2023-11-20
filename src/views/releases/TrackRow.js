import React, {useState, useEffect, useContext } from 'react';
import { FormGroup, Label, Button, Input, Row, Col, Badge } from "reactstrap";
import Select from "react-select";
import './row.css';
import { StateContext } from "../../utils/context";
import DropboxChooser from "../../components/dropboxChooser";

const arrowStyleWrap = {
  display: 'flex'
}
const arrowStyle = {
  padding: 3,
  cursor: 'pointer'
}

const RowSelect = ({ values }) => {
  const { track, removeTrack, index, manageTrackData, manageTrackDataFile, manageTrackDataDetails,  trackOrderChange, listOfTracks, listOfTracksSET, updateRelease, status, blockedValeues, manageDropboxTrackDataFile, manageDropboxTrackFileMetdataError, addMixNameValidator, removeMixNameValidator, revalidateField } = values;
  const key = track.key;
  const [mix, setMix] = useState(2);
  const [mixNameSelectFieldTouched, mixNameSelectFieldTouchedSET] = useState(false);
  const borderColor = mixNameSelectFieldTouched? "#2dce89" : "#e9ecef";

  const clearMixNameInput = (index) => {
    document.getElementById(`track[${index}].mix_name`).value = "";
  }

  //track_mix_select
  // 1 -> mix is selected
  // 2 -> orginal is selected

  useEffect(() => {
    if (updateRelease && (track.track_mix_select === 1)) {
      addMixNameValidator(`track[${index}].mix_name`);
      setMix(1);
    } else if (updateRelease && track.track_mix_select === 2) {
      setMix(2);
    }
  },[track])


  return (
    <div className="artistWrap" style={{flexDirection: "column"}}>
      <div className="artistWrap" style={{margin: "0", alignItems: 'flex-start'}}>
        <Col xs="1" style={arrowStyleWrap}>
          <div style={arrowStyle} onClick={() => trackOrderChange('up', key, index, track.order, listOfTracks, listOfTracksSET)}>▲</div>
          <div style={arrowStyle} onClick={() => trackOrderChange('down', key, index, track.order, listOfTracks, listOfTracksSET)}>▼</div>
        </Col>
        <Col xs="2">
          <Input
            type="text"
            name={`track[${index}].name`}
            defaultValue={track.track_name}
            onChange={(e) => {
              manageTrackData(index, 'track_name', e.target.value);
              if (updateRelease && blockedValeues !== null && blockedValeues.blockedSubmit){
                blockedValeues.setBlockedSubmit(false);
              }
            }}
            onFocus={() => {
              revalidateField(`track[${index}].name`)
            }}
          />
        </Col>
        <Col xs="2">
        {
          updateRelease ?
          <>
            <Select
              components={{ IndicatorSeparator:() => null }}
              defaultValue={track.track_mix_select === 1 ? {label: 'This is a Remix or Mix', value: 'mix'} : {label: 'Original Mix', value: 'orginal'}}
              styles={{
                menu: styles => ({ ...styles, zIndex: 10 }),
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  borderColor: mixNameSelectFieldTouched ? borderColor : baseStyles.borderColor,
                  boxShadow: state.isFocused || state.isHovered 
                    ? "0 0 0 0.2rem rgba(45, 206, 137, 0.25)" : "0 0 0 1px #e9ecef",
                  borderRadius: "2px",
                }),
              }}
              options={[
                {label: 'Original Mix', value: 'orginal'},
                {label: 'This is a Remix or Mix', value: 'mix'}
              ]}
              onFocus={() => {
                mixNameSelectFieldTouchedSET(true)
              }}
              onMouseEnter={() => {
                mixNameSelectFieldTouchedSET(true)
              }}
              onChange={(e) => {
                if (blockedValeues !== null && blockedValeues.blockedSubmit){
                  blockedValeues.setBlockedSubmit(false);
                }
                if (e.value === 'mix' && mix!==1) {
                  setMix(1);
                  addMixNameValidator(`track[${index}].mix_name`);
                } else {
                  if(mix!==2)
                  {
                    setMix(2);
                    removeMixNameValidator(`track[${index}].mix_name`);
                    manageTrackData(index, 'track_mix_name', '');
                    clearMixNameInput(index);
                  }
                }
              }}
            />
            <Input
              id={`track[${index}].mix_name`}
              name={`track[${index}].mix_name`}
              type="text"
              defaultValue={track.track_mix_name}
              className="track_mix_name_class"
              style={{display: mix === 1 ? 'block' : 'none', marginTop: '10px'}}
              onChange={(e) => {
                manageTrackData(index, 'track_mix_name', e.target.value);
                if (updateRelease && blockedValeues !== null && blockedValeues.blockedSubmit){
                  blockedValeues.setBlockedSubmit(false);
                }
              }}
              onFocus={() => {
                revalidateField(`track[${index}].mix_name`)
              }}
              onBlur={() => {
                revalidateField(`track[${index}].mix_name`)
              }}
            />
          </>
          :
          <>
            <Select
              components={{ IndicatorSeparator:() => null }}
              value={mix===1 ? {label: 'This is a Remix or Mix', value: 'mix'} : {label: 'Original Mix', value: 'orginal'}}
              styles={{
                menu: styles => ({ ...styles, zIndex: 10 }),
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  borderColor: mixNameSelectFieldTouched ? borderColor : baseStyles.borderColor,
                  boxShadow: state.isFocused || state.isHovered 
                    ? "0 0 0 0.2rem rgba(45, 206, 137, 0.25)" : "0 0 0 1px #e9ecef",
                  borderRadius: "2px",
                }),
              }}
              options={[
                {label: 'Original Mix', value: 'orginal'},
                {label: 'This is a Remix or Mix', value: 'mix'}
              ]}
              onFocus={() => {
                mixNameSelectFieldTouchedSET(true)
              }}
              onMouseEnter={() => {
                mixNameSelectFieldTouchedSET(true)
              }}
              onChange={(e) => {
                if (e.value === 'mix' && mix!==1) {
                  setMix(1);
                  addMixNameValidator(`track[${index}].mix_name`);
                } else {
                  if(mix!==2)
                  {
                    setMix(2);
                    removeMixNameValidator(`track[${index}].mix_name`);
                    manageTrackData(index, 'track_mix_name', '');
                    clearMixNameInput(index);
                  }
                }
              }}
            />
            <Input
              id={`track[${index}].mix_name`}
              name={`track[${index}].mix_name`}
              type="text"
              defaultValue={track.track_mix_name}
              className="track_mix_name_class"
              style={{display: mix === 1 ? 'block' : 'none', marginTop: '10px'}}
              onChange={(e) => {
                manageTrackData(index, 'track_mix_name', e.target.value);
                if (updateRelease && blockedValeues !== null && blockedValeues.blockedSubmit) {
                  blockedValeues.setBlockedSubmit(false);
                }
              }}
              onFocus={() => {
                revalidateField(`track[${index}].mix_name`)
              }}
              onBlur={() => {
                revalidateField(`track[${index}].mix_name`)
              }}
            />
          </>
        }
        </Col>
        <Col xs="3">
        {
          updateRelease ?
          <div>
            {
              track.track_res && track.track_res.length > 0 ?
              <div className={"releaseFileRow"}>
                <p className="releaseFileRowName">{track.track_res.split('/wav_tracks/')[1]}</p>
                {
                  (status === "distributed" || status === "re_delivery-editing") ?
                  <span></span>
                  :
                  <p className={'releaseRemoveFile'} onClick={() => {
                    manageTrackData(index, 'track_res', '');
                    manageTrackDataDetails(index, 'URL', '');
                    if (blockedValeues !== null && blockedValeues.blockedSubmit){
                      blockedValeues.setBlockedSubmit(false);
                    }
                  }}
                  >Remove?</p>
                }
              </div>
              :
              <div>
                <input
                  type="file"
                  name={`track_${key}`}
                  id={`track_${key}`}
                  accept=".wav"
                  onChange={(e) => {
                    if (blockedValeues !== null && blockedValeues.blockedSubmit){
                      blockedValeues.setBlockedSubmit(false);
                    }
                    manageTrackDataFile(index, 'track_file', e.target.files[0], key)
                  }}
                />
                <div className="trackUploadContainer">
                  <div className="trackUpload" id={`uploadProgress_${key}`}>
                  </div>
                  <div className="trackUploadProgresDiv">
                    <span id={`uploadProgress_text_${key}`}></span>
                  </div>
                </div>
                <DropboxChooser 
                  keyUploading={key}
                  handleDropboxUploadComplete={manageDropboxTrackDataFile}
                  handleFileMetadataError={manageDropboxTrackFileMetdataError}
                  fileType={"audio"}
                  acceptedExtensions={[".wav"]}
                  s3Path={"direct/wav_tracks"}
                />
              </div>
            }
          </div>
          :
          <div>
            <input
              type="file"
              name={`track_${key}`}
              id={`track_${key}`}
              accept=".wav"
              onChange={(e) => manageTrackDataFile(index, 'track_file', e.target.files[0], key)}
            />
            <div className="trackUploadContainer">
              <div className="trackUpload" id={`uploadProgress_${key}`}>
              </div>
              <div className="trackUploadProgresDiv">
                <span id={`uploadProgress_text_${key}`}></span>
              </div>
            </div>
            <DropboxChooser 
              keyUploading={key}
              handleDropboxUploadComplete={manageDropboxTrackDataFile}
              handleFileMetadataError={manageDropboxTrackFileMetdataError}
              fileType={"audio"}
              acceptedExtensions={[".wav"]}
              s3Path={"direct/wav_tracks"}
            />
          </div>
        }
        </Col>
        <Col xs="2">
          <Label check>
          <input
            type="checkbox"
            id={`checkbox_album_only_${key}`}
            name={`album_only_${key}`}
            selected={track.album_only}
            onChange={(e) => {
              if (updateRelease && blockedValeues !== null && blockedValeues.blockedSubmit){
                blockedValeues.setBlockedSubmit(false);
              }
              manageTrackData(index, 'album_only', e.target.value)
            }}
          />
          {' '}
            Only Album

          </Label>
        </Col>
        <Col xs="1">
          {
            (status === "distributed" || status === "re_delivery-editing") ?
            <Button color={'danger'} disabled>Remove </Button>
            :
            <Button color={'danger'} onClick={() => {
              removeTrack(index);
              if (updateRelease && blockedValeues !== null && blockedValeues.blockedSubmit){
                blockedValeues.setBlockedSubmit(false);
              }
            }}>Remove </Button>

          }
        </Col>
      </div>
      <div style={{width: '100%', display: 'flex'}}>
        <Col xs="1"></Col>
        <Col xs="2"></Col>
        <Col xs="2"></Col>
        <Col xs="3"></Col>
        <Col xs="2"></Col>
        <Col xs="1"></Col>
      </div>
      <div style={{width: '100%', display: 'flex'}}>
        <Col xs="1"></Col>
        <Col xs="2">
          <div className="fv-help-block" style={{ display: 'none'}} id={`err_track_name_${key}`}>Please type track name</div>
        </Col>
        <Col xs="2">
          <div className="fv-help-block" style={{ display: 'none'}} id={`err_track_mix_name_${key}`}>Please type mix name</div>
          <div className="fv-help-block" style={{ display: 'none'}} id={`err_track_mix_name_regex_${key}`}>The mix name can only consist of alphabetical, number, space and underscore</div>
        </Col>
        <Col xs="3">
          <div className="fv-help-block" style={{ display: 'none'}}  id={`err_track_file_${key}`}>Please select track file</div>
        </Col>
        <Col xs="2"></Col>
        <Col xs="1"></Col>
      </div>
    </div>
  )
}

const RowSelectDisabled = ({ data }) => {
  const { id, name, mix_name, resource, album_only } = data;


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
        <Col xs="2">
          <Input
            type="text"
            value={mix_name.length === 0 ? "Original Mix" : 'This is a Remix or Mix'}
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
        <Col xs="2">
          <Label check>
          <input
            type="checkbox"
            id={`album_only_${resource + name}`}
            selected={album_only}
            onChange={(e) => false}
          />
          {' '}
            Only Album

          </Label>
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
        Track name <Badge color="primary">Required</Badge>
      </Col>
      <Col xs="2">
        Mix name <Badge color="primary">Required</Badge>
      </Col>
      <Col xs="3">
        File <Badge color="primary">Required</Badge>
      </Col>
      <Col xs="2">
        Album only?
      </Col>
      <Col xs="1">

      </Col>
    </Row>
  )
}


const TrackRow = ({ values, disabled = false, dataView = null, updateRelease = false, status = 'offline', blockedValeues = null }) => {
  const { listOfTracks, manageTrackData, manageTrackDataFile, removeTrack, addNewTrack, trackOrderChange, listOfTracksSET, manageTrackDataDetails, manageDropboxTrackDataFile, manageDropboxTrackFileMetdataError, addMixNameValidator, removeMixNameValidator, revalidateField } = values;
  let key = Math.random().toString(36).substring(1);
  const {currentUser} = useContext(StateContext);

  const isDisabled =  ((!currentUser.unlimited_track_amount && (currentUser.total_allowed_track_amount <= 0)) || listOfTracks.length === (Math.min(currentUser.total_allowed_track_amount, 20))) ? true : false
  return (
    <>
      <FormGroup style={{ paddingBottom: 30 }}>
        <Label>Tracks</Label>
        <Row>
          <RowLabel />
          {
            !disabled ? listOfTracks.map((track, index) => {

              const itemVal = { index, track, removeTrack, manageTrackData, manageTrackDataFile,manageTrackDataDetails,  trackOrderChange, listOfTracks, listOfTracksSET, updateRelease, status, blockedValeues, manageDropboxTrackDataFile, manageDropboxTrackFileMetdataError, addMixNameValidator, removeMixNameValidator, revalidateField }
              return <RowSelect values={itemVal} key={track.key} />
            })
            :
            dataView.map(track => <RowSelectDisabled key={track.name + track.resource} data={track}/>)
          }
        </Row>
        {
          updateRelease ?
          (!disabled && (status !== 'distributed' && status !== 're_delivery-editing')) &&
          <div>
            <Button disabled={isDisabled} color="primary" onClick={() => addNewTrack([...listOfTracks, { order: listOfTracks.length + 1, track_name: "", track_mix_name: "", album_only: false, key: key, track_mix_select: 2 }])}>Add another</Button>{' '}
          </div>
          :
          (!disabled && (status !== 'distributed' && status !== 're_delivery-editing')) &&
          <div>
          <Button disabled={isDisabled} color="primary" onClick={() => addNewTrack([...listOfTracks, { order: listOfTracks.length + 1, track_name: "", track_mix_name: "", album_only: false, key: key }])}>Add another</Button>{' '}
        </div>

        }
      </FormGroup>
    </>
  );
};

export default TrackRow;
