import React, { useState } from 'react';
import { FormGroup, Label,CustomInput, Input, Row, Col, Tooltip } from "reactstrap";
import Select from 'react-select';
import './songRow.css'

const presetOps = [
  { value: 'm', label: 'Acoustic' },
  { value: 'i', label: 'All Genres' },
  { value: 'n', label: 'Classical' },
  { value: 'b', label: 'Club - House - Techno' },
  { value: 'h', label: 'EDM Music' },
  { value: 'f', label: 'Electronic' },
  { value: 'g', label: 'Electronic Raw' },
  { value: 'c', label: 'Hip Hop' },
  { value: 'd', label: 'Hip Hop Bass' },
  { value: 'a', label: 'Pop Music' },
  { value: 'k', label: 'Pop & RnB' },
  { value: 'j', label: 'Rock & Metal' },
  { value: 'e', label: 'Trap' },
  { value: 'l', label: 'Vocal Focused' }
];

const RowSelect = ({ values }) => {
  const { song, index, manageSongData, manageSongDataFile, blockedValeues } = values;
  const key = song.key;
  const validExtensions = ["aac", "m4a", "mp4", "m4b", "3gp", "aif", "aiff", "aifc", "flac", "mp3", "opus", "ogg", "wav"];

  return (
    <div className="artistWrap" style={{flexDirection: "column"}}>
      <div className="artistWrap" style={{margin: "0"}}>
        <Col xs="2">
          <Input
            type="text"
            name={`song_tag_${key}`}
            value={song.tag}
            onChange={(e) => {
              if (blockedValeues !== null && blockedValeues.blockedSubmit){
                blockedValeues.setBlockedSubmit(false);
              }
              manageSongData(index, 'tag', e.target.value);
            }}
            placeholder="i.e. Song Name"
          />
        </Col>

        <Col xs="2">
          <Input
            type="text"
            name={`song_genre_${key}`}
            value={song.genre}
            onChange={(e) => {
              if (blockedValeues !== null && blockedValeues.blockedSubmit){
                blockedValeues.setBlockedSubmit(false);
              }
              manageSongData(index, 'genre', e.target.value);
            }}
            placeholder="i.e. Pop"
          />
        </Col>
        
        <Col xs="2">
          <Select
            name="preset"
            closeMenuOnSelect={true}
            options={presetOps}
            value={song.preset}
            onChange={(e) => {
              manageSongData(index, 'preset', e);  
              if (blockedValeues !== null && blockedValeues.blockedSubmit){
                blockedValeues.setBlockedSubmit(false);
              }
            }}
            placeholder="Select Preset"
            className="artistType"
          />
        </Col>
        <Col xs="2">
          <Input
            type="range"
            name={`song_intensity_${key}`}
            defaultValue={song.intensity}
            onChange={(e) => {
              if (blockedValeues !== null && blockedValeues.blockedSubmit){
                blockedValeues.setBlockedSubmit(false);
              }
              manageSongData(index, 'intensity', e.target.value);
            }}
            min="1"
            max="100"
            step="1"
          />
          <output><b>{song.intensity} %</b></output>
        </Col>
        <Col xs="2">
          <Input
            type="range"
            name={`song_loudness_${key}`}
            defaultValue={song.loudness}
            onChange={(e) => {
              if (blockedValeues !== null && blockedValeues.blockedSubmit){
                blockedValeues.setBlockedSubmit(false);
              }
              manageSongData(index, 'loudness', e.target.value);
            }}
            min="-22"
            max="-6"
            step="1"
          />
          <output><b>{song.loudness} dB</b></output>
        </Col>
        <Col xs="2">
          <CustomInput
            type="file"
            name={`song_${key}`}
            id={`song_${key}`}
            accept=".aac,.m4a,.mp4,.m4b,.3gp,.aif,.aiff,.aifc,.flac,.mp3,.opus,.ogg,.wav"
            onChange={(e) => {
              if (!e || !e.target || !e.target.files || e.target.files.length === 0) {
                return;
              }
              else {
                document.getElementById(`err_song_file_valid_${key}`).style.display='none';
                const file = e.target.files[0];
                const name = file.name;
                const lastDot = name.lastIndexOf('.');
                const ext = name.substring(lastDot + 1);
                var extValid = (validExtensions.indexOf(ext) > -1);
                if(extValid)
                {
                  manageSongDataFile(index, 'song_file', e.target.files[0], key);
                }
                else
                {
                  document.getElementById(`err_song_file_valid_${key}`).style.display='block';
                }
              }
            }}
          />
          <div className="artistUpload" id={`uploadProgress_${key}`}>
          </div>
          <div className="uploadProgresDiv">
            <span id={`uploadProgress_text_${key}`}></span>
          </div>
        </Col>
      </div>
      <div style={{width: '100%', display: 'flex'}}>
        <Col xs="2"></Col>
        <Col xs="2"></Col>
        <Col xs="2"></Col>
        <Col xs="2"></Col>
        <Col xs="2"></Col>
        <Col xs="2"></Col>
      </div>
      <div style={{width: '100%', display: 'flex'}}>
        <Col xs="2">
          <div className="fv-help-block" style={{ display: 'none'}} id={`err_song_tag_${key}`}>Please enter song name</div>
          <div className="fv-help-block" style={{ display: 'none'}} id={`err_song_tag_length_${key}`}>Song name should not be more than 80 characters.</div>
        </Col>
        <Col xs="2">
          <div className="fv-help-block" style={{ display: 'none'}} id={`err_song_genre_${key}`}>Please enter song genre</div>
          <div className="fv-help-block" style={{ display: 'none'}} id={`err_song_genre_length_${key}`}>Song genre should not be more than 50 characters.</div>
        </Col>
        <Col xs="2">
          <div className="fv-help-block" style={{ display: 'none'}} id={"err_song_preset_" + key}>Preset should be selected.</div>
        </Col>
        <Col xs="2">
        </Col>
        <Col xs="2">
        </Col>
        <Col xs="2">
          <div className="fv-help-block" style={{ display: 'none'}}  id={`err_song_file_${key}`}>Please select song file</div>
          <div className="fv-help-block" style={{ display: 'none'}}  id={`err_song_file_valid_${key}`}>Please upload a valid audio file</div>
        </Col>
      </div>
    </div>
  )
}


const RowLabel = () => {

  const [intensityTooltipOpen, setIntensityTooltipOpen] = useState(false);
  const [loudnessTooltipOpen, setLoudnessTooltipOpen] = useState(false);
  const [audioFileTooltipOpen, setAudioFileTooltipOpen] = useState(false);
  
  const toggleIntensityTooltip = () => setIntensityTooltipOpen(!intensityTooltipOpen);
  const toggleLoudnessTooltip = () => setLoudnessTooltipOpen(!loudnessTooltipOpen);
  const toggleAudioFileTooltip = () => setAudioFileTooltipOpen(!audioFileTooltipOpen);

  return (
    <Row className="artistWrap labelRow">
      <Col xs="2">
        Name
      </Col>
      <Col xs="2">
        Genre
      </Col>
      <Col xs="2">
        Preset
      </Col>
      <Col xs="2">
        Intensity
        <i className="ml-1 tooltip-icon mdi mdi-18px mdi-help-circle" id="intensityTooltipIcon"></i>
        <Tooltip placement="top" isOpen={intensityTooltipOpen} target="intensityTooltipIcon" toggle={toggleIntensityTooltip}>
          The ​amount of dynamics, EQ, and processing applied to your song in relation to the overall track and preset selected. Maximum utilization will occur at 100 %. We recommend experimenting with this setting to find the sweet spot which fits you the best.
        </Tooltip>
      </Col>
      <Col xs="2">
        Loudness
        <i className="ml-1 tooltip-icon mdi mdi-18px mdi-help-circle" id="loudnessTooltipIcon"></i>
        <Tooltip placement="top" isOpen={loudnessTooltipOpen} target="loudnessTooltipIcon" toggle={toggleLoudnessTooltip}>
          The integrated loudness target level. Measured in loudness units relative to full scale (LUFS).​ We recommend experimenting with this setting to find the sweet spot which fits you the best.​ Depending on the style and genre of your song, the best results should appear at -15 up to -9 db
        </Tooltip>
      </Col>
      <Col xs="2">
        Audio File
        <i className="ml-1 tooltip-icon mdi mdi-18px mdi-help-circle" id="audioFileTooltipIcon"></i>
        <Tooltip placement="top" isOpen={audioFileTooltipOpen} target="audioFileTooltipIcon" toggle={toggleAudioFileTooltip}>
          Supported audio formats are : AAC, AIFF, FLAC, MP3, OPUS, VORBIS and WAV.  We strongly recommend using lossless file types such as AIFF, FLAC or WAV. Our mastering tool will always return the same file type as the original file. Bear in mind that you need 16 bit, 44.1 khz WAV file for the distribution.
        </Tooltip>
      </Col>
    </Row>
  )
}


const SongRow = ({ values, disabled = false, dataView = null, blockedValeues = null }) => {
  const { listOfSongs, manageSongData, manageSongDataFile, listOfSongsSET } = values;
  return (
    <>
      <FormGroup style={{ paddingBottom: 30 }}>
      <Label><b>Songs</b></Label>
        <Row>
          <RowLabel />
          {
            listOfSongs.map((song, index) => {
              const itemVal = { index, song, manageSongData, manageSongDataFile, listOfSongs, listOfSongsSET, blockedValeues }
              return <RowSelect values={itemVal} key={song.key} />
            })
          }
        </Row>
      </FormGroup>
    </>
  );
};

export default SongRow;
