import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Card,
  Row,
  CardBody,
  Col,
  FormGroup,
  Label,
  Button,
  Alert,
  Input,
  Tooltip
} from "reactstrap";
import { useFetch } from "../../utils/fetchHook";
import { getCookie } from "../../jwt/_helpers/cookie";
import TableHelper from "../../components/tableHelper";
import { Redirect } from "react-router-dom";
import Select from "react-select";

const API_URL = process.env.REACT_APP_API_URL_BASE;
const X_API_KEY = process.env.REACT_APP_X_API_KEY;

const SongParametersUpdate = ({ match, name }) => {
  const token = getCookie("token");
  const currentID = match.url.split("/")[2];
  const [songData, error, loading] = useFetch(
    "GET",
    `audio-mastering-songs/${currentID}/`,
    token
  );
  const [success, setSuccess] = useState(false);
  const [errorPut, setErrorPut] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [masteringID, setMasteringID] = useState(null);

  const [song_intensity, setSong_intensity] = useState(null);
  const [song_loudness, setSong_loudness] = useState(null);
  const [song_preset, setSong_preset] = useState(null);
  const [song_mastered, setSong_mastered] = useState(false);

  const [intensityTooltipOpen, setIntensityTooltipOpen] = useState(false);
  const [loudnessTooltipOpen, setLoudnessTooltipOpen] = useState(false);
  
  const toggleIntensityTooltip = () => setIntensityTooltipOpen(!intensityTooltipOpen);
  const toggleLoudnessTooltip = () => setLoudnessTooltipOpen(!loudnessTooltipOpen);

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

  useEffect(() => {
    if (songData.audio_mastering) {
      setMasteringID(songData.audio_mastering);
    }
    if (songData.intensity) {
      setSong_intensity(songData.intensity);
    }
    if (songData.target_level) {
      setSong_loudness(songData.target_level);
    }
    if (songData.preset) {
      const matchingPreset = presetOps.find(preset => preset.value === songData.preset);
      if (matchingPreset) {
          setSong_preset(matchingPreset);
      }
    }
    if (songData.audio_mastering) {
      setSong_mastered(songData.mastering_expedited);
    }
  }, [songData]);

  const options = {
    method: "PATCH",
    mode: 'cors',
    headers: {
      Authorization: `Bearer ${token}`,
      "x-api-key": X_API_KEY,
      "Content-Type": "application/json"
    }
  };

  const updateParameters = () => {

    const updatedData = {
      ...(song_intensity && (songData.intensity !== song_intensity) && {"intensity": song_intensity}),
      ...(song_preset && (songData.preset !== song_preset.value) && {"preset": song_preset.value}),
      ...(song_loudness && (songData.target_level !== song_loudness) && {"target_level": song_loudness}),
    };

    if (Object.keys(updatedData).length === 0) {
      return false;
    }

    axios
      .patch(
        `${API_URL}audio-mastering-songs/${currentID}/`,
        updatedData,
        options
      )
      .then(res => {
        setSuccess(true);
        setTimeout(() => setRedirect(true), 1000);
      })
      .catch(err => {
        setErrorPut(true);
      });
  }

  return (
    <div>
      {loading ? (
        <TableHelper loading />
      ) : error ? (
        <TableHelper error />
      ) : (
        <>
        {
          song_mastered ? (
            <Alert color="danger">
              Song parameters can not be updated once the song has been mastered!
            </Alert>
          ) : (
            <Card>
            <CardBody>
              <Row>
                <Col sm={4}>
                      <h3>Edit Song Parameters</h3>
    
                      <FormGroup row>
                        <Label for="intensity" sm={4}>
                          Intensity
                          <i className="ml-1 tooltip-icon mdi mdi-18px mdi-help-circle" id="intensityTooltipIcon"></i>
                          <Tooltip placement="top" isOpen={intensityTooltipOpen} target="intensityTooltipIcon" toggle={toggleIntensityTooltip}>
                            The ​amount of dynamics, EQ, and processing applied to your song in relation to the overall track and preset selected. Maximum utilization will occur at 100 %. We recommend experimenting with this setting to find the sweet spot which fits you the best.
                          </Tooltip>
                        </Label>
                        <Col>
                          <Input
                            name="intensity"
                            type="range"
                            defaultValue={songData.intensity}
                            min="1"
                            max="100"
                            step="1"
                            className="mt-2"
                            onChange={e => {
                              setSong_intensity(e.target.value);
                            }}
                          />
                          <output id="intensity-val"><b>{song_intensity} %</b></output>
                        </Col>
                      </FormGroup>
    
                      <FormGroup row>
                        <Label for="loudness" sm={4}>
                          Loudness
                          <i className="ml-1 tooltip-icon mdi mdi-18px mdi-help-circle" id="loudnessTooltipIcon"></i>
                          <Tooltip placement="top" isOpen={loudnessTooltipOpen} target="loudnessTooltipIcon" toggle={toggleLoudnessTooltip}>
                            The integrated loudness target level. Measured in loudness units relative to full scale (LUFS).​ We recommend experimenting with this setting to find the sweet spot which fits you the best.​ Depending on the style and genre of your song, the best results should appear at -15 up to -9 db
                          </Tooltip>
                        </Label>
                        <Col>
                          <Input
                            name="loudness"
                            type="range"
                            defaultValue={songData.target_level}
                            min="-22"
                            max="-6"
                            step="1"
                            className="mt-2"
                            onChange={e => {
                              setSong_loudness(e.target.value);
                            }}
                          />
                          <output id="loudness-val"><b>{song_loudness} dB</b></output>
                        </Col>
                      </FormGroup>
                      
                      <FormGroup row>
                        <Label for="preset" sm={4}>
                          Preset
                        </Label>
                        <Col>
                          <Select
                            name="preset"
                            closeMenuOnSelect={true}
                            options={presetOps}
                            value={song_preset}
                            onChange={(e) => {
                              setSong_preset(e);
                            }}
                            placeholder="Select Preset"
                            className="artistType"
                          />
                        </Col>
                      </FormGroup>
    
                      <FormGroup row>
                        <Col>
                          <Button color="success" onClick={updateParameters}>
                            Submit
                          </Button>
                        </Col>
                      </FormGroup>
    
                      {success && (
                        <Alert color="success">
                          Song parameters have been updated!
                        </Alert>
                      )}
                      {redirect ? <Redirect to={`/mastering/${masteringID}/view`} /> : null}
                      {errorPut && (
                        <Alert color="danger">
                          Something went wrong! Please refresh page and try again!
                        </Alert>
                      )}
                </Col>
              </Row>
              </CardBody>
            </Card>
          )
        }
        </>
      )}
    </div>
  );
};

export default SongParametersUpdate;
