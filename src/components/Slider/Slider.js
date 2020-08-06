import React, {useState} from 'react';
import './Slider.css';
import Switch from 'react-ios-switch';

const Slider = () => {

	//If we want the slider curved or not
	const [curved, setCurved] = useState(true);

	//Holds the index of selected card
	const [selected, setSelected] = useState(0);		

	//Performs actions when a card is selected
	const selectIndex = (index) => {
		setSelected(index);
	}
	
	//Dummy card data
	let cardData = [1,2,3,4,5,6,7];

	//A function which maps the card data into a list of divs
	let cardList = cardData.map((e, index) => {

		let className = "slider-card";
		let dimmerClass = "slider-card-dimmer active";

		let transform;
		let left = "50%";

		//If this is our selected card
		if(index === selected)
		{
			transform = "translate(-50%, -50%) scale(1)"
			className = "slider-card selected"
			dimmerClass = "slider-card-dimmer"
		}

		//The cards to the right of the selected card
		else if(index > selected)
		{
			if(curved)
				transform = `translate(calc(-50% + ${(index - selected) * 84}% - ${Math.pow(1.51, (index - selected))}px), calc(-53% + ${Math.pow((index - selected + 1),2.4)}%)) scale(0.8) rotate(${0 + (index - selected)*6}deg)`
			else
				transform = `translate(calc(-50% + ${(index - selected) * 100}%), -50%) scale(0.8)`
		}

		//The cards to the left of the selected card
		else{
			if(curved)
				transform = `translate(calc(-50% - ${(selected - index) * 84}% + ${Math.pow(1.51, (selected - index))}px), calc(-53% + ${Math.pow((selected - index + 1),2.4)}%)) scale(0.8) rotate(${0 - (selected - index)*6}deg)`
			else
				transform = `translate(calc(-50% - ${(selected - index) * 100}%), -50%) scale(0.8)`
		}
			
		//Final card with all the styles applied
		return <div style = {{ "transform" : transform, "left" : left}} onClick = {()=>selectIndex(index)} key = {index} className = {className} >
			{e}
			<div className = {dimmerClass} />
	</div>});

	//A function which generates the slider selection dots and adds curve based on top-margin
	let sliderNavDots = cardList.map(
		(e, index, arr) =>{
			let className = `slider-nav-item`

			if(index === selected)
				className = className + ' active';

			//The top margin responsible for curving list points
			let marginTop = '0px';
			
			if(curved)
			{
				//Mid point index (We find this because the middle dot will be the center of the curve)
				let midPoints;
				if ((arr.length % 2) === 1) midPoints = [(arr.length-1)/2]
				else midPoints = [(arr.length/2) - 1, (arr.length/2)]

				let indexLessThanMidPoints = midPoints.every(e => (e > index));	
				let indexGreaterThanMidPoints = midPoints.every(e => (e < index));

				let average = (array) => array.reduce((a, b) => a + b) / array.length;
				let midPointAverage = average(midPoints);

				//Decide top margin based on distance from the center to generate curve
				if(midPoints.includes(index)) 
					marginTop = '0px';
				else if (indexLessThanMidPoints)
					marginTop = `${Math.pow(2.8, (midPointAverage - index)) - 1}px`;
				else if (indexGreaterThanMidPoints)
					marginTop = `${Math.pow(2.8, (index - midPointAverage)) - 1}px`;
			}

			//Final selection dot with all the styles applied
			return <li style = {{"marginTop" : marginTop}} onClick = {()=>selectIndex(index)} 
			key = {index} className = {className} />
		})		
	
	return (
		<div className = "slider">
			<div className = "slider-curved-label">Toggle Curve</div>
			<Switch className = "slider-curve-toggle" checked={curved} onChange={setCurved}/>
			<div className = "slider-card-container">
				{cardList}
			</div>
			<ul className = "slider-nav">
			    {sliderNavDots}
	    	</ul>
		</div>
		);
}

export default Slider;