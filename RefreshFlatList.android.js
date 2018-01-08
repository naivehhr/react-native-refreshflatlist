/*
 * @Author: aran.hu 
 * @Date: 2017-04-14 14:29:04 
 * @Last Modified by: aran.hu
 * @Last Modified time: 2017-12-27 14:07:14
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
  ScrollView,
  TouchableOpacity
} from 'react-native';

import Util from './util'
import Item from './Item'
const { height, width } = Dimensions.get('window');
import AndroidSwipeRefreshLayout from './AndroidSwipeRefreshLayout'
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const AnimatedVirtualizedList = Animated.createAnimatedComponent(VirtualizedList);

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
  pushToRefresh: 'load more',
  loading: 'loading...'
}

export const ViewType = {
  ListView: 'ListView',
  ScrollView: 'ScrollView'
}

export default class FlatListTest extends Component {
  static defaultProps = {
    isRefresh: false,
    viewType: 'ScrollView',
  };

  static propTypes = {
    customRefreshView: PropTypes.func,
    isRefresh: PropTypes.bool,
    onRefreshFun: PropTypes.func,
    onEndReached: PropTypes.func,
    viewType: PropTypes.oneOf(['ListView', 'ScrollView'])
  };

  constructor() {
    super()
    this.state = {
      _data: Util.makeData(),
      rotation: new Animated.Value(0),
      rotationNomal: new Animated.Value(0),
      refreshState: RefreshState.pullToRefresh,
      refreshText: RefreshText.pullToRefresh,
      percent: 0,
      footerMsg: FooterText.pushToRefresh,
      toRenderItem: true
    }
    this._marginTop = new Animated.Value()
    this._scrollEndY = 0
    this.headerHeight = 60 // Default refreshView height
    this.isAnimating = false // Controls the same animation not many times during the sliding process
    this.beforeRefreshState = RefreshState.pullToRefresh
  }

  componentWillMount() {
    const { customRefreshView } = this.props
    if (customRefreshView) {
      const { height } = customRefreshView(RefreshState.pullToRefresh).props.style
      this.headerHeight = height
    }
    this._marginTop.setValue(-this.headerHeight)
    this._marginTop.addListener((v) => {
      let p = parseInt(((this.headerHeight + v.value) / (this.headerHeight)) * 100)
      if (this.state.refreshState !== RefreshState.refreshdown)
        this.setState({ percent: (p > 100 ? 100 : p) + '%' })
    })
  }


  componentDidMount() {
    this.initAnimated()
  }

  componentWillReceiveProps(nextProps, nextState) {
    this.setRefreshState(nextProps.isRefresh)
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.refreshState != RefreshState.refreshing
      && nextState.refreshState == RefreshState.refreshing) {
      this.initAnimated()
    }
    return true
  }

  componentWillUnmount() {
    this.t && clearTimeout(this.t);
    this.timer1 && clearTimeout(this.timer1)
    this.timer2 && clearTimeout(this.timer2)
  }

  initAnimated() {
    this.state.rotation.setValue(0)
    Animated.timing(this.state.rotation, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
    }).start((r) => {
      if (this.state.refreshState == RefreshState.refreshing) {
        this.initAnimated()
      }
    })
  }

  // test onRefreshFun
  _onRefreshFun = () => {
    this.setRefreshState(true)
    this.timer1 = setTimeout(() => {
      this.setRefreshState(false)
    }, 2000)
  }

  setRefreshState(refreshing) {
    const { onRefreshFun } = this.props
    if (refreshing) {
      this.beforeRefreshState = RefreshState.refreshing
      this.updateRefreshViewState(RefreshState.refreshing)
    } else {
      if (this.beforeRefreshState == RefreshState.refreshing) {
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
        this.setState({ refreshState: RefreshState.pullToRefresh, refreshText: RefreshText.pullToRefresh }, () => {
          Animated.timing(
            this._marginTop,
            {
              toValue: -this.headerHeight,
              duration: 200,
              easing: Easing.linear
            }).start(() => {
              this.updateItemRenderState()
            })
        })
        break;
      case RefreshState.releaseToRefresh:
        this.setState({ refreshState: RefreshState.releaseToRefresh, refreshText: RefreshText.releaseToRefresh })
        break;
      case RefreshState.refreshing:
        this.setState({ refreshState: RefreshState.refreshing, refreshText: RefreshText.refreshing }, () => {
          Animated.timing(
            this._marginTop,
            {
              toValue: 0,
              duration: 200,
              easing: Easing.linear
            }).start()
        })
        break;
      case RefreshState.refreshdown:
        this.setState({ refreshState: RefreshState.refreshdown, refreshText: RefreshText.refreshdown, toRenderItem: true }, () => {
          // This delay is shown in order to show the refresh time to complete the refresh
          this.setState({ toRenderItem: false })
          this.t = setTimeout(() => {
            // 当刷新完成时，先回到初始状态保持100%, 然后在更新组件状态
            Animated.timing(
              this._marginTop,
              {
                toValue: -this.headerHeight,
                duration: 200,
                easing: Easing.linear
              }).start(() => {
                this.updateRefreshViewState(RefreshState.pullToRefresh)
              })
          }, 500)
        })
        break
      default:

    }
  }

  // 滑动列表结束后，设置item可以render， 用来接收新的state
  updateItemRenderState() {
    if (!this.state.toRenderItem) {
      this.setState({ toRenderItem: true })
    }
  }

  _onSwipe = (movement) => {
    /**
     * If you are in the refresh or refresh the completion of the state will not trigger the refresh
     */
    // this.setState({toRenderItem: false})
    if (this.state.refreshState >= RefreshState.refreshing) return
    this._scrollEndY = movement
    if(movement >= 0) this._marginTop.setValue( movement - this.headerHeight )
    if(movement >= this.headerHeight) {
      this.updateRefreshViewState(RefreshState.releaseToRefresh)
    } else if (movement < this.headerHeight) {
      if (this.state.refreshState === RefreshState.releaseToRefresh)
        this.updateRefreshViewState(RefreshState.pullToRefresh)
    }
  }

  _onRefresh = () => {
    if (this.state.refreshState >= RefreshState.refreshing) return
    if (this._scrollEndY >= this.headerHeight) {
      const { onRefreshFun } = this.props
      this.setRefreshState(true)
      onRefreshFun ? onRefreshFun() : this._onRefreshFun()
    } else {
      //下拉距离不够自动收回
      this.setState({ toRenderItem: true }, () => {
        Animated.timing(
          this._marginTop,
          {
            toValue: -this.headerHeight,
            duration: 200,
            easing: Easing.linear
          }).start(() => {
            this.updateItemRenderState()
          })
      })
    }
    this._scrollEndY = 0
  }

  _onEndReached = () => {
    const { onEndReached } = this.props
    if (onEndReached) {
      return onEndReached()
    }
    this.setState({ footerMsg: 'loading' })
    this.timer2 = setTimeout(() => {
      this.setState({ footerMsg: 'load more' })
    }, 1000)
  }

  // _onTouchStart = () => {
  //   if(this.state.toRenderItem)
  //     this.setState({toRenderItem: false})
  // } 
  _onTouchEnd = () => {
    if (!this.state.toRenderItem)
      this.setState({ toRenderItem: true })
  }
  _onMomentumScrollEnd = () => {
    if (!this.state.toRenderItem)
      this.setState({ toRenderItem: true })
  }

  _onScrollBeginDrag = () => {
    if (this.state.toRenderItem)
      this.setState({ toRenderItem: false })
  }

  _onScrollEndDrag = () => {
    if (!this.state.toRenderItem)
      this.setState({ toRenderItem: true })
  }

  _isTop = () => {
    return this._scrollEndY == 0 ? true : false
  }

  _renderItem = (data) => {
    return <Item 
      isTriggerPressFn={this._isTop} 
      {...this.props} data={data} 
      toRenderItem={this.state.toRenderItem} />
  }

  customRefreshView = () => {
    const { customRefreshView } = this.props
    const { refreshState, refreshText, percent } = this.state
    if (customRefreshView) return customRefreshView(refreshState, percent)
    switch (refreshState) {
      case RefreshState.pullToRefresh:
        if (!this.isAnimating) {
          this.isAnimating = true
          Animated.timing(this.state.rotationNomal, {
            toValue: 0,
            duration: 200,
            easing: Easing.linear,
          }).start(() => { this.isAnimating = false })
        }
        return (
          <Animated.View style={{ flexDirection: 'row', height: this.headerHeight, justifyContent: 'center', alignItems: 'center', backgroundColor: 'pink', }}>
            <Animated.Image
              style={{
                width: 30, height: 30,
                transform: [{
                  rotateZ: this.state.rotationNomal.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '180deg']
                  })
                }]
              }}
              source={require('./img/load-down.png')}
            />
            <Text>{refreshText + ' ' + percent}</Text>
          </Animated.View>
        )
      case RefreshState.releaseToRefresh:
        if (!this.isAnimating) {
          this.isAnimating = true
          Animated.timing(this.state.rotationNomal, {
            toValue: 1,
            duration: 200,
            easing: Easing.linear,
          }).start(() => { this.isAnimating = false })
        }
        return (
          <Animated.View style={{ flexDirection: 'row', height: this.headerHeight, justifyContent: 'center', alignItems: 'center', backgroundColor: 'pink', }}>
            <Animated.Image
              style={{
                width: 30, height: 30,
                transform: [{
                  rotateZ: this.state.rotationNomal.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '180deg']
                  })
                }]
              }}
              source={require('./img/load-down.png')}
            />
            <Text>{refreshText + ' ' + percent}</Text>
          </Animated.View>
        )
      case RefreshState.releaseToRefresh:
        return (
          <Animated.View style={{ justifyContent: 'center', alignItems: 'center', width: width, height: this.headerHeight, backgroundColor: 'pink' }} >
          </Animated.View>
        )
      case RefreshState.refreshing:
        return (
          <Animated.View style={{ flexDirection: 'row', height: this.headerHeight, justifyContent: 'center', alignItems: 'center', backgroundColor: 'pink', }}>
            <Animated.Image
              style={{
                width: 20, height: 20,
                transform: [{
                  rotateZ: this.state.rotation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg']
                  })
                }]
              }}
              source={require('./img/loading.png')}
            />
            <Text>{refreshText}</Text>
          </Animated.View>
        )
      case RefreshState.refreshdown:
        return (
          <Animated.View style={{ flexDirection: 'row', height: this.headerHeight, justifyContent: 'center', alignItems: 'center', backgroundColor: 'pink', }}>
            <Text>{refreshText + ' ' + percent}</Text>
          </Animated.View>
        )
      default:

    }
  }

  _ListFooterComponent = () => {
    const { footerMsg } = this.state
    const { listFooterComponent } = this.props
    if (listFooterComponent) return listFooterComponent()
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: width, height: 30, backgroundColor: 'pink' }} >
        <Text style={{ textAlign: 'center', }}> {footerMsg} </Text>
      </View>
    )
  }

  render() {
    const { viewType, data } = this.props
    return (
      <AndroidSwipeRefreshLayout
        ref={component => this._swipeRefreshLayout = component}
        enabledPullUp={true}
        enabledPullDown={true}
        onSwipe={this._onSwipe}
        onRefresh={this._onRefresh}>
        {
          viewType == ViewType.ScrollView ?
            <AnimatedFlatList
              ref={flatList => { this._flatList = flatList }}
              {...this.props}
              data={['1']}
              renderItem={this._renderItem}
              keyExtractor={(v, i) => i}
              ListHeaderComponent={this.customRefreshView}
              onTouchEnd={this._onTouchEnd}
              onScrollBeginDrag={this._onScrollBeginDrag}
              onScrollEndDrag={this._onScrollEndDrag}
              onMomentumScrollEnd={this._onMomentumScrollEnd}
              style={[{ ...this.props.style },
              {
                marginTop: this._marginTop.interpolate({
                  inputRange: [-this.headerHeight, 0, 500],
                  outputRange: [-this.headerHeight, 0, 150]
                })
              }]}
            />
            :
            <AnimatedFlatList
              ref={flatList => { this._flatList = flatList }}
              {...this.props}
              data={data || this.state._data}
              keyExtractor={(v, i) => i}
              renderItem={this._renderItem}
              ListHeaderComponent={this.customRefreshView}
              ListFooterComponent={this._ListFooterComponent}
              onEndReached={this._onEndReached}
              onEndReachedThreshold={10}
              onTouchEnd={this._onTouchEnd}
              onScrollBeginDrag={this._onScrollBeginDrag}
              onScrollEndDrag={this._onScrollEndDrag}
              onMomentumScrollEnd={this._onMomentumScrollEnd}
              style={[{ ...this.props.style },
              {
                marginTop: this._marginTop.interpolate({
                  inputRange: [-this.headerHeight, 0, 500],
                  outputRange: [-this.headerHeight, 0, 150]
                })
              }]}
            />
        }
      </AndroidSwipeRefreshLayout>
    );
  }
}