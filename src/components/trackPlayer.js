import React, { useRef, useEffect, useReducer, useState } from "react"
import { IoMdHeart } from "react-icons/io"
import AudioVisualizer from "../views/musicLink/AudioVisualizer"
import Play from "../assets/images/landingPage/svg/playV2.svg"
import CntrlPlay from "../assets/images/landingPage/cntrl_play.svg"
import ControlsNext from "../assets/images/landingPage/controls_next.svg"
import ControlsPrev from "../assets/images/landingPage/controls_prev.svg"
import Pause from "../assets/images/landingPage/pause.svg"
import PromotionDownload from "../components/promotionDownload"
import PromoTimeBar from "./promoTimeBar"
import "./trackPlayer.scss"

let audioCtx, audioAnalizer, audioSource, audioDestination
const initState = {
	currentMusic: null, //Index of current song
	isPlayed: false, //Is player inintialized
	isPaused: false, //Is current song paused
	audioRef: null, //Audio ref
}
const reducer = (prevState, action) => {
	switch (action.type) {
		// Changes state data
		case "setData":
			return { ...prevState, ...action.data }
		// Initializes player:
		case "initialize":
			//SRC of first item of musics
			action.data.audioRef.load()
			action.data.audioRef.play() //Plays ref recived through action
			return { ...prevState, ...action.data } //Stores ref in state
		// Change songs:
		case "changeSong":
			const nxtSong = prevState.currentMusic + action.direction //Prev or next
			prevState.audioRef.load()
			prevState.audioRef.play()
			return { ...prevState, currentMusic: nxtSong, isPaused: false } //Update state
		//Play pause
		case "playPause":
			if (prevState.isPaused) {
				//If paused
				prevState.audioRef.play()
			} else {
				//If playing
				prevState.audioRef.pause()
			}
			return { ...prevState, isPaused: !prevState.isPaused }
		//
		case "itemSelect":
			prevState.audioRef.load()
			prevState.audioRef.play()
			return { ...prevState, isPaused: false, currentMusic: action.i }
	}
}
const TrackPlayer = ({
	favoriteId,
	src, //Downloaded link
	name, //Song Name
	mix_name, //Mix name
	handlePlayClick,
	feedbackArray,
	id,
	handleFavoriteChange,
	downloadLinks,
	main_artists,
	featuring_artists,
	disabled,
	downloadVals,
	feedback_id = false,
	tracks_feedback,
	tracks,
	img,
	downloadDisabled
}) => {
	const [state, dispatch] = useReducer(reducer, initState)
	const audioRef = useRef(null)
	const timeRef = useRef(null)
	const [currentTime, setCurrentTime] = useState(0)

	const onPlayClick = (event) => {
		dispatch({
			type: "initialize",
			data: { currentMusic: 0, isPlayed: true, audioRef: audioRef.current },
		})
		//
		audioCtx = new (window.AudioContext || window.webkitAudioContext)()
		audioAnalizer = audioCtx.createAnalyser()
		audioSource = audioCtx.createMediaElementSource(audioRef.current)
		audioDestination = audioCtx.destination
		// Connecting the nodes
		audioSource.connect(audioAnalizer)
		audioAnalizer.connect(audioDestination)
		event.target.disabled = true
		// Creates new audio context + analyzer
	}

	const onCntrlNext = () => {
		if (state.currentMusic < tracks.length - 1) {
			dispatch({ type: "changeSong", direction: 1 })
		}
	}

	const onCntrlPrev = () => {
		if (state.currentMusic > 0) {
			dispatch({ type: "changeSong", direction: -1 })
		}
	}

	const onPlayPauseClick = () => {
		dispatch({ type: "playPause" })
	}

	const onEndHandler = () => {
		if (state.currentMusic === tracks.length - 1) {
			dispatch({ type: "setData", data: { isPaused: true, currentMusic: 0 } })
		} else {
			onCntrlNext()
		}
	}
	useEffect(() => {
		if (!state.isPaused && state.currentMusic >= 0) {
			tracks[state.currentMusic]?.id && handlePlayClick(tracks[state.currentMusic].id)
		}
	}, [state.isPaused, state.currentMusic])
	return (
		<>
			<div className="music-landing-page">
				<div>
					<figure className="playermain">
						<div className="overlay" id="canvas-parent" />
						<img
							src={img}
							className="img-fluid audiobg"
							alt=""
							style={{
								...(state.isPlayed && {
									borderBottomLeftRadius: "0px",
									borderBottomRightRadius: "0px",
								}),
							}}
						/>
						{state.isPlayed && (
							<PromoTimeBar
								audioRef={audioRef}
								currentTime={currentTime}
								state={state}
								dispatch={dispatch}
							></PromoTimeBar>
						)}
						{state.isPlayed === false && (
							<div className="buttons">
								<img src={Play} className="playicon" alt="" onClick={onPlayClick} />
							</div>
						)}

						{state.isPlayed && (
							<div className="buttons">
								<img src={ControlsPrev} className="cleft" alt="" onClick={onCntrlPrev} />
								{state.isPaused && (
									<img src={CntrlPlay} className="playicon" alt="" onClick={onPlayPauseClick} />
								)}
								{state.isPaused === false && (
									<img src={Pause} className="playicon" alt="" onClick={onPlayPauseClick} />
								)}
								<img src={ControlsNext} className="cright" alt="" onClick={onCntrlNext} />
							</div>
						)}

						{/* <div className="description" data-test="music-player-sample-info">
										<span className="author-name">Smalltown Collective</span>
										<span className="album-name">The Difference</span>
									</div> */}

						<div className="time-container" ref={timeRef} />

						<div
							id="audio-canvas"
							style={{
								position: "absolute",
								bottom: "-6px",
								width: "100%",
							}}
						>
							<audio
								ref={audioRef}
								crossOrigin=""
								onEnded={onEndHandler}
								onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
							>
								<source type="audio/mp3" src={tracks[state.currentMusic]?.mp3_resource}></source>
							</audio>
						</div>
						{state.isPlayed && !state.isPaused && (
							<AudioVisualizer
								audioAnalizer={audioAnalizer}
								canvasParenyId="canvas-parent"
							></AudioVisualizer>
						)}
					</figure>
					{state.isPlayed && (
						<div className="tablescroll">
							<table className="table tracktable">
								<thead>
									<tr>
										<th>Track</th>
										<th>Artist</th>
										<th className="text-center">{!downloadLinks ? "Favourite" : "Download"}</th>
									</tr>
								</thead>
								<tbody>
									{tracks.map((m, i) => {
										let feedback_id
										if (tracks_feedback.length > 0) {
											const a = tracks_feedback.filter((i) => i.track === m.id)[0]
											feedback_id = a?.id || false
										} else {
											const init = feedbackArray.filter((i) => i.track === m.id)
											feedback_id = init.length > 0 ? init[0].id : false
										}
										return (
											<tr
												i={i}
												key={i}
												className={`music-list-item ${state.currentMusic == i ? "music-list-item-active" : ""}`}
											>
												<td
													onClick={() => {
														dispatch({ type: "itemSelect", i: i })
													}}
												>
													{m.name} {m?.mix_name && `(${m?.mix_name})`}
												</td>
												<td
													onClick={() => {
														dispatch({ type: "itemSelect", i: i })
													}}
												>
													{m.main_artists}
												</td>
												<td style={{ width: "25%", textAlign: "center" }}>
													<form action="">
														<div>
															{!disabled && (
																<div onClick={() => handleFavoriteChange(m.id)}>
																	{favoriteId === m.id ? (
																		<>
																			<IoMdHeart
																				color={"red"}
																				size={"20px"}
																				style={{ transform: "scale(140%)", transition: "transform 100ms linear" }}
																			/>
																		</>
																	) : (
																		<>
																			<IoMdHeart
																				color={"#FFF"}
																				size={"20px"}
																				style={{ transition: "transform 100ms linear" }}
																			/>
																		</>
																	)}
																</div>
															)}
															{downloadLinks && (
																<PromotionDownload
																	{...{
																		downloadLink: m.wav_download_url,
																		id: m.id,
																		downloadVals: downloadVals,
																		feedback_id: feedback_id,
																		mix: m.mix_name,
																		artist: m.main_artists,
																		name: m.name,
																		downloadDisabled: downloadDisabled
																	}}
																/>
															)}
														</div>
													</form>
												</td>
											</tr>
										)
									})}
								</tbody>
							</table>
						</div>
					)}
				</div>
			</div>
		</>
	)
}

export default TrackPlayer
