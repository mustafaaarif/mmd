import React from "react";

import { ResponsiveChoropleth }  from '@nivo/geo';

import countries from "./trendsMapCountries";

const EdSalesMap = ({ mapData }) => {

  const getFormattedValue = (value) => {
    let new_value = value.toFixed(2) + " €";
    return new_value;
  }

  return (
    <div style={{ width: '100%', height: 500 }}>
        <ResponsiveChoropleth
          data={mapData.country_earnings}
          features={countries.features}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          colors="blues"
          domain={[0, mapData.max]}
          unknownColor="#adadad"
          label="properties.name"
          valueFormat={getFormattedValue}
          projectionTranslation={[0.5, 0.7]}
          projectionScale={120}
          projectionRotation={[-10, 0, 0]}
          enableGraticule={false}
          graticuleLineColor="#dddddd"
          borderWidth={0.3}
          borderColor="#152538"
          legends={[
            {
              anchor: "left",
              direction: "column",
              justify: true,
              translateX: 0,
              translateY: 50,
              itemsSpacing: 0,
              itemWidth: 145,
              itemHeight: 18,
              itemDirection: "left-to-right",
              itemTextColor: "#3e5569",
              itemOpacity: 0.85,
              symbolSize: 18,
              effects: [
                {
                  on: "hover",
                  style: {
                    itemTextColor: "#3e5569",
                    itemOpacity: 1
                  }
                }
              ]
            }
          ]}
        />
    </div>
  );

};

export default EdSalesMap;
