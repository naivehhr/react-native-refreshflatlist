/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component, PropTypes } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  FlatList,
  VirtualizedList,
  Dimensions,
  Animated,
  PanResponder,
  Easing,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import Util from './util'
import RefreshFlatList, { RefreshState, ViewType } from './RefreshFlatList'
const {height, width} = Dimensions.get('window');
export default class Demo extends Component {
  constructor() {
    super()
    this.state = {
      headerHeight: 100,
      refreshing: false,
      _data: [],
      footerMsg: 'loading'
    }
  }
  componentDidMount() {
    let a = Util.makeDataImmttable()
    let c = a.toJS()
    this.setState({_data: Util.makeData()})
  }

  _onRefreshFun = () => {
    console.log('refresh request')
    this.setState({refreshing: true})
    setTimeout(() => {
      console.log('refresh down')
      this.setState({refreshing: false})
    },2000)
  }

  _onEndReached = () => {
    this.setState({footerMsg: 'loading'})
    this.timer2 = setTimeout(() => {
      let _d = this.state._data.concat(Util.makeData(this.state._data.length))
      this.setState({footerMsg: 'load more', _data: _d})
    }, 1000)
  }

  _onLoadFun = () => {

  }

  _renderItem = () => {
    // ListView
    return (
      <View style={{width: width, height: 100}} >
        <Text>{'ListView + ' + item.title} </Text>
      </View>
    )

    // ScrollView
    /*return (
      <View style={{width: width, height: 100}} >
        <Text>{'ScrollView' + item.text} </Text>
      </View>
    )*/
  }

  _customerHeader = (refreshState, percent) => {
    const { headerHeight, msg } = this.state
    switch (refreshState) {
      case RefreshState.pullToRefresh:
        return (
          <Animated.View style={{justifyContent: 'center', alignItems: 'center', width: width, height: headerHeight, backgroundColor: 'red'}} >
            <Text>{ 'pull to refresh' + percent }</Text>
          </Animated.View>
        )
      case RefreshState.releaseToRefresh:
        return (
          <Animated.View style={{justifyContent: 'center', alignItems: 'center', width: width, height: headerHeight, backgroundColor: 'red'}} >
            <Text>{ 'release to refresh' + percent }</Text>
          </Animated.View>
        )
      case RefreshState.refreshing:
        return (
          <Animated.View style={{justifyContent: 'center', alignItems: 'center', width: width, height: headerHeight, backgroundColor: 'red'}} >
            <Text>{ 'refreshing...' + percent }</Text>
          </Animated.View>
        )
      case RefreshState.refreshdown:
        return (
          <Animated.View style={{justifyContent: 'center', alignItems: 'center', width: width, height: headerHeight, backgroundColor: 'red'}} >
            <Text>{ 'refresh down' }</Text>
          </Animated.View>
        )
      default:
    }
  }

  _listFooterComponent = () => {
    return (
      <View style={{ flex:1, justifyContent: 'center', alignItems: 'center',width: width, height: 30, backgroundColor: 'red'}} >
         <Text style={{textAlign: 'center',}}> { this.state.footerMsg } </Text>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <RefreshFlatList
          data={this.state._data}
          refreshing={this.state.refreshing}
          onEndReached={this._onEndReached}
          customRefreshView={this._customerHeader}
          ListFooterComponent={this._listFooterComponent}
          renderItem={this._renderItem}
          onRefreshFun={this._onRefreshFun}
          viewType={ViewType.ListView}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});
