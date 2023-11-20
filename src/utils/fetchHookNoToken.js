import { useState, useEffect } from "react";

const API_URL = process.env.REACT_APP_API_URL_BASE;
const X_API_KEY = process.env.REACT_APP_X_API_KEY;

function useBasicFetch(method, url, body) {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  
  const correct_url = API_URL + url;
  let options;

  if (method === 'GET') {
    options = {
      'method': method,
      headers: {
        'x-api-key': X_API_KEY,
        'Content-Type': 'application/json',
      }
    }
  } else {
    options = {
      'method': method,
      headers: {
        'x-api-key': X_API_KEY,
        'Content-Type': 'application/json'
      },
      body: { body }
    }
  }

  const fetchUrl = async () => {
    setLoading(true);
    try {
      const response = await fetch(correct_url, options);
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
  }, []);
  return [data, error, loading];
}
export { useBasicFetch };