import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions
} from 'react-native';
import Util from './util'
import RefreshFlatList, { RefreshState, ViewType } from 'react-native-refreshflatlist'
const {height, width} = Dimensions.get('window');
import { 
	StackNavigator, 
	TabNavigator, 
	DrawerNavigator,
	DrawerItems,
  NavigationActions
 } from 'react-navigation'
class example extends Component {

  constructor() {
    super()
    this.state = {
      headerHeight: 100,
      refreshing: false,
      _data: [],
      footerMsg: '加载中'
    }
  }

  componentDidMount() {
    this.setState({_data: Util.makeData()})
  }

  _renderItem = ({item}) => {
    return (
      <View style={{width: width, height: 100}} >
        <Text>{'我是自定义的' + item.title} </Text>
      </View>
    )
  }
  render() {
    return (
      <View style={styles.container}>
        <RefreshFlatList
          data={this.state._data}
          renderItem={this._renderItem}
          viewType={'ListView'}
        />
      </View>
    );
  }
}

const ModalStack = TabNavigator({
  APP: {
    screen: example,
  }
}, {
  tabBarPosition: 'bottom',
});
export default ModalStack
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});