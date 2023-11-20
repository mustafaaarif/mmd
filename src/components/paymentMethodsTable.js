import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import PaymentMethodsTableDropdown from "./paymentMethodsTableDropdown";

const PaymentMethodsTable = ({ 
    data, 
    setToggleModal,
    setDataModal, 
  }) => {

  const monthsDict = {
    1: "January", 
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December",
  };

  const actionFormatter = (cell, row) => {
    return (
      <PaymentMethodsTableDropdown
        data={row}
        setToggleModal={setToggleModal}
        setDataModal={setDataModal}
      />
    );
  };

  const defaultFormatter = cell => {
    return (
      <>
        {cell ? (
          <div className="btn btn-success btn-status-md disabled">Default</div>
        ) : (
          <div className="btn btn-warning btn-status-md disabled">Secondary</div>
        )}
      </>
    );
  };


  const statusFormatter = (cell, row) => {

    const currentDate = (new Date());
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    const expiryMonth = parseInt(row.exp_month);
    const expiryYear = parseInt(row.exp_year);

    let cardValid = false;

    if(expiryYear>=currentYear && expiryMonth>=currentMonth)
    {
      cardValid = true;
    }
    else if (cell==="active")
    {
      cardValid = true;
    }
    else{
      cardValid = false;
    }
    
    return (
      <>
        {cardValid ? (
          <div className="btn btn-success btn-status-md disabled">Valid</div>
        ) : (
          <div className="btn btn-warning btn-status-md disabled">Expired</div>
        )}
      </>
    );
  };

  const expMonthFormatter = cell => {
    return (
      <>
        {cell ? (
          monthsDict[cell]
        ) : (
          'Not Available'
        )}
      </>
    );
  };


  const columns = [
    {
        dataField: "holder_name",
        text: "Cardholder Name",
        sort: false
    },
    {
        dataField: "number",
        text: "Card Number",
        sort: false
    },
    {
        dataField: "exp_month",
        text: "Expiry Month",
        formatter: expMonthFormatter,
        sort: false
    },
    {
        dataField: "exp_year",
        text: "Expiry Year",
        sort: false
    },
    {
      dataField: "is_default",
      text: "Type",
      formatter: defaultFormatter,
      sort: false
    },
    {
      dataField: "status",
      text: "Status",
      formatter: statusFormatter,
      sort: false
    },
    {
      dataField: "action",
      text: "Action",
      formatter: actionFormatter,
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "111px" };
      }
    }
  ];

  return (
    <ToolkitProvider
    keyField="id"
    data={data}
    columns={columns}
  >
    {props => (
      <div>

        <BootstrapTable
          {...props.baseProps}
          bordered={ false }
          remote={ { sort: false } }
        />
      </div>
    )}
  </ToolkitProvider>
  );
};

export default PaymentMethodsTable;
