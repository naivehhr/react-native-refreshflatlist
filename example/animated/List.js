import React, { Component } from 'react';
import { View, Text, Button, FlatList, Dimensions, LayoutAnimation } from 'react-native';
import ListItem from './ListItem'

const ITEM_WIDTH = Dimensions.get('window').width

export default class List extends Component {
	state = {
		columns: 1,
		key: 1,
		array: []
	}

	constructor(props) {
		super(props)
		this.getImageData = this.getImageData.bind(this)
	}
	componentWillMount() {
		this.getImageData()
	}

	getImageData() {
		let array = []
		for (let i = 0; i < 10; i++) {
			array.push({ key: i, imgSource: './2.jpg' })
		}
		this.setState({ array })
	}

	renderItem = ({ index, item }) => {
		const { columns } = this.state
		return <ListItem
			index={index}
			itemWidth={(ITEM_WIDTH - (10 * columns)) / columns}
			image={item.imgSource}
		/>
	}

	onPress = () => {
		let { columns, key } = this.state
		columns = columns == 3 ? 1 : 3
		// LayoutAnimation.spring
		this.setState({ columns: columns, key: key + 1 })
	}

	render() {
		const { columns, key, array } = this.state
		console.log('array', array)
		return (
			<View style={{ flex: 1 }}>
				<Button
					onPress={this.onPress}
					title="Toggle Layout"
				>
				</Button>
				<FlatList
					style={{ flex: 1, backgroundColor: 'red' }}
					key={key}
					numColumns={columns}
					data={array}
					renderItem={this.renderItem}
					keyExtractor={
						(item, index) => { return index }
					}
				/>
			</View>
		);
	}
}
