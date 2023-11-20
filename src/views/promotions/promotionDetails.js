import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Row, Col } from "reactstrap";
import PromoDetailsTable from "../../components/promoDetailsTable";
import { useFetch } from "../../utils/fetchHook";
import { getCookie } from "../../jwt/_helpers/cookie";
import { useLocation } from "react-router-dom";
import "./promotions.scss";
import TableHelper from "../../components/tableHelper";
import ViewLayout from "../../components/viewLayout";
import PromotionDoughnutChart from "../../components/promotionDonughtChart";
import PromotionBarChart from "../../components/promotionBarChart";

const PromoDetails = props => {
  const token = getCookie("token");
  const location = useLocation();
  const promotionID = location.pathname.split("/")[2];
  const [data, error, loading] = useFetch("GET",`promotions/${promotionID}/promo-feedback-detail/`,token);
  const [shareLinkData] = useFetch("GET",`promo-feedbacks-share/?promotion=${promotionID}`,token);


  const [dataFeedback, setDataFeedback] = useState(null);
  const [tracks, setTracks] = useState({});
  const [release, setRelease] = useState(false);
  const [wavCount, setWavCount] = useState([]);
  const [favCount, setFavCount] = useState([]);
  const [openedCount, setOpenedCount] = useState([]);
  const [ratingCount, setRatingCount] = useState([]);
  const [dataTable, setDataTable] = useState([]);
  const [dataShare, setDataShare] = useState({});
  const [releaseFeedbackCount, setRelaseFeedbackCount] = useState(0);

  const [shareLink, setShareLink] = useState('');
  const [open, setToggleModal] = useState(false);


  const reduceArray = (arr, key) => {
    return arr.reduce(function(result, currentValue) {
      (result[currentValue[key]] = result[currentValue[key]] || []).push(
        currentValue
      );
      return result;
    }, {});
  };

  const chartCallbacks = {
    label: function(tooltipItem, data) {
      var dataset = data.datasets[tooltipItem.datasetIndex];
      var meta = dataset._meta[Object.keys(dataset._meta)[0]];
      var total = meta.total;
      var currentValue = dataset.data[tooltipItem.index];
      var percentage = parseFloat(((currentValue / total) * 100).toFixed(1));
      return currentValue + " (" + percentage + "%)";
    },
    title: function(tooltipItem, data) {
      return data.labels[tooltipItem[0].index]
    }
  };

  const promoRatingToolip = {
    label: function(tooltipItem, data) {
      
      return release;
    },
    title: function(tooltipItem, data) {
      return "Average rate of " + releaseFeedbackCount + " voters"
    }
  };

  const doughnutTooltip = {
    label: function(tooltipItem, data) {
      var dataset = data.datasets[tooltipItem.datasetIndex];
      var meta = dataset._meta[Object.keys(dataset._meta)[0]];
      var total = meta.total;
      var currentValue = dataset.data[tooltipItem.index];
      var percentage = parseFloat(((currentValue / total) * 100).toFixed(1));
      return currentValue + " (" + percentage + "%)";
    },
    title: function(tooltipItem, initData) {
      const name = initData.labels[tooltipItem[0].index];
      const base = data.track_feedbacks.filter(i => i.track.name === name)[0]?.track?.mix_name;
      const rr =  base ? ` (${base})` : ''
      return name + rr;
    }
  };

  const graphColors = [
    "#10BD9D",
    "#1ECE6C",
    "#2B98DD",
    "#9C56B9",
    "#F1C501)",
    "#E97E04",
    "#E84C36",
    "#95A4A7",
    "#33495F",
    "#F69E00",
    "#D65301",
    "#C33825",
    "#BCC4C7",
    "#227FBC",
    "#1AAF5D",
    "#8E3FB0",
    "#0CA185",
    "#2B3D51",
    "#5987ba",
    "#2227b3"
  ];

  useEffect(() => {
    if (!loading) {
      setDataTable(data.release_feedbacks);
      setDataFeedback({
        labels: ["Promotions Opened", "Promotions Unopened"],
        datasets: [
          {
            data: [data.promo_opened_count, data.promo_sent_count],
            backgroundColor: graphColors,
            borderwidth: 1
          }
        ]
      });

      setTracks(reduceArray(data.track_feedbacks, "track"));
      setRelaseFeedbackCount(data.release_feedbacks.length)
      if (data.release_feedbacks.length > 0) {
        setRelease(data.release_feedbacks.map(i => i.rating).reduce((a,b) => a + b) / data.release_feedbacks.length);
      }


      if (data.track_feedbacks.length > 0) {

        const cleanedTracks = data.track_feedbacks.map(i => ({name: i.track.name, downloaded: i.downloaded_wav, favorite: i.favorite}));
        const reducedTrakcs = reduceArray(cleanedTracks, 'name');
  
        const countDownloadedTracks = Object.keys(reducedTrakcs).map(i => ({name: i, count: reducedTrakcs[i].filter(u => u.downloaded === true).length}))
        const countFavouriteTracks = Object.keys(reducedTrakcs).map(i => ({name: i, count: reducedTrakcs[i].filter(u => u.favorite === true).length}))
  
        setWavCount(countDownloadedTracks);
        setFavCount(countFavouriteTracks);
      }

      setOpenedCount([
        {"name": "Promotions Opened", "count": data.promo_opened_count},
        {"name": "Promotions Unopened", "count": data.promo_sent_count - data.promo_opened_count},
      ]);

      setRatingCount(
          {"name": "Average promotion rating", "count": data.release}
      );
    }
  }, [data, loading]);

  useEffect(() => {
    if ((Object.keys(shareLinkData).length > 0) && shareLinkData?.count > 0) {
      setDataShare(shareLinkData.results[0]);
      setShareLink(shareLinkData.results[0].token);
    }
  }, [shareLinkData])

  const tableProps = {
    dataTable,
    promotionID,
    setShareLink,
    setToggleModal,
    setDataShare,
    dataShare
    
  };

  const copyFunc = () => {
    var copyText = document.getElementById("copyInp");

  navigator.clipboard.writeText(copyText.value).then(function() {
  }, function(err) {
    console.error('Async: Could not copy text: ', err);
  });
  }

  return (
    <>
      <ViewLayout title={"Promotion Details"}>
        {data.feedback_count > 0 ? (
          <>

          <Row>
            <Col lg="6" md="6" sm="12" xm="12">
              {wavCount.filter(i => i.count > 0).length > 0 && (
                <PromotionDoughnutChart promotionData={wavCount} chartTitle={"Downloaded Tracks"} />
              )}
            </Col>

            <Col lg="6" md="6" sm="12" xm="12">
              {favCount.filter(i => i.count > 0).length > 0 && (
                <PromotionDoughnutChart promotionData={favCount} chartTitle={"Favorite Tracks"} />
              )}
            </Col>
          </Row>


          <Row style={{"marginTop": "50px"}}>
            <Col lg="6" md="6" sm="12" xm="12">
              {data.promo_sent_count > 0 && (
                <PromotionDoughnutChart promotionData={openedCount} chartTitle={"Promotions Opened"} />
              )}
            </Col>

            <Col lg="6" md="6" sm="12" xm="12">
            {release && (
              <PromotionBarChart promotionData={ratingCount} chartTitle={"Promotion Ratings"} />
            )}
            </Col>
          </Row>

          </>
        ) : (
          <TableHelper />
        )}
      </ViewLayout>

      <ViewLayout title={"Release Feedback"}>
        <PromoDetailsTable {...tableProps} />
        <Modal isOpen={open} centered={true}>
          <ModalHeader>Share your link</ModalHeader>
          <ModalBody>
            <input id="copyInp" type="text" readOnly value={window.location.origin + "/promo-share/" + shareLink + "/"} style={{display: "none", width: "0px"}}/>
            <div style={{display: "flex", justifyContent: 'center', alignItems: "center"}}>
              <p style={{margin: 0}}>{window.location.origin + "/promo-share/" + shareLink + "/"}</p>
              <p style={{margin: "0 0 0 16px", cursor: 'pointer'}} onClick={() => copyFunc()}>Copy?</p>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => setToggleModal(false)}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </ViewLayout>
    </>
  );
};

export default PromoDetails;
