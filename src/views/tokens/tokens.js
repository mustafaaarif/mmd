import React, { useState, useEffect } from 'react';
import { useFetch } from "../../utils/fetchHook";
import { getCookie } from "../../jwt/_helpers/cookie";
import { Alert, Button, FormGroup, Label, Input, InputGroup, InputGroupAddon, Card, CardBody, CardTitle } from 'reactstrap';
import UploadInstructions from './instructions';

const Tokens = () => {
  const token = getCookie().token;

  const [forceUpdate, setForceUpdate] = useState(0);
  const [accessKeyId, setAccessKeyId] = useState('******************************');
  const [secretAccessKey, setSecretAccessKey] = useState('****************************************');
  const [s3Bucket, setS3Bucket] = useState('<s3_bucket>');
  const [s3Folder, setS3Folder] = useState('<s3_folder>');
  const [keysVisible, setKeysVisible] = useState(false);
  const [accessKeyIdCopied, setAccessKeyIdCopied] = useState(false);
  const [secretAccessKeyCopied, setSecretAccessKeyCopied] = useState(false);

  const [tokensData, error, loading] = useFetch("GET", `users/get-iam-credentials/`, token, false, forceUpdate);

  useEffect(() => {
    if (tokensData) {   
      if(tokensData.credentials) {
        let credentials = tokensData.credentials;
        setAccessKeyId(credentials.AccessKeyId);
        setSecretAccessKey(credentials.SecretAccessKey);
      }
      if(tokensData.s3_bucket) {
        setS3Bucket(tokensData.s3_bucket);
      }
      if(tokensData.s3_folder) {
        setS3Folder(tokensData.s3_folder);
      }
    }
  }, [tokensData]);


  const handleCopy = (value, key="accessKeyId") => {
    navigator.clipboard.writeText(value);
    if(key==="accessKeyId") {
        setAccessKeyIdCopied(true);
      }
      else {
        setSecretAccessKeyCopied(true);
      }
    setTimeout(() => {
      if(key==="accessKeyId") {
        setAccessKeyIdCopied(false);
      }
      else {
        setSecretAccessKeyCopied(false);
      }
    }, 2000);
    navigator.clipboard.writeText(value);
  }

  const toggleVisibility = () => {
    setKeysVisible(!keysVisible);
  }

  return (
      <>
        <Card>
            <CardBody>
                <CardTitle tag="h4">Tokens</CardTitle>
                <div>
                    <FormGroup>
                        <Label for="clientId">Access Key ID</Label>
                        <InputGroup>
                            <Input 
                                type={keysVisible ? "text" : "password"} 
                                name="accessKeyId" 
                                id="accessKeyId" 
                                value={accessKeyId} 
                                readOnly
                            />
                            <InputGroupAddon addonType="append">
                                <Button color="secondary" className="fa fa-copy" onClick={() => handleCopy(accessKeyId, "accessKeyId")}></Button>
                            </InputGroupAddon>
                        </InputGroup>
                    </FormGroup>
                    {
                        accessKeyIdCopied &&
                        <Alert color="success" fade={true} isOpen={accessKeyIdCopied}>
                            Access Key ID copied to clipboard!
                        </Alert>
                    }
                    <FormGroup>
                        <Label for="clientSecret">Secret Access Key</Label>
                        <InputGroup>
                            <Input 
                                type={keysVisible ? "text" : "password"} 
                                name="secretAccessKey" 
                                id="secretAccessKey" 
                                value={secretAccessKey} 
                                readOnly
                            />
                            <InputGroupAddon addonType="append">
                                <Button color="secondary" className="fa fa-copy" onClick={() => handleCopy(secretAccessKey, "secretAccessKey")}></Button>
                            </InputGroupAddon>
                        </InputGroup>
                    </FormGroup>
                    {
                        secretAccessKeyCopied &&
                        <Alert color="success" fade={true} isOpen={secretAccessKeyCopied}>
                            Secret Access Key copied to clipboard!
                        </Alert>
                    }
                    <Button color="primary" onClick={toggleVisibility}>{keysVisible ? "Hide" : "Reveal"}</Button>
                </div>
            </CardBody>
        </Card>

        <UploadInstructions accessKeyId={accessKeyId} secretAccessKey={secretAccessKey} s3Bucket={s3Bucket} s3Folder={s3Folder} keysVisible={keysVisible} />
    </>
  )
}

export default Tokens;
