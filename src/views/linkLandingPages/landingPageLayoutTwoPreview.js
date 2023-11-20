import React from "react"
import { Link } from "react-router-dom";
import { SocialIcon } from "react-social-icons";
import ScrollBar from "react-perfect-scrollbar";
import "./landingPageLayoutTwoPreview.scss";

const fontsDict = {
    1: "'Abril Fatface', cursive",
    2: "'Amatic SC', cursive",
    3: "'Antonio', sans-serif",
    4: "'Bowlby One SC', cursive",
    5: "'Cinzel', serif",
    6: "'Courgette', cursive",
    7: "'Figtree', display",
    8: "'Fjalla One', sans-serif",
    9: "'Fredoka One', cursive",
    10: "'Inter', sans-serif",
	11: "'Josefin Slab', display",
    12: "'Kanit', sans-serif",
    13: "'Lato', sans-serif",
    14: "'Lora', serif",
	15: "'Mansalva', script",
    16: "'Merriweather', serif",
    17: "'Montserrat', sans-serif",
    18: "'Mukta', sans-serif",
    19: "'Noto Sans', sans-serif",
    20: "'Nunito Sans', sans-serif",
    21: "'Oswald', sans-serif",
    22: "'Poppins', sans-serif",
    23: "'Playfair Display', serif",
    24: "'PT Sans', sans-serif",
    25: "'Raleway', sans-serif",
    26: "'Roboto', sans-serif",
    27: "'Rubik', sans-serif",
    28: "'Source Sans Pro', sans-serif",
    29: "'Ubuntu', sans-serif",
    30: "'Work Sans', sans-serif"
};

let gradientDegreeDict = {
    1: "180deg",
    2: "90deg",
    3: "135deg",
    4: "225deg",
    5: "270deg",
    6: "0deg"
};

let socialIconColorDict = {
    1: "",
    2: "#111111",
    3: "#ffffff",
};

function LandingPageLayoutTwoPreview({landingPageData}) {
    let buttonStyle = "rounded-button";
    let headerBgStyle = {background: landingPageData.header_color}
    let bodyBgStyle = { background: landingPageData.body_color}

	if(landingPageData.button_corners === 1) {
		buttonStyle = "rounded-button";
	}
	else if(landingPageData.button_corners === 2) {
		buttonStyle = "semi-rounded-button";
	}
	else if(landingPageData.button_corners === 3) {
		buttonStyle = "squared-button";
	}

    if(landingPageData.header_color_scheme === 2 && landingPageData.header_gradient) {
        let headerGradientDirection = gradientDegreeDict[landingPageData.header_gradient.direction];

        headerBgStyle = {
            "background": landingPageData.header_gradient.first_color,
            "background": `-moz-linear-gradient(${headerGradientDirection}, ${landingPageData.header_gradient.first_color}, ${landingPageData.header_gradient.second_color})`,
            "background": `-webkit-linear-gradient(${headerGradientDirection}, ${landingPageData.header_gradient.first_color}, ${landingPageData.header_gradient.second_color})`,
            "background": `linear-gradient(${headerGradientDirection}, ${landingPageData.header_gradient.first_color}, ${landingPageData.header_gradient.second_color}`,
            "filter": `progid:DXImageTransform.Microsoft.gradient(startColorstr="${landingPageData.header_gradient.first_color}",endColorstr="${landingPageData.header_gradient.second_color}",GradientType=1)`
        };
    }

    if(landingPageData.body_color_scheme === 2 && landingPageData.body_gradient) {
        let bodyGradientDirection = gradientDegreeDict[landingPageData.body_gradient.direction];
        bodyBgStyle = {
            "background": landingPageData.body_gradient.first_color,
            "background": `-moz-linear-gradient(${bodyGradientDirection}, ${landingPageData.body_gradient.first_color}, ${landingPageData.body_gradient.second_color})`,
            "background": `-webkit-linear-gradient(${bodyGradientDirection}, ${landingPageData.body_gradient.first_color}, ${landingPageData.body_gradient.second_color})`,
            "background": `linear-gradient(${bodyGradientDirection}, ${landingPageData.body_gradient.first_color}, ${landingPageData.body_gradient.second_color}`,
            "filter": `progid:DXImageTransform.Microsoft.gradient(startColorstr="${landingPageData.body_gradient.first_color}",endColorstr="${landingPageData.body_gradient.second_color}",GradientType=1)`
        };
    }

	return (
        <div className="ll-two-content" style={{fontFamily: fontsDict[landingPageData.font], ...bodyBgStyle}}>
            <ScrollBar>
                <main className='bodymain'>
                    <div className='col-12 p-0 layout-col-l2'>
                        <div>
                            <div className="pb-2 layout-header" style={{
                                    ...headerBgStyle,
                                }}>
                                <center className="mb-5 text-white">
                                    <p style={{color: landingPageData.title_color?landingPageData.title_color: "#ffffff"}} className="landing-page-title">{landingPageData?.title}</p>
                                    <p className='landing-page-description mt-2 pr-4 pl-4' style={{color: landingPageData.description_color?landingPageData.description_color: "#ffffff"}}>{landingPageData?.short_description}</p>
                                    <div className="social-links mt-3">
                                    {
                                        landingPageData.social_icon_placement === 1 && <div>
                                        {
                                            landingPageData?.social_links?.map(social_link => {
                                                return (
                                                    <span key={social_link.order} className="m-1">
                                                        <SocialIcon url={social_link.destination_url} bgColor={socialIconColorDict[landingPageData.social_icon_color]} target="_blank" style={{height:"30px", width:"30px"}} />
                                                    </span>
                                                )
                                            })
                                        }
                                        </div>
                                    }
                                    </div>
                                </center>
                            </div>
                            <div className="pt-4 pb-4 layout-links">
                                {
                                    landingPageData?.logo ? <img src={landingPageData?.logo? landingPageData.logo : ""} alt="" /> : null
                                }
                                <div className={landingPageData?.logo? "featured-links-layout-two-preview mt-4": "featured-links-layout-two-preview mt-0"}>
                                {
                                    landingPageData?.featured_links?.map(featured_link => {
                                        return (
                                            <div key={featured_link.order} className="layoutTwofeaturedLink">
                                                <Link to={{ pathname: featured_link.destination_url }} target="_blank"  className={`btn featuredLinkBtn ${buttonStyle}`} 
                                                    style={{
                                                        color: landingPageData.button_text_color,
                                                        backgroundColor: landingPageData.button_style === 1? "transparent": landingPageData.button_color,
                                                        border: landingPageData.button_style === 1? `1px solid ${landingPageData.button_color}`: "0px",
                                                        '--hover-color': landingPageData.button_color,
                                                        '--hover-bg-color': landingPageData.button_style === 1? "transparent": landingPageData.button_text_color,
                                                        '--hover-border': landingPageData.button_style === 1? `1px solid ${landingPageData.button_color}`:landingPageData.button_text_color,
                                                        '--focus-box-shadow': landingPageData.button_color,
                                                    }}
                                                >{featured_link.title?featured_link.title:  `Label # ${featured_link.order + 1}`}</Link>
                                            </div>
                                        )
                                    })
                                }
                                </div>
                                <center>
                                {
                                    landingPageData.social_icon_placement === 2 && <div className="mt-3">
                                    {
                                        landingPageData?.social_links?.map(social_link => {
                                            return (
                                                <span key={social_link.order} className="m-1">
                                                    <SocialIcon url={social_link.destination_url} bgColor={socialIconColorDict[landingPageData.social_icon_color]} target="_blank" style={{height:"30px", width:"30px"}} />
                                                </span>
                                            )
                                        })
                                    }
                                    </div>
                                }
                                </center>
                            </div>
                        </div>
                    </div>
                </main>
            </ScrollBar>
        </div>
	)
}

export default LandingPageLayoutTwoPreview;
