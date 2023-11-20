import React, { useState, useRef, useContext } from "react";
import axios from "axios";
import {
  Alert,
  Col,
  Row,
  Button,
  Modal,
  Input,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";
import BootstrapTable from "react-bootstrap-table-next";
import { getCookie } from "../jwt/_helpers/cookie";
import ToolkitProvider, {
  CSVExport
} from "react-bootstrap-table2-toolkit";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import TableDropdown from "./tableDropdown";
import LoaderInner from "../components/LoaderInner";
import SubUserFilter from "./subUserFilter";

import { StateContext } from "../utils/context";

const API_URL = process.env.REACT_APP_API_URL_BASE;
const X_API_KEY = process.env.REACT_APP_X_API_KEY;

const exportToCsv = (filename, rows) =>{
  var processRow = function (row) {
      var finalVal = '';
      for (var j = 0; j < row.length; j++) {
          var innerValue = row[j] === null ? '' : row[j].toString();
          if (row[j] instanceof Date) {
              innerValue = row[j].toLocaleString();
          };
          var result = innerValue.replace(/"/g, '""');
          if (result.search(/("|,|\n)/g) >= 0)
              result = '"' + result + '"';
          if (j > 0)
              finalVal += ',';
          finalVal += result;
      }
      return finalVal + '\n';
  };

  var csvFile = '';
  for (var i = 0; i < rows.length; i++) {
      csvFile += processRow(rows[i]);
  }

  var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
  if (navigator.msSaveBlob) { // IE 10+
      navigator.msSaveBlob(blob, filename);
  } else {
      var link = document.createElement("a");
      if (link.download !== undefined) { // feature detection
          // Browsers that support HTML5 download attribute
          var url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute("download", filename);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      }
  }
}

const compare = (a, b) =>{
  const nameA = a.name.toUpperCase();
  const nameB = b.name.toUpperCase();

  let comparison = 0;
  if (nameA > nameB) {
    comparison = 1;
  } else if (nameA < nameB) {
    comparison = -1;
  }
  return comparison;
}

const RecipientsTable = ({
  tableData,
  setToggleModal,
  setDataModal,
  handlerValues,
  setDeleteBody,
  searchQuery,
  defaultSorted,
  subUserData
}) => {
  const token = getCookie("token");
  const tableRef = useRef(null);
  const { currentUser } = useContext(StateContext);
  const { ExportCSVButton } = CSVExport;

  const [importModal, importModalSET] = useState(false);
  const [importedData, importedDataSET] = useState(false);

  const [deleteMultiple, setDeleteMultiple] = useState(false);
  const [modalEmpty, setModalEmpty] = useState(false);

  const [successImport, successImportSET] = useState(false);
  const [errorImport, errorImportSET] = useState(false);

  const [loaderExportAll, setLoaderExportAll] = useState(false);


  const actionFormatter = (cell, row) => {
    return (
      <TableDropdown
        data={row}
        setToggleModal={setToggleModal}
        setDataModal={setDataModal}
        setDeleteBody={setDeleteBody}
      />
    );
  };

  const handleRemoveMultiple = () => {
    const array = tableRef.current.selectionContext.selected;
    

    const options = {
      'method': "GET",
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${token}`,
        "x-api-key": X_API_KEY,
        'Content-Type': 'application/json'
      }
    }
    axios.post(`${API_URL}recipients/bulk-delete/`, { recipient_ids: array }, options)
    .then(res => {
      if (res.status === 200) {
        setDeleteMultiple(false);
        handlerValues.setForce(prev => prev + 1);
        handlerValues.setSuccessDeleteBulk(true);

        setTimeout(() => {
          handlerValues.setSuccessDeleteBulk(false);
        }, 3000);
      }

    }).catch(err => {
      setDeleteMultiple(false);
    })


  }

  const handleMultipleModal = (bool) => {
    if( tableRef.current.selectionContext.selected.length > 0) {
      setDeleteMultiple(bool);
    } else {
      setModalEmpty(true);
    }
  }

  const sendingAllowFormatter = (cell, row) => {
    if (cell) {
      return "Yes"
    } else {
      return "No"
    }
  }

  const handleSubmitImport = () => {
    let formData = new FormData();

    formData.append("file", importedData);

    axios({
      method: "post",
      mode: 'cors',
      url: `${API_URL}recipients/import/`,
      data: formData,
      headers: {
        Authorization: `Bearer ${token}`,
        "x-api-key": X_API_KEY,
        "Content-Type": "application/json"
      }
    })
      .then(function(response) {
        if (response.status === 200) {
          importModalSET(false);
          importedDataSET(null);
          successImportSET(true);
        }
      })
      .catch(e => {
        errorImportSET(true);
        importModalSET(false);
        importedDataSET(null);
      });
  };

  const exportAll = () => {
    setLoaderExportAll(true)
    axios({
      method: "GET",
      mode: 'cors',
      url: `${API_URL}recipients/?page_size=9999&fields=name,email,sending_allowed`,
      headers: {
        Authorization: `Bearer ${token}`,
        "x-api-key": X_API_KEY,
        "Content-Type": "application/json"
      }
    })
      .then(function(response) {
        if (response.status === 200) {
          const sortArray = response.data.results.sort(compare);
          const getArray = sortArray.map(i => ([i.name, i.email, i.sending_allowed.toString()]));
          const result = [['name', 'email', 'Allow sending'], ...getArray]

          exportToCsv('recipients.csv', result);
          setLoaderExportAll(false);
        }
      })
      .catch(e => {
        console.log('e', e)
        setLoaderExportAll(false);
      });
  };

  const listFormatter = (cell, row) => {
    return (
      <>
        {cell.map((i, index) => {
          if (index + 1 === cell.length) {
            return i.name;
          } else {
            return i.name + ", ";
          }
        })}
      </>
    );
  };

  const columns = [
    {
      dataField: "name",
      text: "Name",
      sort: true,
      formatter: cell => <span className="fontWeight700">{cell}</span>
    },
    {
      dataField: "email",
      text: "Email",
      sort: true
    },
    {
      dataField: "lists",
      text: "Lists",
      sort: true,
      formatter: listFormatter,
      csvExport: false,
      csvFormatter: (row, cell) => row.map(i => i.name).join(", ")
    },
    {
      dataField: "responded_sent",
      text: "Responded",
      sort: true,
      csvExport: false,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      }
    },
    {
      dataField: "unsubscribed_from",
      text: "Unsubscribed",
      sort: true,
      csvExport: false,
      headerStyle: (colum, colIndex) => {
        return { width: "180px" };
      }
    },
    {
      dataField: "sending_allowed",
      text: "Allow Sending",
      sort: true,
      formatter: sendingAllowFormatter,
      headerStyle: (colum, colIndex) => {
        return { width: "160px" };
      }
    },
    {
      dataField: "action",
      text: "Action",
      formatter: actionFormatter,
      sort: false,
      csvExport: false,
      headerStyle: (colum, colIndex) => {
        return { width: "111px" };
      }
    }
  ];

  const handleTableChange = (type, { sortField, sortOrder, data }) => {
    const ascDesc = sortOrder === "desc" ? "-" : "";
    if (sortField === "name" || sortField === "responded_sent" || sortField === "sending_allowed" || sortField === "email") {
      searchQuery.setOrdering({order: ascDesc, name: sortField, sort: sortField});
    }

    if (sortField === "lists") {
      searchQuery.setOrdering({order: ascDesc, name: 'lists__name', sort: sortField});
    }
    if (sortField === "unsubscribed_from") {
      searchQuery.setOrdering({order: ascDesc, name: 'recipientunsubscribe', sort: sortField});
    }
  }

  return (
    <>
      <LoaderInner show={loaderExportAll}/>
      <ToolkitProvider
        keyField="token"
        data={tableData}
        columns={columns}
        search={{
          searchFormatted: true
        }}
        exportCSV={ {
          fileName: 'recipients.csv',
        } }
      >
        {props => (
          <div>
            <Row>
              <Col>
                <div className="customSearch">
                <Input placeholder="Search..." value={searchQuery.query} style={{marginBottom: 10}} onChange={e => searchQuery.setQuery(e.target.value)}/>
                </div>
              </Col>
              {
                currentUser.is_premium_user && <SubUserFilter subUserData={subUserData} />
              }
              <div style={{flex:3}}>
                <div className="flexEndContainer">
                  <Button color="danger"  style={{marginRight: 20}} onClick={() => handleMultipleModal(true)}>
                    Delete selected
                  </Button>
                  <Button
                    outline
                    color="info"
                    style={{ marginRight: 20 }}
                    onClick={() => importModalSET(true)}
                  >
                    Import CSV/XLSX
                  </Button>
                  <ExportCSVButton
                    {...props.csvProps}
                    style={{ marginRight: 20 }}
                    className="btn btn-outline-info"
                  >
                    Export CSV
                  </ExportCSVButton>
                  <Button
                    outline
                    color="info"
                    onClick={() => exportAll()}
                  >
                    Export all (CSV)
                  </Button>
                </div>
              </div>
            </Row>

            <BootstrapTable
              {...props.baseProps}
              bordered={ false }
              ref={ tableRef }
              selectRow={ {
                mode: 'checkbox',
              }}
              remote={ { sort: true } }
              defaultSorted={defaultSorted}
              onTableChange={handleTableChange}
              
            />
          </div>
        )}
      </ToolkitProvider>

      <Modal isOpen={importModal} centered={true}>
        <ModalHeader>Import Recipients</ModalHeader>
        <ModalBody>
          <input
            type="file"
            name={"importedCVS"}
            id={"importedCVS"}
            accept=".csv,.xls,.xlsx"
            onChange={e => importedDataSET(e.target.files[0])}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => importModalSET(false)}>
            Cancel
          </Button>
          <Button
            disabled={importedData ? false : true}
            color="success"
            onClick={() => handleSubmitImport()}
          >
            Save
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={deleteMultiple} centered={true}>
        <ModalHeader>Remove multiple recipients</ModalHeader>
        <ModalBody>
          Are you sure you want to remove all selected recipients? 
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setDeleteMultiple(false)}>
            Cancel
          </Button>
          <Button
            color="danger"
            onClick={() => handleRemoveMultiple()}
          >
            Delete
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEmpty} centered={true}>
        <ModalHeader>Please, select recipients to be removed.</ModalHeader>
        <ModalFooter>
          <Button color="secondary" onClick={() => setModalEmpty(false)}>
            Ok
          </Button>
        </ModalFooter>
      </Modal>
      {successImport && (
        <Alert style={{ marginTop: 20 }} color="info">
          Recipient in processing
        </Alert>
      )}
      {errorImport && (
        <Alert style={{ marginTop: 20 }} color="danger">
          Something went wrong! Please refresh page and try again!
        </Alert>
      )}
    </>
  );
};

export default RecipientsTable;
