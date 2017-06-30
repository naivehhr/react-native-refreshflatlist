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
class TestListView extends Component {

  constructor() {
    super()
    this.state = {
      headerHeight: 100,
      refreshing: false,
      _data: Util.makeData(),
      footerMsg: 'loading more'
    }
  }

  componentDidMount() {
  }

  onRefreshFun = () => {
    this.setState({refreshing: true})
    setTimeout(()=>{
      this.setState({
        refreshing: false, 
        _data: [{title: 'Everyone is dissatisfied with his own fortune.'}]
      })
    }, 1000);
  }

  _renderItem = ({item}) => {
    return (
      <View style={{width: width, height: 100}} >
        <Text>{'The Customer ListView' + item.title} </Text>
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
          onRefreshFun={this.onRefreshFun}
          isRefresh={this.state.refreshing}
          style={{backgroundColor:'yellow'}}
        />
      </View>
    );
  }
}

class TestScrollView extends Component {

  constructor() {
    super()
    this.state = {
      refreshing: false,
      msg: 'I just want to say'
    }
  }

  componentDidMount() {

  }
  
  _renderItem = () => {
    return (
      <View style={{
        width: width, 
        height: height, 
        justifyContent: 'center',
        alignItems: 'center'}} >
        <Text>{'The Customer ScrollView' + this.state.msg} </Text>
      </View>
    )
  }

  onRefreshFun = () => {
    this.setState({refreshing: true})
    setTimeout(()=>{
      this.setState({refreshing: false, msg: 'People do not frivolous waste young'})
    }, 1000);
  }
  
  render() {
    return(
      <View style={styles.container}>
        <RefreshFlatList
          renderItem={this._renderItem}
          viewType={'ScrollView'}
          onRefreshFun={this.onRefreshFun}
          isRefresh={this.state.refreshing}
          style={{backgroundColor:'red'}}
        />
      </View>
    )
  }
}
const TabStack = TabNavigator({
  Test_ListView: {
    screen: TestListView,
  },
  Test_ScrollView: {
    screen: TestScrollView,
  },
}, {
  initialRouteName: 'Test_ListView',
});
export default TabStack
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