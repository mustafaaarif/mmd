import React, { useState, useCallback, useMemo } from "react";
import AsyncSelect from "react-select/async";
import ProfileImg from "../assets/images/users/1.jpg";

const API_URL = process.env.REACT_APP_API_URL_BASE;

const AsyncDropdownDeezer = ({
  value,
  onChange,
  placeholder = "Search...",
  fetchOptions = {},
  fieldName,
  ...props
}) => {
  const [options, setOptions] = useState([]);


  const CustomOption = useMemo(() => {
    return React.memo(({ innerProps, data, isFocused }) => (
      <div {...innerProps} style={{ 
          padding: '3px',
          backgroundColor: isFocused ? '#f5f5f5' : 'transparent', // Adjust this color for hover
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer'
        }}>
        <img
          src={data.image_small || ProfileImg}
          alt={data.label}
          style={{
            padding: "5px",
            height: '55px',
            width: '55px',
            borderRadius: '30%',
            marginRight: "7px",
          }}
        />
        <b>{data.label}</b>
      </div>
    ));
  }, []);


  const loadOptions = (query, callback) => {
    fetch(`${API_URL}artists/deezer-artist-details/?artist_name=${query}`, fetchOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const formattedData = data.filter(({ name }) => !(name.includes("&") || name.includes("/") || name.includes(","))).map(item => ({ 
          value: item["id"],
          label: item["name"],
          nb_album: item["nb_album"],
          nb_fan: item["nb_fan"],
          image_small: item["picture_small"],
          image_medium: item["picture_medium"],
          image_big: item["picture_big"],
          image_xl: item["picture_xl"],
        }));
        setOptions(formattedData);
        callback(formattedData);
      })
      .catch(error => console.error(error));
  };

  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  const debouncedLoadOptions = useCallback(debounce(loadOptions, 300), []);

  return (
    <AsyncSelect
      cacheOptions
      defaultOptions={options}
      value={value}
      loadOptions={debouncedLoadOptions}
      onChange={onChange}
      placeholder={placeholder}
      components={{
        Option: CustomOption,
      }}
      styles={{
        menu: styles => ({ ...styles, zIndex: 10 }),
      }}
      {...props}
    />
  );
}

export default AsyncDropdownDeezer;