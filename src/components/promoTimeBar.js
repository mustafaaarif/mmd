import React, { useState, useEffect, useRef } from "react"
import styles from "./promoTimeBar.module.css"

const PromoTimeBar = ({ audioRef, currentTime, state, dispatch }) => {
	const [isActive, setIsActive] = useState(false)
	const [barWidth, setBarWidth] = useState(0)
	const contRef = useRef(null)
	const duration = audioRef.current.duration

	const changeTimeOnClick = (e) => {
		if (isActive) {
			const [x] = coords(e)
			const newTime = Math.floor(audioRef.current.duration * x)
			setBarWidth(x * 100)
			if (newTime) audioRef.current.currentTime = newTime
			if (state.isPaused) {
				dispatch({ type: "playPause" })
			}
		}
	}
	const formatTime = (seconds) => {
		if (seconds) {
			return [Math.floor(seconds / 60), Math.floor(seconds % 60)]
				.map((x) => x.toString())
				.map((x) => (x.length === 1 ? `0${x}` : x))
				.join(":")
		}
	}

	const coords = (e) => {
		const rect = e.target.getBoundingClientRect()
		const x = e.clientX - rect.left
		const y = e.clientY - rect.top
		const { clientWidth, clientHeight } = contRef.current
		return [x / clientWidth, y / clientHeight]
	}

	useEffect(() => {
		const mobile = () => {
			if (window.innerWidth < 750) {
				setIsActive(true)
			} else {
				setIsActive(false)
			}
		}
		mobile()
		window.addEventListener("resize", mobile)
		return () => {
			window.removeEventListener("resize", mobile)
		}
	}, [])

	useEffect(() => {
		setBarWidth((currentTime / duration) * 100)
	}, [currentTime])

	return (
		<div
			className={styles.container}
			onMouseOver={() => {
				setIsActive(true)
			}}
			onMouseLeave={() => {
				setIsActive(false)
			}}
			onClick={changeTimeOnClick}
			ref={contRef}
		>
			<div className={`${styles.barBackground} ${isActive && styles.activeBar}`}>
				<div
					className={`${styles.bar} ${isActive && styles.activeBar}`}
					style={{ width: `${barWidth}%` }}
				>
					<span className={styles.formatTime}>
						{isActive && formatTime(duration * (barWidth / 100))}
					</span>
				</div>
			</div>
		</div>
	)
}

export default PromoTimeBar
