import React, { useState, useEffect, useRef } from 'react';
import { Collapse, Label, FormGroup, Input, Col } from 'reactstrap';
import CountriesJSON from "../utils/countriesExtended.json"

const CheckboxItem = ({dataItem, selVal, allData, readOnly}) => {
  const {selected, setSelected} = selVal;
  const {data, setData} = allData;
 
  const toggleSelect = (isAdded, id) => {
    if (isAdded) {
      setData(data.map( i => i.label === dataItem.label ? ({label: i.label, value: i.value, continent: i.continent, isChecked: true}) : i))
      setSelected([...selected, id]);
    } else {
      setData(data.map( i => i.label === dataItem.label ? ({label: i.label, value: i.value, continent: i.continent, isChecked: false}) : i))
      setSelected(selected.filter(i => i.label !== id.label))
    }
  }

  return (
    <Col xs="12" sm="6" md="4" lg="3">
      <FormGroup check style={{margin: "0 0 10px 0"}}>
      <Label check>
        <input
          type="checkbox"
          id={`country_${dataItem.label}`}
          disabled={readOnly}
          checked={selected.filter( i => i.label === dataItem.label).length === 1 ? true : false}
          onChange={(e) => toggleSelect(e.target.checked, dataItem)}
        />{" "}
        {dataItem.label}
      </Label>
    </FormGroup>
    </Col>
  )
}

const CountryItem = ({name, total, selVal}) => {
  const [visible, toggleVisible] = useState(false);
  const {selected, setSelected, setCountries, countries, readOnly} = selVal;
  const [data, setData] = useState(countries.filter(i => i.continent === name));

  const selectedOnContinent = selected.filter( i => i.continent === name);


  const toggleSelectAll = (isAdded) => {
    if (isAdded) {
      const selectedData = data.map(i => ({label: i.label, value: i.value, continent: i.continent, isChecked: true}));
      setData(selectedData)
      setSelected([...selected.filter(i => i.continent !== name), ...selectedData]);
      
    } else {
      setData(data.map(i => ({label: i.label, value: i.value, continent: i.continent, isChecked: false})));
      setSelected(selected.filter(i => i.continent !== name));
      setCountries(countries.map(i => {
        if (i.continent === name) {
          return ({label: i.label, value: i.value, continent: i.continent, isChecked: false})
        } else {
          return i;
        }
      }))
    }
  }

  useEffect(() => {
    setData(countries.filter(i => i.continent === name))
  }, [countries])

  return (
    <div>
        <FormGroup check style={{margin: "0 0 20px 0", display: 'flex', alignItems: 'center', padding: 0}}>
          <Label check>
            {
              readOnly ?
              <input
                type="checkbox"
                id={`continent_${name}`}
                checked={data.isChecked}
                disabled={true}
              />
              :
              <input
              type="checkbox"
              id={`continent_${name}`}
              checked={data.isChecked}
              onChange={(e) => toggleSelectAll(e.target.checked)}
            />
            }
           {" "}
          </Label>
          <p style={{fontSize: '14px', margin: 0, padding: '10px 0', cursor: 'pointer'}} onClick={() => toggleVisible(!visible)}>{name} ({total} total, {selectedOnContinent.length} included)</p>
        </FormGroup>
        <Collapse isOpen={visible} >
          <div style={{display: "flex",flexWrap: "wrap"}}>
            {
              data.map( i => {
                return <CheckboxItem dataItem={i} allData={{data, setData}} key={i.label} selVal={selVal} readOnly={readOnly}/>
              })
            }
          </div>
        </Collapse>
    </div>
  )
}

const CountriesSelect = ({selected = [], setSelected, disabled, readOnly = false}) => {
  const isFirstRun = useRef(true);
  const [countries, setCountries] = useState(CountriesJSON);
  const total_asia = CountriesJSON.filter(i => i.continent === 'Asia').length;
  const total_africa = CountriesJSON.filter(i => i.continent === 'Africa').length;
  const total_america_n = CountriesJSON.filter(i => i.continent === 'North America').length;
  const total_america_s = CountriesJSON.filter(i => i.continent === 'South America').length;
  const total_europe = CountriesJSON.filter(i => i.continent === 'Europe').length;
  const total_oceania = CountriesJSON.filter(i => i.continent === 'Oceania').length;

  const filterFunc = (e) => {
    const letters = e.toLowerCase();
    return CountriesJSON.filter(i => i.label.toLowerCase().includes(letters))
  }

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    if (disabled) {
      setSelected(countries);
    } else {
      setSelected([]);
    }
  }, [disabled])

  return (
    <div>
      <FormGroup>
        <Input
          type="search"
          name="search"
          id="searchCountry"
          placeholder="Search country..."
          onChange={(e) => setCountries(filterFunc(e.target.value))}
          disabled={readOnly}
        />
      </FormGroup>


      <CountryItem name="Asia" total={total_asia} selVal={{selected, setSelected, setCountries, countries, disabled, readOnly}}/>
      <CountryItem name="Africa" total={total_africa} selVal={{selected, setSelected, setCountries, countries, disabled, readOnly}}/>
      <CountryItem name="North America" total={total_america_n} selVal={{selected, setSelected, setCountries, countries, disabled, readOnly}}/>
      <CountryItem name="South America" total={total_america_s} selVal={{selected, setSelected, setCountries, countries, disabled, readOnly}}/>
      <CountryItem name="Europe" total={total_europe} selVal={{selected, setSelected, setCountries, countries, disabled, readOnly}}/>
      <CountryItem name="Oceania" total={total_oceania} selVal={{selected, setSelected, setCountries, countries, disabled, readOnly}}/>
    </div>
  );
};

export default CountriesSelect;