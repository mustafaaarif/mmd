import React, { useState, useEffect, useContext } from "react";
import DbSales from "../components/dbSales";
import { Card} from "reactstrap";
import EarningsStats from "../components/earningsStats";
import { StateContext } from "../utils/context";
import { useFetch } from "../utils/fetchHook";
import { getCookie } from "../jwt/_helpers/cookie";
import { set } from "lodash";


const UserStatementsGraph = () => {
  const token = getCookie("token");
  const {currentUser} = useContext(StateContext);
  const [statements] = useFetch("GET", "statements/?page_size=9999", token);
  const [promoCoins, setPromoCoins] = useState(null);
  const [toBePaid, setToBePaid] = useState(null);
  const [allTime, setAllTime] = useState(null);
  const [years, setYears] = useState(null);
  const [salesByYear, setSalesByYear] = useState(null);
  const [salesByQuarter, setSalesByQuarter] = useState(null);

  const reduceArray = (arr, key) => {
    return arr.reduce((result, currentValue) => {
      (result[currentValue[key]] = result[currentValue[key]] || []).push(
        currentValue
      );
      return result;
    }, {});
  };

  const getCount = (object, key) => {
    return Object.values(object).map(i => {
      return i
        .map(x => {
          return parseFloat(x[key]);
        })
        .reduce((a, b) => {
          return a + b;
        })
        .toFixed(2);
    });
  };

  useEffect(() => {
    if (currentUser) {
      setPromoCoins(currentUser.promotion_amount_left);
    }
  }, [currentUser]);

  useEffect(() => {
    if (Object.keys(statements).length) {
      if (statements.results.length > 0) {
        setToBePaid(
          statements.results
            .map(item => {
              if (item.status === 0) {
                return parseFloat(item.price);
              } else {
                return 0;
              }
            })
            .reduce((a, b) => {
              return a + b;
            })
            .toFixed(2)
        );
        setAllTime(
          statements.results
            .map(item => {
              if (item.sts_kind !== 5) {
                return parseFloat(item.price);
              } else {
                return 0;
              }
            })
            .reduce((a, b) => {
              return a + b;
            })
            .toFixed(2)
        );
      } else {
        setToBePaid(0);
        setAllTime(0);
      }

      setYears(
        Array.from(
          new Set(
            statements.results.map(item => {
              return item.year;
            })
          )
        ).sort()
      );

      setSalesByYear(
        getCount(reduceArray(statements.results, "year"), "price")
      );
      setSalesByQuarter(
        getCount(reduceArray(statements.results, "quartal"), "price")
      );
    }

    // eslint-disable-next-line
  }, [statements]);

  const salesData = {
    promoCoins,
    toBePaid,
    allTime
  };
  const chartData = {
    salesByYear,
    years,
    salesByQuarter,
    statements
  };

  return (
    <>
        <Card>
            <EarningsStats {...chartData} />
            <DbSales {...salesData} />
        </Card>
    </>
  );
};

export default UserStatementsGraph;
