import React, { useEffect, useState, useRef } from "react";
import { Row, Col, Card, CardBody, CardTitle, Label, Alert, Button} from "reactstrap";
import { useFetch } from "../../utils/fetchHook";
import { getCookie } from "../../jwt/_helpers/cookie";
import ModalConfirm from "../../components/modalConfirm";
import { Redirect } from "react-router-dom";
import TableHelper from "../../components/tableHelper"
import "react-day-picker/lib/style.css";

import Select from "react-select";
import Datetime from "react-datetime";

import EarningsTable from "../../components/earningsTable";
import ViewLayout from "../../components/viewLayout";

const AddAccounting = () => {
  const token = getCookie("token");
  const [tableData, setTableData] = useState([]);

  //ajax handlers
  const [success, setSuccess] = useState(false);
  const [errorPut, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("Something went wrong! Please refresh page and try again!");
  const [openModal, setToggleModal] = useState(false);
  const [dataModal, setDataModal] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const [release_ops, setReleaseOps] = useState([]);

  const [startingMonth, setStartingMonth] = useState(Datetime.moment().subtract(15, 'month'));
  const [endingMonth, setEndingMonth] = useState(Datetime.moment().subtract(4, 'month'));

  let validRange = (selectedEndingMonth) => {
    let yearAfterStartingMonth = Datetime.moment(startingMonth).add(11, 'M');
    let isValidRange = selectedEndingMonth.isBetween(startingMonth, yearAfterStartingMonth);
    return isValidRange;
  };

  const [activeReleaseTab, setActiveReleaseTab] = useState({
    label: "All Releases",
    value: "0",
  });

  const didEff = useRef(false);

  const [forceUpdate, setForce] = useState(1);

  const [openEarnings, error, isloading] = useFetch("GET",
        "earnings/accounting-overview/?release=" + activeReleaseTab.value
        + "&period_start=" + startingMonth.format('MM-YYYY')
        + "&period_end=" + endingMonth.format('MM-YYYY'),
        token, false , forceUpdate);

  const handleFilterChange = (event, filter) =>
  {

    switch(filter) {
      case "release":
        setActiveReleaseTab(event);
        setError(false);
        setErrorMsg("");
      default:
        //do nothing
    }

  };

  const resetFilters = () =>
  {

    setActiveReleaseTab(
    {
      label: "All Releases",
      value: "0",
    });

    setStartingMonth(Datetime.moment().subtract(15, 'month'));
    setEndingMonth(Datetime.moment().subtract(4, 'month'));

    setError(false);
    setErrorMsg("");

  }

  const handleStartingMonthChange = (value) => {
    setStartingMonth(value);
    let yearAfterStartingMonth = Datetime.moment(value).add(11, 'M');
    setEndingMonth(yearAfterStartingMonth);
  }

  const handleEndingMonthChange = (value) => {
    setEndingMonth(value);
  }

  useEffect(() => {

    if (openEarnings.revenue_data)
    {
      setTableData(openEarnings.revenue_data);
    }

    if (openEarnings.releases)
    {
      let user_releases = [];

      var release_object = {};
      release_object["label"] = "All Releases";
      release_object["value"] = "0";
      user_releases.push(release_object);

      openEarnings.releases.map(release => {

        var release_object = {};
        release_object["label"] = release.name;
        release_object["value"] = release.id;
        user_releases.push(release_object);

      });

      setReleaseOps(user_releases);
    }
  }, [openEarnings]);

  useEffect(() => {
    if (!didEff.current) {
      didEff.current = true;
      return;
    }
    setForce(prev => prev + 1);
  }, [activeReleaseTab, startingMonth, endingMonth]);


  const tableProps = {
    tableData,
  };

  function generateAccountingReport() {

    setError(false);
    setErrorMsg("");

    if(activeReleaseTab.value!=="0")
    {
      if(openEarnings.revenue_data.length>0)
      {
        setDataModal({
          release: activeReleaseTab.value,
          period_start: startingMonth,
          period_end: endingMonth
        });

        setToggleModal(true)
      }

      else
      {
        setError(true)
        setErrorMsg("No earnings available for accounting.")
      }
    }
    else
    {
      setError(true)
      setErrorMsg("Please select a particular release for accounting")
      
    }
  }

  return (
    <>
        <Card className="">
        <h5 className="ml-4 mt-4">Filters</h5>
        <Row className="mb-4">
            <Col className="col-lg-6 col-md-6 col-sm-12 col-12">
            <div className="mx-4">
                <Label>Month Range</Label>
                <div className="starting-month">
                    <Datetime locale="en-gb"
                    dateFormat="YYYY-MM"
                    timeFormat={false}
                    inputProps={{ placeholder: "Starting Month" }}
                    value={startingMonth}
                    onChange={handleStartingMonthChange}
                    />
                </div>
                <div className="ending-month">
                    <Datetime locale="en-gb"
                    dateFormat="YYYY-MM"
                    timeFormat={false}
                    inputProps={{ placeholder: "Ending Month" }}
                    value={endingMonth}
                    isValidDate={validRange}
                    onChange={handleEndingMonthChange}
                    />
                </div>
            </div>
            </Col>

            <Col className="col-lg-6 col-md-6 col-sm-12 col-12">
            <div className="mx-4">
                <Label>Release</Label>
                <Select
                    components={{ IndicatorSeparator: () => null }}
                    name="release_filter"
                    options={release_ops}
                    value={activeReleaseTab}
                    onChange={(e) => handleFilterChange(e, "release")}
                />
            </div>
            </Col>
        </Row>

        <Row>
        <Col className="col-lg-12 col-md-12 col-sm-12 col-12">
            <div className="mx-4 mb-4" style={{ float: "right"}}>
                <Button
                    className="btn btn-outline-success"
                    style={{width: "200px", height: "40px", marginRight: "10px"}}
                    onClick={() => generateAccountingReport()}
                >
                    Generate Accounting Report
                </Button>
                <Button
                className="btn btn-outline-info"
                style={{width: "160px", height: "40px"}}
                onClick={() => { resetFilters() }}>
                Reset Filters
                </Button>
            </div>
            </Col>
        </Row>
        </Card>
      {isloading ? (
        <TableHelper loading />
      ) : error ? (
        <TableHelper error />
      ) : (
        <div className="mb-5">

          <div>
              {success && (
                <Alert color="success">Accounting has been created!</Alert>
              )}
              {redirect ? <Redirect to="/accounting" /> : null}
              {errorPut && (
                <Alert color="danger">
                  {errorMsg}
                </Alert>
              )}
          </div>

          <ViewLayout title={"Earnings available for accounting"}>
            <EarningsTable {...tableProps}/>
          </ViewLayout>

        </div>
      )}

      {
        <ModalConfirm
          openModal={openModal}
          setToggleModal={setToggleModal}
          dataModal={dataModal}
          title={`Add Accounting`}
          setSuccess={setSuccess}
          setError={setError}
          body={`Are you sure you want to add new accounting for Release: ${activeReleaseTab.label}, PERIOD: ${startingMonth.format('MMM-YYYY')} TO ${endingMonth.format('MMM-YYYY')}  ?`}
          apiURL={`accounting_reports/generate-accounting-report`}
          setRedirect={setRedirect}
        />
      }
    </>
  );
};

export default AddAccounting;
