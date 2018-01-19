import React, { Component } from 'react';
import { View, Text, Button, LayoutAnimation } from 'react-native';

export default class Nofification extends Component {
	state = {
		array: [],
		id: 0
	}

	addNofitycation() {
		let newArray = this.state.array.slice()
		const newId = this.state.id + 1
		newArray.push({ id: newId })
		LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
		this.setState({ array: newArray, id: newId },()=> {
			setTimeout(() => {
				const item = this.state.array[0]
				this.removeItem(item.id)
			}, 3000);
		})
	}

	removeItem(id) {
		let newArray = this.state.array.slice()
		const index = newArray.findIndex(item => item.id == id)
		if (index > -1) {
			newArray.splice(index, 1)
		}
		LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
		this.setState({ array: newArray })
	}

	render() {
		const { array } = this.state
		const views = array.map((element, index) => {
			return (
				<View key={index} style={{
					height: 40, margin: 10, justifyContent: 'center',
					alignItems: 'center',
					flexDirection: 'row', padding: 5, borderRadius: 5, backgroundColor: 'black'
				}}>
					<Text style={{ color: 'white', flex: 1 }}>Hello {element.id}</Text>
					<Text style={{ color: 'white', }} onPress={() => this.removeItem(element.id)}>X</Text>
				</View>
			)
		})
		return (
			<View
				style={{
					flex: 1,
					justifyContent: 'center',
					alignItems: 'center',
					backgroundColor: '#F5FCFF'
				}}
			>
				<Button title="Add" onPress={() => this.addNofitycation()} ></Button>
				<View style={{
					position: 'absolute',
					bottom: 0,
					left: 0,
					right: 0,
					backgroundColor: 'tomato'
				}}>
					{views}
				</View>
				<Text> textInComponent </Text>
			</View>
		);
	}
}
