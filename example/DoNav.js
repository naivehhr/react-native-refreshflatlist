import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Button,
  Alert,
  ScrollView,
  LayoutAnimation
} from 'react-native';

import {
  StackNavigator,
  TabNavigator,
  DrawerNavigator,
  DrawerItems,
  NavigationActions,
  TabBarTop
} from 'react-navigation'
const { height, width } = Dimensions.get('window');

class DoNav extends Component {
  componentDidMount() {
  }
  render() {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: 'blue' }}>
        <View style={{ width: width, height: 200, backgroundColor: 'red' }} />
        <TabStack />
        
      </ScrollView>
    );
  }
}
class TestListView extends Component {

  render() {
    return (
      <View style={{backgroundColor: 'yellow'}}>
        <View style={{height: 100}}><Text> TestListView </Text></View>
        <View style={{height: 100}}><Text> TestListView </Text></View>
      </View>
    );
  }
}

class TestScrollView extends Component {
  static navigationOptions = (ll) => {
    {
      tabBarOnPress: (props) => {
        jumpToIndex(scene.index);
      }
    }
  }

  state = {
    key: true
  }

  componentDidMount() {
    setTimeout(() => {
    LayoutAnimation.easeInEaseOut();
      
      this.setState({key: false})
    }, 5000);
  }
  
  render() {
    const { key } = this.state
    let v
    if(key){
      v = (
        <View style={{backgroundColor: 'green'}}>
          <View style={{height: 100}}><Text> TestListView </Text></View>
          <View style={{height: 100}}><Text> TestListView </Text></View>
          <View style={{height: 100}}><Text> TestListView </Text></View>
          <View style={{height: 100}}><Text> TestListView </Text></View>
          <View style={{height: 100}}><Text> TestListView </Text></View>
          <View style={{height: 100}}><Text> TestListView </Text></View>
        </View>
      )
    } else {
      v = (
        <View style={{backgroundColor: 'green'}}>
          <View style={{height: 100}}><Text> TestListView </Text></View>
        </View>
      )
    }
    return (
      <View>{v}</View>
    );
  }
}

const TabStack = TabNavigator({
  Test_ListView: {
    screen: TestListView,
  },
  Test_ScrollView: {
    screen: TestScrollView,
  },
}, {
    initialRouteName: 'Test_ListView',
    tabBarComponent: TabBarTop,
    tabBarPosition: 'top'
  });
const MyTabNavigator = TabNavigator({
  Track: {
    screen: TestListView,
  },
  Details: {
    screen: TestScrollView,
  }
}, {
    tabBarPosition: 'bottom',
    tabBarOptions: {
      upperCaseLabel: false,
      activeTintColor: '#7562DB',
      inactiveTintColor: '#7562DB',
      pressColor: '#7562DB',
      indicatorStyle: { backgroundColor: '#6458A8' },
      style: {
        backgroundColor: '#fff'
      }
    },
    navigationOptions: ({ navigation }) => ({
      tabBarOnPress: (scene, jumpToIndex) => {
        console.log('onPress:', scene.route);
        jumpToIndex(scene.index);
      },
    }),
  });
export default DoNav
