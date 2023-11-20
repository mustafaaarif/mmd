import React, { useEffect, useState } from "react"
import { Container, Button, Card, CardBody, FormText, Alert } from "reactstrap"
import { Formik, Field, Form } from "formik"
import TableHelper from "../../components/tableHelper"
import axios from "axios"
import "./promotions.scss"
import { useLocation } from "react-router-dom"
import TrackPlayer from "../../components/trackPlayer"
import PromotionStars from "../../components/promotionStars"
import { useBasicFetch } from "../../utils/fetchHookNoToken"
import * as Yup from "yup"
import PromotionReleaseStoreUrls from "./promotionReleaseStoreUrls"

const API_URL = process.env.REACT_APP_API_URL_BASE;
const X_API_KEY = process.env.REACT_APP_X_API_KEY;

const Schema = Yup.object().shape({
	Feedback: Yup.string().min(6).required("Feedback is required"),
})
//
const PromotionRate = () => {
	const location = useLocation()
	const promotionID = location.pathname.split("/")[2]
	const recipientToken = location.pathname.split("/")[4]
	const [dataDetails, error4, loadingDetails] = useBasicFetch(
		"GET",
		`promotions/${promotionID}/promo-info/${recipientToken}/`
	)
	//data after load
	//form
	const [success, setSuccess] = useState(false)
	const [successData, setSuccessData] = useState(false)
	const [feedbackArray, setFeedbackArray] = useState([])
	const [releaseDatePassed, setReleaseDatePassed] = useState(true)
	const [storeUrls, setStoreUrls] = useState([])

	const [radioDisabled, setRadioDisabled] = useState(false)
	const [tracksDisabled, setTracksDisabled] = useState(false)

	//download
	const [downloadLinks, setDownloadLinks] = useState(false)

	//stars
	const [userRating, setUserRating] = useState(null)
	const [userRatingError, setUserRatingError] = useState(null)

	const onStarClick = (i) => {
		setUserRatingError(null)
		setUserRating(i)
	}

	//play
	const [ifPlayed, setIfPlayed] = useState([])
	const [blockPostingTrack, setBlockPostingTrack] = useState(false)

	//favorite
	const [favoriteId, setFavoriteId] = useState(null)

	const handlePlayClick = (id) => {
		// Bug in set player
		setIfPlayed([...ifPlayed, id])
	}

	const handleFavoriteChange = (id) => {
		setFavoriteId(id)
	}

	const starProps = {
		onStarClick,
		userRating,
		radioDisabled,
	}

	const trackProps = {
		favoriteId,
		radioDisabled,
		handleFavoriteChange,
		handlePlayClick,
		downloadLinks,
	}
	useEffect(() => {
		if (!loadingDetails && dataDetails.given_release_feedback?.rating) {
			setSuccess(true)
			setRadioDisabled(true)
			setDownloadLinks(true)
			setBlockPostingTrack(true)
			setTracksDisabled(dataDetails.given_release_feedback?.rating ? true : false)

			if (dataDetails.given_release_feedback.length > 0) {
				setFeedbackArray(dataDetails.given_release_feedback)
			}
		}
		if(!loadingDetails && dataDetails.release)
		{
			setReleaseDatePassed(dataDetails.release.release_date_passed);
			setStoreUrls(dataDetails.release.store_urls);
		}
	}, [dataDetails, loadingDetails])

	if (
		dataDetails?.detail === "Not found." ||
		dataDetails?.message === "Cannot access this resource"
	) {
		return (
			<Container fluid={true}>
				<div className="rateWrap">
					<div className="rateInner">
						<div className="logoBackground"></div>
						<Card>
							<CardBody>
								<div className="promoFeedbackWrap">
									<h2 className="rateHeader" style={{ margin: 0 }}>
										Promotion not found
									</h2>
								</div>
							</CardBody>
						</Card>
					</div>
				</div>
			</Container>
		)
	}
	//
	// Popup
	if (dataDetails?.detail === "You do not have permission to perform this action.") {
		return (
			<Container fluid={true}>
				<div className="rateWrap">
					<div className="rateInner">
						<div className="logoBackground"></div>
						<Card>
							<CardBody>
								<div className="promoFeedbackWrap">
									<h2 className="rateHeader" style={{ margin: 0 }}>
										You do not have permission to perform this action.
									</h2>
								</div>
							</CardBody>
						</Card>
					</div>
				</div>
			</Container>
		)
	}
	return (
		<Container fluid={true}>
			<div className="rateWrap">
				<div className="rateInner">
					<div className="logoBackground"></div>
					<Card>
						<CardBody>
							<div className="promoFeedbackWrap">
								{Object.keys(dataDetails).length > 0 ? (
									<>
										<h2 className="rateHeader">{dataDetails.name}</h2>
										<div className="rateItem">
											<div className="coverColumn">
												{/* Abe */}
												<div className="rateText">
													<span>
														<b>Genre: </b>
														{dataDetails?.release?.genre?.name}
													</span>
													<span>
														<b>Sub Genre: </b>
														{dataDetails?.release?.subgenre?.name}
													</span>
													<span>
														<b>Catalog number: </b>
														{dataDetails.release.catalogue_number}
													</span>
													<span>
														<b>Label: </b>
														{dataDetails.release.label.name}
													</span>
													<span>
														<b>Release date: </b>
														{dataDetails.release.official_date}
													</span>
													<span>
														<b>Exclusive date: </b>
														{dataDetails.release.exclusive_date}
													</span>
													<span>
														<b>Description: </b>
														{dataDetails.description}
													</span>
												</div>
											</div>
											<div className="trackColumn">
												<TrackPlayer
													{...trackProps}
													tracks={dataDetails.release.tracks}
													img={dataDetails.release.artwork}
													disabled={tracksDisabled}
													downloadVals={{ promotionID, recipientToken }}
													tracks_feedback={dataDetails.given_tracks_feedback}
													feedbackArray={feedbackArray}
													downloadDisabled={releaseDatePassed}
												/>
											</div>
										</div>

										{
											!releaseDatePassed &&

											<Formik
												initialValues={{
													recipient: "",
													promotion: "",
													rating: "",
													Feedback: "",
													feature_request: "",
													download_all: "",
													favorite: "",
												}}
												validationSchema={Schema}
												onSubmit={({ Feedback, rating, favorite }, { setStatus, setSubmitting }) => {
													setStatus()

													if (userRating === null) {
														setUserRatingError(true)
														return
													}
													const options = {
														method: "post",
														headers: {
															Authorization: `Bearer ${recipientToken}`,
															"x-api-key": X_API_KEY,
															"Content-Type": "application/json",
														},
													}
													const requestData = {
														rating: userRating,
														comment: Feedback,
														favorite: favoriteId,
													}

													axios
														.post(
															`${API_URL}promotions/${promotionID}/release-feedback/${recipientToken}/`,
															requestData,
															options
														)
														.then((res) => {
															if (res.status === 200) {
																setSuccess(true)
																setRadioDisabled(true)
																setDownloadLinks(true)
																setTracksDisabled(true)
																setFavoriteId(null)
																setSuccessData(res.data)

																const unique = [...new Set(ifPlayed)]

																if (!unique.length > 0) {
																	return false
																}

																const opt = {
																	method: "POST",
																	mode: "cors",
																	headers: {
																		Authorization: `Bearer ${recipientToken}`,
																		"x-api-key": X_API_KEY,
																		"Content-Type": "application/json",
																	},
																}

																let requests = unique.map((id) => {
																	return new Promise(async (resolve, reject) => {
																		axios
																			.post(
																				`${API_URL}promotions/${promotionID}/track-feedback/${recipientToken}/`,
																				{
																					track: id,
																					recipient: recipientToken,
																					favorite: favoriteId === id ? true : false,
																					downloaded_mp3: false,
																					downloaded_wav: false,
																					played: true,
																				},
																				opt
																			)
																			.then((res) => {
																				if (res.status === 200 || res.status === 201) {
																					setFeedbackArray((prev) => [...prev, res.data])
																					resolve(res.status)
																				} else {
																					reject(res.status)
																				}
																			})
																			.catch((err, res) => {
																				reject(res.status)
																			})
																	})
																})

																return Promise.all(requests)
																	.then((body) => {
																		return body
																	})
																	.catch((err) => {
																		return false
																	})
															}
														})
														.catch((err, res) => {})
												}}
												render={({ errors, status, touched, values, isSubmitting, setFieldValue }) => {
													return (
														<Form className="mt-3" id="promotionRateForm">
															<div>
																{!success && (
																	<>
																		<PromotionStars {...starProps} />
																		{userRatingError ? <small className="error">Rate is required</small> : null}
																	</>
																)}
																<div className="commentContainer">
																	{!success ? (
																		<>
																			<Field
																				name="Feedback"
																				component="textarea"
																				rows="5"
																				className={
																					"form-control" + (errors.Feedback && touched.Feedback ? " is-invalid" : "")
																				}
																			/>
																			{errors.Feedback && touched.Feedback ? (
																				<small className="error">{errors.Feedback}</small>
																			) : null}

																			<FormText>Please Leave your feedback to unlock the download options</FormText>
																		</>
																	) : (
																		<>
																			<div className="helperWrap">
																				<p className="ratingPara">Thanks for your contribution!</p>
																			</div>
																			{successData ? (
																				<div>
																					<p style={{ marginBottom: 3 }}>Your rating: {successData.rating}/10</p>
																					<p style={{ marginBottom: 3 }}>Your comment: {successData.comment}</p>
																				</div>
																			) : (
																				<div>
																					<p style={{ marginBottom: 3 }}>
																						Your rating: {dataDetails.given_release_feedback.rating}
																						/10
																					</p>
																					<p style={{ marginBottom: 3 }}>
																						Your comment: {dataDetails.given_release_feedback.comment}
																					</p>
																				</div>
																			)}
																		</>
																	)}
																</div>
															</div>

															{!success && (
																<div>
																	<Button type="submit" color="success">
																		Submit
																	</Button>
																</div>
															)}
														</Form>
													)
												}}
											/>
										}

										{
											releaseDatePassed &&
											<div className="pt-4 rateText">
												<Alert color="info">
													<b>This release has already been released on stores, therefore you can not rate, comment or download tracks.</b><br/>
												</Alert>

												{ storeUrls.length>0 && <PromotionReleaseStoreUrls storeUrls={storeUrls} /> }
											</div>
										}
									</>
								) : (
									<TableHelper loading></TableHelper>
								)}
							</div>
						</CardBody>
					</Card>
				</div>
			</div>
		</Container>
	)
}

export default PromotionRate;
