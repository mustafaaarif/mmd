import { useState, useEffect } from "react";
import {authenticationService} from "../jwt/_services/authentication.service";

const API_URL = process.env.REACT_APP_API_URL_BASE;
const X_API_KEY = process.env.REACT_APP_X_API_KEY;

function useFetch(method, url, token, body, onChange = false) {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const correct_url = API_URL + url;
  let options;

  if (method === 'GET') {
    options = {
      'method': method,
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${token}`,
        "x-api-key": X_API_KEY,
        'Content-Type': 'application/json'
      }
    }
  } else {
    options = {
      'method': method,
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${token}`,
        "x-api-key": X_API_KEY,
        'Content-Type': 'application/json'
      },
      body: { body }
    }
  }

  const fetchUrl = async () => {
    setLoading(true);
    if (!token) return false;
    try {
      const response = await fetch(correct_url, options);
      if (response.status === 401) {
        authenticationService.logout();
        return false;
      }
      const json = await response.json();
      setData(json);
      setLoading(false);
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    fetchUrl();
    // eslint-disable-next-line
  }, [onChange]);
  return [data, error, loading];
}
export { useFetch };