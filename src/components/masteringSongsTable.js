import  React, { useState }  from "react";
import { Col, Row, Button, Alert, Badge, UncontrolledTooltip } from "reactstrap";
import ToolkitProvider, {
  CSVExport
} from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import TableHelper from "../components/tableHelper";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import ModalConfirm from "../components/modalConfirm";
import { Link } from "react-router-dom";

const presetDict = {
  'm': 'Acoustic',
  'i': 'All Genres',
  'n': 'Classical',
  'b': 'Club - House - Techno',
  'h': 'EDM Music',
  'f': 'Electronic',
  'g': 'Electronic Raw',
  'c': 'Hip Hop',
  'd': 'Hip Hop Bass',
  'a': 'Pop Music',
  'k': 'Pop & RnB',
  'j': 'Rock & Metal',
  'e': 'Trap',
  'l': 'Vocal Focused'
};

const MasteringSongsTable = ({
  tableData,
  error,
  loading,
}) => {
  const { ExportCSVButton } = CSVExport;
    //ajax handlers
    const [success, setSuccess] = useState(false);
    const [errorPut, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("Something went wrong! Please refresh page and try again!");
    const [redirect, setRedirect] = useState(false);
    const [openModal, setToggleModal] = useState(false);
    const [dataModal, setDataModal] = useState(null);
    const [masteringType, setMasteringType] = useState("");
    const [fetching, setFetching] = useState(false);

    const download = (url, name) => {
      if (!url) {
        throw new Error("Resource URL not provided! You need to provide one");
      }
      setFetching(true);
      fetch(url)
      .then(response => response.blob())
      .then(blob => {
        setFetching(false);
        const blobURL = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobURL;
        a.style = "display: none";

        if (name && name.length) a.download = name;
        document.body.appendChild(a);
        a.click();
      })
      .catch(() => setError(true));
  };

  const generateMastering = (song_id, mastering_type) => {
    setMasteringType(mastering_type);
    setError(false);
    setErrorMsg("");

    setDataModal({
      song_id: song_id,
      mastering_type: mastering_type
    });

    setToggleModal(true);
  }
  
  const previewDownloadFormatter = (cell, row, rowIndex) =>
  row.preview_count>0 ?
  (
    cell? (
      <Button className="btn" color="primary" onClick={()=> download(cell, cell.split(/(\\|\/)/g).pop())} disabled={fetching}>
        <i class="fas fa-download"></i>
      </Button>
    ):
    (
      <>
        <i className="text-warning mdi mdi-36px mdi-clock-start" id={`prvw-gen-id-${rowIndex}`}></i>
        {!cell &&
          <UncontrolledTooltip placement="top" trigger="hover" target={`prvw-gen-id-${rowIndex}`}>The preview is being generated. Please allow 5-6 minutes for it to appear.</UncontrolledTooltip>
        }
      </>
    )
  ) : <b>-</b>;

  const masterCsvFormatter = (cell, row) =>
  cell ?
  ( 
    cell
  ) : ('Not Available');

  const masteringDownloadFormatter = (cell, row, rowIndex) =>
  row.mastering_expedited ?
  (
    cell? (
      <Button className="btn" color="primary" onClick={()=> download(cell, cell.split(/(\\|\/)/g).pop())} disabled={fetching}>
        <i class="fas fa-download"></i>
      </Button>
    ):
    (
      <>
        <i className="text-warning mdi mdi-36px mdi-clock-start" id={`mstr-gen-id-${rowIndex}`}></i>
        {!cell &&
          <UncontrolledTooltip placement="top" trigger="hover" target={`mstr-gen-id-${rowIndex}`}>Mastering is in process. Please allow 7-15 minutes for it to appear.</UncontrolledTooltip>
        }
      </>
    )
  ) : <b>-</b>;

  const masterActionFormatter = (cell, row, rowIndex) => {
    const btnId = `mastering-btn-${rowIndex}`;
    return (
      <>
      <span id={btnId}>
        <Button className="btn btn-outline-primary" style={{pointerEvents: row.mastering_expedited? 'none': 'auto'}} color="primary" disabled={row.mastering_expedited ? true : false} onClick={() => generateMastering(row.id, "master")}>Generate</Button>
      </span>
      {row.mastering_expedited &&
        <UncontrolledTooltip placement="top" trigger="hover" target={btnId}>This song is already mastered.</UncontrolledTooltip>
      }
      </>
    );
  };

  const previewActionFormatter = (cell, row) => {
    return (
      <>
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <Button className="btn btn-outline-primary" color="primary" disabled={(row.preview_count>=5 || row.mastering_expedited) ? true : false} onClick={() => generateMastering(row.id, "preview")}>Generate</Button>
        <Badge color="danger" className="ml-1" style={{fontSize: '13px', fontWeight: 'bold', marginTop: '5px'}}>{5 - row.preview_count} Left</Badge>
      </div>
      </>
    );
  };
 
  const masteringExpeditedFormatter = (cell, row) =>
  cell ?
  (
    <span className="p-4" >
      <i className="fas fa-2x fa-check-circle text-success"></i>
    </span>
  ) :     
  (
    <span className="p-4">
      <i className="fas fa-2x fa-times-circle text-danger"></i>
    </span>
  );

  const editActionFormatter = (cell, row) =>
    row.mastering_expedited ?
    (
      <Button className="btn btn-outline-primary" disabled={true} color="primary">
        Edit
      </Button>
    ) : (
      <Link className="btn btn-outline-primary" disabled={!row.mastering_expedited} to={`/mastering/${row.id}/edit-parameters/`}>Edit</Link>
    );

  const presetFormatter = (cell, row) =>
  cell ?
  ( 
    presetDict[cell]
  ) : ('-');  
  
  const intensityLoudnessFormatter = (cell, row) =>
    `${row.intensity} % / ${row.target_level} dB`;

  const columns = [
    {
      dataField: "tag",
      text: "Name",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "50px" };
      }
    },
    {
      dataField: "preset",
      text: "Preset",
      sort: true,
      formatter: presetFormatter,
      csvFormatter: presetFormatter,
      headerStyle: (colum, colIndex) => {
        return { width: "50px" };
      }
    },
    {
      dataField: "intensity_and_loudness",
      text: "Intensity & Loudness",
      formatter: intensityLoudnessFormatter,
      csvFormatter: intensityLoudnessFormatter,
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "50px" };
      }
    },
    {
      dataField: "generate_preview",
      text: "Preview",
      csvExport: false,
      formatter: previewActionFormatter,
      headerStyle: (colum, colIndex) => {
        return { width: "55px" };
      }
    },
    {
      dataField: "generate_mastering",
      text: "Master",
      csvExport: false,
      formatter: masterActionFormatter,
      headerStyle: (colum, colIndex) => {
        return { width: "50px" };
      }
    },
    {
      dataField: "preview_result",
      text: "Preview Result",
      formatter: previewDownloadFormatter,
      csvFormatter: masterCsvFormatter,
      headerStyle: (colum, colIndex) => {
        return { width: "30px" };
      }
    },
    {
      dataField: "result_file",
      text: "Mastering Result",
      formatter: masteringDownloadFormatter,
      csvFormatter: masterCsvFormatter,
      headerStyle: (colum, colIndex) => {
        return { width: "30px" };
      }
    },
    {
      dataField: "mastering_expedited",
      text: "Mastered",
      sort: true,
      formatter: masteringExpeditedFormatter,
      headerStyle: (colum, colIndex) => {
        return { width: "40px" };
      }
    },
    {
      dataField: "edit",
      text: "Action",
      formatter: editActionFormatter,
      csvExport: false,
      headerStyle: (colum, colIndex) => {
        return { width: "20px" };
      }
    },
  ];

  return (
    <>
      {
        <div>
            {(success && masteringType==="master") && (
              <Alert color="success">Song sent for Mastering generation!<br/>Note: Please check in few minutes as it takes 7-15 minutes for generating mastering.</Alert>
            )}
            {(success && masteringType==="preview") && (
              <Alert color="success">Song sent for Mastering Preview generation!<br/>Note: Please check in few minutes as it takes 5-6 minutes for generating mastering preview.</Alert>
            )}
            {redirect ? window.location.reload() : null}
            {errorPut && (
              <Alert color="danger">
                {errorMsg}
              </Alert>
            )}
        </div>
      }
      {loading ? (
        <TableHelper loading />
      ) : error ? (
        <TableHelper error />
      ) : (
        <ToolkitProvider
          keyField="id"
          data={tableData}
          columns={columns}
          exportCSV={ {
            fileName: 'audio-mastering-songs.csv',
          } }
        >
          {props => (
            <div>
              <Row>
                <Col>
                  <div className="m-5 m-5">
                  </div>
                </Col>
                <Col>
                  <div className="flexEndContainer">

                    <ExportCSVButton
                      className="btn btn-outline-info"
                      {...props.csvProps}
                    >
                      Export CSV
                    </ExportCSVButton>
                  </div>
                </Col>
              </Row>

              <BootstrapTable
               {...props.baseProps}
                bordered={ false }
              />
            </div>
          )}
        </ToolkitProvider>
      )}
      {
        <ModalConfirm
          openModal={openModal}
          setToggleModal={setToggleModal}
          dataModal={dataModal}
          title={masteringType==='master'? 'Generate Mastering' : 'Generate Mastering Preview'}
          setSuccess={setSuccess}
          setRedirect={setRedirect}
          setError={setError}
          body={masteringType==='master'? 'Are you sure that you want to generate mastering?  This is an irreversible action! The master result shall appear within 7-15 minutes.' : 'Are you sure that you want to generate mastering preview? The preview result shall appear within 5-6 minutes.'}
          apiURL={`dolby_master`}
          successMsg={masteringType==='master'? 'Song sent for mastering generation!' : 'Song sent for mastering preview generation!'}
        />
      }
    </>
  );
};

export default MasteringSongsTable;