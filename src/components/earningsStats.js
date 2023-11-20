import React, { useState } from "react";
import Select from "react-select";
import {
  CardBody,
  TabPane,
  TabContent,
} from "reactstrap";
import { Line } from "react-chartjs-2";

const EarningStats = ({ salesByYear, years, statements }) => {
  const [activeTab, setActiveTab] = useState({
    label: "All time earnings",
    value: "1"
  });


  let monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];


  const get12Months = () => {
    let d = new Date();
    let ar = [];
    d.setDate(1);
    for (let i = 0; i <= 11; i++) {
      ar.push({ month: d.getMonth() + 1, year: d.getFullYear(), monthName: monthNames[d.getMonth()] })
      d.setMonth(d.getMonth() - 1);
    }
    return ar;
  }

  const get12MChartData = (passData) => {
    const dataNow = new Date();
    const currentYear = dataNow.getFullYear();
    const getLast12Month = passData.filter(i => {
      if (i.month >= dataNow.getMonth() + 1 && i.year === currentYear - 1) {
        return i;
      }
      if (i.month <= dataNow.getMonth() + 1 && i.year === currentYear) {
        return i;
      }
    })
    const currentYearFilter = getLast12Month.filter(i => i.year === currentYear);
    const pastYearFilter = getLast12Month.filter(i => i.year === currentYear - 1);

    const currentYearData = reduceChartData(currentYearFilter).map(i => ({ ...i, year: currentYear }));
    const pastYearData = reduceChartData(pastYearFilter).map(i => ({ ...i, year: currentYear - 1 }));
    const merged = [...currentYearData, ...pastYearData];

    const filledMissingData = get12Months().map(i => {
      const item = merged.filter(m => (m.month === i.month) && (m.year === i.year));

      if (item.length === 0) {
        return ({ month: i.month, year: i.year, value: 0 });
      } else {
        return ({ month: i.month, year: i.year, value: Number((item[0].value).toFixed(2)) });
      }
    })

    const sortedByDate = filledMissingData.sort(function (a, b) {
      if (a.year > b.year) return 1;
      if (a.year < b.year) return -1;

      if (a.month > b.month) return 1;
      if (a.month < b.month) return -1;
    });
    return sortedByDate.map(i => i.value);
  }

  const reduceChartData = (obj) => {
    let counts = obj.reduce((prev, curr) => {
      let count = prev.get(curr.month) || 0;
      prev.set(curr.month, Number(curr.price) + count);
      return prev;
    }, new Map());
    return [...counts].map(([month, value]) => {
      return { month, value }
    })
  }

  const opt = [
    {
      label: "All time earnings",
      value: "1"
    },
    {
      label: "Last 12 months earnings",
      value: "2"
    }
  ];


  return (
    <>
      <div className="dashboard-select-outer">
        <div className="dashboard-select-wrap">
          <Select
            components={{ IndicatorSeparator: () => null }}
            name="country"
            options={opt}
            value={activeTab}
            onChange={e => setActiveTab(e)}
          />
        </div>
      </div>
      <CardBody>
        {years !== null && (
          <>
            <TabContent activeTab={activeTab.value}>
              <TabPane tabId="1">
                <div className="dashboardChart">
                  <Line
                    width={100}
                    height={30}
                    data={{
                      labels: years,
                      datasets: [
                        {
                          data: salesByYear,
                          label: "All time earnings",
                          fill: true,
                          pointBorderWidth: 3,
                          borderwidth: 1,
                          tension: 0.5,
                          pointBackgroundColor: "#000a60",
                          borderColor: "#000a60",
                          backgroundColor: "rgba(232,244,251, .5)"
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      position: "bottom",
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      scales: {
                        x: {
                          grid: {
                            display: false
                          }
                        },
                        y: {
                          grid: {
                            display: false
                          }
                        }
                      }
                    }}
                  />
                </div>
              </TabPane>
            </TabContent>
            <TabContent activeTab={activeTab.value}>
              <TabPane tabId="2">
                <div className="dashboardChart">
                  <Line
                    width={100}
                    height={30}
                    data={{
                      labels: get12Months().map(i => i.monthName).reverse(),
                      datasets: [
                        {
                          data: get12MChartData(statements.results),
                          label: "Last 12 Months",
                          fill: true,
                          pointBorderWidth: 3,
                          borderwidth: 1,
                          tension: 0.5,
                          pointBackgroundColor: "#000a60",
                          borderColor: "#000a60",
                          backgroundColor: "rgba(232,244,251, .5)"
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      position: "bottom",
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      scales: {
                        x: {
                          grid: {
                            display: false
                          }
                        },
                        y: {
                          grid: {
                            display: false
                          }
                        }
                      }
                    }}
                  />
                </div>
              </TabPane>
            </TabContent>
          </>
        )}
      </CardBody>
      <br />
    </>
  );
};

export default EarningStats;
