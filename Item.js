/*
 * @Author: aran.hu 
 * @Date: 2017-06-29 14:23:37 
 * @Last Modified by: aran.hu
 * @Last Modified time: 2017-06-29 14:29:40
 */
import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
} from 'react-native';
import _ from 'lodash'
export default class Item extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    if(nextProps.viewType == "ScrollView") {
      if (_.isEqual(this._renderItem, nextProps.renderItem)) {
        return false
      }
      return true
    }
    if (_.isEqual(this.props, nextProps)) {
        return false
    }
    return true
  }

  componentDidUpdate (prevProps, prevState) {
    this._renderItem = this.props.renderItem
  }
  
  render() {
    console.log('render----')
    const { renderItem, item, bingo} = this.props
    return item?renderItem(item): renderItem()
  }
}
