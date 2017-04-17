/*
 * @Author: aran.hu
 * @Date: 2017-04-14 14:29:15
 * @Last Modified by: aran.hu
 * @Last Modified time: 2017-04-17 10:48:06
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
  Easing
} from 'react-native';
import Util from './util'
import Immutable from 'immutable'
const { height, width } = Dimensions.get('window');

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
export default class RefreshFlatList extends Component {

  static defaultProps = {
    refreshing: false,
    viewType: 'ScrollView',
  };

  static propTypes = {
    customRefreshView: PropTypes.func,
    refreshing: PropTypes.bool,
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
      footerMsg: '加载更多'
    }
    this._scrollEndY = 0
    this.key = false // 是否到达旋转点
    this.headerHeight = 60
    this.mTop = 0 //记录距离顶部高
    this.isOnMove = false // 区别是否是手指触发滑动: 计算滑动百分比

    this.isAnimating = false //是否再执行动画 控制不滑动过程中不多次触发同一个动画
  }

  componentWillMount() {
    const { customRefreshView } = this.props
    if(customRefreshView) {
      //更新自定义头部组件高度
      const { height } = customRefreshView().props.style
      this.headerHeight = height
    }

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (event, gestureState) => true,
      onStartShouldSetPanResponderCapture: (event, gestureState) => true,
      onMoveShouldSetPanResponder: (event, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (event, gestureState) => true,
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
    // this.setState({_data: Util.makeData()})
    this.initAnimated()
  }

  componentWillReceiveProps(nextProps, nextState) {
    this.setRefreshState(nextProps.refreshing)
  }

  componentWillUnmount() {
    this.t && clearTimeout(this.t)
    this.tt && clearTimeout(this.tt)
    this.timer1 && clearTimeout(this.timer1);
    this.timer2 && clearTimeout(this.timer2);
  }

  initAnimated() {
    this._an = Animated.timing(this.state.rotation, {
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
    console.log('触发刷新事件')
    this.setRefreshState(true)
    this.timer1 = setTimeout(() => {
      console.log('刷新完成')
      this.setRefreshState(false)
    }, 2000)
  }

  setRefreshState(refreshing){
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
        this.setState({refreshState: RefreshState.refreshdown, refreshText: RefreshText.refreshdown, percent: 100}, () => {
          // 这个延时为了显示完成刷新的等待时间
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
    this.setState({footerMsg: '加载中'})
    this.timer2 = setTimeout(() => {
      this.setState({footerMsg: '加载更多'})
    }, 1000)
  }

  _onScroll = (e) => {
    let { y } = e.nativeEvent.contentOffset
    this._scrollEndY = y
    if(!this.isOnMove && -y >= 0){
      //刷新状态下，上推列表依percent然显示100%
      let p = parseInt(( -y / (this.headerHeight)) * 100)
      this.setState({percent: (p > 100? 100: p)})
    }
  }

  onStart(e, g) {
    this.isOnMove = true
  }

  onMove(e, g) {
    this.mTop = g.dy
    if(g.dy >= 0){
      //刷新状态下，上推列表依percent然显示100%
      let p = parseInt(( g.dy / (2 * this.headerHeight)) * 100)
      this.setState({percent: (p > 100? 100: p)})
    }
    if(!this.key && this._scrollEndY < -this.headerHeight) {
      this.key = true
      this.updateRefreshViewState(RefreshState.releaseToRefresh)
    } else if(this.key && this._scrollEndY > -this.headerHeight) {
      this.key = false
      this.updateRefreshViewState(RefreshState.pullToRefresh)
    }
  }

  onEnd(e, g) {
    this.isOnMove = false
    if(this._scrollEndY < -this.headerHeight) {
      const { onRefreshFun } = this.props
      onRefreshFun?onRefreshFun(): this._onRefreshFun()
    }
  }

  _shouldItemUpdate(prev, next) {
    return prev.item.text !== next.item.text;
  }

  _renderItem = ({item}) => {
    return (
      <View style={{width: width, height: 100}} >
        <Text> {item.text} </Text>
      </View>
    )
  }

  _renderItemScrollView = () => {
    const { renderItem } = this.props
    if(renderItem) {
      return renderItem()
    }
    return (
      <View style={{width: width, height: 100}} >
        <Text> {'这是个ScrollView'} </Text>
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
        <VirtualizedList
          ref={ flatList => { this._flatList = flatList }}
          {...this._panResponder.panHandlers}
          onScroll={this._onScroll}
          data={['1']}
          renderItem={this._renderItemScrollView}
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
          onScroll={this._onScroll}
          data={data || this.state._data}
          renderItem={this._renderItem}
          keyExtractor={(v,i)=>i}
          ListHeaderComponent={this.customRefreshView}
          ListFooterComponent={this._ListFooterComponent}
          onEndReached={this._onEndReached} // 直接传入就行了
          onEndReachedThreshold={0.1}
          {...this.props}
          style={[{...this.props.style},{marginTop: -this.headerHeight}]}
        />
      );
    }
  }
}

  /*return (
    <FlatList
      ref={ flatList => { this._flatList = flatList }}
      {...this._panResponder.panHandlers}
      onScroll={this._onScroll}
      data={data || this.state._data}
      renderItem={this._renderItem}
      keyExtractor={(v,i)=>i}
      ListHeaderComponent={this.customRefreshView}
      ListFooterComponent={this._ListFooterComponent}
      onEndReached={this._onEndReached} // 直接传入就行了
      onEndReachedThreshold={0}
      {...this.props}
      style={{marginTop: -this.headerHeight}}
    />
  );*/

const styles = StyleSheet.create({

});
