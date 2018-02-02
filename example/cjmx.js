/*
 * @Author: aran.hu 
 * @Date: 2017-04-17 13:04:12 
 * @Last Modified by: aran.hu
 * @Last Modified time: 2018-02-02 15:21:17
 */

import {
  AppRegistry, ScrollView,
  View,
  Dimensions,
  Easing,
  Animated,
  LayoutAnimation,
  NativeModules
} from 'react-native';
import APP from './app'
import Test from './Test'
import A from './scroll-absolute'
import React, { Component } from 'react';
const { height, width } = Dimensions.get('window');
import RefreshFlatList, { RefreshState, ViewType } from 'react-native-refreshflatlist'

const { UIManager } = NativeModules;
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

export class AView extends Component {

  constructor(props) {
    super()
    this.state = {
      _h: new Animated.Value(100),
      h: 100
    }
    this.currentPoint = 0
    this.animateRunning = false
    this.isTag = false
  }

  onScroll = (event) => {
    let contentSizeHeight = event.nativeEvent.contentSize.height //2400
    let offsetY = event.nativeEvent.contentOffset.y
    let oriageScrollHeight = event.nativeEvent.layoutMeasurement.height
    let heightTotal = oriageScrollHeight + offsetY
    if(heightTotal < oriageScrollHeight || heightTotal > contentSizeHeight) heightTotal = contentSizeHeight
    LayoutAnimation.easeInEaseOut()
    console.log('heightTotal', heightTotal)
    // if(offsetY == 0) {
    //   console.log('到顶部')
    // } else if(heightTotal == contentSizeHeight){
    //   console.log('到底部')
    // }
    if(offsetY == 0 || heightTotal == contentSizeHeight) {
      this.isTag = true
    } else {
      this.isTag = false
    }

    if (this.running || this.isTag) {
      this.currentPoint = offsetY
      return
    }

    if (offsetY > this.currentPoint) {
      // console.log('向下')
      this.running = true
      this.setState({ h: 0 }, () => {
        this.running = false
      })
    } else if (offsetY < this.currentPoint) {
      // console.log('向上')
      this.running = true
      this.setState({ h: 100 }, () => {
        this.running = false
      })
    }
    this.currentPoint = offsetY


    // console.log('curren value=>>>'+this.state._h._value)

    // if(this.state._h._value = 100){
    //   Animated.timing(this.state._h, {
    //     toValue: 0,
    //     easing: Easing.back(),
    //     duration: 500,
    //   }).start(()=>{
    // // console.log('value=>>>'+this.state._h._value)

    //   });
    // } else {
    //   console.log('???????????')
    //   Animated.timing(this.state._h, {
    //     toValue: 100,
    //     easing: Easing.back(),
    //     duration: 500,
    //   }).start();
    // }
  }

  onLayout = (ev) => {
    console.log(ev.nativeEvent.layout)
  }
  render() {
    return (
      <Animated.ScrollView
        ref={flatList => { this.s1 = flatList }}
        scrollEventThrottle={16}
        scrollEnabled={false}

        contentContainerStyle={{ flex: 1 }}
      >
        <Animated.View style={{ height: this.state.h, backgroundColor: 'violet' }} />
        <ScrollView
          onScroll={this.onScroll}
          scrollEventThrottle={16}
          onContentSizeChange={(w, h) => {
            console.log('??', h)
          }}
        // onScrollBeginDrag={(e) => console.log('onScrollBeginDrag', e.nativeEvent.contentOffset)}
        >
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
      </Animated.ScrollView>
    )
  }
}

AppRegistry.registerComponent('example', () => AView);
