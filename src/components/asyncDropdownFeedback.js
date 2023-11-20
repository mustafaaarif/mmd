import React, { useState, useEffect } from "react";
import AsyncSelect from "react-select/async";

const API_URL = process.env.REACT_APP_API_URL_BASE;

const AsyncDropdownFeedback = ({
  value,
  onChange,
  placeholder = "Search...",
  endpoint,
  subUserEndpoint,
  parentUserOnly,
  fetchOptions = {},
  labelField,
  valueField = "id",
  isFieldValid=true,
  fieldTouched=false,
  showValidFeedback=true,
  setFieldTouched,
  revalidateField,
  fieldName,
  ...props
}) => {
  const [options, setOptions] = useState([]);

  const borderColor = fieldTouched ? (isFieldValid ? "#2dce89": "#f62d51"): "#e9ecef";

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
      onFocus={() => {
        if(showValidFeedback) {
          setFieldTouched(true)
          if(fieldName && revalidateField) {
            revalidateField(fieldName)
          }
        }
      }}
      onMouseEnter={() => {
        if(showValidFeedback) {
          setFieldTouched(true)
          if(fieldName && revalidateField) {
            revalidateField(fieldName)
          }
        }
      }}
      placeholder={placeholder}
      styles={{
        menu: styles => ({ ...styles, zIndex: 10 }),
        control: (baseStyles, state) => ({
          ...baseStyles,
          borderColor: (fieldTouched && showValidFeedback) ? borderColor : baseStyles.borderColor,
          boxShadow: (state.isFocused || state.isHovered) && showValidFeedback
            ? (isFieldValid ? "0 0 0 0.2rem rgba(45, 206, 137, 0.25)" : "0 0 0 0.2rem rgba(246, 45, 81, 0.25)") 
            : "0 0 0 1px #e9ecef",
          borderRadius: "2px",
        }),
      }}
      {...props}
    />
  );
}

export default AsyncDropdownFeedback;