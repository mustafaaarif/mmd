
import React, { useState } from 'react';
import reactCSS from 'reactcss';
import { TwitterPicker, ChromePicker } from 'react-color';


const CustomColorPickerInput = ({color, setColor}) => {
    const [displayColorPicker, setDisplayColorPicker] = useState(false);
    const handleClick = () => {
      setDisplayColorPicker(!displayColorPicker)
    };
    const handleClose = () => {
      setDisplayColorPicker(false)
    };
    const handleChange = (color) => {
      setColor(color.hex);
    };

    const styles = reactCSS({
        'default': {
          color: {
            width: '30px',
            height: '30px',
            borderRadius: '2px',
            background: `${color}`,
          },
          swatch: {
            padding: '5px',
            background: '#fff',
            borderRadius: '1px',
            boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
            display: 'inline-block',
            cursor: 'pointer',
          },
          popover: {
            position: 'absolute',
            zIndex: '2',
          },
          cover: {
            position: 'fixed',
            top: '0px',
            right: '0px',
            bottom: '0px',
            left: '0px',
          },
        },
      });

    return (
      <div>
        <div style={ styles.swatch } onClick={ handleClick }>
            <div style={ styles.color } />
        </div>
        { displayColorPicker ? <div style={ styles.popover }>
            <div style={ styles.cover } onClick={ handleClose }/>
            <div style={{display: "flex", alignItems: "right", width: "100%"}}>
                <ChromePicker
                color={color}
                onChange={handleChange}
                disableAlpha={true}
                />
                <TwitterPicker
                color={color}
                onChange={handleChange}
                triangle="hide"
                />
            </div>
        </div> : null }
      </div>
    )
}

export default CustomColorPickerInput;