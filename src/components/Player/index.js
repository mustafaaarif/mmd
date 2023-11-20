import React, { useState } from "react";

import Waveform from "./Waveform";
import PlayList from "./PlayList";
import "../../assets/scss/all/custom/_player.scss";

// const url = "https://www.mfiles.co.uk/mp3-downloads/gs-cd-track2.mp3";

// const tracks = [
//   {
//     id: 0,
//     title: "Brahms: St Anthony Chorale - Theme, Two Pianos Op.56b",
//     url:
//       "https://www.mfiles.co.uk/mp3-downloads/brahms-st-anthony-chorale-theme-two-pianos.mp3"
//   },
//   {
//     id: 1,
//     title: "Franz Schubert's Ständchen - Voice (Clarinet) & Piano",
//     url:
//       "https://www.mfiles.co.uk/mp3-downloads/franz-schubert-standchen-serenade.mp3"
//   }
// ];

export default function Player({tracks = []}) {
  const [selectedTrack, setSelectedTrack] = useState(tracks[0]);

  // console.log('tracks', tracks)
  // console.log('selectedTrack', selectedTrack)

  return (
    <div style={{margin: '30px 0'}} className="Player_App">
      {selectedTrack && (
        <Waveform url={selectedTrack.url} />
      )}

      <PlayList
        tracks={tracks}
        selectedTrack={selectedTrack}
        setSelectedTrack={setSelectedTrack}
      />
    </div>
  );
}
