import React, { useEffect, useState } from "react";
import Axios from "axios";
import ReactGA from "react-ga4";
import LandingPageLayoutOne from "./landingPageLayoutOne";
import LandingPageLayoutTwo from "./landingPageLayoutTwo";

const API_URL = process.env.REACT_APP_API_URL_BASE;
const GA_TRACKING_ID = process.env.REACT_APP_GA_TRACKING_ID;

function LinkLandingPage() {

	const [landingPageData, setLandingPageData] = useState(null);

	// Initialize Google Analytics
	useEffect(() => {
		ReactGA.initialize([
			{
				trackingId: GA_TRACKING_ID,
				testMode: true,
			},
		])
	}, [])

	useEffect(() => {
		getLinkInBioLink()
	}, [])

	const getLinkInBioLink = async () => {
		const [, , back_url] = window.location.pathname.split("/");
		let domain = window.location.origin;
		domain = domain.replace(/^https?:\/\/(?:www\.)?/, '');

		try 
		{
			const result = await Axios.get(
				`${API_URL}link-landingpage/?back_url=${back_url}&domain=${domain}`
			);

			if (result.status === 200) {
				setLandingPageData(result.data);
				ReactGA.send({ hitType: "pageview", page: window.location.href });
			}

			else
			{
				window.location.assign('/bioNotFound');
			}
		}
		catch (error) {
			window.location.assign('/bioNotFound');
		} 
	}

	return (
		<>
			{
				(landingPageData && landingPageData.layout === 1) && <LandingPageLayoutOne landingPageData={landingPageData} />
			}
			{
				(landingPageData && landingPageData.layout === 2) && <LandingPageLayoutTwo landingPageData={landingPageData} />
			}
		</>
	)
}

export default LinkLandingPage;
