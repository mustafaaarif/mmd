import React, { useEffect, useRef, useReducer } from "react"
import Axios from "axios"
import Am from "../../assets/images/landingPage/svg/am.svg"
import Beatport from "../../assets/images/landingPage/svg/beatport_green.svg"
import Juno from "../../assets/images/landingPage/svg/juno.svg"
import Play from "../../assets/images/landingPage/svg/playV2.svg"
import CntrlPlay from "../../assets/images/landingPage/cntrl_play.svg"
import Pause from "../../assets/images/landingPage/pause.svg"
import Spotify from "../../assets/images/landingPage/svg/spotify.svg"
import Tidal from "../../assets/images/landingPage/svg/tidal.svg"
import Triangle from "../../assets/images/landingPage/svg/triangle.svg"
import Yt from "../../assets/images/landingPage/svg/yt.svg"
import ControlsNext from "../../assets/images/landingPage/controls_next.svg"
import ControlsPrev from "../../assets/images/landingPage/controls_prev.svg"
import ScSvg from "../../assets/images/landingPage/svg/Soundcloud.svg"
import DeezerSvg from "../../assets/images/landingPage/svg/deezer.svg"
import TraxsourceSvg from "../../assets/images/landingPage/svg/Traxsource.svg"
import AmazonMusicSvg from "../../assets/images/landingPage/svg/AmazonMusic.svg"
import ReactGA from "react-ga4"
import AudioVisualizer from "./AudioVisualizer"
import "./landingPage.scss"

const API_URL = process.env.REACT_APP_API_URL_BASE
const GA_TRACKING_ID = process.env.REACT_APP_GA_TRACKING_ID

var formatTime = function (time) {
	return [
		Math.floor((time % 3600) / 60), // minutes
		("00" + Math.floor(time % 60)).slice(-2), // seconds
	].join(":")
}

function fetchDuration(path) {
	return new Promise((resolve) => {
		const audio = new Audio()
		audio.src = path
		audio.addEventListener("loadedmetadata", () => {
			// To keep a promise maintainable, only do 1
			// asynchronous activity for each promise you make
			resolve(formatTime(audio.duration))
		})
	})
}

const PLAY_SVG = (
	<>
		<svg
			width='10'
			height='10'
			viewBox='0 0 10 10'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
		>
			<path
				d='M9.09594 4.3301L1.93665 0.136432C1.32607 -0.221821 0.5 0.168043 0.5 0.810791V9.18759C0.5 9.84088 1.32607 10.2202 1.93665 9.86195L9.09594 5.66828C9.63469 5.36271 9.63469 4.64621 9.09594 4.3301Z'
				fill='#3E5569'
			/>
		</svg>{" "}
		Play
	</>
)

const DOWNLOAD_SVG = (
	<>
		<svg
			width='10'
			height='11'
			viewBox='0 0 10 11'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
		>
			<path
				fill-rule='evenodd'
				clip-rule='evenodd'
				d='M4.79262 8.71945L1.26321 5.41945C1.07793 5.24621 1.20915 4.95 1.47118 4.95H3.53V0.275C3.53 0.123122 3.66169 0 3.82412 0H6.17706C6.3395 0 6.47118 0.123122 6.47118 0.275V4.95H8.53C8.79204 4.95 8.92326 5.24621 8.73797 5.41945L5.20856 8.71945C5.0937 8.82685 4.90748 8.82685 4.79262 8.71945ZM9.7115 9.9H0.288499C0.129167 9.9 0 10.0177 0 10.1776V10.7224C0 10.8757 0.12644 11 0.288499 11H9.7115C9.87083 11 10 10.8823 10 10.7224V10.1776C10 10.0243 9.87356 9.9 9.7115 9.9Z'
				fill='#3E5569'
			/>
		</svg>{" "}
		Download
	</>
)

// STATE OBJECT
const initState = {
	currentMusic: null, //Index of current song
	musics: [], //Arr obj with: url, name...
	isPlayed: false, //Is player inintialized
	musicLink: "", //Arr obj for links
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
// G-VARIABLES FOR AUDIO CONTEXT AND ANALIZER
let audioCtx, audioAnalizer, audioSource, audioDestination
//
//
function LandingPage() {
	const [state, dispatch] = useReducer(reducer, initState)
	const audioRef = useRef(null)
	const timeRef = useRef(null)

	// Google Statistcs
	useEffect(() => {
		ReactGA.initialize([
			{
				trackingId: GA_TRACKING_ID,
				testMode: true,
			},
		])
	}, [])
	// Initialize state on load: musics, musicLinkData.
	useEffect(() => {
		getMusicLink()
	}, [])
	// Updates the displayed time
	useEffect(() => {
		audioRef.current.ontimeupdate = (e) => {
			timeRef.current.innerText = formatTime(e.target.currentTime)
			audioRef.current.onloadedmetadata = (e) => {}
		}
	})
	const getMusicLink = async () => {
		const [, , urlpart1, urlpart2] = window.location.pathname.split("/");
		const domain = window.location.origin;

    try {
      
      const result = await Axios.get(
        `${API_URL}musiclink-landingpage/?url_part1=${urlpart1}&url_part2=${urlpart2}&domain=${domain}`
      );

      if (result.status === 200) {
       		// console.log(result);
          const musicLinkData = result.data;
          getDurations(musicLinkData.preview_files);
          dispatch({ type: "setData", data: { musicLink: musicLinkData } });
          // setMusicLink(musicLinkData)
          ReactGA.send({ hitType: "pageview", page: window.location.href });
      }

      else
      {
        window.location.assign('/l/notFound');        
      }
    } catch (error) {
      window.location.assign('/l/notFound');
    } 
	}
	//
	const getDurations = async (previewFiles) => {
		const res = await Promise.all(
			previewFiles.map(({ url }) => fetchDuration(url))
		)
		dispatch({
			type: "setData",
			data: {
				musics: (() => previewFiles.map((m, i) => ({ ...m, length: res[i] })))(),
			},
		})
	}
	//
	const onPlayClick = (event) => {
		if (state.musics.length > 0) {
			dispatch({
				type: "initialize",
				data: { currentMusic: 0, isPlayed: true, audioRef: audioRef.current },
			})
			let track_name = state.musics[0].track_name
			let music_link = state.musics[0].musiclink_id

			ReactGA.event("play_track", {
				category: "Track Played",
				action: "User clicked track play button",
				label: "Landing Page",
				track_name: track_name,
				music_link: music_link,
			})
		}
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
	//
	const onCntrlNext = () => {
		if (state.currentMusic < state.musics.length - 1) {
			dispatch({ type: "changeSong", direction: 1 })
		}
	}
	const onCntrlPrev = () => {
		if (state.currentMusic > 0) {
			dispatch({ type: "changeSong", direction: -1 })
		}
	}
	//
	const onPlayPauseClick = () => {
		if (state.isPaused) {
			let track_name = state.musics[state.currentMusic].track_name
			let music_link = state.musics[state.currentMusic].musiclink_id

			ReactGA.event("play_track", {
				category: "Track Played",
				action: "User clicked track play button",
				label: "Landing Page",
				track_name: track_name,
				music_link: music_link,
			})
		}
		dispatch({ type: "playPause" })
	}
	//
	const onButtonLink = (link, store) => () => {
		ReactGA.event("store_visit", {
			category: "Store Visit",
			action: "User clicked store play button",
			label: "Landing Page",
			store_name: store,
			link_url: link,
			music_link: state.musicLink.id,
		})
		window.open(link, "_blank")
	}
	//
	const onEndHandler = () => {
		if (state.currentMusic === state.musics.length - 1) {
			dispatch({ type: "setData", data: { isPaused: true, currentMusic: 0 } })
		} else {
			onCntrlNext()
		}
	}
	//
	return (
		<div className='music-landing-page'>
			<div
				className='back-image'
				style={{
					backgroundImage: `url(${state.musicLink?.image_big})`,
					backgroundRepeat: "no-repeat",
					backgroundSize: "cover",
					backgroundAttachment: "fixed",
				}}
			/>
			<main className='bodymain'>
				<div className='container mb-md-5 p-0'>
					<div className='row no-gutters'>
						<div className='col-md-6 '>
							<figure className='playermain'>
								<div className='overlay' id='canvas-parent' />
								<img
									src={state.musicLink?.image_big}
									className='img-fluid audiobg'
									alt=''
									style={{
										...(state.isPlayed && {
											borderBottomLeftRadius: "0px",
											borderBottomRightRadius: "0px",
										}),
									}}
								/>
								{state.isPlayed === false && (
									<div className='buttons'>
										<img src={Play} className='playicon' alt='' onClick={onPlayClick} />
									</div>
								)}

								{state.isPlayed && (
									<div className='buttons'>
										<img
											src={ControlsPrev}
											className='cleft'
											alt=''
											onClick={onCntrlPrev}
										/>
										{state.isPaused && (
											<img
												src={CntrlPlay}
												className='playicon'
												alt=''
												onClick={onPlayPauseClick}
											/>
										)}
										{state.isPaused === false && (
											<img
												src={Pause}
												className='playicon'
												alt=''
												onClick={onPlayPauseClick}
											/>
										)}
										<img
											src={ControlsNext}
											className='cright'
											alt=''
											onClick={onCntrlNext}
										/>
									</div>
								)}

								{/* <div className="description" data-test="music-player-sample-info">
										<span className="author-name">Smalltown Collective</span>
										<span className="album-name">The Difference</span>
									</div> */}

								<div className='time-container' ref={timeRef} />

								<div
									id='audio-canvas'
									style={{
										position: "absolute",
										bottom: "-6px",
										width: "100%",
									}}
								>
									<audio ref={audioRef} crossOrigin='' onEnded={onEndHandler}>
										<source
											crossOrigin=''
											type='audio/mp3'
											src={state.musics[state.currentMusic]?.url}
										></source>
									</audio>
								</div>
								{state.isPlayed && !state.isPaused ? (
									<AudioVisualizer
										audioAnalizer={audioAnalizer}
										canvasParenyId='canvas-parent'
									></AudioVisualizer>
								) : null}
							</figure>
							{state.isPlayed && (
								<div className='tablescroll'>
									<table className='table tracktable'>
										<thead>
											<tr>
												<th>Track</th>
												<th>Artist</th>
												<th>Time</th>
											</tr>
										</thead>
										<tbody>
											{state.musics.map((m, i) => {
												return (
													<tr
														i={i}
														className={`music-list-item ${
															state.currentMusic == i ? "music-list-item-active" : ""
														}`}
														onClick={() => {
															dispatch({ type: "itemSelect", i: i })
														}}
													>
														<td>{m.artist_name}</td>
														<td>{m.track_name}</td>
														<td>{m?.length}</td>
													</tr>
												)
											})}
										</tbody>
									</table>
								</div>
							)}
						</div>
						<div className='col-md-6'>
							<div className='card logocard'>
								<div className='card-header'>
									<h2>{state.musicLink?.release_name}</h2>
									<p>{state.musicLink?.artist_name}</p>
									<p className='choose-music-text mt-2'>Choose Music Service</p>
									<img src={Triangle} className='triangle' alt='' />
								</div>
								<div className='card-body'>
									<ul className='logolist row row-cols-2 m-0'>
										{state.musicLink?.spotify_url && (
											<li>
												<div className='brandlogo'>
													<img src={Spotify} alt='' />
												</div>
												<button
													className='btn downloadbnt'
													onClick={onButtonLink(state.musicLink?.spotify_url, "spotify")}
												>
													{PLAY_SVG}
												</button>
											</li>
										)}
										{state.musicLink?.deezer_url && (
											<li>
												<div className='brandlogo'>
													<img src={DeezerSvg} alt='' />
												</div>
												<button
													className='btn downloadbnt'
													onClick={onButtonLink(state.musicLink?.deezer_url, "deezer")}
												>
													{PLAY_SVG}
												</button>
											</li>
										)}
										{state.musicLink?.beatport_url && (
											<li>
												<div className='brandlogo'>
													<img src={Beatport} alt='' />
												</div>
												<button
													className='btn downloadbnt'
													onClick={onButtonLink(state.musicLink?.beatport_url, "beatport")}
												>
													{PLAY_SVG}
												</button>
											</li>
										)}
										{state.musicLink?.traxsource_url && (
											<li>
												<div className='brandlogo'>
													<img src={TraxsourceSvg} alt='' />
												</div>
												<button
													className='btn downloadbnt'
													onClick={onButtonLink(
														state.musicLink?.traxsource_url,
														"traxsource"
													)}
												>
													{PLAY_SVG}
												</button>
											</li>
										)}
										{state.musicLink?.applemusic_url && (
											<li>
												<div className='brandlogo'>
													<img src={Am} alt='' />
												</div>
												<button
													className='btn downloadbnt'
													onClick={onButtonLink(
														state.musicLink?.applemusic_url,
														"applemusic"
													)}
												>
													{PLAY_SVG}
												</button>
											</li>
										)}
										{state.musicLink?.soundcloud_url && (
											<li>
												<div className='brandlogo'>
													<img src={ScSvg} alt='' />
												</div>
												<button
													className='btn downloadbnt'
													onClick={onButtonLink(
														state.musicLink?.soundcloud_url,
														"soundcloud"
													)}
												>
													{PLAY_SVG}
												</button>
											</li>
										)}
										{state.musicLink?.youtube_url && (
											<li>
												<div className='brandlogo'>
													<img src={Yt} alt='' />
												</div>
												<button
													className='btn downloadbnt'
													onClick={onButtonLink(state.musicLink?.youtube_url, "youtube")}
												>
													{PLAY_SVG}
												</button>
											</li>
										)}
										{state.musicLink?.tidal_url && (
											<li>
												<div className='brandlogo'>
													<img src={Tidal} alt='' />
												</div>
												<button
													className='btn downloadbnt'
													onClick={onButtonLink(state.musicLink?.tidal_url, "tidal")}
												>
													{PLAY_SVG}
												</button>
											</li>
										)}
										{state.musicLink?.junodownload_url && (
											<li>
												<div className='brandlogo'>
													<img src={Juno} alt='' />
												</div>
												<button
													className='btn downloadbnt'
													onClick={onButtonLink(
														state.musicLink?.junodownload_url,
														"junodownload"
													)}
												>
													{PLAY_SVG}
												</button>
											</li>
										)}
										{state.musicLink?.amazonmusic_url && (
											<li>
												<div className='brandlogo'>
													<img src={AmazonMusicSvg} alt='' height={'100%'} width={110} />
												</div>
												<button
													className='btn downloadbnt'
													onClick={onButtonLink(
														state.musicLink?.amazonmusic_url,
														"amazonmusic"
													)}
												>
													{PLAY_SVG}
												</button>
											</li>
										)}
										{state.musicLink?.other_url && (
											<li>
												<div className='brandlogo'>
													<div className='empty'>Others</div>
												</div>
												<button
													className='btn downloadbnt'
													onClick={onButtonLink(state.musicLink?.other_url, "other")}
												>
													{PLAY_SVG}
												</button>
											</li>
										)}
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
				 <div className='text-center copyright text-white'>
					<div>
						We use essential cookies to provide service. To manage your permissions click the icon in the lower left corner.
					</div>
				</div>
			</main>
		</div>
	)
}

export default LandingPage
