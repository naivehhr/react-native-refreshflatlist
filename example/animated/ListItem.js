import React, { Component } from 'react';
import { View, Text, Animated, TouchableWithoutFeedback, Image } from 'react-native';

export default class ListItem extends Component {

	state = {
		animatePress: new Animated.Value(1),
		animatedItem: new Animated.Value(0)
	}

	animateIn() {
		Animated.timing(this.state.animatePress, {
			toValue: 0.8,
			duration: 200
		}).start()
	}

	animateOut() {
		Animated.timing(this.state.animatePress, {
			toValue: 1,
			duration: 200
		}).start()
	}

	componentWillMount = () => {
		const { index } = this.props
		const delay = index * 500
		Animated.sequence([
			Animated.delay(delay),
			// Animated.spring(this.state.animatedItem, {
			// 	toVlaue: 1,
			// })
			Animated.spring(this.state.animatedItem, {
				toValue: 1,
				duration: 500,
				// delay: index * 100
			})
		]).start()
		// Animated.timing(this.state.animatedItem, {
		// 	toValue: 1,
		// 	duration: 500,
		// 	// delay: index * 100
		// }).start()
	}
	


	render() {
		const { itemWidth, image, onPress, onPressItem } = this.props
		return (
			<TouchableWithoutFeedback
				onPress={() => onPressItem && onPressItem(this.props.image)}
				onPressIn={() => this.animateIn()}
				onPressOut={() => this.animateOut()}
			>
				<Animated.View style={{
					margin: 5,
					transform: [
						{
							scale: this.state.animatePress
						},{
							// translateY: this.state.animatedItem.interpolate({
							// 	inputRange: [0, 1],
							// 	outputRange: [700, 1]
							// }),
							rotateY: this.state.animatedItem.interpolate({
								inputRange: [0, 1],
								outputRange: ["90deg", "0deg"]
							})
						}
					]
				}}>
					<Image style={{width: itemWidth, height: 200}} source={require('./2.jpg')} />
				</Animated.View>
			</TouchableWithoutFeedback>
		);
	}
}
