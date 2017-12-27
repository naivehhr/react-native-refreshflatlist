/*
 * @Author: aran.hu 
 * @Date: 2017-06-29 14:23:37 
 * @Last Modified by: aran.hu
 * @Last Modified time: 2017-12-27 14:24:42
 */
import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
} from 'react-native';
import _ from 'lodash'
export default class Item extends Component {
  
  shouldComponentUpdate(nextProps, nextState) {
    if(this.props.viewType === 'ListView') {
      // listview 更新逻辑
      return !_.isEqual(this.props.data, nextProps.data)
    }
    return nextProps.toRenderItem
  }
  
  render() {
    const { renderItem, data, isTriggerPressFn=()=>true} = this.props
    return renderItem(isTriggerPressFn, data)
  }
}