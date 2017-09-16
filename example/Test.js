import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Button,
  Alert,
  FlatList,
  VirtualizedList,
  ViewPagerAndroid,
  ScrollView
} from 'react-native';
import RefreshFlatList, { RefreshState, ViewType } from 'react-native-refreshflatlist'
const { height, width } = Dimensions.get('window');
import Swiper from 'react-native-swiper';
export default class Test extends Component {
  constructor() {
    super()
    this.state = {
    }
  }

  _renderItem = () => {
    return (
      <View style={{ flex: 1}}>
        <Swiper style={{ height: 200}}   showsButtons={true}>
          <View style={styles.slide1}>
            <Text style={styles.text}>Hello Swiper</Text>
          </View>
          <View style={styles.slide2}>
            <Text style={styles.text}>Beautiful</Text>
          </View>
          <View style={styles.slide3}>
            <Text style={styles.text}>And simple</Text>
          </View>
        </Swiper>
      </View>
    )
  }

  render() {
    return (
      <View style={{ flex: 1 }} >
        <RefreshFlatList
          viewType={'ScrollView'}
          renderItem={this._renderItem}
          removeClippedSubviews={false}
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
  wrapper: {
    flex: 1,
    height: height,
  },
  slide1: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },
  slide2: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },
  slide3: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
  },
  text: {
    color: 'red',
    fontSize: 30,
    fontWeight: 'bold',
  }
});