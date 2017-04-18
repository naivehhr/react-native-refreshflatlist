## RefreshFlatList & RefreshVirtualizedList

> 一个简单的支持双平台自定义头部刷新组件目前只支持 FlatList (RN >= 0.43)

# *Components are not available ！！！！*

### Preview

* ListView

![IOS](img/ios.gif )

![ANDROID](img/android.gif)

* ScrollView

![Alt text](img/ios-1.gif)

> 注: 使用ViewType为ScrollView时，renderItem 请直接传入被包含的组件即可

```
// ScrollView
_renderItem = () => {
	return (
	  <View style={{width: width, height: 100}} >
	    <Text>{'我是自定义的ScrollView'} </Text>
	  </View>
	)
}

// ListView
_renderItem = ({item}) => {
    return (
      <View style={{width: width, height: 100}} >
        <Text>{'我是自定义的ListVeiwItem' + item.title} </Text>
      </View>
    )
  }
```

### Demo

See the Demo.ios.js & Demo.android.js

RO

```
git clone https://github.com/naivehhr/react-native-refreshflatlist.git
cd react-native-refreshflatlist/example && npm install
react-native react-native-refreshflatlist 

```

### Usage

```
export default class FlatListTest extends Component {
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
    // let a = Util.makeDataImmttable()
    // let c = a.toJS()
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

  _renderItem = ({item}) => {
    // ListView Item
    return (
      <View style={{width: width, height: 100}} >
        <Text>{'我是自定义的' + item.title} </Text>
      </View>
    )
  }
  
  
	/**
    * refreshState: 组件状态
    * percent: 滑动百分比
    */
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
        return (talk
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
          <Animated.View style={{ flexDirection: 'row',height: headerHeight, justifyContent: 'center', alignItems: 'center', backgroundColor: 'red',}}>
            <Text>{ '完成' }</Text>
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

  _onEndReached = () => {
    // this.setState({footerMsg: '加载中'})
    // this.timer2 = setTimeout(() => {
    //   let _d = this.state._data.concat(Util.makeData(this.state._data.length))
    //   this.setState({footerMsg: '加载更多', _data: _d})
    // }, 1000)
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
          viewType={ViewType.ListView}
        />
      </View>
    );
  }
}
```

### Props
* * * 

| Prop              	| Type    |  Optional  | Default | Description |
| --------          	| -----   | ----       | -----   | ----        |
| ...ListView.propTypes	| | | | | [doc](http://example.net/)
| customRefreshView		| func	| Yes | DefaultView | 自定义头部组件
| refreshing         	| boolean | | | 组件是否刷新
| viewType        		| object | Yes | ScrollView | ScrollView, ListView|



> 注： 本组件Android手势模块基于 [react-native-smart-pull-to-refresh-listview](https://github.com/react-native-component/react-native-smart-pull-to-refresh-listview/)
