/*
 * @Author: aran.hu
 * @Date: 2017-04-14 14:29:15
 * @Last Modified by: aran.hu
 * @Last Modified time: 2017-12-27 14:02:47
 */


import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
  InteractionManager
} from 'react-native';
import Util from './util'
import Item from './Item'
const { height, width } = Dimensions.get('window');

// 0: 未刷新; 1: 到达刷新点; 2: 刷新中; 3: 刷新完成
export const RefreshState = {
  pullToRefresh: 0,
  releaseToRefresh: 1,
  refreshing: 2,
  refreshdown: 3,
}

export const RefreshText = {
  pullToRefresh: 'pull to refresh',
  releaseToRefresh: 'release to refresh ',
  refreshing: 'refreshing...',
  refreshdown: 'refresh complete!'
}

export const FooterText = {
  pushToRefresh: 'pull to refresh',
  loading: 'refreshing...'
}

export const ViewType = {
  ListView: 'ListView',
  ScrollView: 'ScrollView'
}

export default class RefreshFlatList extends Component {

  static defaultProps = {
    isRefresh: false,
    viewType: 'ScrollView',
  };

  static propTypes = {
    customRefreshView: PropTypes.func,
    onRefreshFun: PropTypes.func,
    onEndReached: PropTypes.func,
    isRefresh: PropTypes.bool,
    viewType: PropTypes.oneOf(['ListView', 'ScrollView'])
  };

  constructor() {
    super()
    this.state = {
      _data: [],
      rotation: new Animated.Value(0),
      rotationNomal: new Animated.Value(0),
      refreshState: RefreshState.pullToRefresh,
      refreshText: RefreshText.pullToRefresh,
      percent: 0,
      footerMsg: 'load more',
      toRenderItem: true
    }
    this._scrollEndY = 0
    this.headerHeight = 60
    this.mTop = 0 // Record distance from top to top
    this.isOnMove = false // Distinguish whether the finger is triggered Slip; Calculate the sliding percentage
    this.isAnimating = false //Controls the same animation not many times during the sliding process
    this.beforeRefreshState = RefreshState.pullToRefresh
  }

  componentWillMount() {
    const { customRefreshView } = this.props
    if(customRefreshView) {
      const { height } = customRefreshView(RefreshState.pullToRefresh).props.style
      this.headerHeight = height
    }

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (event, gestureState) => true,
      onStartShouldSetPanResponderCapture: (event, gestureState) => true,
      onMoveShouldSetPanResponder: (event, gestureState) => false,
      onMoveShouldSetPanResponderCapture: (event, gestureState) => false,
      onPanResponderTerminationRequest: (event, gestureState) => true,
      onPanResponderGrant: (event, gestureState) => {
          this.onStart(event, gestureState);
      },
      onPanResponderMove: (event, gestureState) => {
          this.onMove(event, gestureState);
      },
      onPanResponderRelease: (event, gestureState) => {
          this.onEnd(event, gestureState);
      }
    })
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps, nextState) {
    this.setRefreshState(nextProps.isRefresh)
  }

  shouldComponentUpdate (nextProps, nextState) {
    /**
     * This code is just an example of the rotation animation.
     */
    if(this.state.refreshState != RefreshState.refreshing 
    && nextState.refreshState == RefreshState.refreshing) {
      this.initAnimated()
    }
    return true
  }

  componentWillUnmount() {
    this.t && clearTimeout(this.t)
    this.tt && clearTimeout(this.tt)
    this.timer1 && clearTimeout(this.timer1);
    this.timer2 && clearTimeout(this.timer2);
  }

  initAnimated() {
    this.state.rotation.setValue(0)
    this._an = Animated.timing(this.state.rotation, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
    }).start((r) => {
      if(this.state.refreshState == RefreshState.refreshing){
        this.initAnimated()
      }
    })
  }

  // Test onRefreshFun
  _onRefreshFun = () => {
    this.setRefreshState(true)
    this.timer1 = setTimeout(() => {
      this.setRefreshState(false)
    }, 2000)
  }

  setRefreshState(refreshing){
    if (refreshing) {
      this.beforeRefreshState = RefreshState.refreshing
      this.updateRefreshViewState(RefreshState.refreshing)
    } else {
      if(this.beforeRefreshState == RefreshState.refreshing) {
        this.beforeRefreshState = RefreshState.pullToRefresh
        this.updateRefreshViewState(RefreshState.refreshdown)
      } else {
        // this.updateRefreshViewState(RefreshState.pullToRefresh)
      }
    }
  }

  updateRefreshViewState(refreshState = RefreshState.pullToRefresh) {
    switch (refreshState) {
      case RefreshState.pullToRefresh:
        this.setState({refreshState: RefreshState.pullToRefresh, refreshText: RefreshText.pullToRefresh})
        break;
      case RefreshState.releaseToRefresh:
        this.setState({refreshState: RefreshState.releaseToRefresh, refreshText: RefreshText.releaseToRefresh})
        break;
      case RefreshState.refreshing:
        this.setState({refreshState: RefreshState.refreshing, refreshText: RefreshText.refreshing}, () => {
          this._flatList.scrollToOffset({animated:true, offset: -this.headerHeight})
        })
        break;
      case RefreshState.refreshdown:
        this.setState({refreshState: RefreshState.refreshdown, refreshText: RefreshText.refreshdown, percent: 100, toRenderItem: true}, () => {
          // This delay is shown in order to show the refresh time to complete the refresh
          this.t = setTimeout(() => {
            this._flatList.scrollToOffset({animated:true, offset: 0})
            this.tt = setTimeout(() => {
              this.updateRefreshViewState(RefreshState.pullToRefresh)
            }, 500)
          }, 500)
        })
      default:

    }
  }

  _onEndReached = () => {
    const { onEndReached } = this.props
    if(onEndReached) {
      return onEndReached()
    }
    this.setState({footerMsg: 'loading'})
    this.timer2 = setTimeout(() => {
      this.setState({footerMsg: 'load more'})
    }, 1000)
  }

  _onScroll = (e) => {
    let { y } = e.nativeEvent.contentOffset
    this._scrollEndY = y
    if(this._scrollEndY == 0) this.setState({toRenderItem: true})
    if(!this.isOnMove && -y >= 0){
      //刷新状态下，上推列表依percent然显示100%
      let p = parseInt(( -y / (this.headerHeight)) * 100)
      if(this.state.refreshState !== RefreshState.refreshdown)
        this.setState({percent: (p > 100? 100: p)})
    }
  }

  onStart(e, g) {
    this.isOnMove = true
    this.setState({toRenderItem: false}) 
  }

  onMove(e, g) {
    this.mTop = g.dy
    if(g.dy >= 0){
      let p = parseInt(( g.dy / (2 * this.headerHeight)) * 100)
      p = p > 100? 100: p
      this.setState({percent: p})
      if(p < 100) {
        this.updateRefreshViewState(RefreshState.pullToRefresh)
      } else {
        this.updateRefreshViewState(RefreshState.releaseToRefresh)
      }
    }
  }

  onEnd(e, g) {
    this.isOnMove = false
    if(this._scrollEndY < -this.headerHeight) {
      const { onRefreshFun } = this.props
      this.setRefreshState(true)
      onRefreshFun?onRefreshFun(): this._onRefreshFun()
    }
  }

  _shouldItemUpdate(prev, next) {
    return prev.item.text !== next.item.text;
  }

   _renderItem = (item) => {
    return <Item {...this.props} item={item} toRenderItem={this.state.toRenderItem}/>
  }

  customRefreshView = () => {
    const { customRefreshView } = this.props
    const { refreshState, refreshText, percent} = this.state
    if(customRefreshView) return customRefreshView(refreshState, percent)
    switch (refreshState) {
      case RefreshState.pullToRefresh:
        // this.isAnimating 这里是为了控制动画不被重复触发
        if(!this.isAnimating) {
          this.isAnimating = true
          Animated.timing(this.state.rotationNomal, {
            toValue: 0,
            duration: 200,
            easing: Easing.linear,
          }).start(()=> {this.isAnimating = false})
        }
        return (
          <Animated.View style={{ flexDirection: 'row',height: this.headerHeight, justifyContent: 'center', alignItems: 'center', backgroundColor: 'pink',}}>
            <Animated.Image
              style={{width: 30, height: 30,
                transform: [{
                  rotateZ: this.state.rotationNomal.interpolate({
                    inputRange: [0,1],
                    outputRange: ['0deg', '180deg']
                  })
                }]
              }}
              source={require('./img/load-down.png')}
            />
            <Text>{ refreshText + ' ' + percent + '%'}</Text>
          </Animated.View>
        )
      case RefreshState.releaseToRefresh:
        if(!this.isAnimating) {
          this.isAnimating = true
          Animated.timing(this.state.rotationNomal, {
            toValue: 1,
            duration: 200,
            easing: Easing.linear,
          }).start(()=> {this.isAnimating = false})
        }
        return (
          <Animated.View style={{ flexDirection: 'row',height: this.headerHeight, justifyContent: 'center', alignItems: 'center', backgroundColor: 'pink',}}>
            <Animated.Image
              style={{width: 30, height: 30,
                transform: [{
                  rotateZ: this.state.rotationNomal.interpolate({
                    inputRange: [0,1],
                    outputRange: ['0deg', '180deg']
                  })
                }]
              }}
              source={require('./img/load-down.png')}
            />
            <Text>{ refreshText + ' ' + percent + '%'}</Text>
          </Animated.View>
        )
      case RefreshState.releaseToRefresh:
        return (
          <Animated.View style={{justifyContent: 'center', alignItems: 'center', width: width, height: this.headerHeight, backgroundColor: 'pink'}} >
          </Animated.View>
        )
      case RefreshState.refreshing:
        return (
          <Animated.View style={{flexDirection: 'row', height: this.headerHeight, justifyContent: 'center', alignItems: 'center', backgroundColor: 'pink',}}>
            <Animated.Image
              style={{width: 20, height: 20,
                transform: [{
                  rotateZ: this.state.rotation.interpolate({
                    inputRange: [0,1],
                    outputRange: ['0deg', '360deg']
                  })
                }]
              }}
              source={require('./img/loading.png')}
            />
            <Text>{ refreshText }</Text>
          </Animated.View>
        )
      case RefreshState.refreshdown:
        return (
          <Animated.View style={{ flexDirection: 'row',height: this.headerHeight, justifyContent: 'center', alignItems: 'center', backgroundColor: 'pink',}}>
            <Text>{ refreshText + ' ' + percent + '%' }</Text>
          </Animated.View>
        )
      default:

    }
  }

  _ListFooterComponent = () => {
    const { footerMsg } = this.state
    const { listFooterComponent } = this.props
    if(listFooterComponent) return listFooterComponent()
    return (
      <View style={{ flex:1, justifyContent: 'center', alignItems: 'center',width: width, height: 30, backgroundColor: 'pink'}} >
         <Text style={{textAlign: 'center',}}> { footerMsg } </Text>
      </View>
    )
  }

  render() {
    const { _data } = this.state
    const { viewType, data } = this.props
    if(viewType == 'ScrollView') {
      return (
        <FlatList
          ref={ flatList => { this._flatList = flatList }}
          {...this._panResponder.panHandlers}
          {...this.props}
          onScroll={this._onScroll}
          data={['1']}
          renderItem={this._renderItem}
          keyExtractor={(v,i)=>i}
          ListHeaderComponent={this.customRefreshView}
          style={[{...this.props.style},{marginTop: -this.headerHeight}]}
        />
      )
    } else {
      return (
        <FlatList
          ref={ flatList => { this._flatList = flatList }}
          {...this._panResponder.panHandlers}
          {...this.props}
          onScroll={this._onScroll}
          data={data || this.state._data}
          renderItem={this._renderItem}
          keyExtractor={(v,i)=>i}
          ListHeaderComponent={this.customRefreshView}
          ListFooterComponent={this._ListFooterComponent}
          onEndReached={this._onEndReached} 
          onEndReachedThreshold={0.1}
          style={[{...this.props.style},{marginTop: -this.headerHeight}]}
        />
      );
    }
  }
}