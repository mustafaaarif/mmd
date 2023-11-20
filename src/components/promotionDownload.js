/* eslint-disable jsx-a11y/anchor-has-content */
import React, { useState } from "react";
import axios from "axios";
import { UncontrolledTooltip } from "reactstrap";
import { FiDownload } from "react-icons/fi";

const API_URL = process.env.REACT_APP_API_URL_BASE;
const X_API_KEY = process.env.REACT_APP_X_API_KEY;

const PromotionDownload = ({ downloadLink, id, downloadVals, feedback_id, name, artist, mix, downloadDisabled}) => {
	const trimmedLocation = window.location.origin
	const trimmedLink = downloadLink.slice(41, downloadLink.length)
	const [color, setColor] = useState("white")
	const fullName = `${artist}-${name}`
	const mixName = mix && `(${mix})`
	const onDownload = () => {
		if (!feedback_id) {
			return false
		}
		const opt = {
			method: "PATCH",
			mode: "cors",
			headers: {
				Authorization: `Bearer ${downloadVals.recipientToken}`,
				"x-api-key": X_API_KEY,
				"Content-Type": "application/json",
			},
		}

		axios.patch(
			`${API_URL}promotions/${downloadVals.promotionID}/change-track-feedback/${downloadVals.recipientToken}/${feedback_id}/`,
			{
				downloaded_wav: true,
			},
			opt
		)
	}

	return (
		<>
		{
		!downloadDisabled?
			<a
				onClick={() => onDownload()}
				href={downloadLink}
				download={fullName + mixName + ".wav"}
				className="btn"
				target="blank"
				onMouseEnter={() => {
					setColor(undefined)
				}}
				onMouseLeave={() => {
					setColor("white")
				}}
			>
				<FiDownload color={color} size="1.5rem"></FiDownload>
			</a>:
			<div className="btn">
				<FiDownload id={`promo-${id}`} color={"#808080"} size="1.5rem"></FiDownload>
				<UncontrolledTooltip placement="top" trigger="hover" target={`promo-${id}`} style={{backgroundColor: "#000a60"}}>
					Download is disabled
				</UncontrolledTooltip>
			</div>
		}
		</>
	)
}

export default PromotionDownload;
