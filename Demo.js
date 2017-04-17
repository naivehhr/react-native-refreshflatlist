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
      footerMsg: '加载中'
    }
  }
  componentDidMount() {
    let a = Util.makeDataImmttable()
    let c = a.toJS()
    this.setState({_data: Util.makeData()})
  }

  _onRefreshFun = () => {
    console.log('用户要求更新啦')
    this.setState({refreshing: true})
    setTimeout(() => {
      console.log('用户更新完成')
      this.setState({refreshing: false})
    },2000)
  }

  _onEndReached = () => {
    this.setState({footerMsg: '加载中'})
    this.timer2 = setTimeout(() => {
      let _d = this.state._data.concat(Util.makeData(this.state._data.length))
      this.setState({footerMsg: '加载更多', _data: _d})
    }, 1000)
  }

  _onLoadFun = () => {

  }

  _renderItem = () => {
    // ListView
    /*return (
      <View style={{width: width, height: 100}} >
        <Text>{'我是自定义的' + item.title} </Text>
      </View>
    )*/

    // ScrollView
    return (
      <View style={{width: width, height: 100}} >
        <Text>{'我是自定义的View' + item.text} </Text>
      </View>
    )
  }

  _customerHeader = (refreshState, percent) => {
    const { headerHeight, msg } = this.state
    switch (refreshState) {
      case RefreshState.pullToRefresh:
        return (
          <Animated.View style={{justifyContent: 'center', alignItems: 'center', width: width, height: headerHeight, backgroundColor: 'red'}} >
            <Text>{ '下拉刷新' + percent }</Text>
          </Animated.View>
        )
      case RefreshState.releaseToRefresh:
        return (
          <Animated.View style={{justifyContent: 'center', alignItems: 'center', width: width, height: headerHeight, backgroundColor: 'red'}} >
            <Text>{ '放手啊啊啊啊' + percent }</Text>
          </Animated.View>
        )
      case RefreshState.refreshing:
        return (
          <Animated.View style={{justifyContent: 'center', alignItems: 'center', width: width, height: headerHeight, backgroundColor: 'red'}} >
            <Text>{ '刷新中....' + percent }</Text>
          </Animated.View>
        )
      case RefreshState.refreshdown:
        return (
          <Animated.View style={{justifyContent: 'center', alignItems: 'center', width: width, height: headerHeight, backgroundColor: 'red'}} >
            <Text>{ '刷新完成' }</Text>
          </Animated.View>
        )
      default:
        return (
          <View style={{justifyContent: 'center', alignItems: 'center', height: headerHeight, width: width}}>
            <Text>{ percent }</Text>
          </View>
        )
    }
  }

  _listFooterComponent = () => {
    return (
      <View style={{ flex:1, justifyContent: 'center', alignItems: 'center',width: width, height: 30, backgroundColor: 'red'}} >
         <Text style={{textAlign: 'center',}}> { this.state.footerMsg } </Text>
      </View>
    )
  }

  _renderContent = () => {
    return (
      <View style={{width: width, height: 100}} >
        <Text> {'这是个自定义的ScrollView'} </Text>
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
          renderContent={this._renderContent}
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
