'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ViewType = exports.FooterText = exports.RefreshText = exports.RefreshState = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactNative = require('react-native');

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

var _Item = require('./Item');

var _Item2 = _interopRequireDefault(_Item);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @Author: aran.hu
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @Date: 2017-04-14 14:29:15
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @Last Modified by: aran.hu
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @Last Modified time: 2017-12-27 14:02:47
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var _Dimensions$get = _reactNative.Dimensions.get('window'),
    height = _Dimensions$get.height,
    width = _Dimensions$get.width;

// 0: 未刷新; 1: 到达刷新点; 2: 刷新中; 3: 刷新完成


var RefreshState = exports.RefreshState = {
  pullToRefresh: 0,
  releaseToRefresh: 1,
  refreshing: 2,
  refreshdown: 3
};

var RefreshText = exports.RefreshText = {
  pullToRefresh: 'pull to refresh',
  releaseToRefresh: 'release to refresh ',
  refreshing: 'refreshing...',
  refreshdown: 'refresh complete!'
};

var FooterText = exports.FooterText = {
  pushToRefresh: 'pull to refresh',
  loading: 'refreshing...'
};

var ViewType = exports.ViewType = {
  ListView: 'ListView',
  ScrollView: 'ScrollView'
};

var RefreshFlatList = function (_Component) {
  _inherits(RefreshFlatList, _Component);

  function RefreshFlatList() {
    _classCallCheck(this, RefreshFlatList);

    var _this = _possibleConstructorReturn(this, (RefreshFlatList.__proto__ || Object.getPrototypeOf(RefreshFlatList)).call(this));

    _this._onRefreshFun = function () {
      _this.setRefreshState(true);
      _this.timer1 = setTimeout(function () {
        _this.setRefreshState(false);
      }, 2000);
    };

    _this._onEndReached = function () {
      var onEndReached = _this.props.onEndReached;

      if (onEndReached) {
        return onEndReached();
      }
      _this.setState({ footerMsg: 'loading' });
      _this.timer2 = setTimeout(function () {
        _this.setState({ footerMsg: 'load more' });
      }, 1000);
    };

    _this._onScroll = function (e) {
      var y = e.nativeEvent.contentOffset.y;

      _this._scrollEndY = y;
      if (_this._scrollEndY == 0) _this.setState({ toRenderItem: true });
      if (!_this.isOnMove && -y >= 0) {
        //刷新状态下，上推列表依percent然显示100%
        var p = parseInt(-y / _this.headerHeight * 100);
        if (_this.state.refreshState !== RefreshState.refreshdown) _this.setState({ percent: p > 100 ? 100 : p });
      }
    };

    _this._renderItem = function (item) {
      return _react2.default.createElement(_Item2.default, _extends({}, _this.props, { item: item, toRenderItem: _this.state.toRenderItem }));
    };

    _this.customRefreshView = function () {
      var customRefreshView = _this.props.customRefreshView;
      var _this$state = _this.state,
          refreshState = _this$state.refreshState,
          refreshText = _this$state.refreshText,
          percent = _this$state.percent;

      if (customRefreshView) return customRefreshView(refreshState, percent);
      switch (refreshState) {
        case RefreshState.pullToRefresh:
          // this.isAnimating 这里是为了控制动画不被重复触发
          if (!_this.isAnimating) {
            _this.isAnimating = true;
            _reactNative.Animated.timing(_this.state.rotationNomal, {
              toValue: 0,
              duration: 200,
              easing: _reactNative.Easing.linear
            }).start(function () {
              _this.isAnimating = false;
            });
          }
          return _react2.default.createElement(
            _reactNative.Animated.View,
            { style: { flexDirection: 'row', height: _this.headerHeight, justifyContent: 'center', alignItems: 'center', backgroundColor: 'pink' } },
            _react2.default.createElement(_reactNative.Animated.Image, {
              style: { width: 30, height: 30,
                transform: [{
                  rotateZ: _this.state.rotationNomal.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '180deg']
                  })
                }]
              },
              source: require('./img/load-down.png')
            }),
            _react2.default.createElement(
              _reactNative.Text,
              null,
              refreshText + ' ' + percent + '%'
            )
          );
        case RefreshState.releaseToRefresh:
          if (!_this.isAnimating) {
            _this.isAnimating = true;
            _reactNative.Animated.timing(_this.state.rotationNomal, {
              toValue: 1,
              duration: 200,
              easing: _reactNative.Easing.linear
            }).start(function () {
              _this.isAnimating = false;
            });
          }
          return _react2.default.createElement(
            _reactNative.Animated.View,
            { style: { flexDirection: 'row', height: _this.headerHeight, justifyContent: 'center', alignItems: 'center', backgroundColor: 'pink' } },
            _react2.default.createElement(_reactNative.Animated.Image, {
              style: { width: 30, height: 30,
                transform: [{
                  rotateZ: _this.state.rotationNomal.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '180deg']
                  })
                }]
              },
              source: require('./img/load-down.png')
            }),
            _react2.default.createElement(
              _reactNative.Text,
              null,
              refreshText + ' ' + percent + '%'
            )
          );
        case RefreshState.releaseToRefresh:
          return _react2.default.createElement(_reactNative.Animated.View, { style: { justifyContent: 'center', alignItems: 'center', width: width, height: _this.headerHeight, backgroundColor: 'pink' } });
        case RefreshState.refreshing:
          return _react2.default.createElement(
            _reactNative.Animated.View,
            { style: { flexDirection: 'row', height: _this.headerHeight, justifyContent: 'center', alignItems: 'center', backgroundColor: 'pink' } },
            _react2.default.createElement(_reactNative.Animated.Image, {
              style: { width: 20, height: 20,
                transform: [{
                  rotateZ: _this.state.rotation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg']
                  })
                }]
              },
              source: require('./img/loading.png')
            }),
            _react2.default.createElement(
              _reactNative.Text,
              null,
              refreshText
            )
          );
        case RefreshState.refreshdown:
          return _react2.default.createElement(
            _reactNative.Animated.View,
            { style: { flexDirection: 'row', height: _this.headerHeight, justifyContent: 'center', alignItems: 'center', backgroundColor: 'pink' } },
            _react2.default.createElement(
              _reactNative.Text,
              null,
              refreshText + ' ' + percent + '%'
            )
          );
        default:

      }
    };

    _this._ListFooterComponent = function () {
      var footerMsg = _this.state.footerMsg;
      var listFooterComponent = _this.props.listFooterComponent;

      if (listFooterComponent) return listFooterComponent();
      return _react2.default.createElement(
        _reactNative.View,
        { style: { flex: 1, justifyContent: 'center', alignItems: 'center', width: width, height: 30, backgroundColor: 'pink' } },
        _react2.default.createElement(
          _reactNative.Text,
          { style: { textAlign: 'center' } },
          ' ',
          footerMsg,
          ' '
        )
      );
    };

    _this.state = {
      _data: [],
      rotation: new _reactNative.Animated.Value(0),
      rotationNomal: new _reactNative.Animated.Value(0),
      refreshState: RefreshState.pullToRefresh,
      refreshText: RefreshText.pullToRefresh,
      percent: 0,
      footerMsg: 'load more',
      toRenderItem: true
    };
    _this._scrollEndY = 0;
    _this.headerHeight = 60;
    _this.mTop = 0; // Record distance from top to top
    _this.isOnMove = false; // Distinguish whether the finger is triggered Slip; Calculate the sliding percentage
    _this.isAnimating = false; //Controls the same animation not many times during the sliding process
    _this.beforeRefreshState = RefreshState.pullToRefresh;
    return _this;
  }

  _createClass(RefreshFlatList, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this2 = this;

      var customRefreshView = this.props.customRefreshView;

      if (customRefreshView) {
        var _height = customRefreshView(RefreshState.pullToRefresh).props.style.height;

        this.headerHeight = _height;
      }

      this._panResponder = _reactNative.PanResponder.create({
        onStartShouldSetPanResponder: function onStartShouldSetPanResponder(event, gestureState) {
          return true;
        },
        onStartShouldSetPanResponderCapture: function onStartShouldSetPanResponderCapture(event, gestureState) {
          return true;
        },
        onMoveShouldSetPanResponder: function onMoveShouldSetPanResponder(event, gestureState) {
          return false;
        },
        onMoveShouldSetPanResponderCapture: function onMoveShouldSetPanResponderCapture(event, gestureState) {
          return false;
        },
        onPanResponderTerminationRequest: function onPanResponderTerminationRequest(event, gestureState) {
          return true;
        },
        onPanResponderGrant: function onPanResponderGrant(event, gestureState) {
          _this2.onStart(event, gestureState);
        },
        onPanResponderMove: function onPanResponderMove(event, gestureState) {
          _this2.onMove(event, gestureState);
        },
        onPanResponderRelease: function onPanResponderRelease(event, gestureState) {
          _this2.onEnd(event, gestureState);
        }
      });
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {}
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps, nextState) {
      this.setRefreshState(nextProps.isRefresh);
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      /**
       * This code is just an example of the rotation animation.
       */
      if (this.state.refreshState != RefreshState.refreshing && nextState.refreshState == RefreshState.refreshing) {
        this.initAnimated();
      }
      return true;
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.t && clearTimeout(this.t);
      this.tt && clearTimeout(this.tt);
      this.timer1 && clearTimeout(this.timer1);
      this.timer2 && clearTimeout(this.timer2);
    }
  }, {
    key: 'initAnimated',
    value: function initAnimated() {
      var _this3 = this;

      this.state.rotation.setValue(0);
      this._an = _reactNative.Animated.timing(this.state.rotation, {
        toValue: 1,
        duration: 1000,
        easing: _reactNative.Easing.linear
      }).start(function (r) {
        if (_this3.state.refreshState == RefreshState.refreshing) {
          _this3.initAnimated();
        }
      });
    }

    // Test onRefreshFun

  }, {
    key: 'setRefreshState',
    value: function setRefreshState(refreshing) {
      if (refreshing) {
        this.beforeRefreshState = RefreshState.refreshing;
        this.updateRefreshViewState(RefreshState.refreshing);
      } else {
        if (this.beforeRefreshState == RefreshState.refreshing) {
          this.beforeRefreshState = RefreshState.pullToRefresh;
          this.updateRefreshViewState(RefreshState.refreshdown);
        } else {
          // this.updateRefreshViewState(RefreshState.pullToRefresh)
        }
      }
    }
  }, {
    key: 'updateRefreshViewState',
    value: function updateRefreshViewState() {
      var _this4 = this;

      var refreshState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : RefreshState.pullToRefresh;

      switch (refreshState) {
        case RefreshState.pullToRefresh:
          this.setState({ refreshState: RefreshState.pullToRefresh, refreshText: RefreshText.pullToRefresh });
          break;
        case RefreshState.releaseToRefresh:
          this.setState({ refreshState: RefreshState.releaseToRefresh, refreshText: RefreshText.releaseToRefresh });
          break;
        case RefreshState.refreshing:
          this.setState({ refreshState: RefreshState.refreshing, refreshText: RefreshText.refreshing }, function () {
            _this4._flatList.scrollToOffset({ animated: true, offset: -_this4.headerHeight });
          });
          break;
        case RefreshState.refreshdown:
          this.setState({ refreshState: RefreshState.refreshdown, refreshText: RefreshText.refreshdown, percent: 100, toRenderItem: true }, function () {
            // This delay is shown in order to show the refresh time to complete the refresh
            _this4.t = setTimeout(function () {
              _this4._flatList.scrollToOffset({ animated: true, offset: 0 });
              _this4.tt = setTimeout(function () {
                _this4.updateRefreshViewState(RefreshState.pullToRefresh);
              }, 500);
            }, 500);
          });
        default:

      }
    }
  }, {
    key: 'onStart',
    value: function onStart(e, g) {
      this.isOnMove = true;
      this.setState({ toRenderItem: false });
    }
  }, {
    key: 'onMove',
    value: function onMove(e, g) {
      this.mTop = g.dy;
      if (g.dy >= 0) {
        var p = parseInt(g.dy / (2 * this.headerHeight) * 100);
        p = p > 100 ? 100 : p;
        this.setState({ percent: p });
        if (p < 100) {
          this.updateRefreshViewState(RefreshState.pullToRefresh);
        } else {
          this.updateRefreshViewState(RefreshState.releaseToRefresh);
        }
      }
    }
  }, {
    key: 'onEnd',
    value: function onEnd(e, g) {
      this.isOnMove = false;
      if (this._scrollEndY < -this.headerHeight) {
        var onRefreshFun = this.props.onRefreshFun;

        this.setRefreshState(true);
        onRefreshFun ? onRefreshFun() : this._onRefreshFun();
      }
    }
  }, {
    key: '_shouldItemUpdate',
    value: function _shouldItemUpdate(prev, next) {
      return prev.item.text !== next.item.text;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this5 = this;

      var _data = this.state._data;
      var _props = this.props,
          viewType = _props.viewType,
          data = _props.data;

      if (viewType == 'ScrollView') {
        return _react2.default.createElement(_reactNative.FlatList, _extends({
          ref: function ref(flatList) {
            _this5._flatList = flatList;
          }
        }, this._panResponder.panHandlers, this.props, {
          onScroll: this._onScroll,
          data: ['1'],
          renderItem: this._renderItem,
          keyExtractor: function keyExtractor(v, i) {
            return i;
          },
          ListHeaderComponent: this.customRefreshView,
          style: [_extends({}, this.props.style), { marginTop: -this.headerHeight }]
        }));
      } else {
        return _react2.default.createElement(_reactNative.FlatList, _extends({
          ref: function ref(flatList) {
            _this5._flatList = flatList;
          }
        }, this._panResponder.panHandlers, this.props, {
          onScroll: this._onScroll,
          data: data || this.state._data,
          renderItem: this._renderItem,
          keyExtractor: function keyExtractor(v, i) {
            return i;
          },
          ListHeaderComponent: this.customRefreshView,
          ListFooterComponent: this._ListFooterComponent,
          onEndReached: this._onEndReached,
          onEndReachedThreshold: 0.1,
          style: [_extends({}, this.props.style), { marginTop: -this.headerHeight }]
        }));
      }
    }
  }]);

  return RefreshFlatList;
}(_react.Component);

RefreshFlatList.defaultProps = {
  isRefresh: false,
  viewType: 'ScrollView'
};
RefreshFlatList.propTypes = {
  customRefreshView: _propTypes2.default.func,
  onRefreshFun: _propTypes2.default.func,
  onEndReached: _propTypes2.default.func,
  isRefresh: _propTypes2.default.bool,
  viewType: _propTypes2.default.oneOf(['ListView', 'ScrollView'])
};
exports.default = RefreshFlatList;