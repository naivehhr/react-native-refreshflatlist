/*
 * @Author: aran.hu 
 * @Date: 2017-06-29 14:23:37 
 * @Last Modified by: aran.hu
 * @Last Modified time: 2017-06-30 10:55:36
 */
import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
} from 'react-native';
export default class Item extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.toRenderItem
  }
  
  render() {
    const { renderItem, item, bingo} = this.props
    return item?renderItem(item): renderItem()
  }
}
