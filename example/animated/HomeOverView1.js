import React, { Component } from 'react';
import {
	View,
	Text,
	ScrollView,
	Dimensions,
	Animated,
	StyleSheet,
	Image,
	TouchableOpacity,
	Easing
} from 'react-native';

const { width, height } = Dimensions.get('window')
const headerHeight = 60
const bgHeight = 300
/**
 * 回弹的Header
 */
export default class HomeOverView1 extends Component {

	constructor(props) {
		super()
		this.state = {
			scrollY: new Animated.Value(0),
			topHeight: new Animated.Value(0),
		}
		this.isBingo = false
		this.isAnimating = false
	}

	onScroll = (event) => {
		const { topHeight } = this.state
		let offsetY = event.nativeEvent.contentOffset.y
		let oriageScrollHeight = event.nativeEvent.layoutMeasurement.height
		let contentSizeHeight = event.nativeEvent.contentSize.height //2400
		let heightTotal = oriageScrollHeight + offsetY
		// if(offsetY <= 0) {
		// 	console.log('到顶部')
		// 	return
		// } else if(heightTotal >= contentSizeHeight){
		// 	console.log('到底部')
		// 	return
		// }
		if (offsetY <= 0 || heightTotal >= contentSizeHeight) {
			this.isBingo = true
			return
		} else {
			this.isBingo = false
		}

		if (offsetY > this.currentPoint) {
			console.log('向下')
			this.doAnimated('down')
		} else if (offsetY < this.currentPoint) {
			console.log('向上')
			this.doAnimated('up')
		}
		this.currentPoint = offsetY
	}

	doAnimated(direction) {
		let targetHeight = direction == 'up'? 0 : -headerHeight
		if(this.isAnimating) return
		this.isAnimating = true
		Animated.timing(
			this.state.topHeight,
			{
				toValue: targetHeight,
				duration: 200
			}
		).start(() => {
			this.isAnimating = false
		});
	}

	render() {
		const { scrollY, opacityValue, topHeight } = this.state
		const onScroll = Animated.event([{
			nativeEvent: {
				contentOffset: {
					y: scrollY
				}
			}
		}])

		const threshold = bgHeight - headerHeight
		const backgroundColor = scrollY.interpolate({
			inputRange: [0, threshold],
			outputRange: ["transparent", "white"]
		})
		return (
			<View style={{ flex: 1 }}>


				<ScrollView
					contentContainerStyle={{
					}}
					scrollEventThrottle={16}
					onScroll={this.onScroll}
				>
					<Animated.View>
						<Animated.Image
							style={{ width: width, height: bgHeight }}
							resizeMode={'cover'}
							source={require('./2.jpg')}
						/>
					</Animated.View>
					<View style={{ height: 200, backgroundColor: 'yellow', width: width }}>
						<Text>Body</Text>
					</View>
					<View style={{ height: 200, backgroundColor: 'yellow', width: width }}>
						<Text>Body</Text>
					</View>
					<View style={{ height: 200, backgroundColor: 'yellow', width: width }}>
						<Text>Body</Text>
					</View>
					<View style={{ height: 200, backgroundColor: 'yellow', width: width }}>
						<Text>Body</Text>
					</View>
					<View style={{ height: 200, backgroundColor: 'yellow', width: width }}>
						<Text>Body</Text>
					</View>
					<View style={{ height: 200, backgroundColor: 'yellow', width: width }}>
						<Text>Body</Text>
					</View>
				</ScrollView>
				<Animated.View style={[styles.header, { top: topHeight }]}>
					<TouchableOpacity onPress={() => console.log('onPress')}>
						<Text style={{ color: 'red' }}>Header</Text>
					</TouchableOpacity>
				</Animated.View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	header: {
		width: width,
		position: 'absolute',
		height: headerHeight,
		backgroundColor: 'white',
		justifyContent: 'center',
		alignItems: 'center'
	}
})

