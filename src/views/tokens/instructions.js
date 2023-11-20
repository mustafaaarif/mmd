import React from 'react';
import { Card, CardBody, CardTitle, CardText } from 'reactstrap';

import stepTwo from "../../assets/images/bulk/step2.png";
import stepThree from "../../assets/images/bulk/step3.png";

const UploadInstructions = ({accessKeyId, secretAccessKey, s3Bucket, s3Folder, keysVisible}) => {
  return (
    <Card>
      <CardBody>
        <CardTitle tag="h4">Instructions</CardTitle>
        <CardText>
          <ul>
            <li>
              <strong>Step 1 - Download upload tool</strong>:<br/>
              Download the <a href="https://cyberduck.io/" target="blank">Cyberduck</a> tool.
            </li>
            <li className="mt-3">
              <strong>Step 2 - Make a copy of Upload Spreadsheet and save the Trigger file</strong>:<br/>
              Copy this <a href="https://docs.google.com/spreadsheets/d/1bA0T403ivH_k3r5jGuAGRJRmEA31gYEygBC8-mUmWBg/edit?usp=sharing" target="blank"><b>SPREADSHEET</b></a> to your GOOGLE DRIVE.
              <br/>
              Save this <a href="https://md-global-pub-doc.s3.amazonaws.com/bulk-trigger/last.zzz" target="blank"><b>TRIGGER FILE</b></a> to your computer or cloud storage.
              <br/>
              <div style={{ marginTop: "10px", width: "100%", height: "auto", display: "block" }}>
                  <img src={stepTwo} alt="step two" style={{ maxWidth: "60%", height: "auto" }} />
              </div>
            </li>
            <li className="mt-3">
                <strong>Step 3 - Establish the connection</strong>:<br/>
                <ul>
                    <li>Open the Cyberduck tool.</li>
                    <li>In the lower-left corner click on the + icon. (Add new bookmark).</li>
                    <li>Input following credentials:
                        <ul>
                            <li>Access Key ID: <b style={{color: "#b40bbe"}}>{keysVisible? accessKeyId: "**************************"}</b></li>
                            <li>Secret Access Key: <b style={{color: "#b40bbe"}}>{keysVisible? secretAccessKey: "*************************************************"}</b></li>
                            <li>Your S3 Folder: <b style={{color: "#b40bbe"}}>{s3Folder}</b></li>
                            <li>Your S3 Path :  <b style={{color: "#b40bbe"}}>{s3Bucket}/{s3Folder}/</b></li>
                        </ul>
                    </li>
                    <li>Follow these steps:</li>
                </ul>
                <div style={{ marginTop: "10px", width: "100%", height: "auto", display: "block" }}>
                    <img src={stepThree} alt="step three" style={{ maxWidth: "60%", height: "auto" }} />
                </div>
            </li>
            <li className="mt-3">
              <strong>Step 4 - Fill in the metadata</strong>:<br/>
              Fill in the metadata according to the instructions from our Help Center.
            </li>
            <li className="mt-3">
              <strong>Step 5 - Files and Genres</strong>:<br/>
                <ul>
                    <li>Upload your <b style={{color: "#b40bbe"}}>metadata.csv</b> file and all audio <b className="text-success">(.wav)</b> and <b className="text-success">image (.jpg)</b> files, <b className="text-danger">NOT (.jpeg)</b></li>
                    <li><b>JPG</b> files must be <b>3000x3000 px, max files size 4MB</b></li>
                    <li>Audio files must be only <b>wav, 16 bit, 44.1 khz</b></li>
                    <li>Root file names must be one word</li>
                </ul>
                <br/>
                <b>IMPORTANT:</b> Be aware of <a href="https://docs.google.com/spreadsheets/d/1qLpeLyq0E7uCSp_Sv67iHGTiEBdVvVgowmGjGnpwXEg/edit?usp=sharing" target="blank"><b>MMD Dance Genres</b></a> and matching in the stores such as Beatport.
            </li>
            <li className="mt-3">
              <strong>Step 6 - Upload Trigger</strong>:<br/>
              After all the files are uploaded, please upload this empty trigger file <b style={{color: "#b40bbe"}}>“last.zzz”</b>. Monitor your email for any notifications.
            </li>
            <li className="mt-3">
              <strong>Advice - Test with us before uploading</strong>:<br/>
              Feel free to contact our support team with any questions regarding this way of release creation. This is a very simple process that relies on more robust technologies such as AWS S3 and does not rely on browser technologies. However, it requires your metadata to be 100 % accurate. Move Music team can test upload a few releases for you with your metadata to detect possible issues.
            </li>
          </ul>

        </CardText>
      </CardBody>
    </Card>
  );
};

export default UploadInstructions;