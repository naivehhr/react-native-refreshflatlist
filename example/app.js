import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Button,
  Alert
} from 'react-native';
import Util from './util'
import RefreshFlatList, { RefreshState, ViewType } from 'react-native-refreshflatlist'
const { height, width } = Dimensions.get('window');
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
      footerMsg: 'load more'
    }
  }

  componentDidMount() {
    // setTimeout(()=>{
    //   this.setState({
    //     _data: [{title: '54555'}]
    //   })
    // }, 3000);
  }

  onRefreshFun = () => {
    // 这里可以放到组件内部实现如果触发就直接设置为true
    // this.setState({refreshing: true})
    setTimeout(() => {
      this.setState({
        refreshing: false,
        _data: [{ title: 'Everyone is dissatisfied with his own fortune.' }]
      })
      // setTimeout(()=>{
      //   this.setState({
      //     refreshing: false, 
      //     _data: [{title: '1111'}]
      //   })
      //   setTimeout(()=>{
      //     this.setState({
      //       refreshing: false, 
      //       _data: [{title: '22222'}]
      //     })
      //   }, 1000);
      // }, 1000);
    }, 1000);
  }

  onEndReached = () => {
    // this.setState({footerMsg: 'loading'})
    // setTimeout(()=>{
    //     this.setState({
    //       _data: this.state._data.concat(Util.makeData(100)),
    //       footerMsg: 'load more'
    //     })
    // }, 1000);
  }

  onPress(isTriggerPressFn) {
    // 仅需在Android设置
    if (isTriggerPressFn()) {
      Alert.alert('onPress')
    }
  }

  _renderItem = (isTriggerPressFn, data) => {
    return (
      <View style={{ width: width, height: 100 }} >
        <Text>{'The Customer ListView'} </Text>
        <Button onPress={this.onPress.bind(this, isTriggerPressFn)} title={'btn'} />
      </View>
    )
  }

  _listFooterComponent = () => {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: width, height: 30, backgroundColor: 'pink' }} >
        <Text style={{ textAlign: 'center', }}> {this.state.footerMsg} </Text>
      </View>
    )
  }
  render() {
    return (
      <View style={styles.container}>
        <RefreshFlatList
          data={this.state._data}
          renderItem={this._renderItem}
          listFooterComponent={this._listFooterComponent}
          viewType={'ListView'}
          onRefreshFun={this.onRefreshFun}
          onEndReached={this.onEndReached}
          isRefresh={this.state.refreshing}
          style={{ backgroundColor: 'yellow' }}
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
    // setTimeout(()=>{
    //     this.setState({
    //      msg: 'People do not frivolous waste young 5000'
    //     })
    //   }, 5000);
  }

  _renderItem = (isTriggerPressFn) => {
    return (
      <View style={{
        width: width,
        height: height,
        justifyContent: 'center',
        alignItems: 'center'
      }} >
        <Text>{'The Customer ScrollView' + this.state.msg} </Text>
        <Button onPress={this.onPress.bind(this, isTriggerPressFn)} title={'btn'} />
      </View>
    )
  }

  onRefreshFun = () => {
    this.setState({ refreshing: true })
    setTimeout(() => {
      this.setState({ refreshing: false, msg: 'People do not frivolous waste young' })
    }, 1000);
  }

  onPress(isTriggerPressFn){
    if(isTriggerPressFn()){
      Alert.alert('onPress')
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <RefreshFlatList
          renderItem={this._renderItem}
          viewType={'ScrollView'}
          onRefreshFun={this.onRefreshFun}
          isRefresh={this.state.refreshing}
          style={{ backgroundColor: 'red' }}
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