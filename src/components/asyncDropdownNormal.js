import React, { useState, useEffect } from "react";
import AsyncSelect from "react-select/async";

const API_URL = process.env.REACT_APP_API_URL_BASE;

const AsyncDropdownNormal = ({
  value,
  onChange,
  placeholder = "Search...",
  endpoint,
  subUserEndpoint,
  parentUserOnly,
  fetchOptions = {},
  labelField,
  valueField = "id",
  fieldName,
  ...props
}) => {
  const [options, setOptions] = useState([]);

  const loadOptions = (query, callback) => {
    fetch(`${API_URL}${endpoint}/${subUserEndpoint}?search=${query}${parentUserOnly}`, fetchOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const formattedData = data.results.map(item => ({ 
          value: item[valueField],
          label: item[labelField]
        }));
        callback(formattedData);
        setOptions(formattedData);
      })
      .catch(error => console.error(error));
  };

  useEffect(() => {
    loadOptions('', options => setOptions(options));
  }, [subUserEndpoint]);

  return (
    <AsyncSelect
      key={subUserEndpoint}
      cacheOptions
      defaultOptions={options}
      value={value}
      loadOptions={loadOptions}
      onChange={onChange}
      placeholder={placeholder}
      styles={{
        menu: styles => ({ ...styles, zIndex: 10 }),
      }}
      {...props}
    />
  );
}

export default AsyncDropdownNormal;