import React, { useState } from "react";
import {
  FormGroup,
  Label,
  Button,
  Col,
  FormText,
  Input,
  Row,
} from "reactstrap";
import "../releases/row.css";

const RowSelect = ({ values, key }) => {
  const [error, setError] = useState(false);

  const validateUrl = (url) => {
    return url.match(
      /^(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
    );
  };

  const handlePlayClick = (id) => {
    const trArray = document.querySelectorAll('[id^="track_play_"]');
    trArray.forEach((audio) => {
      if ( !audio.paused && audio.id !== `track_play_${id}`){
          audio.pause();
      }
    });
  };

  const { previewFile, remove, index, manageData, previewFiles } = values;
  return (
    <>
      <div className="artistWrap" style={{ flexDirection: "column" }}>
        <div className="artistWrap" style={{ margin: "0" }}>
          <Col xs="4">
            <audio
              controls
              id={"track_play_" + index}
              controlsList="nodownload"
              onPlay={() => handlePlayClick(index)}
            >
              <source src={previewFile.url} type={"audio/mp3"} />
              Your browser does not support the audio element.
            </audio>
            {/* <Input
              type="text"
              name={`url`}
              value={previewFile.url}
              className={`${error ? "is-invalid" : ""}`}
              onChange={({ target: { name, value } }) => {
                if (value === "") {
                  setError(false);
                  return;
                }
                if (validateUrl(value) === null) {
                  setError(true);
                } else {
                  setError(false);
                }
                manageData(index, name, value);
              }}
            /> */}
          </Col>
          <Col xs="3">
            <Input
              type="text"
              name={`artist_name`}
              value={previewFile.artist_name}
              onChange={({ target: { name, value } }) =>
                manageData(index, name, value)
              }
            />
          </Col>

          <Col xs="3">
            <Input
              type="text"
              name={`track_name`}
              value={previewFile.track_name}
              onChange={({ target: { name, value } }) =>
                manageData(index, name, value)
              }
            />
          </Col>

          {/* <Col xs="2">
            <Button color={"danger"} onClick={() => remove(index)}>
              Remove{" "}
            </Button>
          </Col> */}
        </div>
      </div>
    </>
  );
};

const RowLabel = () => {
  return (
    <Row className="artistWrap labelRow">
      <Col xs="4">Url</Col>
      <Col xs="3">Artist name</Col>
      <Col xs="3">Track name</Col>
      {/* <Col xs="2">Delete</Col>
      <Col xs="1"></Col> */}
    </Row>
  );
};

const PreviewFilesRow = ({ values }) => {
  let { previewFiles = [], remove, addNew, manageData } = values;

  return (
    <>
      <FormGroup>
        <Label>Music Link Preview Files</Label>
        <Row>
          <RowLabel />
        </Row>
        <Row>
          {previewFiles.map((previewFile, index) => {
            const itemVal = {
              index,
              previewFile,
              remove,
              manageData,
              previewFiles,
            };
            return <RowSelect values={itemVal} key={index} />;
          })}
        </Row>

        {/* <div>
          <Button
            color="primary"
            onClick={() =>
              addNew([
                ...previewFiles,
                {
                  url: "",
                  artist_name: "",
                  track_name: "",
                },
              ])
            }
          >
            Add another
          </Button>{" "}
        </div> */}
      </FormGroup>
    </>
  );
};

export default PreviewFilesRow;
