import React, { Component } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	Animated,
	Easing
} from 'react-native';

export default class componentName extends Component {

	state = {
		toggle: false,
		animated: new Animated.Value(0)
	}

	_onPress = () => {
		const newState = !this.state.toggle
		this.animateButton(newState)
		this.setState({ toggle: newState })
		this.props.onStateChange && this.props.onStateChange(newState)
	}

	animateButton(newState) {
		this.state.animated.setValue(newState ? 0 : 1)
		Animated.spring(this.state.animated, {
			toValue: newState ? 1 : 0,
			duration: 500,
		}).start()
	}

	render() {

		const { toggle, animated } = this.state
		const textValue = toggle ? 'NO' : 'OFF'
		const buttonBg = toggle ? 'white' : 'white' // dodgerblue
		const textColor = toggle ? 'white' : 'black'

		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
				<TouchableOpacity
					onPress={this._onPress}
					style={{
						flex: 1,
						margin: 10,
						height: 60,
						borderRadius: 30,
						borderWidth: 2,
						justifyContent: 'center',
						borderColor: 'dodgerblue',
						backgroundColor: buttonBg,
					}}
				>
					<Animated.View style={{
						position: 'absolute',
						left: 0, 
						right: 0,
						top: 0,
						bottom: 0,
						backgroundColor: 'dodgerblue',
						borderRadius: 30,
						justifyContent: 'center',
						opacity: animated,
						transform: [{
							scale: animated.interpolate({
								inputRange: [0, 1],
								outputRange: [0, 1]
							})
						}]
					}}>
						
					</Animated.View>
					<Text style={{
							backgroundColor: 'transparent',
							color: textColor,
							textAlign: 'center',
							fontSize: 16
						}}>
							{textValue}
						</Text>
				</TouchableOpacity>
			</View>
		);
	}
}
