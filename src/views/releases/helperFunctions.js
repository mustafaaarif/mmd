import * as mmb from 'music-metadata-browser';
import slugify from 'slugify';
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL_BASE;
const X_API_KEY = process.env.REACT_APP_X_API_KEY;

export const getElByKey = (el, elKey) => el.filter(i => i.key === elKey)

export const checkRowSelector = (list, nameArray) => {
  let artistErrors = 0;
  list.map(i => {
      const key = i.key;
       return nameArray.map(item => {
        if (item === "track_mix_name") {
          var sel = document.getElementById(`track_mix_select_${key}`).value;
          if (sel === '0' || sel === '1') {
            if (i[item] === "" || typeof i[item] === 'undefined') {
              document.getElementById(`err_${item}_${key}`).style.display = 'block'
              return artistErrors += 1;
            } else {
              document.getElementById(`err_${item}_${key}`).style.display = 'none';
              return false;
            }
          } else {
            return false;
          }
        } else if(item === "publisher_author") {
          const reg = new RegExp(/^([A-Z][a-zA-Z]{2,19}\s[a-zA-Z]{1,19}'?-?[a-zA-Z]{2,25}\s?([A-Z][a-zA-Z]{1,25})?)/)
          if (i[item] === "" || typeof i[item] === 'undefined' || reg.test(i[item]) === false) {
            document.getElementById(`err_${item}_${key}`).style.display = 'block'
            return artistErrors += 1;
          } else {
            document.getElementById(`err_${item}_${key}`).style.display = 'none';
            return false;
          }

        } else {
          if (i[item] === "" || typeof i[item] === 'undefined') {
            document.getElementById(`err_${item}_${key}`).style.display = 'block'
            return artistErrors += 1;
          } else {
            document.getElementById(`err_${item}_${key}`).style.display = 'none';
            return false;
          }
        }

      })
    })
  return artistErrors;
}

export const checkTrackURL = (list, listDetails) => {
  let artistErrors = 0;

  list.map(i => {
      const keyList = i.key;
      const keyDetails = getElByKey(listDetails, i.key)[0];
      if (keyDetails && (keyList === keyDetails.key)) {
       if (keyDetails.URL) {
        document.getElementById(`err_track_file_${keyList}`).style.display = 'none';
        return false;
       } else {
        document.getElementById(`err_track_file_${keyList}`).style.display = 'block'
        return artistErrors += 1;
       }
      } else {
        document.getElementById(`err_track_file_${keyList}`).style.display = 'block'
        return artistErrors += 1;
      }
    })
  return artistErrors;
}

const computeLength = (file) =>{
  return new Promise(async (resolve) => {
    try {
      const metadata = await parseFile(file);
      
      const {bitsPerSample, sampleRate, numberOfChannels, duration } = metadata.format;
      const size = (bitsPerSample * sampleRate * numberOfChannels * duration) / 8000000;  // 8 * 1000 * 1000
      //eslint-disable-next-line
      if (bitsPerSample === 16 && sampleRate === 44100 && size < 159) {
        resolve({
          valid: (bitsPerSample === 16 && sampleRate === 44100 && size < 159),
          meta: {
            bitsPerSample: bitsPerSample,
            sampleRate: sampleRate,
            size: size,
            duration: duration
          },
        });
      } else {
        resolve({
          valid: false,
          message: `The track has to be WAV format only, 16 bit and 44.1 kHz. Max file size is 159 MB. Your was ${bitsPerSample} bit, ${(sampleRate/1000).toFixed(1)} Hz and ${size} MB.`
        });
      }
  } catch (error) {
    console.log("Error: ", error)
    resolve({
      valid: false,
      message: 'This file is invalid, please make sure to properly encode your file in 16 bit, 44.1 kHz.',
    });
  }
});
};

const parseFile = async(file) => mmb.parseBlob(file, {native: true}).then(metadata => metadata);

export const uploadS3 = async(file, token, keyUploading, fileType = 'wav', path = '/direct/wav_tracks/') => {
  const fileName = file.name;
  const nameSlugify =  slugify(fileName, {remove: /[\,\.\<\>\:\;\"\'\|\[\]\{\}\!\?\@\#\$\%\^\&\*\(\)\=\+\/\\]/g});
  document.getElementById(`track_${keyUploading}`).disabled = true;

  return axios({
    method: "GET",
    mode: 'cors',
    url: `${API_URL}obtain-signed-url-for-upload/?filename=media${path}${nameSlugify}.${fileType}&filetype=${fileType}`,
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      "x-api-key": X_API_KEY,
    }
  }).then(function(response) {
    const URL = response.data.signed_url.url;
    const full_URL= response.data.signed_url.fields.key.split('media/')[1];
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
export const releaseArtworkUpload = (file, token, ID) => {
  const fileName = file.name;
  const nameSlugify =  slugify(fileName, {remove: /[\,\.\<\>\:\;\"\'\|\[\]\{\}\!\?\@\#\$\%\^\&\*\(\)\=\+\/\\]/g})
  const splited = fileName.split('.');
  const fileType = fileName.split('.')[splited.length - 1];

  return axios({
    method: "GET",
    url: `${API_URL}obtain-signed-url-for-upload/?filename=media/direct/release_artwork/${nameSlugify}.${fileType}&filetype=${fileType}`,
    headers: {
      Authorization: `Bearer ${token}`,
      "x-api-key": X_API_KEY,
    }
  }).then(function(response) {
    const URL = response.data.signed_url.url;
    const full_URL= response.data.signed_url.fields.key;
    let split = full_URL.split('/');
    split.shift();
    let transformedURL = split.join('/');

    const signedOpts = response.data.signed_url.fields;
    var options = {
      mode: 'cors',
      headers: {
        "Content-Type": fileType
      }
    };
    var postData = new FormData();
    for (let i in signedOpts) {
      postData.append(i, signedOpts[i]);
    }
    postData.append("file", file);
   
    return axios
      .post(URL, postData, options)
      .then(result => {
        return transformedURL;
      })
      .catch(error => {
        return null
      });
  })
}

export const checkTrackValidation = (e) => computeLength(e).then(msg => msg);


export const checkDropboxReleaseArtworkFileValidation = (metadata) => {
  const { mode, size, width, height } = metadata;
  const isRGB = (mode === "RGB");
  const sizeUpto4MB = (size <= 4);
  const validDimensions = (height === 3000 && width === 3000);
  const isValid = isRGB && sizeUpto4MB && validDimensions;
  let validationMessage = "Invalid Image, Please upload cover in 3000x3000 px, JPG ('.jpg' extension only), RGB colours, max file size 4 MB, The uploaded file has ";

  if (!isRGB) {
    validationMessage += `Image Colours in ${mode} format`
  }

  if (!sizeUpto4MB) {
    validationMessage += !isRGB? `, ${size} MB File Size`: ` ${size} MB File Size`;
  }

  if (!validDimensions) {
    validationMessage += 
    validationMessage += (!isRGB || !sizeUpto4MB)?`, Dimensions ${height}x${width} px.`: ` Dimensions ${height}x${width} px.`;
  }

  if (isValid) {
    return {
        valid: true,
        meta: {
          mode,
          size,
          height,
          width,
        }
    };
  } else {
    return {
        valid: false,
        message: validationMessage
    };
  }
}


export const checkDropboxTrackFileValidation = (metadata) => {
  const { bitsPerSample, sampleRate, size, duration } = metadata;

  const isValid = bitsPerSample === 16 && sampleRate === 44100 && size < 159;

  if (isValid) {
      return {
          valid: true,
          meta: {
            bitsPerSample,
            sampleRate,
            size,
            duration
          }
      };
  } else {
      return {
          valid: false,
          message: `The track has to be WAV format only, 16 bit and 44.1 kHz. Max file size is 159 MB. Your was ${bitsPerSample} bit, ${(sampleRate / 1000).toFixed(1)} kHz and ${size} MB.`
      };
  }
}

export const checkCatalogNumber = (name, token, setErrorDupl, initialNO = null) => {
  const options = {
    method: "POST",
    mode: 'cors',
    headers: {
      Authorization: `Bearer ${token}`,
      "x-api-key": X_API_KEY,
      "Content-Type": "application/json"
    }
  };

  axios.get(`${API_URL}releases/?search=${name}`, options).then(res => {
    
    if (res.status === 200){
      const list = res.data.results.length > 0 ? res.data.results : [];
      if (list.length > 0) {
        if (initialNO && ( initialNO === name)) {
          setErrorDupl(null)
        } else {
          const getOne = list.filter(i => i.catalogue_number === name);
          if (getOne.length > 0) {
            setErrorDupl(name);
          } else {
            setErrorDupl(null)
          }
        }
      } else {
        setErrorDupl(null)
        return;
      }
    }
  })
}

export const checkCatalogNumberReturn = (name, token, setErrorDupl, initialNO = null) => {
  const options = {
    method: "POST",
    mode: 'cors',
    headers: {
      Authorization: `Bearer ${token}`,
      "x-api-key": X_API_KEY,
      "Content-Type": "application/json"
    }
  };

  const req =  axios.get(`${API_URL}releases/?search=${name}`, options).then(res => {
    
    if (res.status === 200){
      const list = res.data.results.length > 0 ? res.data.results : [];
      if (list.length > 0) {
        if (initialNO && ( initialNO === name)) {
          setErrorDupl(null)
          return false;
        } else {
          const getOne = list.filter(i => i.catalogue_number === name);
          if (getOne.length > 0) {
            setErrorDupl(name);
            return true
          } else {
            setErrorDupl(null)
            return false;
          }
        }
      } else {
        setErrorDupl(null)
        return false;
      }
    }
  })


  return req;
}