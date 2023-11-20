import React, {useEffect, useRef, useState} from "react";
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';

import WaveSurfer from "wavesurfer.js";

import playIcon from "../../assets/images/Player/play.svg";
import pauseIcon from "../../assets/images/Player/pause.svg";


const formWaveSurferOptions = ref => ({
  container: ref,
  waveColor: "#eee",
  progressColor: "OrangeRed",
  cursorColor: "OrangeRed",
  barWidth: 3,
  barRadius: 3,
  responsive: true,
  height: 100,
  // If true, normalize by the maximum peak instead of 1.0.
  normalize: true,
  // Use the PeakCache to improve rendering speed of large waveforms.
  partialRender: true
});

export default function Waveform({url}) {
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const [playing, setPlay] = useState(false);
  const [volume, setVolume] = useState(0.5);

  // create new WaveSurfer instance
  // On component mount and when url changes
  useEffect(() => {
    setPlay(false);

    const options = formWaveSurferOptions(waveformRef.current);
    wavesurfer.current = WaveSurfer.create(options);

    wavesurfer.current.load(url);

    wavesurfer.current.on("ready", function() {
      // https://wavesurfer-js.org/docs/methods.html
      // wavesurfer.current.play();
      // setPlay(true);

      // make sure object stillavailable when file loaded
      if (wavesurfer.current) {
        wavesurfer.current.setVolume(volume);
        setVolume(volume);
      }
    });

    // Removes events, elements and disconnects Web Audio nodes.
    // when component unmount
    return () => wavesurfer.current.destroy();
  }, [url]);

    const handlePlayPause = () => {
      setPlay(!playing);
      wavesurfer.current.playPause();
    };

    const onVolumeChange = value => {
      if (value) {
        setVolume(value);
        wavesurfer.current.setVolume(value || 1);
      }
    };

  return (
    <div>
      <div id="waveform" ref={waveformRef}/>
      <div className="controls">
        <button onClick={handlePlayPause}>
          <img src={playing ? pauseIcon : playIcon } alt=""/>
        </button>
        <Slider className="range" value={volume} min={0.01} step={0.025} max={1} defaultValue={3} onChange={onVolumeChange}/>
      </div>
    </div>
  );
}
