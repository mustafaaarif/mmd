import React from "react";
import { Line } from "react-chartjs-2";


const TrendsMultiSalesGraph = ({ salesGraphData, storeValue }) => {

  

    const getGraphDatasets = (graphData, selectedStore) => {

      var amazonMusicSalesDataset = {
        order: 1,
        data: graphData.store_sales?.amazon_music.data,
        label: "Amazon Music stream",
        borderColor: "#4512ff",
        backgroundColor: "#4512ff",
        tension: 0.5,
        borderWidth: 1.5,
        fill: false
      };

      var appleMusicSalesDataset = {
        order: 2,
        data: graphData.store_sales.apple_music.data,
        label: "Apple Music stream",
        borderColor: "#f94c57",
        backgroundColor: "#f94c57",
        tension: 0.5,
        borderWidth: 1.5,
        fill: false
      };

      var beatportSalesDataset = {
        order: 3,
        data: graphData.store_sales.beatport.data,
        label: "Beatport download",
        borderColor: "#01FF95",
        backgroundColor: "#01FF95",
        tension: 0.5,
        borderWidth: 1.5,
        fill: false
      };

      var deezerSalesDataset = {
        order: 4,
        data: graphData.store_sales.deezer.data,
        label: "Deezer stream",
        borderColor: "#EF5466",
        backgroundColor: "#EF5466",
        tension: 0.5,
        borderWidth: 1.5,
        fill: false
      };

      var facebookSalesDataset = {
        order: 5,
        data: graphData.store_sales.facebook.data,
        label: "Facebook stream",
        borderColor: "#4267B2",
        backgroundColor: "#4267B2",
        tension: 0.5,
        borderWidth: 1.5,
        fill: false
      };

      var instagramSalesDataset = {
        order: 6,
        data: graphData.store_sales.instagram.data,
        label: "Instagram stream",
        borderColor: "#8A3AB9",
        backgroundColor: "#8A3AB9",
        tension: 0.5,
        borderWidth: 1.5,
        fill: false
      };

      var itunesSalesDataset = {
        order: 7,
        data: graphData.store_sales.itunes.data,
        label: "iTunes download",
        borderColor: "#000000",
        backgroundColor: "#000000",
        tension: 0.5,
        borderWidth: 1.5,
        fill: false
      };

      var pandoraSalesDataset = {
        order: 8,
        data: graphData.store_sales.pandora.data,
        label: "Pandora stream",
        borderColor: "#00A0EE",
        backgroundColor: "#00A0EE",
        tension: 0.5,
        borderWidth: 1.5,
        fill: false
      };

      var soundcloudSalesDataset = {
        order: 9,
        data: graphData.store_sales.soundcloud.data,
        label: "Soundcloud stream",
        borderColor: "#FF8800",
        backgroundColor: "#FF8800",
        tension: 0.5,
        borderWidth: 1.5,
        fill: false
      };

      var spotifySalesDataset = {
        order: 10,
        data: graphData.store_sales.spotify.data,
        label: "Spotify stream",
        borderColor: "#2dce89",
        backgroundColor: "#2dce89",
        tension: 0.5,
        borderWidth: 1.5,
        fill: false
      };

      var tiktokSalesDataset = {
        order: 11,
        data: graphData.store_sales.tiktok.data,
        label: "Tiktok stream",
        borderColor: "#25F4EE",
        backgroundColor: "#25F4EE",
        tension: 0.5,
        borderWidth: 1.5,
        fill: false
      };

      var traxsourceSalesDataset = {
        order: 12,
        data: graphData.store_sales.traxsource.data,
        label: "Traxsource download",
        borderColor: "#40A0FF",
        backgroundColor: "#40A0FF",
        tension: 0.5,
        borderWidth: 1.5,
        fill: false
      };

      var youtubeSalesDataset = {
        order: 13,
        data: graphData.store_sales.youtube.data,
        label: "Youtube stream",
        borderColor: "#FF0000",
        backgroundColor: "#FF0000",
        tension: 0.5,
        borderWidth: 1.5,
        fill: false
      };

      var youtubePremiumSalesDataset = {
        order: 14,
        data: graphData.store_sales.youtube_premium.data,
        label: "Youtube Premium stream",
        borderColor: "#282828",
        backgroundColor: "#282828",
        tension: 0.5,
        borderWidth: 1.5,
        fill: false
      };


      var combinedSalesDataset = {
        order: 15,
        data: graphData.combined_sales.data,
        label: "Total sales",
        pointBackgroundColor: "#000a60",
        borderColor: "#000a60",
        backgroundColor: "rgba(232,244,251, 0.5)",
        hoverBackgroundColor: "rgba(232,244,251, .6)",
        type: 'bar',
        fill: false
      };

      var datasets = [];

      if(selectedStore === "0")
      {
        datasets = [
          amazonMusicSalesDataset,
          appleMusicSalesDataset,
          beatportSalesDataset,
          deezerSalesDataset,
          facebookSalesDataset,
          instagramSalesDataset,
          itunesSalesDataset,
          pandoraSalesDataset,
          soundcloudSalesDataset,
          spotifySalesDataset,
          tiktokSalesDataset,
          traxsourceSalesDataset,
          youtubeSalesDataset,
          youtubePremiumSalesDataset,
          combinedSalesDataset
        ];
      }

      if(selectedStore === "ds")
      {
        datasets = [
          beatportSalesDataset,
          itunesSalesDataset,
          traxsourceSalesDataset,
          combinedSalesDataset
        ];
      }

      if(selectedStore === "ss")
      {
        datasets = [
          amazonMusicSalesDataset,
          appleMusicSalesDataset,
          deezerSalesDataset,
          facebookSalesDataset,
          instagramSalesDataset,
          pandoraSalesDataset,
          soundcloudSalesDataset,
          spotifySalesDataset,
          tiktokSalesDataset,
          youtubeSalesDataset,
          youtubePremiumSalesDataset,
          combinedSalesDataset
        ];
      }

      if(selectedStore === "am")
      {
        datasets = [amazonMusicSalesDataset, combinedSalesDataset];
      }

      if(selectedStore === "apm")
      {
        datasets = [appleMusicSalesDataset, combinedSalesDataset];
      }

      if(selectedStore === "bp")
      {
        datasets = [beatportSalesDataset, combinedSalesDataset];
      }

      if(selectedStore === "dr")
      {
        datasets = [deezerSalesDataset, combinedSalesDataset];
      }

      if(selectedStore === "fb")
      {
        datasets = [facebookSalesDataset, combinedSalesDataset];
      }

      if(selectedStore === "ig")
      {
        datasets = [instagramSalesDataset, combinedSalesDataset];
      }

      if(selectedStore === "it")
      {
        datasets = [itunesSalesDataset, combinedSalesDataset];
      }

      if(selectedStore === "pd")
      {
        datasets = [pandoraSalesDataset, combinedSalesDataset];
      }

      if(selectedStore === "sc")
      {
        datasets = [soundcloudSalesDataset, combinedSalesDataset];
      }

      if(selectedStore === "sp")
      {
        datasets = [spotifySalesDataset, combinedSalesDataset];
      }

      if(selectedStore === "tx")
      {
        datasets = [traxsourceSalesDataset, combinedSalesDataset];
      }

      if(selectedStore === "tk")
      {
        datasets = [tiktokSalesDataset, combinedSalesDataset];
      }
      
      if(selectedStore === "yt")
      {
        datasets = [youtubeSalesDataset, combinedSalesDataset];
      }
      
      if(selectedStore === "yp")
      {
        datasets = [youtubePremiumSalesDataset, combinedSalesDataset];
      }
      
      return datasets;
    };

    const options = {
        type: 'line',
        plugins: {
            legend: {
              display: true,
            },
            subtitle: {
              display: true,
              text: '* Store labels are ordered alphabetically (A-Z)'
          }
        },
        responsive: true,
        interaction: {
            mode: 'index',
            intersect: false
        },
        maintainAspectRatio: false,
        scales: {
            x: {
              grid: {
                  display: false,
                }
            },
            y: {
                grid: {
                  display: false,
                }
            }
        }
    };

    console.log(salesGraphData)

  return (
    <>
      <div className="multiSalesChart">
        <Line
          width={100}
          height={500}
          data={{
            labels: salesGraphData.labels,
            datasets: getGraphDatasets(salesGraphData, storeValue)
          }}
          options={options}
        />
      </div>
    </>
  );
};

export default TrendsMultiSalesGraph;
