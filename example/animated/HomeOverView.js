import React, { Component } from 'react';
import {
	View,
	Text,
	ScrollView,
	Dimensions,
	Animated,
	StyleSheet,
	Image,
	TouchableOpacity
} from 'react-native';

const { width, height } = Dimensions.get('window')
const headerHeight = 60
export default class HomeOverView extends Component {
	state = {
		scrollY: new Animated.Value(0),
		opacityValue: new Animated.Value(1)
	}


	onScroll = (event) => {
		const { y } = event.nativeEvent.contentOffset
		const { opacityValue } = this.state
		// console.log(y)
		// opacityValue.interpolate({
		// 	inputRange: [-1000, 0, headerHeight + 100],
		// 	outputRange: [1, 1, 0]
		// })
	}

	render() {
		const { scrollY, opacityValue } = this.state
		const onScroll = Animated.event([{
			nativeEvent: {
				contentOffset: {
					y: scrollY
				}
			}
		}])

		const threshold = 300 - headerHeight
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
					{...{ onScroll }}
				>
					<Animated.View>
						<Animated.Image
							style={{ width: width, height: 300 }}
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
				<Animated.View style={[styles.header, { backgroundColor }]}>
					<TouchableOpacity onPress={()=> console.log('onPress')}>
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
		backgroundColor: 'transparent',
		justifyContent: 'center',
		alignItems: 'center',
	}
})

