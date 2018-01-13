import React, { Component } from 'react';
import { View, ScrollView, Dimensions, Text } from 'react-native';
const { width, height } = Dimensions.get('window')
import Util from './util'
import RefreshFlatList, { RefreshState, ViewType } from 'react-native-refreshflatlist'

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      enabled: true,
      enabledInner: false,
      opacity: 1,
      opacity1: 0,
      _data: Util.makeData(),
      s: true
    };
  }

  onScroll(event) {
    let y = event.nativeEvent.contentOffset.y
    console.log(y)
    // if(!this.state.enabled) return
    // console.log('0-----------------------0')
    // console.log(this.s1)
    // console.log(this.s1.getScrollResponder())
    // console.log('0111-----------------------0111')

    if (y >= 200) {
      console.log('0-----------------------0')
      this.setState({
        opacity: 0,
        opacity1: 1,
      })
      // this.s1.setNativeProps({
      //   scrollEnabled: false
      // })
      // this.s2.setNativeProps({
      //   scrollEnabled: true
      // })
    } else {
      this.setState({
        opacity: 1,
        opacity1: 0,
      })
    }
  }

  onScrollInner(event) {
    let y = event.nativeEvent.contentOffset.y
    // if(!this.state.enabled) return
    // console.log('0-----------------------0')
    // console.log(this.s1)
    // console.log(this.s1.getScrollResponder())
    // console.log('0111-----------------------0111')

    if (y == 0) {
      console.log('0-----------------------0')
      this.s1.setNativeProps({
        scrollEnabled: true
      })
      this.s2.setNativeProps({
        scrollEnabled: false
      })
    }
  }

  _renderItem = (isTriggerPressFn) => {
    return (
      <View style={{
        width: width,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center'
      }} >
        <Text>{'The Customer ScrollView' + this.state.msg} </Text>
      </View>
    )
  }

  render() {
    return (
      <View>
        <ScrollView
          onScroll={this.onScroll.bind(this)}
          ref={flatList => { this.s1 = flatList }}
          scrollEventThrottle={16}
          scrollEnabled={this.state.s}
        >
          <View style={{ height: 200, backgroundColor: 'violet' }} />
          <View style={{
            height: 100, backgroundColor: 'yellow',
            width: 200,
            opacity: this.state.opacity
          }}
          />
          {/* <View style={{ height: 2000, backgroundColor: 'red' }} >
            <ScrollView
              style={{ margin: 10, }} >
              <View style={{ height: 200, backgroundColor: 'blue' }} />
              <View style={{ height: 200, backgroundColor: 'pink' }} />
              <View style={{ height: 200, backgroundColor: 'blue' }} />
              <View style={{ height: 200, backgroundColor: 'pink' }} />
              <View style={{ height: 200, backgroundColor: 'blue' }} />
              <View style={{ height: 200, backgroundColor: 'pink' }} />
              <View style={{ height: 200, backgroundColor: 'blue' }} />
              <View style={{ height: 200, backgroundColor: 'pink' }} />
              <View style={{ height: 200, backgroundColor: 'blue' }} />
              <View style={{ height: 200, backgroundColor: 'pink' }} />
              <View style={{ height: 200, backgroundColor: 'blue' }} />
              <View style={{ height: 200, backgroundColor: 'pink' }} />
            </ScrollView>
          </View> */}
          <RefreshFlatList
            data={this.state._data}
            renderItem={this._renderItem}
            viewType={'ListView'}
            style={{ backgroundColor: 'red' }}
          />
        </ScrollView>
        <View style={{
          height: 100, backgroundColor: 'black',
          position: 'absolute',
          top: 0,
          width: width,
          opacity: this.state.opacity1
        }}
        />
      </View>
    );
  }
}