import React from "react"
import Sketch from "react-p5"

let canvasPrnt, dataArr, bufferLength, elementWidth, elementHeight

const AudioVisualizer = ({ audioAnalizer, canvasParenyId }) => {
	//
	// FIRST WAVEFORM
	const setupOne = (p5) => {
		canvasPrnt = document.getElementById(canvasParenyId)
		// Creates canvas and append to parent
		p5
			.createCanvas(
				canvasPrnt.getBoundingClientRect().width,
				canvasPrnt.getBoundingClientRect().height
			)
			.parent(canvasPrnt)
		p5.angleMode(p5.DEGREES)
		elementWidth = canvasPrnt.canvasPrnt.getBoundingClientRect().width
		elementHeight = canvasPrnt.getBoundingClientRect().height
		audioAnalizer.fftSize = 2048
		bufferLength = audioAnalizer.frequencyBinCount
		dataArr = new Float32Array(bufferLength)
		audioAnalizer.smoothingTimeConstant = 0.85
	}
	// Draw function
	const drawOne = (p5) => {
		p5.clear()
		p5.stroke(250)
		p5.strokeWeight(3)
		p5.noFill()
		audioAnalizer.getFloatTimeDomainData(dataArr)
		p5.translate(elementWidth / 2, elementHeight / 2)
		// FIRTS HALF OF CIRCLE
		p5.beginShape()
		for (let i = 0; i < elementWidth; i++) {
			let index = p5.floor(p5.map(i, 0, 180, 0, dataArr.length - 1))
			let r = p5.map(dataArr[index], -1, 1, 150, 350) / 3
			let x = r * p5.sin(i)
			let y = r * p5.cos(i)
			p5.vertex(x, y)
		}
		p5.endShape()
		// SECOND HALF OF CIRCLE
		p5.beginShape()
		for (let i = 0; i < elementWidth; i++) {
			let index = p5.floor(p5.map(i, 0, 180, 0, dataArr.length - 1))
			let r = p5.map(dataArr[index], -1, 1, 150, 350) / 3
			let x = r * -p5.sin(i)
			let y = r * p5.cos(i)
			p5.vertex(x, y)
		}
		p5.endShape()
	}
	//
	// SECOND WAVEFORM
	const setupTwo = (p5) => {
		canvasPrnt = document.getElementById(canvasParenyId)
		// Creates canvas and append to parent
		p5
			.createCanvas(
				canvasPrnt.getBoundingClientRect().width,
				canvasPrnt.getBoundingClientRect().height
			)
			.parent(canvasPrnt)
		elementWidth = canvasPrnt.getBoundingClientRect().width
		elementHeight = canvasPrnt.getBoundingClientRect().height
		audioAnalizer.fftSize = 1024
		bufferLength = audioAnalizer.frequencyBinCount
		dataArr = new Float32Array(bufferLength)
	}
	const drawTwo = (p5) => {
		p5.clear()
		p5.stroke(250)
		p5.strokeWeight(2)
		p5.noFill()
		audioAnalizer.getFloatTimeDomainData(dataArr)

		// HEEEEEEEEEY
		p5.beginShape()
		for (let i = 0; i < elementWidth; i++) {
			let index = p5.floor(p5.map(i, 0, elementWidth, 0, dataArr.length - 1))
			let x = i
			let y = dataArr[index] * 100 + elementHeight / 2
			p5.vertex(x, y)
		}
		p5.endShape()
	}
	//
	// THIRD WAVEFORM
	const setupThree = (p5) => {
		canvasPrnt = document.getElementById(canvasParenyId)
		// Creates canvas and append to parent
		p5
			.createCanvas(
				canvasPrnt.getBoundingClientRect().width,
				canvasPrnt.getBoundingClientRect().height / 4
			)
			.parent(canvasPrnt)
		elementWidth = canvasPrnt.getBoundingClientRect().width
		elementHeight = canvasPrnt.getBoundingClientRect().height / 4
		audioAnalizer.fftSize = 512
		bufferLength = audioAnalizer.frequencyBinCount
		dataArr = new Uint8Array(bufferLength)
	}
	// Hola
	//
	const drawThree = (p5) => {
		p5.colorMode("HSB")
		p5.clear()
		p5.stroke(0)
		p5.strokeWeight(0.3)
		p5.fill("rgba(56, 166, 229, 0.8)")

		audioAnalizer.getByteFrequencyData(dataArr)
		for (let i = 0; i < 80; i++) {
			let amp = dataArr[i]
			let y = p5.map(amp, 0, 300, elementHeight, 0)
			let w = elementWidth / 80
			p5.rect(i * w, y, w, elementHeight - y)
		}
	}
	const windowDefault = (p5) => {
		p5.resizeCanvas(
			canvasPrnt.getBoundingClientRect().width,
			canvasPrnt.getBoundingClientRect().height
		)
		elementWidth = canvasPrnt.getBoundingClientRect().width
		elementHeight = canvasPrnt.getBoundingClientRect().height
	}
	const windowThree = (p5) => {
		p5.resizeCanvas(
			canvasPrnt.getBoundingClientRect().width,
			canvasPrnt.getBoundingClientRect().height / 4
		)
		elementWidth = canvasPrnt.canvasPrnt.getBoundingClientRect().width
		elementHeight = canvasPrnt.getBoundingClientRect().height / 4
	}
	const audioVis = {
		one: { setup: setupOne, draw: drawOne, window: windowDefault },
		two: { setup: setupTwo, draw: drawTwo, window: windowDefault },
		three: { setup: setupThree, draw: drawThree, window: windowThree },
	}
	return (
		<Sketch
			setup={audioAnalizer.getFloatTimeDomainData ? audioVis.two.setup : audioVis.three.setup}
			draw={audioAnalizer.getFloatTimeDomainData ? audioVis.two.draw : audioVis.three.draw}
			windowResized={
				audioAnalizer.getFloatTimeDomainData ? audioVis.two.window : audioVis.three.window
			}
		></Sketch>
	)
}

export default React.memo(AudioVisualizer)
