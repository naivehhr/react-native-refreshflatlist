import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Button,
  Alert,
  Animated
} from 'react-native';

export default class extends Component {

  state = {
    animated: new Animated.Value(0),
    opacityA: new Animated.Value(1),
    animated2: new Animated.Value(0),
    opacityA2: new Animated.Value(1),
  }
  
  componentDidMount() {
    const { animated, opacityA, animated2, opacityA2 } = this.state

    Animated.stagger(1000, [
      Animated.loop(
        Animated.parallel([
          Animated.timing(animated, {
            toValue: 1,
            duration: 1000
          }),
          Animated.timing(opacityA, {
            toValue: 0,
            duration: 1000
          })
        ])
      ),
      Animated.loop(
        Animated.parallel([
          Animated.timing(animated2, {
            toValue: 1,
            duration: 1000
          }),
          Animated.timing(opacityA2, {
            toValue: 0,
            duration: 1000
          })
        ])
      )
    ]).start()
  }
  
  render() {
    const { opacityA, animated, animated2, opacityA2 } = this.state
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'cornflowerblue'}}>
        <Animated.View
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: 'rgba(153, 0, 0, 0.4)',
            opacity: opacityA,
            transform: [
              {
                scale: animated
              }
            ]
          }}
        >
          <Animated.View
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: 'rgba(0, 255, 0, 0.4)',
              opacity: opacityA2,
              transform: [
                {
                  scale: animated2
                }
              ]
            }}
          >
          </Animated.View>
        </Animated.View>
      </View>
    )
  }
}
