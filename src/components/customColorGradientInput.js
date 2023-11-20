
import React, { useState, useEffect } from 'react';
import reactCSS from 'reactcss';
import { TwitterPicker, ChromePicker } from 'react-color';

let gradientDegreeDict = {
    1: "180deg",
    2: "90deg",
    3: "135deg",
    4: "225deg",
    5: "270deg",
    6: "0deg"
};

const CustomColorPickerGradient = ({gradient, setGradient}) => {

    const [startColor, setStartColor] = useState("#b40bbe");
    const [endColor, setEndColor] = useState("#000a60");
    const [gradientDirection, setGradientDirection] = useState(1);
    const [gradientType, setGradientType] = useState("0deg");

    const [displayStartColorPicker, setDisplayStartColorPicker] = useState(false);
    const [displayEndColorPicker, setDisplayEndColorPicker] = useState(false);

    useEffect(() => {
        if(gradient)
        {   
            setStartColor(gradient.first_color)
            setEndColor(gradient.second_color)
            setGradientDirection(gradient.direction)
            setGradientType(gradientDegreeDict[gradient.direction])
        }
    }, [gradient]);

    const handleStartColorClick = () => {
        setDisplayStartColorPicker(!displayStartColorPicker)
    };

    const handleStartClose = () => {
        setDisplayStartColorPicker(!displayStartColorPicker)
    };

    const handleStartColorChange = (updatedStartColor) => {
        setGradient({
            "first_color": updatedStartColor.hex,
            "second_color": endColor,
            "direction": gradientDirection,
        })
    };

    const handleEndColorClick = () => {
        setDisplayEndColorPicker(!displayEndColorPicker)
    };

    const handleEndClose = () => {
        setDisplayEndColorPicker(!displayEndColorPicker)
    };

    const handleEndColorChange = (updatedEndColor) => {
        setGradient({
            "first_color": startColor,
            "second_color": updatedEndColor.hex,
            "direction": gradientDirection,
        })
    };

    const styles = reactCSS({
        'default': {
          startColor: {
            width: '30px',
            height: '30px',
            borderRadius: '2px',
            background: `${startColor}`,
          },
          endColor: {
            width: '30px',
            height: '30px',
            borderRadius: '2px',
            background: `${endColor}`,
          },
          gradient: {
            width: '160px',
            height: '30px',
            borderRadius: '2px',
            background: `linear-gradient(${gradientType}, ${startColor}, ${endColor}`,
          },
          swatch: {
            padding: '1px',
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
          gradientCircleBtn: {
            cursor: "pointer",
            height: "30px",
            width: "30px",
            margin: "3px",
            paddingTop: "0px",
            paddingLeft: "4px",
            borderRadius: "15px",
            border: "2px solid #e9ecef",
          },
          gradientCircleBtnSelected: {
            cursor: "pointer",
            height: "30px",
            width: "30px",
            margin: "3px",
            paddingTop: "0px",
            paddingLeft: "4px",
            borderRadius: "15px",
            color: "#000a60",
            border: "2px solid #000a60",
          }
        },
      });

    return (
        <div>
        <div style={ styles.swatch } onClick={ handleStartColorClick }>
            <div style={ styles.startColor } />
        </div>
        <div style={ styles.swatch } >
            <div style={ styles.gradient } />
        </div>
        <div style={ styles.swatch } onClick={ handleEndColorClick }>
            <div style={ styles.endColor } />
        </div>

        <div style={{display: "flex", alignItems: "center", width: "100%", marginLeft: "5px"}}>
            <div style={gradientDirection === 1? styles.gradientCircleBtnSelected: styles.gradientCircleBtn} className="mdi mdi-18px mdi-arrow-down gradientCircleBtn"
                onClick={()=> {
                    setGradient({
                        "first_color": startColor,
                        "second_color": endColor,
                        "direction": 1,
                    })
                }}
            >
            </div>
            <div style={gradientDirection === 2? styles.gradientCircleBtnSelected: styles.gradientCircleBtn} className="mdi mdi-18px mdi-arrow-right gradientCircleBtn"
                onClick={()=> {
                    setGradient({
                        "first_color": startColor,
                        "second_color": endColor,
                        "direction": 2,
                    })
                }}
            ></div>
            <div style={gradientDirection === 3? styles.gradientCircleBtnSelected: styles.gradientCircleBtn} className="mdi mdi-18px mdi-arrow-bottom-right gradientCircleBtn"
                onClick={()=> {
                    setGradient({
                        "first_color": startColor,
                        "second_color": endColor,
                        "direction": 3,
                    })
                }}
            ></div>
            <div style={gradientDirection === 4? styles.gradientCircleBtnSelected: styles.gradientCircleBtn} className="mdi mdi-18px mdi-arrow-bottom-left gradientCircleBtn"
                onClick={()=> {
                    setGradient({
                        "first_color": startColor,
                        "second_color": endColor,
                        "direction": 4,
                    })
                }}
            ></div>
            <div style={gradientDirection === 5? styles.gradientCircleBtnSelected: styles.gradientCircleBtn} className="mdi mdi-18px mdi-arrow-left gradientCircleBtn"
                onClick={()=> {
                    setGradient({
                        "first_color": startColor,
                        "second_color": endColor,
                        "direction": 5,
                    })
                }}
            ></div>
            <div style={gradientDirection === 6? styles.gradientCircleBtnSelected: styles.gradientCircleBtn} className="mdi mdi-18px mdi-arrow-up gradientCircleBtn"
                onClick={()=> {
                    setGradient({
                        "first_color": startColor,
                        "second_color": endColor,
                        "direction": 6,
                    })
                }}
            ></div>
        </div>
        { displayStartColorPicker ? <div style={ styles.popover }>
            <div style={ styles.cover } onClick={ handleStartClose }/>
            <div style={{display: "flex", alignItems: "right", width: "100%"}}>
                <ChromePicker
                color={startColor}
                onChange={handleStartColorChange}
                disableAlpha={true}
                />
                <TwitterPicker
                color={startColor}
                onChange={handleStartColorChange}
                triangle="hide"
                />
            </div>
        </div> : null }
        { displayEndColorPicker ? <div style={ styles.popover }>
            <div style={ styles.cover } onClick={ handleEndClose }/>
            <div style={{display: "flex", alignItems: "right", width: "100%"}}>
                <ChromePicker
                color={endColor}
                onChange={handleEndColorChange}
                disableAlpha={true}
                />
                <TwitterPicker
                color={endColor}
                onChange={handleEndColorChange}
                triangle="hide"
                />
            </div>
        </div> : null }
        </div>
    )
}

export default CustomColorPickerGradient;