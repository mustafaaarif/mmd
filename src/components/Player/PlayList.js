import React from "react";

const PlayList = ({ tracks, selectedTrack, setSelectedTrack }) => {
  return (
    <div className="playlist">
      {tracks.map((track, index) => (
        <div
          key={index}
          className={
            track?.demo_song_name === selectedTrack?.demo_song_name
              ? "playlist-item selected"
              : "playlist-item"
          }
          onClick={() => setSelectedTrack(track)}
        >
          {track?.demo_song_name}
        </div>
      ))}
    </div>
  );
};

export default PlayList;
