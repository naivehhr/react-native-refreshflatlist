/*
 * @Author: aran.hu 
 * @Date: 2017-04-14 14:29:04 
 * @Last Modified by: aran.hu
 * @Last Modified time: 2017-04-17 10:44:31
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
const {height, width} = Dimensions.get('window');
import AndroidSwipeRefreshLayout from './AndroidSwipeRefreshLayout'
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const AnimatedVirtualizedList = Animated.createAnimatedComponent(VirtualizedList);

// 0: 未刷新; 1: 到达刷新点; 2: 刷新中;
export const RefreshState = {
  pullToRefresh: 0,
  releaseToRefresh: 1,
  refreshing: 2,
  refreshdown: 3,
}

export const RefreshText = {
  pullToRefresh: '下拉刷新',
  releaseToRefresh: '松开刷新',
  refreshing: '刷新ING....',
  refreshdown: '刷新完成!'
}

export const FooterText = {
  pushToRefresh: '上拉加载',
  loading: '加载ING....'
}

export const ViewType = {
  ListView: 'ListView',
  ScrollView: 'ScrollView'
}

export default class FlatListTest extends Component {
  static defaultProps = {
    refreshing: false,
    viewType: 'ScrollView',
  };

  static propTypes = {
    customRefreshView: PropTypes.func,
    refreshing: PropTypes.bool,
    onRefreshFun: PropTypes.func,
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
      footerMsg: FooterText.pushToRefresh
    }
    this._marginTop = new Animated.Value()
    this._scrollEndY = 0
    this.key = false // 是否到达旋转点 用来避免多次触发动画
    this.headerHeight = 60
    this.isAnimating = false //是否再执行动画 控制不滑动过程中不多次触发同一个动画
  }

  componentWillMount() {
    const { customRefreshView } = this.props
    if(customRefreshView) {
      const { height } = customRefreshView().props.style
      this.headerHeight = height
    }
    this._marginTop.setValue(-this.headerHeight)
    this._marginTop.addListener((v) => {
      //TODO: 这里要优化每一帧渲染一次的要求
      let p = parseInt(( (this.headerHeight + v.value) / (this.headerHeight)) * 100)
      this.setState({percent: (p > 100? 100: p) + '%'})
    })
  }


  componentDidMount() {
    this.initAnimated()
  }

  componentWillReceiveProps(nextProps, nextState) {
    this.setRefreshState(nextProps.refreshing)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true
  }
 
  componentWillUnmount() {
    this.t && clearTimeout(this.t);
    this.timer1 && clearTimeout(this.timer1)
    this.timer2 && clearTimeout(this.timer2)
  }

  initAnimated() {
    Animated.timing(this.state.rotation, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
    }).start((r) => {
      this.state.rotation.setValue(0)
      this.initAnimated()
    })
  }

  // 测试方法
  _onRefreshFun = () => {
    console.log('trigger refreshFun')
    this.setRefreshState(true)
    this.timer1 = setTimeout(() => {
      console.log('refreshFun complete')
      this.setRefreshState(false)
    }, 2000)
  }

  setRefreshState(refreshing){
    const { onRefreshFun } = this.props
    if (refreshing) {
      this.key = true
      this.updateRefreshViewState(RefreshState.refreshing)
    } else {
      if(this.key) {
        this.key = false
        this.updateRefreshViewState(RefreshState.refreshdown)
      } else {
        this.updateRefreshViewState(RefreshState.pullToRefresh)
      }
    }
  }

  updateRefreshViewState(refreshState = RefreshState.pullToRefresh) {
    switch (refreshState) {
      case RefreshState.pullToRefresh:
        this.setState({refreshState: RefreshState.pullToRefresh, refreshText: RefreshText.pullToRefresh},()=>{
          Animated.timing(
            this._marginTop,
            {
              toValue: -this.headerHeight,
              duration: 200,
              easing: Easing.linear
          }).start()
        })
        break;
      case RefreshState.releaseToRefresh:
        this.setState({refreshState: RefreshState.releaseToRefresh, refreshText: RefreshText.releaseToRefresh})
        break;
      case RefreshState.refreshing: 
        this.setState({refreshState: RefreshState.refreshing, refreshText: RefreshText.refreshing}, () => {
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
        this.setState({refreshState: RefreshState.refreshdown, refreshText: RefreshText.refreshdown}, () => {
          // 这个延时为了显示完成刷新的等待时间
          this.t = setTimeout(() => {
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
      default:
        
    }
  }

  _onSwipe = (movement) => {
    //NOTE: 如果处于刷新中或者刷新完成状态不再触发刷新
    if(this.state.refreshState >= RefreshState.refreshing) return
    this._scrollEndY = movement
    this._marginTop.setValue( movement - this.headerHeight )
    if(!this.key && movement >= this.headerHeight) {
      this.key = true
      this.updateRefreshViewState(RefreshState.releaseToRefresh)
    } else if(this.key && movement < this.headerHeight) {
      this.key = false
      this.updateRefreshViewState(RefreshState.pullToRefresh)
    }
  }

  _onRefresh = () => {
    if(this.state.refreshState >= RefreshState.refreshing) return
    if(this._scrollEndY >= this.headerHeight) {
      const { onRefreshFun } = this.props
      onRefreshFun?onRefreshFun(): this._onRefreshFun()
    } else {
      //下拉距离不够自动收回
      Animated.timing(
        this._marginTop,
        {
          toValue: -this.headerHeight,
          duration: 200,
          easing: Easing.linear
      }).start()
    }
  }

  _onEndReached = () => {
    this.setState({footerMsg: '加载中'})
    this.timer2 = setTimeout(() => {
      this.setState({footerMsg: '加载更多'})
    }, 1000)
  }

  _renderItem = ({item}) => {
    return (
      <View style={{width: width, height: 100, backgroundColor: 'yellow'}} >
        <Text> {item.text} </Text>
      </View>
    )
  }

  _ListHeaderComponent = () => {
    return (
      <View style={{width: width, height: this.headerHeight, backgroundColor: 'red'}} >
         <Text> Header Area</Text>
      </View>
    )
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
            <Text>{ refreshText + ' ' + percent }</Text>
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
            <Text>{ refreshText + ' ' + percent }</Text>
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
            <Text>{ refreshText + ' ' + percent }</Text>
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

  _renderItemScrollView = () => {
    const { renderContent } = this.props
    if(renderContent) {
      return renderContent()
    }
    return (
      <View style={{width: width, height: 100}} >
        <Text> {'This is a ScrollView'} </Text>
      </View>
    )
  }

  render() {
    const { viewType, data } = this.props
    return (
      <AndroidSwipeRefreshLayout 
        ref={ component => this._swipeRefreshLayout = component }
        enabledPullUp={true}
        enabledPullDown={true}
        onSwipe={this._onSwipe}
        onRefresh={this._onRefresh}>
        {
          viewType == ViewType.ScrollView?
            <AnimatedVirtualizedList
              ref={ flatList => { this._flatList = flatList }}
              data={['1']}
              renderItem={this._renderItemScrollView}
              keyExtractor={(v,i)=>i}
              ListHeaderComponent={this.customRefreshView}
              style={[{...this.props.style},{marginTop: this._marginTop}]}
            />
          :
            <AnimatedFlatList
              ref={ flatList => { this._flatList = flatList }}
              data={data || this.state._data}
              renderItem={this._renderItem}
              keyExtractor={(v,i)=>i}
              ListHeaderComponent={this.customRefreshView}
              ListFooterComponent={this._ListFooterComponent}
              onEndReached={this._onEndReached} 
              onEndReachedThreshold={0}
              {...this.props}
              style={[{...this.props.style},{marginTop: this._marginTop}]}
            />
        }
      </AndroidSwipeRefreshLayout>
    );
  }
}
