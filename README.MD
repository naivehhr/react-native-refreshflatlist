## RefreshFlatList & RefreshVirtualizedList
[![npm](https://img.shields.io/npm/v/react-native-refreshflatlist.svg)](https://www.npmjs.com/package/react-native-refreshflatlist)
[![npm](https://img.shields.io/npm/dm/react-native-refreshflatlist.svg)](https://www.npmjs.com/package/react-native-refreshflatlist)
[![npm](https://img.shields.io/npm/dt/react-native-refreshflatlist.svg)](https://www.npmjs.com/package/react-native-refreshflatlist)

> 一个简单的支持双平台自定义头部刷新组件目前只支持 FlatList (RN >= 0.43)

### Preview

* ListView

<img src="img/ios-listview.gif" width = "35%" />
<img src="img/android-listview.gif" width = "35%" />


* ScrollView

<img src="img/ios-scrollview.gif" width = "35%" />
<img src="img/android-scrollview.gif" width = "35%" />



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
      footerMsg: ''
    }
  }
  componentDidMount() {
    this.setState({_data: [1,2,3,4]})
  }

  _onRefreshFun = () => {
    this.setState({refreshing: true})
    setTimeout(() => {
      this.setState({refreshing: false})
    },2000)
  }

  _renderItem = ({item}) => {
    // ListView Item
    return (
      <View style={{width: width, height: 100}} >
        <Text>{'list item' + item.title} </Text>
      </View>
    )
  }
  
  
	/**
    * refreshState: 0: pullToRefresh; 1: releaseToRefresh; 2: refreshing; 3: refreshdown
    * percent:
    */
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
        return (talk
          <Animated.View style={{justifyContent: 'center', alignItems: 'center', width: width, height: headerHeight, backgroundColor: 'red'}} >
            <Text>{ 'release to refresh' + percent }</Text>
          </Animated.View>
        )
      case RefreshState.refreshing:
        return (
          <Animated.View style={{justifyContent: 'center', alignItems: 'center', width: width, height: headerHeight, backgroundColor: 'red'}} >
            <Text>{ 'refreshing....' + percent }</Text>
          </Animated.View>
        )
      case RefreshState.refreshdown:
        return (
          <Animated.View style={{ flexDirection: 'row',height: headerHeight, justifyContent: 'center', alignItems: 'center', backgroundColor: 'red',}}>
            <Text>{ 'refresh complete' }</Text>
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
| ...ListView.propTypes	| | | | | [doc](http://facebook.github.io/react-native/docs/flatlist.html)
| customRefreshView		| func	| Yes | DefaultView | 自定义头部组件
| onRefreshFun		    | func	| Yes | DefaultTestFun | 触发刷新调用的方法
| isRefreshing         	| boolean | | false | 
| viewType        		| object | Yes | ScrollView | ScrollView, ListView|




> 注： 本组件Android手势模块基于 [react-native-smart-pull-to-refresh-listview](https://github.com/react-native-component/react-native-smart-pull-to-refresh-listview/)
