import React, { useState, useEffect, useContext } from "react";
import PaymentMethodsTable from "../../components/paymentMethodsTable";
import ViewLayout from "../../components/viewLayout";
import { Alert } from "reactstrap";
import TableHelper from "../../components/tableHelper";
import { getCookie } from "../../jwt/_helpers/cookie";
import { useFetch } from "../../utils/fetchHook";
import { StateContext } from "../../utils/context";
import { getUser } from "../../utils/getUser";
import TableModal from "../../components/tableModal";

const PaymentMethods = props => {

  const token = getCookie("token");
  const {currentUser, setCurrentUser} = useContext(StateContext);

  const [openModal, setToggleModal] = useState(false);
  const [dataModal, setDataModal] = useState(null);

  //ajax handlers
  const [success, setSuccess] = useState(false);
  const [errorPut, setError] = useState(false);

  const [forceUpdate, setForce] = useState(1);

  const handlerValues = { setSuccess, setError, forceUpdate, setForce };

  const [apiData, error, loading] = useFetch("GET",`user-payment/list/`, token, false, forceUpdate);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {

    if (apiData) {
      if(apiData) {
        setTableData(apiData);
      }
    }
  }, [apiData]);

  useEffect(() => {
    getUser(token, currentUser, setCurrentUser);
    setForce( prev => prev + 1);
  }, [success]);

  return (
    <>
      {loading ? (
        <TableHelper loading />
      ) : error ? (
        <TableHelper error />
      ) :  (
        <div>
          {
            currentUser.total_payment_methods>=3 && (
              <Alert color="warning">
                You have reached the limit of 3 payment methods, If you want to add a new payment, you can do that by deleting an existing one.
              </Alert>
            )
          }
          <ViewLayout title={"Your payment methods list"}>
            <PaymentMethodsTable
              data={tableData}
              setToggleModal={setToggleModal}
              setDataModal={setDataModal}
            />
          </ViewLayout>
        </div>
      )}

      {dataModal && (
        <TableModal
          openModal={openModal}
          setToggleModal={setToggleModal}
          dataModal={dataModal}
          values={handlerValues}
          title={
            `Delete Payment Method ${dataModal.number}`
          }
          body={
            "Are you sure that you want to delete this payment method?"
          }
          apiURL={`user-payment/${dataModal.id}/delete/`}
          bodyID={dataModal.id}
          can_be_deleted={true}
          deleteBody={true}
        />
      )}
      {success && <Alert color="success">Payment Method has been removed!</Alert>}
      {errorPut && (
        <Alert color="danger">
          Something went wrong! Please refresh page and try again!
        </Alert>
      )}
        
    </>
  );
};

export default PaymentMethods;
