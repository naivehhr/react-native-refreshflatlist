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

var _AndroidSwipeRefreshLayout = require('./AndroidSwipeRefreshLayout');

var _AndroidSwipeRefreshLayout2 = _interopRequireDefault(_AndroidSwipeRefreshLayout);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @Author: aran.hu 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @Date: 2017-04-14 14:29:04 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @Last Modified by: aran.hu
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @Last Modified time: 2017-12-27 14:07:14
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var _Dimensions$get = _reactNative.Dimensions.get('window'),
    height = _Dimensions$get.height,
    width = _Dimensions$get.width;

var AnimatedFlatList = _reactNative.Animated.createAnimatedComponent(_reactNative.FlatList);
var AnimatedVirtualizedList = _reactNative.Animated.createAnimatedComponent(_reactNative.VirtualizedList);

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
  pushToRefresh: 'load more',
  loading: 'loading...'
};

var ViewType = exports.ViewType = {
  ListView: 'ListView',
  ScrollView: 'ScrollView'
};

var FlatListTest = function (_Component) {
  _inherits(FlatListTest, _Component);

  function FlatListTest() {
    _classCallCheck(this, FlatListTest);

    var _this = _possibleConstructorReturn(this, (FlatListTest.__proto__ || Object.getPrototypeOf(FlatListTest)).call(this));

    _this._onRefreshFun = function () {
      _this.setRefreshState(true);
      _this.timer1 = setTimeout(function () {
        _this.setRefreshState(false);
      }, 2000);
    };

    _this._onSwipe = function (movement) {
      /**
       * If you are in the refresh or refresh the completion of the state will not trigger the refresh
       */
      // this.setState({toRenderItem: false})
      if (_this.state.refreshState >= RefreshState.refreshing) return;
      _this._scrollEndY = movement;
      if (movement >= 0) _this._marginTop.setValue(movement - _this.headerHeight);
      if (movement >= _this.headerHeight) {
        _this.updateRefreshViewState(RefreshState.releaseToRefresh);
      } else if (movement < _this.headerHeight) {
        if (_this.state.refreshState === RefreshState.releaseToRefresh) _this.updateRefreshViewState(RefreshState.pullToRefresh);
      }
    };

    _this._onRefresh = function () {
      if (_this.state.refreshState >= RefreshState.refreshing) return;
      if (_this._scrollEndY >= _this.headerHeight) {
        var onRefreshFun = _this.props.onRefreshFun;

        _this.setRefreshState(true);
        onRefreshFun ? onRefreshFun() : _this._onRefreshFun();
      } else {
        //下拉距离不够自动收回
        _this.setState({ toRenderItem: true }, function () {
          _reactNative.Animated.timing(_this._marginTop, {
            toValue: -_this.headerHeight,
            duration: 200,
            easing: _reactNative.Easing.linear
          }).start(function () {
            _this.updateItemRenderState();
          });
        });
      }
      _this._scrollEndY = 0;
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

    _this._onTouchEnd = function () {
      if (!_this.state.toRenderItem) _this.setState({ toRenderItem: true });
    };

    _this._onMomentumScrollEnd = function () {
      if (!_this.state.toRenderItem) _this.setState({ toRenderItem: true });
    };

    _this._onScrollBeginDrag = function () {
      if (_this.state.toRenderItem) _this.setState({ toRenderItem: false });
    };

    _this._onScrollEndDrag = function () {
      if (!_this.state.toRenderItem) _this.setState({ toRenderItem: true });
    };

    _this._isTop = function () {
      return _this._scrollEndY == 0 ? true : false;
    };

    _this._renderItem = function (data) {
      return _react2.default.createElement(_Item2.default, _extends({
        isTriggerPressFn: _this._isTop
      }, _this.props, { data: data,
        toRenderItem: _this.state.toRenderItem }));
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
              style: {
                width: 30, height: 30,
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
              refreshText + ' ' + percent
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
              style: {
                width: 30, height: 30,
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
              refreshText + ' ' + percent
            )
          );
        case RefreshState.releaseToRefresh:
          return _react2.default.createElement(_reactNative.Animated.View, { style: { justifyContent: 'center', alignItems: 'center', width: width, height: _this.headerHeight, backgroundColor: 'pink' } });
        case RefreshState.refreshing:
          return _react2.default.createElement(
            _reactNative.Animated.View,
            { style: { flexDirection: 'row', height: _this.headerHeight, justifyContent: 'center', alignItems: 'center', backgroundColor: 'pink' } },
            _react2.default.createElement(_reactNative.Animated.Image, {
              style: {
                width: 20, height: 20,
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
              refreshText + ' ' + percent
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
      _data: _util2.default.makeData(),
      rotation: new _reactNative.Animated.Value(0),
      rotationNomal: new _reactNative.Animated.Value(0),
      refreshState: RefreshState.pullToRefresh,
      refreshText: RefreshText.pullToRefresh,
      percent: 0,
      footerMsg: FooterText.pushToRefresh,
      toRenderItem: true
    };
    _this._marginTop = new _reactNative.Animated.Value();
    _this._scrollEndY = 0;
    _this.headerHeight = 60; // Default refreshView height
    _this.isAnimating = false; // Controls the same animation not many times during the sliding process
    _this.beforeRefreshState = RefreshState.pullToRefresh;
    return _this;
  }

  _createClass(FlatListTest, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this2 = this;

      var customRefreshView = this.props.customRefreshView;

      if (customRefreshView) {
        var _height = customRefreshView(RefreshState.pullToRefresh).props.style.height;

        this.headerHeight = _height;
      }
      this._marginTop.setValue(-this.headerHeight);
      this._marginTop.addListener(function (v) {
        var p = parseInt((_this2.headerHeight + v.value) / _this2.headerHeight * 100);
        if (_this2.state.refreshState !== RefreshState.refreshdown) _this2.setState({ percent: (p > 100 ? 100 : p) + '%' });
      });
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.initAnimated();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps, nextState) {
      this.setRefreshState(nextProps.isRefresh);
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      if (this.state.refreshState != RefreshState.refreshing && nextState.refreshState == RefreshState.refreshing) {
        this.initAnimated();
      }
      return true;
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.t && clearTimeout(this.t);
      this.timer1 && clearTimeout(this.timer1);
      this.timer2 && clearTimeout(this.timer2);
    }
  }, {
    key: 'initAnimated',
    value: function initAnimated() {
      var _this3 = this;

      this.state.rotation.setValue(0);
      _reactNative.Animated.timing(this.state.rotation, {
        toValue: 1,
        duration: 1000,
        easing: _reactNative.Easing.linear
      }).start(function (r) {
        if (_this3.state.refreshState == RefreshState.refreshing) {
          _this3.initAnimated();
        }
      });
    }

    // test onRefreshFun

  }, {
    key: 'setRefreshState',
    value: function setRefreshState(refreshing) {
      var onRefreshFun = this.props.onRefreshFun;

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
          this.setState({ refreshState: RefreshState.pullToRefresh, refreshText: RefreshText.pullToRefresh }, function () {
            _reactNative.Animated.timing(_this4._marginTop, {
              toValue: -_this4.headerHeight,
              duration: 200,
              easing: _reactNative.Easing.linear
            }).start(function () {
              _this4.updateItemRenderState();
            });
          });
          break;
        case RefreshState.releaseToRefresh:
          this.setState({ refreshState: RefreshState.releaseToRefresh, refreshText: RefreshText.releaseToRefresh });
          break;
        case RefreshState.refreshing:
          this.setState({ refreshState: RefreshState.refreshing, refreshText: RefreshText.refreshing }, function () {
            _reactNative.Animated.timing(_this4._marginTop, {
              toValue: 0,
              duration: 200,
              easing: _reactNative.Easing.linear
            }).start();
          });
          break;
        case RefreshState.refreshdown:
          this.setState({ refreshState: RefreshState.refreshdown, refreshText: RefreshText.refreshdown, toRenderItem: true }, function () {
            // This delay is shown in order to show the refresh time to complete the refresh
            _this4.setState({ toRenderItem: false });
            _this4.t = setTimeout(function () {
              // 当刷新完成时，先回到初始状态保持100%, 然后在更新组件状态
              _reactNative.Animated.timing(_this4._marginTop, {
                toValue: -_this4.headerHeight,
                duration: 200,
                easing: _reactNative.Easing.linear
              }).start(function () {
                _this4.updateRefreshViewState(RefreshState.pullToRefresh);
              });
            }, 500);
          });
          break;
        default:

      }
    }

    // 滑动列表结束后，设置item可以render， 用来接收新的state

  }, {
    key: 'updateItemRenderState',
    value: function updateItemRenderState() {
      if (!this.state.toRenderItem) {
        this.setState({ toRenderItem: true });
      }
    }

    // _onTouchStart = () => {
    //   if(this.state.toRenderItem)
    //     this.setState({toRenderItem: false})
    // } 

  }, {
    key: 'render',
    value: function render() {
      var _this5 = this;

      var _props = this.props,
          viewType = _props.viewType,
          data = _props.data;

      return _react2.default.createElement(
        _AndroidSwipeRefreshLayout2.default,
        {
          ref: function ref(component) {
            return _this5._swipeRefreshLayout = component;
          },
          enabledPullUp: true,
          enabledPullDown: true,
          onSwipe: this._onSwipe,
          onRefresh: this._onRefresh },
        viewType == ViewType.ScrollView ? _react2.default.createElement(AnimatedFlatList, _extends({
          ref: function ref(flatList) {
            _this5._flatList = flatList;
          }
        }, this.props, {
          data: ['1'],
          renderItem: this._renderItem,
          keyExtractor: function keyExtractor(v, i) {
            return i;
          },
          ListHeaderComponent: this.customRefreshView,
          onTouchEnd: this._onTouchEnd,
          onScrollBeginDrag: this._onScrollBeginDrag,
          onScrollEndDrag: this._onScrollEndDrag,
          onMomentumScrollEnd: this._onMomentumScrollEnd,
          style: [_extends({}, this.props.style), {
            marginTop: this._marginTop.interpolate({
              inputRange: [-this.headerHeight, 0, 500],
              outputRange: [-this.headerHeight, 0, 150]
            })
          }]
        })) : _react2.default.createElement(AnimatedFlatList, _extends({
          ref: function ref(flatList) {
            _this5._flatList = flatList;
          }
        }, this.props, {
          data: data || this.state._data,
          keyExtractor: function keyExtractor(v, i) {
            return i;
          },
          renderItem: this._renderItem,
          ListHeaderComponent: this.customRefreshView,
          ListFooterComponent: this._ListFooterComponent,
          onEndReached: this._onEndReached,
          onEndReachedThreshold: 10,
          onTouchEnd: this._onTouchEnd,
          onScrollBeginDrag: this._onScrollBeginDrag,
          onScrollEndDrag: this._onScrollEndDrag,
          onMomentumScrollEnd: this._onMomentumScrollEnd,
          style: [_extends({}, this.props.style), {
            marginTop: this._marginTop.interpolate({
              inputRange: [-this.headerHeight, 0, 500],
              outputRange: [-this.headerHeight, 0, 150]
            })
          }]
        }))
      );
    }
  }]);

  return FlatListTest;
}(_react.Component);

FlatListTest.defaultProps = {
  isRefresh: false,
  viewType: 'ScrollView'
};
FlatListTest.propTypes = {
  customRefreshView: _propTypes2.default.func,
  isRefresh: _propTypes2.default.bool,
  onRefreshFun: _propTypes2.default.func,
  onEndReached: _propTypes2.default.func,
  viewType: _propTypes2.default.oneOf(['ListView', 'ScrollView'])
};
exports.default = FlatListTest;