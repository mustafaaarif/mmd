import slugify from 'slugify';
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL_BASE;
const X_API_KEY = process.env.REACT_APP_X_API_KEY;

export const getElByKey = (el, elKey) => el.filter(i => i.key === elKey)

export const validateSongs = (list, nameArray) => {
  let songsErrors = 0;
  list.map(i => {
      const key = i.key;

       return nameArray.map(item => {
        if (item === "song_genre") {
          if (i["genre"] === "" || typeof i["genre"] === 'undefined') {
            document.getElementById(`err_${item}_${key}`).style.display = 'block';
            songsErrors += 1;
          }
          else if (i["genre"] !== "" && typeof i["genre"] !== 'undefined' && i["genre"].length > 50) {
            document.getElementById(`err_${item}_length_${key}`).style.display = 'block'; 
          } else {
            document.getElementById(`err_${item}_${key}`).style.display = 'none';
          }
        }
        else if (item === "song_tag") {
          if (i["tag"] === "" || typeof i["tag"] === 'undefined') {
            document.getElementById(`err_${item}_${key}`).style.display = 'block';
            songsErrors += 1;
          } else if (i["genre"] !== "" && typeof i["genre"] !== 'undefined' && i["genre"].length > 50) {
            document.getElementById(`err_${item}_length_${key}`).style.display = 'block'; 
          } else {
            document.getElementById(`err_${item}_${key}`).style.display = 'none';
          }
        }
        else if (item === "song_preset") {
          if (i["preset"] === "" || typeof i["preset"] === 'undefined') {
            document.getElementById(`err_${item}_${key}`).style.display = 'block';
            songsErrors += 1;
          }
          else {
            document.getElementById(`err_${item}_${key}`).style.display = 'none';              
          }
        }
        else if (item === "song_file") {
          if (i["base_file"] === "" || typeof i["base_file"] === 'undefined') {
            document.getElementById(`err_${item}_${key}`).style.display = 'block';
            songsErrors += 1;
          } else {
            document.getElementById(`err_${item}_${key}`).style.display = 'none';
          }
        }
      })
    })
  return songsErrors;
}


export const uploadS3 = async(file, token, keyUploading, fileType = 'wav', path = 'mastering/input/') => {
  const fileName = file.name;
  const nameSlugify =  slugify(fileName, {remove: /[\,\.\<\>\:\;\"\'\|\[\]\{\}\!\?\@\#\$\%\^\&\*\(\)\=\+\/\\]/g});
  document.getElementById(`song_${keyUploading}`).disabled = true;

  return axios({
    method: "GET",
    mode: 'cors',
    url: `${API_URL}obtain-signed-url-for-upload/?filename=${path}${nameSlugify}.${fileType}&filetype=${fileType}`,
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      "x-api-key": X_API_KEY,
    }
  }).then(function(response) {
    const URL = response.data.signed_url.url;
    const full_URL= response.data.signed_url.fields.key;
    const signedOpts = response.data.signed_url.fields;
    var options = {
      mode: 'cors',
      headers: {
        "Content-Type": fileType
      },
      onUploadProgress: function(progressEvent) {
        var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        document.getElementById(`uploadProgress_${keyUploading}`).style.width = percentCompleted + '%';
        document.getElementById(`uploadProgress_text_${keyUploading}`).innerHTML = percentCompleted + '%'; 
      },
    };
    var postData = new FormData();
    for (let i in signedOpts) {
      postData.append(i, signedOpts[i]);
    }
    postData.append("file", file);

    return axios
      .post(URL, postData, options)
      .then(result => {
        return full_URL
      })
      .catch(error => {
        return null
      });
  })
}
