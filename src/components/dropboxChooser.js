import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { getCookie } from "../jwt/_helpers/cookie";
import DropboxIconSvg from "../assets/images/dropbox_icon.svg";
import "./dropboxChooser.css";

const API_URL = process.env.REACT_APP_API_URL_BASE;
const X_API_KEY = process.env.REACT_APP_X_API_KEY;
const WEB_SOCKET_URL = process.env.REACT_APP_WEB_SOCKET_URL;

const slugify = (text, options = {}) => {
    let slug = text.toString()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');

    if (options.remove) {
        slug = slug.replace(options.remove, '');
    }
    return slug.toLowerCase();
}

const generateUploadID = () => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

const getFilenameFromLink = (url) => {
    const lastDot = url.lastIndexOf('.');
    const fileExtension = url.substring(lastDot + 1);
    const urlWithoutFileExtension = url.substring(0, lastDot);
    const path = new URL(urlWithoutFileExtension).pathname;
    const fileName = slugify(path.split('/').pop(), { remove: /[\,\.\<\>\:\;\"\'\|\[\]\{\}\!\?\@\#\$\%\^\&\*\(\)\=\+\/\\]/g });
    const hash = uuidv4().split('-').join('');
    return `${hash}_${fileName}.${fileExtension}`;
}

const getProgressMessage = (currentProgress) => {
    switch (true) {
        case (currentProgress >= 0 && currentProgress < 50):
            return 'Downloading File From Dropbox';
        case (currentProgress >= 50 && currentProgress < 90):
            return 'Processing File';
        case (currentProgress >= 90 && currentProgress < 91):
            return 'Analyzing Metadata';
        case (currentProgress >= 91 && currentProgress <= 100):
            return 'Finalizing Upload';
        default:
            return '';
    }
  }


const DropboxChooser = ({keyUploading, handleDropboxUploadComplete, handleFileMetadataError, fileType, acceptedExtensions, s3Path, clearArtworkFile=null}) => {
    const token = getCookie('token');
    const options = {
      method: "POST",
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${token}`,
        "x-api-key": X_API_KEY,
        "Content-Type": "application/json"
      }
    };
    const [connection, setConnection] = useState(null);
    const [progress, setProgress] = useState(0);
    const [connectionId, setConnectionId] = useState(null);
    const [transferLink, setTransferLink] = useState(null);
    const [fileMetadata, setFileMetadata] = useState(null);
    const [fileMetadataError, setFileMetadataError] = useState(false);
    const [S3Key, setS3Key] = useState(null);
    const [transferStarted, setTransferStarted] = useState(false);
    const prevProgressRef = useRef();

    const initializeWebSocket = () => {
        const ws = new WebSocket(WEB_SOCKET_URL);

        ws.onopen = (event) => {
            console.log("WebSocket connection opened:", event);

            // Sending a message to the WebSocket server to acknowledge connection
            const messageToSend = {
                action: 'clientMessage',
                data: 'Hello from client!'
            };
            ws.send(JSON.stringify(messageToSend));
        };

        ws.onmessage = (event) => {
            console.log("WebSocket message received:", event.data);
            const data = JSON.parse(event.data);
            switch (data.action) {
                case "progressUpdate":
                    let percentCompleted = Math.round(data.progress);
                    let previousProgress = prevProgressRef.current || 0;        
                    if (percentCompleted > previousProgress && percentCompleted<=100) {
                        setProgress(percentCompleted);
                    }
                    break;
                case "acknowlement":
                    setConnectionId(data.connectionId);
                    break;
                case "metadata":
                    setFileMetadata(data.metadata);
                    console.log("File Metadata", data.metadata);
                    break;
                case "metadata_error":
                    setFileMetadataError(true);
                    console.log("Metadata Error", data.message);
                    break;
                default:
                    console.log("Unhandled action:", data.action);
            }
        };

        ws.onclose = (event) => {
            console.log("WebSocket connection closed:", event);
            setTransferStarted(false);
        };

        ws.onerror = (error) => {
            console.error("WebSocket error observed:", error);
            setTransferStarted(false);
        };

        setConnection(ws);
    };


    useEffect(() => {
        if(transferLink && connectionId)
        {
            handleTransfer(transferLink)
        }
    }, [transferLink, connectionId])

    useEffect(() => {
        try {
            axios.post(`${API_URL}dropbox-upload/`, {"request_type": "warm-up"}, options);
        } catch (error) {
            console.error("Error during warm up:", error);
        }

        initializeWebSocket();

        return () => {
            if (connection) {
                connection.close();
            }
        };
    }, [])

    useEffect(() => {
        if(fileMetadata && progress>=100)
        {
            handleDropboxUploadComplete(S3Key, keyUploading, transferLink, fileMetadata)
        }
    }, [S3Key, fileMetadata, progress])

    useEffect(() => {
        let currentProgress = Math.round(progress);
        let previousProgress = prevProgressRef.current || 0;

        if (currentProgress > previousProgress && currentProgress<=100) {
            document.getElementById(`uploadProgress_${keyUploading}`).style.width = currentProgress + '%';
            document.getElementById(`uploadProgress_text_${keyUploading}`).innerHTML = currentProgress + '%'; 
            const message = getProgressMessage(currentProgress);
            document.getElementById(`uploadProgressMessage_${keyUploading}`).innerHTML = message;
            prevProgressRef.current = currentProgress;
        }

        if(progress>=100)
        {
            setTransferStarted(false)
            setTransferLink(null);
        }
    }, [progress])

    useEffect(() => {
        if(fileMetadataError) {
            handleFileMetadataError(fileMetadataError, keyUploading);
        }
    }, [fileMetadataError])


    const startTransfer = async (fileLink, s3Key, uid, connectionId, fileType) => {
        const payload = {
            uid: uid,
            dropbox_link: fileLink,
            s3_key: s3Key,
            connection_id: connectionId,
            file_type: fileType,
            request_type: "transfer",
        };

        const progressInterval = setInterval(() => {
            setProgress(prevProgress => {
                if (prevProgress >= 40) {
                    return prevProgress;
                }
                return prevProgress + 0.5;
            });
        }, 500);
    
        try {
            const response = await axios.post(`${API_URL}dropbox-upload/`, payload, options);
            clearInterval(progressInterval);
            console.log("Transfer response:", response.data);
        } catch (error) {
            clearInterval(progressInterval);    
            console.error("Error during transfer:", error);
        }
    };


    const handleTransfer = async (fileLink) => {
        const uid = generateUploadID();
        const fileName = getFilenameFromLink(transferLink);
        const s3Key = `${s3Path}/${fileName}`;
        setS3Key(s3Key);
        if (connection && connection.readyState !== WebSocket.OPEN) {
            setConnectionId(null);
            console.log("WebSocket is not open. Trying to reconnect...");
            initializeWebSocket();

            connection.onopen = (event) => {
                console.log("WebSocket reconnected successfully.");
                startTransfer(fileLink, `media/${s3Key}`, uid, connectionId, fileType);
            };
        } else {
            startTransfer(fileLink, `media/${s3Key}`, uid, connectionId, fileType);
        }
    };

    const handleFileSelect = (files) => {
        if(fileType==="image" && clearArtworkFile) {
            clearArtworkFile();
        }
        document.getElementById(`uploadProgress_${keyUploading}`).style.width = '0%';
        document.getElementById(`uploadProgress_text_${keyUploading}`).innerHTML = '0%';
        setFileMetadataError(false);
        setProgress(0);
        prevProgressRef.current = 0;
        setTransferStarted(true);
        setTransferLink(files[0].link);
    }


    const handleClick = () => {
        if (window.Dropbox) {
            window.Dropbox.choose({
                success: handleFileSelect,
                cancel: () => { },
                linkType: "direct",
                multiselect: false,
                extensions: acceptedExtensions,
            });
        } else {
            console.warn("Dropbox SDK hasn't loaded yet.");
        }
    };


    return (
        <div style={{marginBottom: "15px"}}>
            <center>
            {transferStarted && <div id={`uploadProgressMessage_${keyUploading}`} style={{color: "#000a60", fontWeight: "bold", paddingTop: "15px", paddingBottom: "15px"}}>Downloading File From Dropbox</div>}
            {!transferStarted &&
                <button type="button" className="dropbox-button" onClick={handleClick} disabled={transferStarted}>
                    <img src={DropboxIconSvg} alt="Dropbox Logo" /> Choose from Dropbox
                </button>
            }
            </center>
        </div>
    );
}

export default DropboxChooser;
        