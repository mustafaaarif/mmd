import React, { useEffect, useState } from "react";
import DeliveryConfirmationBreakdownTable from "../../components/deliveryConfirmationBreadownTable";
import ViewLayout from "../../components/viewLayout";
import TableHelper from "../../components/tableHelper";
import { useFetch } from "../../utils/fetchHook";
import { useLocation } from "react-router-dom";
import { getCookie } from "../../jwt/_helpers/cookie";

const dspDict = {
  '1': ['YouTube Content ID'],
  '2': ['YouTube Premium'],
  '3': ['YouTube Content ID, YouTube Premium'],
  '5': ['Beatport'],
  '6': ['Airtel', 'HighResAudio', 'LINE Music', 'Etisalat', 'Tidal', 'Binge', 'Joox', 'Audible Licensing', 'Moodagent', 'MicDrop', '7Digital', 'Exlibris', 'Soundhound', 'iHeartRadio', 'Genie Music', 'MX Player ', 'iMusica', 'Kuack Media', 'Vodafone Play', 'Slacker', 'MePlaylist', 'Yandex Music', 'Audiomack', 'Beatsource', 'Vodafone', 'Nuuday A/S', 'Bugs!', 'TIM Music', 'Digicel', 'Electric Jukebox / Roxi', 'Xiami', "Music in 'Ayoba'", 'Mi TV', 'MyMelo', 'Napster', 'KkBox', 'NEC', 'Pretzel Rocks', 'Jaxsta Music', 'Shareit', 'PlayNetwork', 'Tencent', 'Supernatural', 'AWA', 'Boomplay Music', 'Stellar Entertainment', 'Grandpad', 'TouchTunes', 'QQ Music', 'Gracenote', 'Anghami', 'LICKD', 'Boomerang', 'A1 Xplore Music', 'Fan Label', 'Ncell', 'Soundtrack Your Brand', 'Peloton', 'Simfy Africa', 'Idea', 'NetEase', 'Wynk', 'Lasso', 'United Media Agency', 'Hungama', 'SparkAR', 'Airtel TV', 'Virgin Australia', 'Mixcloud', 'Dub Store Sound Inc.', 'Soundmouse', 'JioSaavn', 'MTNL', 'Nepal Telecom', 'Kakao / MelOn', 'BMAT', 'GrooveFox', 'Qobuz', 'MTN', 'Telenor', 'SoundMachine', 'SunExpress', 'Hardstyle.com', 'Bitel', 'Xite', 'FLO', 'Fizy', 'Shazam', 'NAVER VIBE', 'Global Radio'],
  '7': ['Traxsource'],
  '8D': ['Deezer'],
  '8J': ['Junodownload'],
  '8S': ['Spotify'],
  '10': ['Douyin', 'TikTok'],
  '11': ['Twitch', 'Audible Magic'],
  '14': ['Facebook AL', 'Faacebook FP', 'Instagram'],
  '15': ['Amazon Music', 'Amazon Unlimited', 'Amazon Prime'],
  '16': ['SoundCloud GO+', 'SoundCloud'],
  '19': ['Pandora'],
  '20': ['Apple Music', 'iTunes']
}

const DeliveryConfirmationBreakdown = props => {
  const token = getCookie("token");
  const location = useLocation();
  const confirmationID = location.pathname.split("/")[2];
  const [apiData, error, loading] = useFetch("GET",`ddex-delivery-confirmations/${confirmationID}/`, token);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if(apiData.store_confirmations)
    {
      const storeDeliveryList = [];
      for (const confirmation of apiData.store_confirmations) {
        const store = confirmation.store;
        const status = confirmation.status;
        if (dspDict.hasOwnProperty(store)) {
          const dspNames = dspDict[store]
          for (const dspName of dspNames) {
            let additionalNote = ""
            let russianDsp = false;
            if(dspName === "Apple Music" || dspName === "iTunes") {
              if(status){
                additionalNote = "Successfully delivered, subject to additional QC control by Apple Music staff."
              }
              else {
                additionalNote = `Release delivery was unsuccessfull for ${dspName}.`
              }
            }
            else if(dspName === "United Media Agency" || dspName === "Yandex Music") {
              additionalNote = "No deliveries possible at the moment"
              russianDsp = true;
            }
            else {
              if(status) {
                additionalNote = `Release has been successfully delivered to the ${dspName} servers.`
              }
              else {
                additionalNote = `Release delivery was unsuccessfull for ${dspName}.`
              }
            }
            const deliveryObj = {
              store: dspName,
              status: russianDsp? false: status,
              additionalNote: additionalNote,
            };
            storeDeliveryList.push(deliveryObj);
          }

        }
      }
      storeDeliveryList.sort((a, b) => a.store.localeCompare(b.store));
      setTableData(storeDeliveryList);
    }
  }, [apiData]);

  const tableProps = {
    tableData,
    error,
    loading,
  };

  return (
    <>
      {loading ? (
        <TableHelper loading />
      ) : error ? (
        <TableHelper error />
      ) :  (
        <div>
          <ViewLayout title={"Store Delivery List"}>
            <DeliveryConfirmationBreakdownTable
              {...tableProps}
            />
          </ViewLayout>
        </div>
      )}
    </>
  );
};

export default DeliveryConfirmationBreakdown;