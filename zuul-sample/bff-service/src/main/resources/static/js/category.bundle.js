(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
// For more information about browser field, check out the browser field at https://github.com/substack/browserify-handbook#browser-field.

var styleElementsInsertedAtTop = [];

var insertStyleElement = function(styleElement, options) {
    var head = document.head || document.getElementsByTagName('head')[0];
    var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];

    options = options || {};
    options.insertAt = options.insertAt || 'bottom';

    if (options.insertAt === 'top') {
        if (!lastStyleElementInsertedAtTop) {
            head.insertBefore(styleElement, head.firstChild);
        } else if (lastStyleElementInsertedAtTop.nextSibling) {
            head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
        } else {
            head.appendChild(styleElement);
        }
        styleElementsInsertedAtTop.push(styleElement);
    } else if (options.insertAt === 'bottom') {
        head.appendChild(styleElement);
    } else {
        throw new Error('Invalid value for parameter \'insertAt\'. Must be \'top\' or \'bottom\'.');
    }
};

module.exports = {
    // Create a <link> tag with optional data attributes
    createLink: function(href, attributes) {
        var head = document.head || document.getElementsByTagName('head')[0];
        var link = document.createElement('link');

        link.href = href;
        link.rel = 'stylesheet';

        for (var key in attributes) {
            if ( ! attributes.hasOwnProperty(key)) {
                continue;
            }
            var value = attributes[key];
            link.setAttribute('data-' + key, value);
        }

        head.appendChild(link);
    },
    // Create a <style> tag with optional data attributes
    createStyle: function(cssText, attributes, extraOptions) {
        extraOptions = extraOptions || {};

        var style = document.createElement('style');
        style.type = 'text/css';

        for (var key in attributes) {
            if ( ! attributes.hasOwnProperty(key)) {
                continue;
            }
            var value = attributes[key];
            style.setAttribute('data-' + key, value);
        }

        if (style.sheet) { // for jsdom and IE9+
            style.innerHTML = cssText;
            style.sheet.cssText = cssText;
            insertStyleElement(style, { insertAt: extraOptions.insertAt });
        } else if (style.styleSheet) { // for IE8 and below
            insertStyleElement(style, { insertAt: extraOptions.insertAt });
            style.styleSheet.cssText = cssText;
        } else { // for Chrome, Firefox, and Safari
            style.appendChild(document.createTextNode(cssText));
            insertStyleElement(style, { insertAt: extraOptions.insertAt });
        }
    }
};

},{}],2:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],3:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

},{}],4:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

},{}],5:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":3,"./encode":4}],6:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.NextArrow = exports.PrevArrow = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PrevArrow = exports.PrevArrow = _react2.default.createClass({
  displayName: 'PrevArrow',


  clickHandler: function clickHandler(options, e) {
    if (e) {
      e.preventDefault();
    }
    this.props.clickHandler(options, e);
  },
  render: function render() {
    var prevClasses = { 'slick-arrow': true, 'slick-prev': true };
    var prevHandler = this.clickHandler.bind(this, { message: 'previous' });

    if (!this.props.infinite && (this.props.currentSlide === 0 || this.props.slideCount <= this.props.slidesToShow)) {
      prevClasses['slick-disabled'] = true;
      prevHandler = null;
    }

    var prevArrowProps = {
      key: '0',
      'data-role': 'none',
      className: (0, _classnames2.default)(prevClasses),
      style: { display: 'block' },
      onClick: prevHandler
    };
    var prevArrow;

    if (this.props.prevArrow) {
      prevArrow = _react2.default.cloneElement(this.props.prevArrow, prevArrowProps);
    } else {
      prevArrow = _react2.default.createElement(
        'button',
        _extends({ key: '0', type: 'button' }, prevArrowProps),
        ' Previous'
      );
    }

    return prevArrow;
  }
});

var NextArrow = exports.NextArrow = _react2.default.createClass({
  displayName: 'NextArrow',

  clickHandler: function clickHandler(options, e) {
    if (e) {
      e.preventDefault();
    }
    this.props.clickHandler(options, e);
  },
  render: function render() {
    var nextClasses = { 'slick-arrow': true, 'slick-next': true };
    var nextHandler = this.clickHandler.bind(this, { message: 'next' });

    if (!this.props.infinite) {
      if (this.props.centerMode) {
        // check if current slide is last slide
        if (this.props.currentSlide >= this.props.slideCount - 1) {
          nextClasses['slick-disabled'] = true;
          nextHandler = null;
        }
      } else {
        // check if all slides are shown in slider
        if (this.props.slideCount <= this.props.slidesToShow || this.props.currentSlide >= this.props.slideCount - this.props.slidesToShow) {
          nextClasses['slick-disabled'] = true;
          nextHandler = null;
        }
      }
    }

    var nextArrowProps = {
      key: '1',
      'data-role': 'none',
      className: (0, _classnames2.default)(nextClasses),
      style: { display: 'block' },
      onClick: nextHandler
    };

    var nextArrow;

    if (this.props.nextArrow) {
      nextArrow = _react2.default.cloneElement(this.props.nextArrow, nextArrowProps);
    } else {
      nextArrow = _react2.default.createElement(
        'button',
        _extends({ key: '1', type: 'button' }, nextArrowProps),
        ' Next'
      );
    }

    return nextArrow;
  }
});
},{"classnames":17,"react":"react"}],7:[function(require,module,exports){
'use strict';

var defaultProps = {
    className: '',
    accessibility: true,
    adaptiveHeight: false,
    arrows: true,
    autoplay: false,
    autoplaySpeed: 3000,
    centerMode: false,
    centerPadding: '50px',
    cssEase: 'ease',
    dots: false,
    dotsClass: 'slick-dots',
    draggable: true,
    easing: 'linear',
    edgeFriction: 0.35,
    fade: false,
    focusOnSelect: false,
    infinite: true,
    initialSlide: 0,
    lazyLoad: false,
    pauseOnHover: true,
    responsive: null,
    rtl: false,
    slide: 'div',
    slidesToShow: 1,
    slidesToScroll: 1,
    speed: 500,
    swipe: true,
    swipeToSlide: false,
    touchMove: true,
    touchThreshold: 5,
    useCSS: true,
    variableWidth: false,
    vertical: false,
    waitForAnimate: true,
    afterChange: null,
    beforeChange: null,
    edgeEvent: null,
    init: null,
    swipeEvent: null,
    // nextArrow, prevArrow are react componets
    nextArrow: null,
    prevArrow: null
};

module.exports = defaultProps;
},{}],8:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.Dots = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getDotCount = function getDotCount(spec) {
  var dots;
  dots = Math.ceil(spec.slideCount / spec.slidesToScroll);
  return dots;
};

var Dots = exports.Dots = _react2.default.createClass({
  displayName: 'Dots',


  clickHandler: function clickHandler(options, e) {
    // In Autoplay the focus stays on clicked button even after transition
    // to next slide. That only goes away by click somewhere outside
    e.preventDefault();
    this.props.clickHandler(options);
  },
  render: function render() {
    var _this = this;

    var dotCount = getDotCount({
      slideCount: this.props.slideCount,
      slidesToScroll: this.props.slidesToScroll
    });

    // Apply join & split to Array to pre-fill it for IE8
    //
    // Credit: http://stackoverflow.com/a/13735425/1849458
    var dots = Array.apply(null, Array(dotCount + 1).join('0').split('')).map(function (x, i) {

      var leftBound = i * _this.props.slidesToScroll;
      var rightBound = i * _this.props.slidesToScroll + (_this.props.slidesToScroll - 1);
      var className = (0, _classnames2.default)({
        'slick-active': _this.props.currentSlide >= leftBound && _this.props.currentSlide <= rightBound
      });

      var dotOptions = {
        message: 'dots',
        index: i,
        slidesToScroll: _this.props.slidesToScroll,
        currentSlide: _this.props.currentSlide
      };

      return _react2.default.createElement(
        'li',
        { key: i, className: className },
        _react2.default.createElement(
          'button',
          { onClick: _this.clickHandler.bind(_this, dotOptions) },
          i + 1
        )
      );
    });

    return _react2.default.createElement(
      'ul',
      { className: this.props.dotsClass, style: { display: 'block' } },
      dots
    );
  }
});
},{"classnames":17,"react":"react"}],9:[function(require,module,exports){
'use strict';

module.exports = require('./slider');
},{"./slider":15}],10:[function(require,module,exports){
"use strict";

var initialState = {
    animating: false,
    dragging: false,
    autoPlayTimer: null,
    currentDirection: 0,
    currentLeft: null,
    currentSlide: 0,
    direction: 1,
    listWidth: null,
    listHeight: null,
    // loadIndex: 0,
    slideCount: null,
    slideWidth: null,
    slideHeight: null,
    // sliding: false,
    // slideOffset: 0,
    swipeLeft: null,
    touchObject: {
        startX: 0,
        startY: 0,
        curX: 0,
        curY: 0
    },

    lazyLoadedList: [],

    // added for react
    initialized: false,
    edgeDragged: false,
    swiped: false, // used by swipeEvent. differentites between touch and swipe.
    trackStyle: {},
    trackWidth: 0

    // Removed
    // transformsEnabled: false,
    // $nextArrow: null,
    // $prevArrow: null,
    // $dots: null,
    // $list: null,
    // $slideTrack: null,
    // $slides: null,
};

module.exports = initialState;
},{}],11:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;
exports.InnerSlider = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _eventHandlers = require('./mixins/event-handlers');

var _eventHandlers2 = _interopRequireDefault(_eventHandlers);

var _helpers = require('./mixins/helpers');

var _helpers2 = _interopRequireDefault(_helpers);

var _initialState = require('./initial-state');

var _initialState2 = _interopRequireDefault(_initialState);

var _defaultProps = require('./default-props');

var _defaultProps2 = _interopRequireDefault(_defaultProps);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _track = require('./track');

var _dots = require('./dots');

var _arrows = require('./arrows');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var InnerSlider = exports.InnerSlider = _react2.default.createClass({
  displayName: 'InnerSlider',

  mixins: [_helpers2.default, _eventHandlers2.default],
  list: null,
  track: null,
  listRefHandler: function listRefHandler(ref) {
    this.list = ref;
  },
  trackRefHandler: function trackRefHandler(ref) {
    this.track = ref;
  },
  getInitialState: function getInitialState() {
    return _extends({}, _initialState2.default, {
      currentSlide: this.props.initialSlide
    });
  },
  getDefaultProps: function getDefaultProps() {
    return _defaultProps2.default;
  },
  componentWillMount: function componentWillMount() {
    if (this.props.init) {
      this.props.init();
    }
    this.setState({
      mounted: true
    });
    var lazyLoadedList = [];
    for (var i = 0; i < _react2.default.Children.count(this.props.children); i++) {
      if (i >= this.state.currentSlide && i < this.state.currentSlide + this.props.slidesToShow) {
        lazyLoadedList.push(i);
      }
    }

    if (this.props.lazyLoad && this.state.lazyLoadedList.length === 0) {
      this.setState({
        lazyLoadedList: lazyLoadedList
      });
    }
  },
  componentDidMount: function componentDidMount() {
    // Hack for autoplay -- Inspect Later
    this.initialize(this.props);
    this.adaptHeight();

    // To support server-side rendering
    if (!window) {
      return;
    }
    if (window.addEventListener) {
      window.addEventListener('resize', this.onWindowResized);
    } else {
      window.attachEvent('onresize', this.onWindowResized);
    }
  },
  componentWillUnmount: function componentWillUnmount() {
    if (this.animationEndCallback) {
      clearTimeout(this.animationEndCallback);
    }
    if (window.addEventListener) {
      window.removeEventListener('resize', this.onWindowResized);
    } else {
      window.detachEvent('onresize', this.onWindowResized);
    }
    if (this.state.autoPlayTimer) {
      clearInterval(this.state.autoPlayTimer);
    }
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if (this.props.slickGoTo != nextProps.slickGoTo) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('react-slick deprecation warning: slickGoTo prop is deprecated and it will be removed in next release. Use slickGoTo method instead');
      }
      this.changeSlide({
        message: 'index',
        index: nextProps.slickGoTo,
        currentSlide: this.state.currentSlide
      });
    } else if (this.state.currentSlide >= nextProps.children.length) {
      this.update(nextProps);
      this.changeSlide({
        message: 'index',
        index: nextProps.children.length - nextProps.slidesToShow,
        currentSlide: this.state.currentSlide
      });
    } else {
      this.update(nextProps);
    }
  },
  componentDidUpdate: function componentDidUpdate() {
    this.adaptHeight();
  },
  onWindowResized: function onWindowResized() {
    this.update(this.props);
    // animating state should be cleared while resizing, otherwise autoplay stops working
    this.setState({
      animating: false
    });
  },
  slickPrev: function slickPrev() {
    this.changeSlide({ message: 'previous' });
  },
  slickNext: function slickNext() {
    this.changeSlide({ message: 'next' });
  },
  slickGoTo: function slickGoTo(slide) {
    typeof slide === 'number' && this.changeSlide({
      message: 'index',
      index: slide,
      currentSlide: this.state.currentSlide
    });
  },
  render: function render() {
    var className = (0, _classnames2.default)('slick-initialized', 'slick-slider', this.props.className, {
      'slick-vertical': this.props.vertical
    });

    var trackProps = {
      fade: this.props.fade,
      cssEase: this.props.cssEase,
      speed: this.props.speed,
      infinite: this.props.infinite,
      centerMode: this.props.centerMode,
      focusOnSelect: this.props.focusOnSelect ? this.selectHandler : null,
      currentSlide: this.state.currentSlide,
      lazyLoad: this.props.lazyLoad,
      lazyLoadedList: this.state.lazyLoadedList,
      rtl: this.props.rtl,
      slideWidth: this.state.slideWidth,
      slidesToShow: this.props.slidesToShow,
      slidesToScroll: this.props.slidesToScroll,
      slideCount: this.state.slideCount,
      trackStyle: this.state.trackStyle,
      variableWidth: this.props.variableWidth
    };

    var dots;

    if (this.props.dots === true && this.state.slideCount >= this.props.slidesToShow) {
      var dotProps = {
        dotsClass: this.props.dotsClass,
        slideCount: this.state.slideCount,
        slidesToShow: this.props.slidesToShow,
        currentSlide: this.state.currentSlide,
        slidesToScroll: this.props.slidesToScroll,
        clickHandler: this.changeSlide
      };

      dots = _react2.default.createElement(_dots.Dots, dotProps);
    }

    var prevArrow, nextArrow;

    var arrowProps = {
      infinite: this.props.infinite,
      centerMode: this.props.centerMode,
      currentSlide: this.state.currentSlide,
      slideCount: this.state.slideCount,
      slidesToShow: this.props.slidesToShow,
      prevArrow: this.props.prevArrow,
      nextArrow: this.props.nextArrow,
      clickHandler: this.changeSlide
    };

    if (this.props.arrows) {
      prevArrow = _react2.default.createElement(_arrows.PrevArrow, arrowProps);
      nextArrow = _react2.default.createElement(_arrows.NextArrow, arrowProps);
    }

    var verticalHeightStyle = null;

    if (this.props.vertical) {
      verticalHeightStyle = {
        height: this.state.listHeight
      };
    }

    var centerPaddingStyle = null;

    if (this.props.vertical === false) {
      if (this.props.centerMode === true) {
        centerPaddingStyle = {
          padding: '0px ' + this.props.centerPadding
        };
      }
    } else {
      if (this.props.centerMode === true) {
        centerPaddingStyle = {
          padding: this.props.centerPadding + ' 0px'
        };
      }
    }

    var listStyle = (0, _objectAssign2.default)({}, verticalHeightStyle, centerPaddingStyle);

    return _react2.default.createElement(
      'div',
      { className: className, onMouseEnter: this.onInnerSliderEnter, onMouseLeave: this.onInnerSliderLeave },
      prevArrow,
      _react2.default.createElement(
        'div',
        {
          ref: this.listRefHandler,
          className: 'slick-list',
          style: listStyle,
          onMouseDown: this.swipeStart,
          onMouseMove: this.state.dragging ? this.swipeMove : null,
          onMouseUp: this.swipeEnd,
          onMouseLeave: this.state.dragging ? this.swipeEnd : null,
          onTouchStart: this.swipeStart,
          onTouchMove: this.state.dragging ? this.swipeMove : null,
          onTouchEnd: this.swipeEnd,
          onTouchCancel: this.state.dragging ? this.swipeEnd : null,
          onKeyDown: this.props.accessibility ? this.keyHandler : null },
        _react2.default.createElement(
          _track.Track,
          _extends({ ref: this.trackRefHandler }, trackProps),
          this.props.children
        )
      ),
      nextArrow,
      dots
    );
  }
});
}).call(this,require('_process'))
},{"./arrows":6,"./default-props":7,"./dots":8,"./initial-state":10,"./mixins/event-handlers":12,"./mixins/helpers":13,"./track":16,"_process":2,"classnames":17,"object-assign":20,"react":"react"}],12:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _trackHelper = require('./trackHelper');

var _helpers = require('./helpers');

var _helpers2 = _interopRequireDefault(_helpers);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EventHandlers = {
  // Event handler for previous and next
  changeSlide: function changeSlide(options) {
    var indexOffset, previousInt, slideOffset, unevenOffset, targetSlide;
    var _props = this.props;
    var slidesToScroll = _props.slidesToScroll;
    var slidesToShow = _props.slidesToShow;
    var _state = this.state;
    var slideCount = _state.slideCount;
    var currentSlide = _state.currentSlide;

    unevenOffset = slideCount % slidesToScroll !== 0;
    indexOffset = unevenOffset ? 0 : (slideCount - currentSlide) % slidesToScroll;

    if (options.message === 'previous') {
      slideOffset = indexOffset === 0 ? slidesToScroll : slidesToShow - indexOffset;
      targetSlide = currentSlide - slideOffset;
      if (this.props.lazyLoad) {
        previousInt = currentSlide - slideOffset;
        targetSlide = previousInt === -1 ? slideCount - 1 : previousInt;
      }
    } else if (options.message === 'next') {
      slideOffset = indexOffset === 0 ? slidesToScroll : indexOffset;
      targetSlide = currentSlide + slideOffset;
      if (this.props.lazyLoad) {
        targetSlide = (currentSlide + slidesToScroll) % slideCount + indexOffset;
      }
    } else if (options.message === 'dots' || options.message === 'children') {
      // Click on dots
      targetSlide = options.index * options.slidesToScroll;
      if (targetSlide === options.currentSlide) {
        return;
      }
    } else if (options.message === 'index') {
      targetSlide = parseInt(options.index);
      if (targetSlide === options.currentSlide) {
        return;
      }
    }

    this.slideHandler(targetSlide);
  },

  // Accessiblity handler for previous and next
  keyHandler: function keyHandler(e) {
    //Dont slide if the cursor is inside the form fields and arrow keys are pressed
    if (!e.target.tagName.match('TEXTAREA|INPUT|SELECT')) {
      if (e.keyCode === 37 && this.props.accessibility === true) {
        this.changeSlide({
          message: this.props.rtl === true ? 'next' : 'previous'
        });
      } else if (e.keyCode === 39 && this.props.accessibility === true) {
        this.changeSlide({
          message: this.props.rtl === true ? 'previous' : 'next'
        });
      }
    }
  },
  // Focus on selecting a slide (click handler on track)
  selectHandler: function selectHandler(options) {
    this.changeSlide(options);
  },
  swipeStart: function swipeStart(e) {
    var touches, posX, posY;

    if (this.props.swipe === false || 'ontouchend' in document && this.props.swipe === false) {
      return;
    } else if (this.props.draggable === false && e.type.indexOf('mouse') !== -1) {
      return;
    }
    posX = e.touches !== undefined ? e.touches[0].pageX : e.clientX;
    posY = e.touches !== undefined ? e.touches[0].pageY : e.clientY;
    this.setState({
      dragging: true,
      touchObject: {
        startX: posX,
        startY: posY,
        curX: posX,
        curY: posY
      }
    });
  },
  swipeMove: function swipeMove(e) {
    if (!this.state.dragging) {
      e.preventDefault();
      return;
    }
    if (this.state.animating) {
      return;
    }
    var swipeLeft;
    var curLeft, positionOffset;
    var touchObject = this.state.touchObject;

    curLeft = (0, _trackHelper.getTrackLeft)((0, _objectAssign2.default)({
      slideIndex: this.state.currentSlide,
      trackRef: this.track
    }, this.props, this.state));
    touchObject.curX = e.touches ? e.touches[0].pageX : e.clientX;
    touchObject.curY = e.touches ? e.touches[0].pageY : e.clientY;
    touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(touchObject.curX - touchObject.startX, 2)));

    if (this.props.verticalSwiping) {
      touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(touchObject.curY - touchObject.startY, 2)));
    }

    positionOffset = (this.props.rtl === false ? 1 : -1) * (touchObject.curX > touchObject.startX ? 1 : -1);

    if (this.props.verticalSwiping) {
      positionOffset = touchObject.curY > touchObject.startY ? 1 : -1;
    }

    var currentSlide = this.state.currentSlide;
    var dotCount = Math.ceil(this.state.slideCount / this.props.slidesToScroll);
    var swipeDirection = this.swipeDirection(this.state.touchObject);
    var touchSwipeLength = touchObject.swipeLength;

    if (this.props.infinite === false) {
      if (currentSlide === 0 && swipeDirection === 'right' || currentSlide + 1 >= dotCount && swipeDirection === 'left') {
        touchSwipeLength = touchObject.swipeLength * this.props.edgeFriction;

        if (this.state.edgeDragged === false && this.props.edgeEvent) {
          this.props.edgeEvent(swipeDirection);
          this.setState({ edgeDragged: true });
        }
      }
    }

    if (this.state.swiped === false && this.props.swipeEvent) {
      this.props.swipeEvent(swipeDirection);
      this.setState({ swiped: true });
    }

    if (!this.props.vertical) {
      swipeLeft = curLeft + touchSwipeLength * positionOffset;
    } else {
      swipeLeft = curLeft + touchSwipeLength * (this.state.listHeight / this.state.listWidth) * positionOffset;
    }

    if (this.props.verticalSwiping) {
      swipeLeft = curLeft + touchSwipeLength * positionOffset;
    }

    this.setState({
      touchObject: touchObject,
      swipeLeft: swipeLeft,
      trackStyle: (0, _trackHelper.getTrackCSS)((0, _objectAssign2.default)({ left: swipeLeft }, this.props, this.state))
    });

    if (Math.abs(touchObject.curX - touchObject.startX) < Math.abs(touchObject.curY - touchObject.startY) * 0.8) {
      return;
    }
    if (touchObject.swipeLength > 4) {
      e.preventDefault();
    }
  },
  getNavigableIndexes: function getNavigableIndexes() {
    var max = void 0;
    var breakPoint = 0;
    var counter = 0;
    var indexes = [];

    if (!this.props.infinite) {
      max = this.state.slideCount;
    } else {
      breakPoint = this.props.slidesToShow * -1;
      counter = this.props.slidesToShow * -1;
      max = this.state.slideCount * 2;
    }

    while (breakPoint < max) {
      indexes.push(breakPoint);
      breakPoint = counter + this.props.slidesToScroll;

      counter += this.props.slidesToScroll <= this.props.slidesToShow ? this.props.slidesToScroll : this.props.slidesToShow;
    }

    return indexes;
  },
  checkNavigable: function checkNavigable(index) {
    var navigables = this.getNavigableIndexes();
    var prevNavigable = 0;

    if (index > navigables[navigables.length - 1]) {
      index = navigables[navigables.length - 1];
    } else {
      for (var n in navigables) {
        if (index < navigables[n]) {
          index = prevNavigable;
          break;
        }

        prevNavigable = navigables[n];
      }
    }

    return index;
  },
  getSlideCount: function getSlideCount() {
    var _this = this;

    var centerOffset = this.props.centerMode ? this.state.slideWidth * Math.floor(this.props.slidesToShow / 2) : 0;

    if (this.props.swipeToSlide) {
      var swipedSlide = void 0;

      var slickList = _reactDom2.default.findDOMNode(this.list);

      var slides = slickList.querySelectorAll('.slick-slide');

      Array.from(slides).every(function (slide) {
        if (!_this.props.vertical) {
          if (slide.offsetLeft - centerOffset + _this.getWidth(slide) / 2 > _this.state.swipeLeft * -1) {
            swipedSlide = slide;
            return false;
          }
        } else {
          if (slide.offsetTop + _this.getHeight(slide) / 2 > _this.state.swipeLeft * -1) {
            swipedSlide = slide;
            return false;
          }
        }

        return true;
      });

      var slidesTraversed = Math.abs(swipedSlide.dataset.index - this.state.currentSlide) || 1;

      return slidesTraversed;
    } else {
      return this.props.slidesToScroll;
    }
  },

  swipeEnd: function swipeEnd(e) {
    if (!this.state.dragging) {
      e.preventDefault();
      return;
    }
    var touchObject = this.state.touchObject;
    var minSwipe = this.state.listWidth / this.props.touchThreshold;
    var swipeDirection = this.swipeDirection(touchObject);

    if (this.props.verticalSwiping) {
      minSwipe = this.state.listHeight / this.props.touchThreshold;
    }

    // reset the state of touch related state variables.
    this.setState({
      dragging: false,
      edgeDragged: false,
      swiped: false,
      swipeLeft: null,
      touchObject: {}
    });
    // Fix for #13
    if (!touchObject.swipeLength) {
      return;
    }
    if (touchObject.swipeLength > minSwipe) {
      e.preventDefault();

      var slideCount = void 0,
          newSlide = void 0;

      switch (swipeDirection) {

        case 'left':
        case 'down':
          newSlide = this.state.currentSlide + this.getSlideCount();
          slideCount = this.props.swipeToSlide ? this.checkNavigable(newSlide) : newSlide;
          this.state.currentDirection = 0;
          break;

        case 'right':
        case 'up':
          newSlide = this.state.currentSlide - this.getSlideCount();
          slideCount = this.props.swipeToSlide ? this.checkNavigable(newSlide) : newSlide;
          this.state.currentDirection = 1;
          break;

        default:
          slideCount = this.state.currentSlide;

      }

      this.slideHandler(slideCount);
    } else {
      // Adjust the track back to it's original position.
      var currentLeft = (0, _trackHelper.getTrackLeft)((0, _objectAssign2.default)({
        slideIndex: this.state.currentSlide,
        trackRef: this.track
      }, this.props, this.state));

      this.setState({
        trackStyle: (0, _trackHelper.getTrackAnimateCSS)((0, _objectAssign2.default)({ left: currentLeft }, this.props, this.state))
      });
    }
  },
  onInnerSliderEnter: function onInnerSliderEnter(e) {
    if (this.props.autoplay && this.props.pauseOnHover) {
      this.pause();
    }
  },
  onInnerSliderLeave: function onInnerSliderLeave(e) {
    if (this.props.autoplay && this.props.pauseOnHover) {
      this.autoPlay();
    }
  }
};

exports.default = EventHandlers;
},{"./helpers":13,"./trackHelper":14,"object-assign":20,"react-dom":"react-dom"}],13:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _trackHelper = require('./trackHelper');

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var helpers = {
  initialize: function initialize(props) {
    var slickList = _reactDom2.default.findDOMNode(this.list);

    var slideCount = _react2.default.Children.count(props.children);
    var listWidth = this.getWidth(slickList);
    var trackWidth = this.getWidth(_reactDom2.default.findDOMNode(this.track));
    var slideWidth;

    if (!props.vertical) {
      slideWidth = this.getWidth(_reactDom2.default.findDOMNode(this)) / props.slidesToShow;
    } else {
      slideWidth = this.getWidth(_reactDom2.default.findDOMNode(this));
    }

    var slideHeight = this.getHeight(slickList.querySelector('[data-index="0"]'));
    var listHeight = slideHeight * props.slidesToShow;

    var currentSlide = props.rtl ? slideCount - 1 - props.initialSlide : props.initialSlide;

    this.setState({
      slideCount: slideCount,
      slideWidth: slideWidth,
      listWidth: listWidth,
      trackWidth: trackWidth,
      currentSlide: currentSlide,
      slideHeight: slideHeight,
      listHeight: listHeight
    }, function () {

      var targetLeft = (0, _trackHelper.getTrackLeft)((0, _objectAssign2.default)({
        slideIndex: this.state.currentSlide,
        trackRef: this.track
      }, props, this.state));
      // getCSS function needs previously set state
      var trackStyle = (0, _trackHelper.getTrackCSS)((0, _objectAssign2.default)({ left: targetLeft }, props, this.state));

      this.setState({ trackStyle: trackStyle });

      this.autoPlay(); // once we're set up, trigger the initial autoplay.
    });
  },
  update: function update(props) {
    var slickList = _reactDom2.default.findDOMNode(this.list);
    // This method has mostly same code as initialize method.
    // Refactor it
    var slideCount = _react2.default.Children.count(props.children);
    var listWidth = this.getWidth(slickList);
    var trackWidth = this.getWidth(_reactDom2.default.findDOMNode(this.track));
    var slideWidth;

    if (!props.vertical) {
      slideWidth = this.getWidth(_reactDom2.default.findDOMNode(this)) / props.slidesToShow;
    } else {
      slideWidth = this.getWidth(_reactDom2.default.findDOMNode(this));
    }

    var slideHeight = this.getHeight(slickList.querySelector('[data-index="0"]'));
    var listHeight = slideHeight * props.slidesToShow;

    // pause slider if autoplay is set to false
    if (!props.autoplay) this.pause();

    this.setState({
      slideCount: slideCount,
      slideWidth: slideWidth,
      listWidth: listWidth,
      trackWidth: trackWidth,
      slideHeight: slideHeight,
      listHeight: listHeight
    }, function () {

      var targetLeft = (0, _trackHelper.getTrackLeft)((0, _objectAssign2.default)({
        slideIndex: this.state.currentSlide,
        trackRef: this.track
      }, props, this.state));
      // getCSS function needs previously set state
      var trackStyle = (0, _trackHelper.getTrackCSS)((0, _objectAssign2.default)({ left: targetLeft }, props, this.state));

      this.setState({ trackStyle: trackStyle });
    });
  },
  getWidth: function getWidth(elem) {
    return elem.getBoundingClientRect().width || elem.offsetWidth;
  },
  getHeight: function getHeight(elem) {
    return elem.getBoundingClientRect().height || elem.offsetHeight;
  },

  adaptHeight: function adaptHeight() {
    if (this.props.adaptiveHeight) {
      var selector = '[data-index="' + this.state.currentSlide + '"]';
      if (this.list) {
        var slickList = _reactDom2.default.findDOMNode(this.list);
        slickList.style.height = slickList.querySelector(selector).offsetHeight + 'px';
      }
    }
  },
  slideHandler: function slideHandler(index) {
    var _this = this;

    // Functionality of animateSlide and postSlide is merged into this function
    // console.log('slideHandler', index);
    var targetSlide, currentSlide;
    var targetLeft, currentLeft;
    var callback;

    if (this.props.waitForAnimate && this.state.animating) {
      return;
    }

    if (this.props.fade) {
      currentSlide = this.state.currentSlide;

      // Don't change slide if it's not infite and current slide is the first or last slide.
      if (this.props.infinite === false && (index < 0 || index >= this.state.slideCount)) {
        return;
      }

      //  Shifting targetSlide back into the range
      if (index < 0) {
        targetSlide = index + this.state.slideCount;
      } else if (index >= this.state.slideCount) {
        targetSlide = index - this.state.slideCount;
      } else {
        targetSlide = index;
      }

      if (this.props.lazyLoad && this.state.lazyLoadedList.indexOf(targetSlide) < 0) {
        this.setState({
          lazyLoadedList: this.state.lazyLoadedList.concat(targetSlide)
        });
      }

      callback = function callback() {
        _this.setState({
          animating: false
        });
        if (_this.props.afterChange) {
          _this.props.afterChange(targetSlide);
        }
        delete _this.animationEndCallback;
      };

      this.setState({
        animating: true,
        currentSlide: targetSlide
      }, function () {
        this.animationEndCallback = setTimeout(callback, this.props.speed);
      });

      if (this.props.beforeChange) {
        this.props.beforeChange(this.state.currentSlide, targetSlide);
      }

      this.autoPlay();
      return;
    }

    targetSlide = index;
    if (targetSlide < 0) {
      if (this.props.infinite === false) {
        currentSlide = 0;
      } else if (this.state.slideCount % this.props.slidesToScroll !== 0) {
        currentSlide = this.state.slideCount - this.state.slideCount % this.props.slidesToScroll;
      } else {
        currentSlide = this.state.slideCount + targetSlide;
      }
    } else if (targetSlide >= this.state.slideCount) {
      if (this.props.infinite === false) {
        currentSlide = this.state.slideCount - this.props.slidesToShow;
      } else if (this.state.slideCount % this.props.slidesToScroll !== 0) {
        currentSlide = 0;
      } else {
        currentSlide = targetSlide - this.state.slideCount;
      }
    } else {
      currentSlide = targetSlide;
    }

    targetLeft = (0, _trackHelper.getTrackLeft)((0, _objectAssign2.default)({
      slideIndex: targetSlide,
      trackRef: this.track
    }, this.props, this.state));

    currentLeft = (0, _trackHelper.getTrackLeft)((0, _objectAssign2.default)({
      slideIndex: currentSlide,
      trackRef: this.track
    }, this.props, this.state));

    if (this.props.infinite === false) {
      targetLeft = currentLeft;
    }

    if (this.props.beforeChange) {
      this.props.beforeChange(this.state.currentSlide, currentSlide);
    }

    if (this.props.lazyLoad) {
      var loaded = true;
      var slidesToLoad = [];
      for (var i = targetSlide; i < targetSlide + this.props.slidesToShow; i++) {
        loaded = loaded && this.state.lazyLoadedList.indexOf(i) >= 0;
        if (!loaded) {
          slidesToLoad.push(i);
        }
      }
      if (!loaded) {
        this.setState({
          lazyLoadedList: this.state.lazyLoadedList.concat(slidesToLoad)
        });
      }
    }

    // Slide Transition happens here.
    // animated transition happens to target Slide and
    // non - animated transition happens to current Slide
    // If CSS transitions are false, directly go the current slide.

    if (this.props.useCSS === false) {

      this.setState({
        currentSlide: currentSlide,
        trackStyle: (0, _trackHelper.getTrackCSS)((0, _objectAssign2.default)({ left: currentLeft }, this.props, this.state))
      }, function () {
        if (this.props.afterChange) {
          this.props.afterChange(currentSlide);
        }
      });
    } else {

      var nextStateChanges = {
        animating: false,
        currentSlide: currentSlide,
        trackStyle: (0, _trackHelper.getTrackCSS)((0, _objectAssign2.default)({ left: currentLeft }, this.props, this.state)),
        swipeLeft: null
      };

      callback = function callback() {
        _this.setState(nextStateChanges);
        if (_this.props.afterChange) {
          _this.props.afterChange(currentSlide);
        }
        delete _this.animationEndCallback;
      };

      this.setState({
        animating: true,
        currentSlide: currentSlide,
        trackStyle: (0, _trackHelper.getTrackAnimateCSS)((0, _objectAssign2.default)({ left: targetLeft }, this.props, this.state))
      }, function () {
        this.animationEndCallback = setTimeout(callback, this.props.speed);
      });
    }

    this.autoPlay();
  },
  swipeDirection: function swipeDirection(touchObject) {
    var xDist, yDist, r, swipeAngle;

    xDist = touchObject.startX - touchObject.curX;
    yDist = touchObject.startY - touchObject.curY;
    r = Math.atan2(yDist, xDist);

    swipeAngle = Math.round(r * 180 / Math.PI);
    if (swipeAngle < 0) {
      swipeAngle = 360 - Math.abs(swipeAngle);
    }
    if (swipeAngle <= 45 && swipeAngle >= 0 || swipeAngle <= 360 && swipeAngle >= 315) {
      return this.props.rtl === false ? 'left' : 'right';
    }
    if (swipeAngle >= 135 && swipeAngle <= 225) {
      return this.props.rtl === false ? 'right' : 'left';
    }
    if (this.props.verticalSwiping === true) {
      if (swipeAngle >= 35 && swipeAngle <= 135) {
        return 'down';
      } else {
        return 'up';
      }
    }

    return 'vertical';
  },
  autoPlay: function autoPlay() {
    var _this2 = this;

    if (this.state.autoPlayTimer) {
      return;
    }
    var play = function play() {
      if (_this2.state.mounted) {
        var nextIndex = _this2.props.rtl ? _this2.state.currentSlide - _this2.props.slidesToScroll : _this2.state.currentSlide + _this2.props.slidesToScroll;
        _this2.slideHandler(nextIndex);
      }
    };
    if (this.props.autoplay) {
      this.setState({
        autoPlayTimer: setInterval(play, this.props.autoplaySpeed)
      });
    }
  },
  pause: function pause() {
    if (this.state.autoPlayTimer) {
      clearInterval(this.state.autoPlayTimer);
      this.setState({
        autoPlayTimer: null
      });
    }
  }
};

exports.default = helpers;
},{"./trackHelper":14,"object-assign":20,"react":"react","react-dom":"react-dom"}],14:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.getTrackLeft = exports.getTrackAnimateCSS = exports.getTrackCSS = undefined;

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var checkSpecKeys = function checkSpecKeys(spec, keysArray) {
  return keysArray.reduce(function (value, key) {
    return value && spec.hasOwnProperty(key);
  }, true) ? null : console.error('Keys Missing', spec);
};

var getTrackCSS = exports.getTrackCSS = function getTrackCSS(spec) {
  checkSpecKeys(spec, ['left', 'variableWidth', 'slideCount', 'slidesToShow', 'slideWidth']);

  var trackWidth, trackHeight;

  var trackChildren = spec.slideCount + 2 * spec.slidesToShow;

  if (!spec.vertical) {
    if (spec.variableWidth) {
      trackWidth = (spec.slideCount + 2 * spec.slidesToShow) * spec.slideWidth;
    } else if (spec.centerMode) {
      trackWidth = (spec.slideCount + 2 * (spec.slidesToShow + 1)) * spec.slideWidth;
    } else {
      trackWidth = (spec.slideCount + 2 * spec.slidesToShow) * spec.slideWidth;
    }
  } else {
    trackHeight = trackChildren * spec.slideHeight;
  }

  var style = {
    opacity: 1,
    WebkitTransform: !spec.vertical ? 'translate3d(' + spec.left + 'px, 0px, 0px)' : 'translate3d(0px, ' + spec.left + 'px, 0px)',
    transform: !spec.vertical ? 'translate3d(' + spec.left + 'px, 0px, 0px)' : 'translate3d(0px, ' + spec.left + 'px, 0px)',
    transition: '',
    WebkitTransition: '',
    msTransform: !spec.vertical ? 'translateX(' + spec.left + 'px)' : 'translateY(' + spec.left + 'px)'
  };

  if (trackWidth) {
    (0, _objectAssign2.default)(style, { width: trackWidth });
  }

  if (trackHeight) {
    (0, _objectAssign2.default)(style, { height: trackHeight });
  }

  // Fallback for IE8
  if (window && !window.addEventListener && window.attachEvent) {
    if (!spec.vertical) {
      style.marginLeft = spec.left + 'px';
    } else {
      style.marginTop = spec.left + 'px';
    }
  }

  return style;
};

var getTrackAnimateCSS = exports.getTrackAnimateCSS = function getTrackAnimateCSS(spec) {
  checkSpecKeys(spec, ['left', 'variableWidth', 'slideCount', 'slidesToShow', 'slideWidth', 'speed', 'cssEase']);

  var style = getTrackCSS(spec);
  // useCSS is true by default so it can be undefined
  style.WebkitTransition = '-webkit-transform ' + spec.speed + 'ms ' + spec.cssEase;
  style.transition = 'transform ' + spec.speed + 'ms ' + spec.cssEase;
  return style;
};

var getTrackLeft = exports.getTrackLeft = function getTrackLeft(spec) {

  checkSpecKeys(spec, ['slideIndex', 'trackRef', 'infinite', 'centerMode', 'slideCount', 'slidesToShow', 'slidesToScroll', 'slideWidth', 'listWidth', 'variableWidth', 'slideHeight']);

  var slideOffset = 0;
  var targetLeft;
  var targetSlide;
  var verticalOffset = 0;

  if (spec.fade) {
    return 0;
  }

  if (spec.infinite) {
    if (spec.slideCount >= spec.slidesToShow) {
      slideOffset = spec.slideWidth * spec.slidesToShow * -1;
      verticalOffset = spec.slideHeight * spec.slidesToShow * -1;
    }
    if (spec.slideCount % spec.slidesToScroll !== 0) {
      if (spec.slideIndex + spec.slidesToScroll > spec.slideCount && spec.slideCount > spec.slidesToShow) {
        if (spec.slideIndex > spec.slideCount) {
          slideOffset = (spec.slidesToShow - (spec.slideIndex - spec.slideCount)) * spec.slideWidth * -1;
          verticalOffset = (spec.slidesToShow - (spec.slideIndex - spec.slideCount)) * spec.slideHeight * -1;
        } else {
          slideOffset = spec.slideCount % spec.slidesToScroll * spec.slideWidth * -1;
          verticalOffset = spec.slideCount % spec.slidesToScroll * spec.slideHeight * -1;
        }
      }
    }
  } else {

    if (spec.slideCount % spec.slidesToScroll !== 0) {
      if (spec.slideIndex + spec.slidesToScroll > spec.slideCount && spec.slideCount > spec.slidesToShow) {
        var slidesToOffset = spec.slidesToShow - spec.slideCount % spec.slidesToScroll;
        slideOffset = slidesToOffset * spec.slideWidth;
      }
    }
  }

  if (spec.centerMode) {
    if (spec.infinite) {
      slideOffset += spec.slideWidth * Math.floor(spec.slidesToShow / 2);
    } else {
      slideOffset = spec.slideWidth * Math.floor(spec.slidesToShow / 2);
    }
  }

  if (!spec.vertical) {
    targetLeft = spec.slideIndex * spec.slideWidth * -1 + slideOffset;
  } else {
    targetLeft = spec.slideIndex * spec.slideHeight * -1 + verticalOffset;
  }

  if (spec.variableWidth === true) {
    var targetSlideIndex;
    if (spec.slideCount <= spec.slidesToShow || spec.infinite === false) {
      targetSlide = _reactDom2.default.findDOMNode(spec.trackRef).childNodes[spec.slideIndex];
    } else {
      targetSlideIndex = spec.slideIndex + spec.slidesToShow;
      targetSlide = _reactDom2.default.findDOMNode(spec.trackRef).childNodes[targetSlideIndex];
    }
    targetLeft = targetSlide ? targetSlide.offsetLeft * -1 : 0;
    if (spec.centerMode === true) {
      if (spec.infinite === false) {
        targetSlide = _reactDom2.default.findDOMNode(spec.trackRef).children[spec.slideIndex];
      } else {
        targetSlide = _reactDom2.default.findDOMNode(spec.trackRef).children[spec.slideIndex + spec.slidesToShow + 1];
      }

      targetLeft = targetSlide ? targetSlide.offsetLeft * -1 : 0;
      targetLeft += (spec.listWidth - targetSlide.offsetWidth) / 2;
    }
  }

  return targetLeft;
};
},{"object-assign":20,"react-dom":"react-dom"}],15:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _innerSlider = require('./inner-slider');

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _json2mq = require('json2mq');

var _json2mq2 = _interopRequireDefault(_json2mq);

var _reactResponsiveMixin = require('react-responsive-mixin');

var _reactResponsiveMixin2 = _interopRequireDefault(_reactResponsiveMixin);

var _defaultProps = require('./default-props');

var _defaultProps2 = _interopRequireDefault(_defaultProps);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Slider = _react2.default.createClass({
  displayName: 'Slider',

  mixins: [_reactResponsiveMixin2.default],
  innerSlider: null,
  innerSliderRefHandler: function innerSliderRefHandler(ref) {
    this.innerSlider = ref;
  },
  getInitialState: function getInitialState() {
    return {
      breakpoint: null
    };
  },
  componentWillMount: function componentWillMount() {
    var _this = this;

    if (this.props.responsive) {
      var breakpoints = this.props.responsive.map(function (breakpt) {
        return breakpt.breakpoint;
      });
      breakpoints.sort(function (x, y) {
        return x - y;
      });

      breakpoints.forEach(function (breakpoint, index) {
        var bQuery;
        if (index === 0) {
          bQuery = (0, _json2mq2.default)({ minWidth: 0, maxWidth: breakpoint });
        } else {
          bQuery = (0, _json2mq2.default)({ minWidth: breakpoints[index - 1], maxWidth: breakpoint });
        }
        _this.media(bQuery, function () {
          _this.setState({ breakpoint: breakpoint });
        });
      });

      // Register media query for full screen. Need to support resize from small to large
      var query = (0, _json2mq2.default)({ minWidth: breakpoints.slice(-1)[0] });

      this.media(query, function () {
        _this.setState({ breakpoint: null });
      });
    }
  },

  slickPrev: function slickPrev() {
    this.innerSlider.slickPrev();
  },

  slickNext: function slickNext() {
    this.innerSlider.slickNext();
  },

  slickGoTo: function slickGoTo(slide) {
    this.innerSlider.slickGoTo(slide);
  },

  render: function render() {
    var _this2 = this;

    var settings;
    var newProps;
    if (this.state.breakpoint) {
      newProps = this.props.responsive.filter(function (resp) {
        return resp.breakpoint === _this2.state.breakpoint;
      });
      settings = newProps[0].settings === 'unslick' ? 'unslick' : (0, _objectAssign2.default)({}, this.props, newProps[0].settings);
    } else {
      settings = (0, _objectAssign2.default)({}, _defaultProps2.default, this.props);
    }

    var children = this.props.children;
    if (!Array.isArray(children)) {
      children = [children];
    }

    // Children may contain false or null, so we should filter them
    children = children.filter(function (child) {
      return !!child;
    });

    if (settings === 'unslick') {
      // if 'unslick' responsive breakpoint setting used, just return the <Slider> tag nested HTML
      return _react2.default.createElement(
        'div',
        null,
        children
      );
    } else {
      return _react2.default.createElement(
        _innerSlider.InnerSlider,
        _extends({ ref: this.innerSliderRefHandler }, settings),
        children
      );
    }
  }
});

module.exports = Slider;
},{"./default-props":7,"./inner-slider":11,"json2mq":18,"object-assign":20,"react":"react","react-responsive-mixin":21}],16:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.Track = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getSlideClasses = function getSlideClasses(spec) {
  var slickActive, slickCenter, slickCloned;
  var centerOffset, index;

  if (spec.rtl) {
    index = spec.slideCount - 1 - spec.index;
  } else {
    index = spec.index;
  }

  slickCloned = index < 0 || index >= spec.slideCount;
  if (spec.centerMode) {
    centerOffset = Math.floor(spec.slidesToShow / 2);
    slickCenter = (index - spec.currentSlide) % spec.slideCount === 0;
    if (index > spec.currentSlide - centerOffset - 1 && index <= spec.currentSlide + centerOffset) {
      slickActive = true;
    }
  } else {
    slickActive = spec.currentSlide <= index && index < spec.currentSlide + spec.slidesToShow;
  }
  return (0, _classnames2.default)({
    'slick-slide': true,
    'slick-active': slickActive,
    'slick-center': slickCenter,
    'slick-cloned': slickCloned
  });
};

var getSlideStyle = function getSlideStyle(spec) {
  var style = {};

  if (spec.variableWidth === undefined || spec.variableWidth === false) {
    style.width = spec.slideWidth;
  }

  if (spec.fade) {
    style.position = 'relative';
    style.left = -spec.index * spec.slideWidth;
    style.opacity = spec.currentSlide === spec.index ? 1 : 0;
    style.transition = 'opacity ' + spec.speed + 'ms ' + spec.cssEase;
    style.WebkitTransition = 'opacity ' + spec.speed + 'ms ' + spec.cssEase;
  }

  return style;
};

var getKey = function getKey(child, fallbackKey) {
  // key could be a zero
  return child.key === null || child.key === undefined ? fallbackKey : child.key;
};

var renderSlides = function renderSlides(spec) {
  var key;
  var slides = [];
  var preCloneSlides = [];
  var postCloneSlides = [];
  var count = _react2.default.Children.count(spec.children);

  _react2.default.Children.forEach(spec.children, function (elem, index) {
    var child = void 0;
    var childOnClickOptions = {
      message: 'children',
      index: index,
      slidesToScroll: spec.slidesToScroll,
      currentSlide: spec.currentSlide
    };

    if (!spec.lazyLoad | (spec.lazyLoad && spec.lazyLoadedList.indexOf(index) >= 0)) {
      child = elem;
    } else {
      child = _react2.default.createElement('div', null);
    }
    var childStyle = getSlideStyle((0, _objectAssign2.default)({}, spec, { index: index }));
    var slickClasses = getSlideClasses((0, _objectAssign2.default)({ index: index }, spec));
    var cssClasses;

    if (child.props.className) {
      cssClasses = (0, _classnames2.default)(slickClasses, child.props.className);
    } else {
      cssClasses = slickClasses;
    }

    var onClick = function onClick(e) {
      child.props && child.props.onClick && child.props.onClick(e);
      if (spec.focusOnSelect) {
        spec.focusOnSelect(childOnClickOptions);
      }
    };

    slides.push(_react2.default.cloneElement(child, {
      key: 'original' + getKey(child, index),
      'data-index': index,
      className: cssClasses,
      tabIndex: '-1',
      style: (0, _objectAssign2.default)({ outline: 'none' }, child.props.style || {}, childStyle),
      onClick: onClick
    }));

    // variableWidth doesn't wrap properly.
    if (spec.infinite && spec.fade === false) {
      var infiniteCount = spec.variableWidth ? spec.slidesToShow + 1 : spec.slidesToShow;

      if (index >= count - infiniteCount) {
        key = -(count - index);
        preCloneSlides.push(_react2.default.cloneElement(child, {
          key: 'precloned' + getKey(child, key),
          'data-index': key,
          className: cssClasses,
          style: (0, _objectAssign2.default)({}, child.props.style || {}, childStyle),
          onClick: onClick
        }));
      }

      if (index < infiniteCount) {
        key = count + index;
        postCloneSlides.push(_react2.default.cloneElement(child, {
          key: 'postcloned' + getKey(child, key),
          'data-index': key,
          className: cssClasses,
          style: (0, _objectAssign2.default)({}, child.props.style || {}, childStyle),
          onClick: onClick
        }));
      }
    }
  });

  if (spec.rtl) {
    return preCloneSlides.concat(slides, postCloneSlides).reverse();
  } else {
    return preCloneSlides.concat(slides, postCloneSlides);
  }
};

var Track = exports.Track = _react2.default.createClass({
  displayName: 'Track',

  render: function render() {
    var slides = renderSlides.call(this, this.props);
    return _react2.default.createElement(
      'div',
      { className: 'slick-track', style: this.props.trackStyle },
      slides
    );
  }
});
},{"classnames":17,"object-assign":20,"react":"react"}],17:[function(require,module,exports){
/*!
  Copyright (c) 2016 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg)) {
				classes.push(classNames.apply(null, arg));
			} else if (argType === 'object') {
				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes.push(key);
					}
				}
			}
		}

		return classes.join(' ');
	}

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = classNames;
	} else if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
		// register as 'classnames', consistent with npm package name
		define('classnames', [], function () {
			return classNames;
		});
	} else {
		window.classNames = classNames;
	}
}());

},{}],18:[function(require,module,exports){
var camel2hyphen = require('string-convert/camel2hyphen');

var isDimension = function (feature) {
  var re = /[height|width]$/;
  return re.test(feature);
};

var obj2mq = function (obj) {
  var mq = '';
  var features = Object.keys(obj);
  features.forEach(function (feature, index) {
    var value = obj[feature];
    feature = camel2hyphen(feature);
    // Add px to dimension features
    if (isDimension(feature) && typeof value === 'number') {
      value = value + 'px';
    }
    if (value === true) {
      mq += feature;
    } else if (value === false) {
      mq += 'not ' + feature;
    } else {
      mq += '(' + feature + ': ' + value + ')';
    }
    if (index < features.length-1) {
      mq += ' and '
    }
  });
  return mq;
};

var json2mq = function (query) {
  var mq = '';
  if (typeof query === 'string') {
    return query;
  }
  // Handling array of media queries
  if (query instanceof Array) {
    query.forEach(function (q, index) {
      mq += obj2mq(q);
      if (index < query.length-1) {
        mq += ', '
      }
    });
    return mq;
  }
  // Handling single media query
  return obj2mq(query);
};

module.exports = json2mq;
},{"string-convert/camel2hyphen":19}],19:[function(require,module,exports){
var camel2hyphen = function (str) {
  return str
          .replace(/[A-Z]/g, function (match) {
            return '-' + match.toLowerCase();
          })
          .toLowerCase();
};

module.exports = camel2hyphen;
},{}],20:[function(require,module,exports){
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

'use strict';
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

},{}],21:[function(require,module,exports){
var canUseDOM = require('can-use-dom');
var enquire = canUseDOM && require('enquire.js');
var json2mq = require('json2mq');

var ResponsiveMixin = {
  media: function (query, handler) {
    query = json2mq(query);
    if (typeof handler === 'function') {
      handler = {
        match: handler
      };
    }
    canUseDOM && enquire.register(query, handler);

    // Queue the handlers to unregister them at unmount  
    if (! this._responsiveMediaHandlers) {
      this._responsiveMediaHandlers = [];
    }
    this._responsiveMediaHandlers.push({query: query, handler: handler});
  },
  componentWillUnmount: function () {
    if (this._responsiveMediaHandlers) {
      this._responsiveMediaHandlers.forEach(function(obj) {
        canUseDOM && enquire.unregister(obj.query, obj.handler);
      });
    }
  }
};

module.exports = ResponsiveMixin;

},{"can-use-dom":22,"enquire.js":23,"json2mq":18}],22:[function(require,module,exports){
var canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

module.exports = canUseDOM;
},{}],23:[function(require,module,exports){
/*!
 * enquire.js v2.1.1 - Awesome Media Queries in JavaScript
 * Copyright (c) 2014 Nick Williams - http://wicky.nillia.ms/enquire.js
 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
 */

;(function (name, context, factory) {
	var matchMedia = window.matchMedia;

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = factory(matchMedia);
	}
	else if (typeof define === 'function' && define.amd) {
		define(function() {
			return (context[name] = factory(matchMedia));
		});
	}
	else {
		context[name] = factory(matchMedia);
	}
}('enquire', this, function (matchMedia) {

	'use strict';

    /*jshint unused:false */
    /**
     * Helper function for iterating over a collection
     *
     * @param collection
     * @param fn
     */
    function each(collection, fn) {
        var i      = 0,
            length = collection.length,
            cont;

        for(i; i < length; i++) {
            cont = fn(collection[i], i);
            if(cont === false) {
                break; //allow early exit
            }
        }
    }

    /**
     * Helper function for determining whether target object is an array
     *
     * @param target the object under test
     * @return {Boolean} true if array, false otherwise
     */
    function isArray(target) {
        return Object.prototype.toString.apply(target) === '[object Array]';
    }

    /**
     * Helper function for determining whether target object is a function
     *
     * @param target the object under test
     * @return {Boolean} true if function, false otherwise
     */
    function isFunction(target) {
        return typeof target === 'function';
    }

    /**
     * Delegate to handle a media query being matched and unmatched.
     *
     * @param {object} options
     * @param {function} options.match callback for when the media query is matched
     * @param {function} [options.unmatch] callback for when the media query is unmatched
     * @param {function} [options.setup] one-time callback triggered the first time a query is matched
     * @param {boolean} [options.deferSetup=false] should the setup callback be run immediately, rather than first time query is matched?
     * @constructor
     */
    function QueryHandler(options) {
        this.options = options;
        !options.deferSetup && this.setup();
    }
    QueryHandler.prototype = {

        /**
         * coordinates setup of the handler
         *
         * @function
         */
        setup : function() {
            if(this.options.setup) {
                this.options.setup();
            }
            this.initialised = true;
        },

        /**
         * coordinates setup and triggering of the handler
         *
         * @function
         */
        on : function() {
            !this.initialised && this.setup();
            this.options.match && this.options.match();
        },

        /**
         * coordinates the unmatch event for the handler
         *
         * @function
         */
        off : function() {
            this.options.unmatch && this.options.unmatch();
        },

        /**
         * called when a handler is to be destroyed.
         * delegates to the destroy or unmatch callbacks, depending on availability.
         *
         * @function
         */
        destroy : function() {
            this.options.destroy ? this.options.destroy() : this.off();
        },

        /**
         * determines equality by reference.
         * if object is supplied compare options, if function, compare match callback
         *
         * @function
         * @param {object || function} [target] the target for comparison
         */
        equals : function(target) {
            return this.options === target || this.options.match === target;
        }

    };
    /**
     * Represents a single media query, manages it's state and registered handlers for this query
     *
     * @constructor
     * @param {string} query the media query string
     * @param {boolean} [isUnconditional=false] whether the media query should run regardless of whether the conditions are met. Primarily for helping older browsers deal with mobile-first design
     */
    function MediaQuery(query, isUnconditional) {
        this.query = query;
        this.isUnconditional = isUnconditional;
        this.handlers = [];
        this.mql = matchMedia(query);

        var self = this;
        this.listener = function(mql) {
            self.mql = mql;
            self.assess();
        };
        this.mql.addListener(this.listener);
    }
    MediaQuery.prototype = {

        /**
         * add a handler for this query, triggering if already active
         *
         * @param {object} handler
         * @param {function} handler.match callback for when query is activated
         * @param {function} [handler.unmatch] callback for when query is deactivated
         * @param {function} [handler.setup] callback for immediate execution when a query handler is registered
         * @param {boolean} [handler.deferSetup=false] should the setup callback be deferred until the first time the handler is matched?
         */
        addHandler : function(handler) {
            var qh = new QueryHandler(handler);
            this.handlers.push(qh);

            this.matches() && qh.on();
        },

        /**
         * removes the given handler from the collection, and calls it's destroy methods
         * 
         * @param {object || function} handler the handler to remove
         */
        removeHandler : function(handler) {
            var handlers = this.handlers;
            each(handlers, function(h, i) {
                if(h.equals(handler)) {
                    h.destroy();
                    return !handlers.splice(i,1); //remove from array and exit each early
                }
            });
        },

        /**
         * Determine whether the media query should be considered a match
         * 
         * @return {Boolean} true if media query can be considered a match, false otherwise
         */
        matches : function() {
            return this.mql.matches || this.isUnconditional;
        },

        /**
         * Clears all handlers and unbinds events
         */
        clear : function() {
            each(this.handlers, function(handler) {
                handler.destroy();
            });
            this.mql.removeListener(this.listener);
            this.handlers.length = 0; //clear array
        },

        /*
         * Assesses the query, turning on all handlers if it matches, turning them off if it doesn't match
         */
        assess : function() {
            var action = this.matches() ? 'on' : 'off';

            each(this.handlers, function(handler) {
                handler[action]();
            });
        }
    };
    /**
     * Allows for registration of query handlers.
     * Manages the query handler's state and is responsible for wiring up browser events
     *
     * @constructor
     */
    function MediaQueryDispatch () {
        if(!matchMedia) {
            throw new Error('matchMedia not present, legacy browsers require a polyfill');
        }

        this.queries = {};
        this.browserIsIncapable = !matchMedia('only all').matches;
    }

    MediaQueryDispatch.prototype = {

        /**
         * Registers a handler for the given media query
         *
         * @param {string} q the media query
         * @param {object || Array || Function} options either a single query handler object, a function, or an array of query handlers
         * @param {function} options.match fired when query matched
         * @param {function} [options.unmatch] fired when a query is no longer matched
         * @param {function} [options.setup] fired when handler first triggered
         * @param {boolean} [options.deferSetup=false] whether setup should be run immediately or deferred until query is first matched
         * @param {boolean} [shouldDegrade=false] whether this particular media query should always run on incapable browsers
         */
        register : function(q, options, shouldDegrade) {
            var queries         = this.queries,
                isUnconditional = shouldDegrade && this.browserIsIncapable;

            if(!queries[q]) {
                queries[q] = new MediaQuery(q, isUnconditional);
            }

            //normalise to object in an array
            if(isFunction(options)) {
                options = { match : options };
            }
            if(!isArray(options)) {
                options = [options];
            }
            each(options, function(handler) {
                queries[q].addHandler(handler);
            });

            return this;
        },

        /**
         * unregisters a query and all it's handlers, or a specific handler for a query
         *
         * @param {string} q the media query to target
         * @param {object || function} [handler] specific handler to unregister
         */
        unregister : function(q, handler) {
            var query = this.queries[q];

            if(query) {
                if(handler) {
                    query.removeHandler(handler);
                }
                else {
                    query.clear();
                    delete this.queries[q];
                }
            }

            return this;
        }
    };

	return new MediaQueryDispatch();

}));
},{}],24:[function(require,module,exports){
var css = "@CHARSET \"utf-8\";\n/*---------------------------------------\n\tBase css\n---------------------------------------*/\nhtml,\nbody,\ndiv,\nspan,\np,\npre,\na,\ncite,\ncode,\nem,\nimg,\nsmall,\nstrong,\nsub,\nsup,\nu,\ni,\ncenter,\ndl,\ndt,\ndd,\nol,\nul,\nli,\nfieldset,\nform,\nlabel,\nlegend,\narticle,\ntable,\ncaption,\ntbody,\ntfoot,\nthead,\ntr,\nth,\ntd,\naside,\ncanvas,\ndetails,\nfigure,\nfigcaption,\nfooter,\nheader,\nmenu,\nnav,\nsection,\nsummary,\nmark {\n  margin: 0;\n  padding: 0;\n  font-family: 'NanumGothic';\n}\n@font-face {\n  font-family: 'NanumGothic';\n  src: url('/css/font/NanumGothic.eot');\n  src: url('/css/font/NanumGothic.eot?#iefix') format('embedded-opentype'),\n\t\t url('/css/font/NanumGothic.woff') format('woff'),\n\t\t url('/css/font/NanumGothic.ttf') format('truetype');\n  font-weight: normal;\n  font-style: normal;\n}\n.blind,\ncaption {\n  font-size: 0;\n  line-height: 0;\n  text-indent: -10000px;\n}\nul,\nli {\n  list-style: none;\n}\na:focus {\n  outline: none;\n}\na:link,\na:visited,\na:active {\n  font-family: 'NanumGothic', arial, gulim, dotum;\n  text-decoration: none;\n}\na:hover {\n  text-decoration: none;\n}\na img,\nfieldset {\n  border: 0;\n}\nbutton {\n  cursor: pointer;\n  border: 0;\n}\n"; (require("browserify-css").createStyle(css, { "href": "src/app/app.css" }, { "insertAt": "bottom" })); module.exports = css;
},{"browserify-css":1}],25:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _Header = require('../containers/header/Header');

var _Header2 = _interopRequireDefault(_Header);

var _Body = require('../containers/body/Body');

var _Body2 = _interopRequireDefault(_Body);

var _Footer = require('../containers/footer/Footer');

var _Footer2 = _interopRequireDefault(_Footer);

var _post = require('../services/post');

var service = _interopRequireWildcard(_post);

require('./app.css');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = function (_React$Component) {
  _inherits(App, _React$Component);

  function App(props) {
    _classCallCheck(this, App);

    var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

    _this.state = {
      category: null
    };
    _this.relaySearchKeyword = _this.relaySearchKeyword.bind(_this);
    return _this;
  }

  _createClass(App, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.refs.app.addEventListener("request-search", this.relaySearchKeyword, false);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.refs.app.removeEventListener("request-search", this.relaySearchKeyword);
    }
  }, {
    key: 'relaySearchKeyword',
    value: function relaySearchKeyword(event) {
      var keyword = event.detail.keyword || null;
      console.log('perform search for keyword [' + keyword + ']');
      this.setState({
        searchKeyword: keyword
      });
    }
  }, {
    key: 'fetchMovieList',
    value: function fetchMovieList() {
      var _this2 = this;

      var id = window.location.href.split("/").pop(0);
      Promise.all([service.getCategoryDetail(id), service.getCategoryMovieList(id)]).then(function (results) {
        var detail = results[0].data;
        var list = results[1].data;
        _this2.setState({
          category: {
            id: detail.id,
            title: detail.name,
            list: list
          }
        });
      });
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.fetchMovieList();
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'wrapper', ref: 'app' },
        _react2.default.createElement(_Header2.default, null),
        _react2.default.createElement(_Body2.default, {
          searchKeyword: this.state.searchKeyword,
          category: this.state.searchKeyword ? null : this.state.category
        }),
        _react2.default.createElement(_Footer2.default, null)
      );
    }
  }]);

  return App;
}(_react2.default.Component);

exports.default = App;


_reactDom2.default.render(_react2.default.createElement(App, null), document.getElementById('root'));

},{"../containers/body/Body":66,"../containers/footer/Footer":67,"../containers/header/Header":69,"../services/post":74,"./app.css":24,"react":"react","react-dom":"react-dom"}],26:[function(require,module,exports){
var css = ".movie-item {\n  position: relative;\n  width: 1196px;\n  margin: 0 auto;\n}\n.movie-item > div {\n  float: left;\n  margin-left: 3px;\n}\n.movie-item > div:first-child {\n  margin-left: 0;\n}\n.movie-btn__prev,\n.movie-btn__next {\n  display: none;\n}\n.movie-list.selected .movie-btn__prev,\n.movie-list.selected .movie-btn__next {\n  display: block;\n  width: 44px;\n  height: 44px;\n  text-indent: -9999px;\n}\n.movie-list.selected .movie-btn__prev {\n  position: absolute;\n  top: 100px;\n  left: 22px;\n  background: url(\"/css/images/movie-arrow.png\") no-repeat 0 0;\n}\n.movie-list.selected .movie-list.sub .movie-btn__prev,\n.movie-list.selected .movie-list.sub .movie-btn__next {\n  top: 60px;\n}\n.movie-list.selected .movie-btn__prev:hover {\n  background: url(\"/css/images/movie-arrow.png\") no-repeat -76px 0;\n}\n.movie-list.selected .movie-btn__next {\n  position: absolute;\n  top: 100px;\n  right: 22px;\n  background: url(\"/css/images/movie-arrow.png\") no-repeat 0 -76px;\n}\n.movie-list.selected .movie-btn__next:hover {\n  background: url(\"/css/images/movie-arrow.png\") no-repeat -76px -76px;\n}\n.movie-item .slick-slider {\n  height: 165px;\n}\n.movie-item .slick-slide img {\n  width: 292px;\n}\n.slick-prev,\n.slick-next {\n  display: none !important;\n}\n.movie-item .slick-slide {\n  cursor: pointer;\n}\n/*.slick-prev,\n.slick-next {\n  width: 44px;\n  height: 44px;\n  text-indent: -9999px;\n}\n.slick-prev {\n  position: absolute;\n  top: 80px;\n  left: 22px ;\n  background: url(\"/css/images/movie-arrow.png\") no-repeat 0 0;\n}\n.movie-list.sub .slick-prev, \n.movie-list.sub .slick-next {\n  top: 60px;\n}\n.slick-prev:hover {\n  background: url(\"/css/images/movie-arrow.png\") no-repeat -76px 0;\n}\n.slick-next {\n  position: absolute;\n  top: 80px;\n  right: 22px;\n  background: url(\"/css/images/movie-arrow.png\") no-repeat 0 -76px;\n}\n.slick-next:hover {\n  background: url(\"/css/images/movie-arrow.png\") no-repeat -76px -76px;\n}*/\n"; (require("browserify-css").createStyle(css, { "href": "src/components/body_category/body_carousel/body_carousel.css" }, { "insertAt": "bottom" })); module.exports = css;
},{"browserify-css":1}],27:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactSlick = require('react-slick');

var _reactSlick2 = _interopRequireDefault(_reactSlick);

require('./body_carousel.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
// import Coverflow from 'react-coverflow';


var BodyCarousel = function (_React$Component) {
	_inherits(BodyCarousel, _React$Component);

	function BodyCarousel(props) {
		_classCallCheck(this, BodyCarousel);

		var _this = _possibleConstructorReturn(this, (BodyCarousel.__proto__ || Object.getPrototypeOf(BodyCarousel)).call(this, props));

		_this.state = {
			"markupList": []
		};

		_this.slide_next = _this.slide_next.bind(_this);
		_this.slide_previous = _this.slide_previous.bind(_this);
		_this.movieClickHandler = _this.movieClickHandler.bind(_this);
		return _this;
	}

	_createClass(BodyCarousel, [{
		key: 'componentWillMount',
		value: function componentWillMount() {
			if (this.props.movieList != null) {
				var movieList = this.props.movieList;
				var markupList = movieList.map(function (data, i) {
					return _react2.default.createElement(
						'div',
						{ key: i },
						_react2.default.createElement('img', { src: data.poster, 'data-id': data.id })
					);
				});

				this.setState({
					"markupList": markupList
				});
			}
		}
	}, {
		key: 'slide_next',
		value: function slide_next() {
			this.refs.slider.slickNext();
		}
	}, {
		key: 'slide_previous',
		value: function slide_previous() {
			this.refs.slider.slickPrev();
		}
	}, {
		key: 'movieClickHandler',
		value: function movieClickHandler(e) {
			var id = e.target.getAttribute('data-id') ? e.target.getAttribute('data-id') : '';
			// console.log('id = '+id);
			this.props.callbackParent(e, true, id);
		}
	}, {
		key: 'render',
		value: function render() {
			var sliderSettings = {
				dots: false,
				infinite: true,
				speed: 800,
				slidesToShow: 4,
				slidesToScroll: 4
			};
			return _react2.default.createElement(
				'div',
				null,
				_react2.default.createElement(
					'button',
					{ type: 'button', className: 'movie-btn__prev', onClick: this.slide_previous, title: '\uC774\uC804\uB9AC\uC2A4\uD2B8' },
					'\uC774\uC804\uB9AC\uC2A4\uD2B8'
				),
				_react2.default.createElement(
					'div',
					{ className: 'movie-item', onClick: this.movieClickHandler },
					_react2.default.createElement(
						_reactSlick2.default,
						_extends({ ref: 'slider' }, sliderSettings),
						this.state.markupList
					)
				),
				_react2.default.createElement(
					'button',
					{ type: 'button', className: 'movie-btn__next', onClick: this.slide_next, title: '\uB2E4\uC74C\uB9AC\uC2A4\uD2B8' },
					'\uB2E4\uC74C\uB9AC\uC2A4\uD2B8'
				)
			);
		}
	}]);

	return BodyCarousel;
}(_react2.default.Component);

// <Coverflow className="movie-item"
// 	width={1280}
// 	height={240}
// 	displayQuantityOfSide={3}
// 	navigation={false}
// 	enableHeading={true}
// 	clickable={true}
// 	active={0}
// 	onClick={this.movieClickHandler}
// >{this.state.markupList}</Coverflow>


exports.default = BodyCarousel;

},{"./body_carousel.css":26,"react":"react","react-slick":9}],28:[function(require,module,exports){
var css = "/* ------------------------------------\n  content\n--------------------------------------- */\n.content-wrapper {\n  max-width: 1374px;\n  margin: auto;\n  padding: 20px 0 40px;\n}\n.movie-list {\n  position: relative;\n  padding: 6px 0 20px;\n}\n.movie-list.sub {\n  padding: 20px 0;\n}\n.movie-list:after {\n  content: '';\n  display: block;\n  clear: both;\n}\n.movie-list h3 {\n  width: 1196px;\n  margin: 10px auto;\n  font-size: 18px;\n  font-weight: bold;\n  color: #999999;\n}\n.movie-list.selected {\n  background: #0e0e0e;\n}\n.movie-list.selected h3 {\n  color: #ffffff;\n}\n/* ------------------------------------\n  sub\n--------------------------------------- */\n.title-wrap {\n  position: relative;\n  width: 1196px;\n  display: table;\n  margin: auto;\n  padding-top: 14px;\n}\n.title-wrap h2 {\n  display: table-cell;\n  vertical-align: bottom;\n  font-size: 40px;\n  font-weight: bold;\n  color: #ffffff;\n}\n.title-wrap .category-select {\n  display: table-cell;\n  position: relative;\n  text-align: right;\n  bottom: -16px;\n}\n.category-title {\n  padding-right: 15px;\n  font-size: 14px;\n  color: #cccccc;\n}\n.category-select__list {\n  min-width: 200px;\n  margin: 20px 0;\n  padding: 4px 10px 8px;\n  font-size: 15px;\n  color: #a3a3a3;\n  border: 1px solid #666666;\n  background: #303030;\n}\n"; (require("browserify-css").createStyle(css, { "href": "src/components/body_category/body_category.css" }, { "insertAt": "bottom" })); module.exports = css;
},{"browserify-css":1}],29:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

require('./body_category.css');

require('../../css/slick.css');

var _post = require('../../services/post');

var _body_carousel = require('./body_carousel/body_carousel.js');

var _body_carousel2 = _interopRequireDefault(_body_carousel);

var _detail_popup = require('../detail_popup/detail_popup.js');

var _detail_popup2 = _interopRequireDefault(_detail_popup);

var _layer_popup = require('../layer_popup/layer_popup.js');

var _layer_popup2 = _interopRequireDefault(_layer_popup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BodyCategory = function (_React$Component) {
	_inherits(BodyCategory, _React$Component);

	function BodyCategory(props) {
		_classCallCheck(this, BodyCategory);

		var _this = _possibleConstructorReturn(this, (BodyCategory.__proto__ || Object.getPrototypeOf(BodyCategory)).call(this, props));

		_this.state = {
			markupList: [],
			focused: false,
			viewDetailFocused: false,
			movieInfo: {}
		};

		_this.onMouseEnterHandler = _this.onMouseEnterHandler.bind(_this);
		_this.onMouseLeaveHandler = _this.onMouseLeaveHandler.bind(_this);
		_this.onMovieItemClick = _this.onMovieItemClick.bind(_this);
		_this.openLayerPopup = _this.openLayerPopup.bind(_this);
		_this.closeLayerPopup = _this.closeLayerPopup.bind(_this);
		return _this;
	}

	_createClass(BodyCategory, [{
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(nextProps) {
			var _this2 = this;

			// console.log('category componentWillReceiveProps');
			var movieCategoryData = nextProps.bodyCategoryData;
			if (movieCategoryData != null && movieCategoryData.length > 0) {
				(function () {

					var movieList = nextProps.bodyCategoryMovieList;
					// console.log('movieList = '+movieList)
					var markupList = movieCategoryData.map(function (data, i) {
						return _react2.default.createElement(
							'div',
							{ className: 'movie-list', key: i,
								onMouseEnter: _this2.onMouseEnterHandler,
								onMouseLeave: _this2.onMouseLeaveHandler
							},
							_react2.default.createElement(
								'h3',
								null,
								data.name
							),
							_react2.default.createElement(_body_carousel2.default, {
								movieList: movieList[i].data,
								callbackParent: _this2.onMovieItemClick
							})
						);
					});

					_this2.setState({
						markupList: markupList
					});
				})();
			}
		}
	}, {
		key: 'onMouseEnterHandler',
		value: function onMouseEnterHandler(e) {
			e.currentTarget.classList.add('selected');
			this.setState({
				focused: false
			});
		}
	}, {
		key: 'onMouseLeaveHandler',
		value: function onMouseLeaveHandler(e) {
			e.currentTarget.classList.remove('selected');
		}
	}, {
		key: 'onMovieItemClick',
		value: function onMovieItemClick(e, newState, id) {
			var _this3 = this;

			// console.log('onMovieItemClick');
			var nativeEvent = e.nativeEvent;
			(0, _post.getMovieDetailData)(id).then(function (res) {
				var detailData = res.data;
				// console.log('detailData = '+detailData);
				detailData['top'] = nativeEvent.pageY - nativeEvent.offsetY - 20;
				detailData['left'] = nativeEvent.pageX - nativeEvent.offsetX - 20;
				// console.log('e.nativeEvent = '+e.nativeEvent);
				// console.log('top = '+detailData['top']);
				// console.log('left = '+detailData['left']);

				_this3.setState({
					focused: newState,
					movieInfo: detailData
				});
			});
		}
	}, {
		key: 'openLayerPopup',
		value: function openLayerPopup(e) {
			this.setState({
				focused: false,
				viewDetailFocused: true
			});
		}
	}, {
		key: 'closeLayerPopup',
		value: function closeLayerPopup(e) {
			this.setState({
				viewDetailFocused: false
			});
		}
	}, {
		key: 'render',
		value: function render() {
			var _state = this.state,
			    markupList = _state.markupList,
			    movieInfo = _state.movieInfo,
			    focused = _state.focused,
			    viewDetailFocused = _state.viewDetailFocused;


			return _react2.default.createElement(
				'div',
				{ className: 'content-wrapper' },
				markupList,
				focused ? _react2.default.createElement(_detail_popup2.default, {
					movieInfo: movieInfo,
					callbackParent: this.openLayerPopup
				}) : "",
				viewDetailFocused ? _react2.default.createElement(_layer_popup2.default, {
					movieInfo: this.state.movieInfo,
					callbackParent: this.closeLayerPopup
				}) : ""
			);
		}
	}]);

	return BodyCategory;
}(_react2.default.Component);

exports.default = BodyCategory;

},{"../../css/slick.css":71,"../../services/post":74,"../detail_popup/detail_popup.js":35,"../layer_popup/layer_popup.js":45,"./body_carousel/body_carousel.js":27,"./body_category.css":28,"react":"react"}],30:[function(require,module,exports){
var css = "/* ------------------------------------\n  content\n--------------------------------------- */\n.content-wrapper {\n  max-width: 1374px;\n  margin: auto;\n  padding: 20px 0 40px;\n}\n.movie-list {\n  position: relative;\n  padding: 6px 0 20px;\n}\n.movie-list.sub {\n  padding: 20px 0;\n}\n.movie-list:after {\n  content: '';\n  display: block;\n  clear: both;\n}\n.movie-list h3 {\n  width: 1196px;\n  margin: 10px auto;\n  font-size: 18px;\n  font-weight: bold;\n  color: #999999;\n}\n.movie-list.selected {\n  background: #0e0e0e;\n}\n.movie-list.selected h3 {\n  color: #ffffff;\n}\n/* ------------------------------------\n  sub\n--------------------------------------- */\n.title-wrap {\n  position: relative;\n  width: 1196px;\n  display: table;\n  margin: auto;\n  padding-top: 14px;\n}\n.title-wrap h2 {\n  display: table-cell;\n  vertical-align: bottom;\n  font-size: 40px;\n  font-weight: bold;\n  color: #ffffff;\n}\n.title-wrap .category-select {\n  display: table-cell;\n  position: relative;\n  text-align: right;\n  bottom: -16px;\n}\n.category-title {\n  padding-right: 15px;\n  font-size: 14px;\n  color: #cccccc;\n}\n.category-select__list {\n  min-width: 200px;\n  margin: 20px 0;\n  padding: 4px 10px 8px;\n  font-size: 15px;\n  color: #a3a3a3;\n  border: 1px solid #666666;\n  background: #303030;\n}\n.movie-item img {\n  width: 180px;\n  margin: 3px;\n  cursor: pointer;\n}\n"; (require("browserify-css").createStyle(css, { "href": "src/components/body_movielist/body_movielist.css" }, { "insertAt": "bottom" })); module.exports = css;
},{"browserify-css":1}],31:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

require('./body_movielist.css');

require('../../css/slick.css');

var _post = require('../../services/post');

var _detail_popup = require('../detail_popup/detail_popup.js');

var _detail_popup2 = _interopRequireDefault(_detail_popup);

var _layer_popup = require('../layer_popup/layer_popup.js');

var _layer_popup2 = _interopRequireDefault(_layer_popup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MovieList = function (_React$Component) {
	_inherits(MovieList, _React$Component);

	function MovieList(props) {
		_classCallCheck(this, MovieList);

		var _this = _possibleConstructorReturn(this, (MovieList.__proto__ || Object.getPrototypeOf(MovieList)).call(this, props));

		_this.state = {
			markupList: [],
			focused: false,
			viewDetailFocused: false,
			movieInfo: {}
		};

		_this.onMouseEnterHandler = _this.onMouseEnterHandler.bind(_this);
		_this.onMouseLeaveHandler = _this.onMouseLeaveHandler.bind(_this);
		_this.onMovieItemClick = _this.onMovieItemClick.bind(_this);
		_this.openLayerPopup = _this.openLayerPopup.bind(_this);
		_this.closeLayerPopup = _this.closeLayerPopup.bind(_this);
		return _this;
	}

	_createClass(MovieList, [{
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(nextProps) {
			var movieList = nextProps.list;
			if (movieList != null && movieList.length > 0) {
				// console.log('movieList = '+movieList)
				var markupList = movieList.map(function (data, i) {
					return _react2.default.createElement(
						'div',
						{ key: i },
						_react2.default.createElement('img', { src: data.poster, 'data-id': data.id })
					);
				});

				this.setState({
					markupList: markupList
				});
			}
		}
	}, {
		key: 'onMouseEnterHandler',
		value: function onMouseEnterHandler(e) {
			// e.currentTarget.classList.add('selected');
			this.setState({
				focused: false
			});
		}
	}, {
		key: 'onMouseLeaveHandler',
		value: function onMouseLeaveHandler(e) {
			// e.currentTarget.classList.remove('selected')
		}
	}, {
		key: 'onMovieItemClick',
		value: function onMovieItemClick(e, newState) {
			var _this2 = this;

			// console.log('onMovieItemClick');
			var nativeEvent = e.nativeEvent;
			var id = e.target.getAttribute('data-id') ? e.target.getAttribute('data-id') : '';
			if (id) {
				(0, _post.getMovieDetailData)(id).then(function (res) {
					var detailData = res.data;
					// console.log('detailData = '+detailData);
					detailData['top'] = nativeEvent.pageY - nativeEvent.offsetY - 90;
					detailData['left'] = nativeEvent.pageX - nativeEvent.offsetX - 90;
					// console.log('e.nativeEvent = '+e.nativeEvent);
					// console.log('top = '+detailData['top']);
					// console.log('left = '+detailData['left']);

					_this2.setState({
						focused: newState,
						movieInfo: detailData
					});
				});
			}
		}
	}, {
		key: 'openLayerPopup',
		value: function openLayerPopup(e) {
			this.setState({
				focused: false,
				viewDetailFocused: true
			});
		}
	}, {
		key: 'closeLayerPopup',
		value: function closeLayerPopup(e) {
			this.setState({
				viewDetailFocused: false
			});
		}
	}, {
		key: 'render',
		value: function render() {
			var _state = this.state,
			    markupList = _state.markupList,
			    movieInfo = _state.movieInfo,
			    focused = _state.focused,
			    viewDetailFocused = _state.viewDetailFocused;


			return _react2.default.createElement(
				'div',
				null,
				_react2.default.createElement(
					'div',
					{ className: 'title-wrap' },
					_react2.default.createElement(
						'h2',
						null,
						this.props.title
					)
				),
				_react2.default.createElement(
					'div',
					{ className: 'content-wrapper' },
					_react2.default.createElement(
						'div',
						{ className: 'movie-list',
							onMouseEnter: this.onMouseEnterHandler,
							onMouseLeave: this.onMouseLeaveHandler
						},
						_react2.default.createElement(
							'div',
							{ className: 'movie-item', onClick: this.onMovieItemClick },
							markupList
						)
					)
				),
				focused ? _react2.default.createElement(_detail_popup2.default, {
					movieInfo: movieInfo,
					callbackParent: this.openLayerPopup
				}) : "",
				viewDetailFocused ? _react2.default.createElement(_layer_popup2.default, {
					movieInfo: this.state.movieInfo,
					callbackParent: this.closeLayerPopup
				}) : ""
			);
		}
	}]);

	return MovieList;
}(_react2.default.Component);

exports.default = MovieList;

},{"../../css/slick.css":71,"../../services/post":74,"../detail_popup/detail_popup.js":35,"../layer_popup/layer_popup.js":45,"./body_movielist.css":30,"react":"react"}],32:[function(require,module,exports){
var css = "/* content */\n.cnt-wrapper {\n  background: #303030;\n}\n.cnt-main {\n  min-width: 1196px;\n  height: 450px;\n  margin: 0 auto;\n  /* background: #181818 url(\"/css/images/main-bg.jpg\") no-repeat center center;*/\n}\n.cnt-main__content {\n  position: relative;\n  width: 1196px;\n  height: 450px;\n  margin: 0 auto;\n}\n.main-disc__first {\n  position: relative;\n  top: 80px;\n  font-size: 100px;\n  line-height: 44px;\n  color: #ffffff;\n}\n.main-disc__second {\n  width: 400px;\n  margin: 160px 0 20px;\n  font-size: 20px;\n  font-weight: bold;\n  color: #ffffff;\n}\n.recent-movie__go {\n  display: block;\n  font-size: 15px;\n  font-weight: bold;\n  color: #a8a8a8;\n}\n.recent-movie__go:after {\n  content: '';\n  display: inline-block;\n  width: 8px;\n  height: 11px;\n  position: relative;\n  top: 1px;\n  left: 10px;\n  background: url(\"/css/images/btn-icon.png\") no-repeat 0 0;\n}\n.cnt-main__btnwrap {\n  margin-top: 40px;\n}\n.cnt-main__btnwrap .btn-play {\n  width: 83px;\n  height: 34px;\n  padding-right: 14px;\n  font-size: 15px;\n  font-weight: bold;\n  line-height: 20px;\n  color: #ffffff;\n  background: #ea002c;\n  -webkit-border-radius: 3px;\n  -moz-border-radius: 3px;\n  -ms-border-radius: 3px;\n  border-radius: 3px;\n}\n.cnt-main__btnwrap .btn-play:after {\n  content: '';\n  display: inline-block;\n  width: 6px;\n  height: 11px;\n  position: relative;\n  top: 0;\n  left: 10px;\n  background: url(\"/css/images/btn-icon.png\") no-repeat 0 -54px;\n}\n.cnt-main__btnwrap .btn-movielist {\n  width: 150px;\n  height: 36px;\n  padding-right: 14px;\n  margin-left: 3px;\n  font-size: 15px;\n  font-weight: bold;\n  line-height: 28px;\n  color: #a8a8a8;\n  background: #181818;\n  border: 2px solid #666666;\n  -webkit-border-radius: 3px;\n  -moz-border-radius: 3px;\n  -ms-border-radius: 3px;\n  border-radius: 3px;\n}\n.cnt-main__btnwrap .btn-movielist:after {\n  content: '';\n  display: inline-block;\n  width: 12px;\n  height: 12px;\n  position: relative;\n  top: 1px;\n  left: 10px;\n  background: url(\"/css/images/btn-icon.png\") no-repeat 0 -116px;\n}\n"; (require("browserify-css").createStyle(css, { "href": "src/components/body_promotion/body_promotion.css" }, { "insertAt": "bottom" })); module.exports = css;
},{"browserify-css":1}],33:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

require('./body_promotion.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BodyPromotion = function (_React$Component) {
	_inherits(BodyPromotion, _React$Component);

	function BodyPromotion(props) {
		_classCallCheck(this, BodyPromotion);

		var _this = _possibleConstructorReturn(this, (BodyPromotion.__proto__ || Object.getPrototypeOf(BodyPromotion)).call(this, props));

		_this.state = {
			title: '',
			summary: ''
		};

		_this.viewAllClickHandler = _this.viewAllClickHandler.bind(_this);
		_this.runClickHandler = _this.runClickHandler.bind(_this);
		_this.viewListClickHandler = _this.viewListClickHandler.bind(_this);
		return _this;
	}

	_createClass(BodyPromotion, [{
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(nextProps) {
			// console.log('BodyPromotion componentWillReceiveProps');

			if (nextProps.bodyPromotionData != null) {
				var bodyPromotionData = nextProps.bodyPromotionData;

				this.setState({
					title: bodyPromotionData['title'],
					summary: bodyPromotionData['summary'],
					posterStyle: {
						background: "#181818 url(" + bodyPromotionData['stillcut'] + ") no-repeat center center"
					}
				});
			}
		}
	}, {
		key: 'viewAllClickHandler',
		value: function viewAllClickHandler(e) {
			alert('최근 등록된 동영상 모두 보기');
		}
	}, {
		key: 'runClickHandler',
		value: function runClickHandler(e) {
			alert('동영상 재생');
		}
	}, {
		key: 'viewListClickHandler',
		value: function viewListClickHandler(e) {
			alert('내 동영상 목록');
		}

		// <a href="#" className="recent-movie__go" onClick={this.viewAllClickHandler}>최근 등록된 동영상 모두 보기</a>

	}, {
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'div',
				{ className: 'cnt-main', style: this.state.posterStyle },
				_react2.default.createElement(
					'div',
					{ className: 'cnt-main__content' },
					_react2.default.createElement('p', { className: 'main-disc__first', dangerouslySetInnerHTML: { __html: this.state.title } }),
					_react2.default.createElement(
						'p',
						{ className: 'main-disc__second' },
						this.state.summary
					),
					_react2.default.createElement(
						'div',
						{ className: 'cnt-main__btnwrap' },
						_react2.default.createElement(
							'button',
							{ type: 'button', className: 'btn-play', onClick: this.runClickHandler },
							'\uC7AC\uC0DD'
						),
						_react2.default.createElement(
							'button',
							{ type: 'button', className: 'btn-movielist', onClick: this.viewListClickHandler },
							'\uB0B4 \uB3D9\uC601\uC0C1 \uBAA9\uB85D'
						)
					)
				)
			);
		}
	}]);

	return BodyPromotion;
}(_react2.default.Component);

exports.default = BodyPromotion;

},{"./body_promotion.css":32,"react":"react"}],34:[function(require,module,exports){
var css = "/* movie item sample disc */\n.item-info__wrap {\n  position: absolute;\n  width: 346px;\n  height: 226px;\n  border: 5px solid #ea002c;\n  z-index: 10;\n}\n.item-info__wrap img,\n.item-info__wrap  .item-info__img {\n  width: 100%;\n  height: 100%;\n}\n.item-info__box {\n  position: absolute;\n  top: 0;\n  width: 346px;\n  height: 226px;\n  background: rgba(0, 0, 0, 0.5);\n}\n.item-info__title {\n  position: relative;\n  top: 44px;\n  left: 15px;\n  font-size: 25px;\n  font-weight: bold;\n  color: #ffffff;\n}\n.rate-wrap {\n  position: relative;\n  top: 18px;\n  left: 15px;\n}\n.star-grade__wrap {\n  display: inline-block;\n  overflow: hidden;\n  width: 54px;\n  height: 10px;\n  background: url(\"/css/images/star.png\") no-repeat;\n}\n.star-grade {\n  display: block;\n  text-indent: -9999px;\n  width: 100%;\n  background: url(\"/css/images/star.png\") no-repeat 0 -29px;\n}\n.open-year {\n  display: inline-block;\n  position: relative;\n  top: -2px;\n  margin: 0 2px;\n  font-size: 12px;\n  font-style: normal;\n  color: #c3c3c3;\n}\n.age-grade {\n  display: inline-block;\n  position: relative;\n  top: -2px;\n  padding: 0 4px;\n  height: 15px;\n  line-height: 15px;\n  font-size: 10px;\n  font-weight: bold;\n  color: #cccccc;\n  border: 1px solid #999999;\n}\n.info-disc {\n  position: relative;\n  top: 24px;\n  left: 15px;\n  width: 310px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  font-size: 12px;\n  color: #ffffff;\n  line-height: 18px;\n}\n.info-disc__more {\n  display: block;\n  position: absolute;\n  bottom: 0px;\n  /*position: relative;\n\ttop: 28px;*/\n  width: 100%;\n  height: 30px;\n  text-indent: -9999px;\n  background: url(\"/css/images/item-btn-more.png\") no-repeat center center;\n}\n"; (require("browserify-css").createStyle(css, { "href": "src/components/detail_popup/detail_popup.css" }, { "insertAt": "bottom" })); module.exports = css;
},{"browserify-css":1}],35:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

require('./detail_popup.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DetailPopup = function (_React$Component) {
	_inherits(DetailPopup, _React$Component);

	function DetailPopup(props) {
		_classCallCheck(this, DetailPopup);

		var _this = _possibleConstructorReturn(this, (DetailPopup.__proto__ || Object.getPrototypeOf(DetailPopup)).call(this, props));

		_this.state = {
			title: '',
			poster: '',
			year: '',
			rate: '',
			grade: '',
			summary: '',
			popupStyle: {},
			startGradeCss: {}
		};

		_this.viewDetail = _this.viewDetail.bind(_this);
		return _this;
	}

	_createClass(DetailPopup, [{
		key: 'componentWillMount',
		value: function componentWillMount() {
			var info = this.props.movieInfo;
			// console.log('info = '+info);
			this.setState({
				title: info.title,
				poster: info.poster,
				year: info.year,
				rate: info.rate,
				grade: info.grade,
				summary: info.summary,
				popupStyle: {
					top: info.top + "px",
					left: info.left + "px"
				},
				gradeCss: {
					width: info.grade * 20 + '%'
				}
			});
		}
	}, {
		key: 'viewDetail',
		value: function viewDetail(e) {
			this.props.callbackParent(e);
		}
	}, {
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'div',
				{ ref: 'infopopup', className: 'item-info__wrap', style: this.state.popupStyle },
				_react2.default.createElement(
					'p',
					{ className: 'item-info__img' },
					_react2.default.createElement('img', { src: this.state.poster, alt: '' })
				),
				_react2.default.createElement(
					'div',
					{ className: 'item-info__box' },
					_react2.default.createElement(
						'h4',
						{ className: 'item-info__title' },
						this.state.title
					),
					_react2.default.createElement(
						'div',
						{ className: 'rate-wrap' },
						_react2.default.createElement(
							'span',
							{ className: 'star-grade__wrap' },
							_react2.default.createElement(
								'span',
								{ className: 'star-grade', style: this.state.gradeCss },
								this.state.grade
							)
						),
						_react2.default.createElement(
							'em',
							{ className: 'open-year' },
							this.state.year
						),
						_react2.default.createElement(
							'span',
							{ className: 'age-grade' },
							this.state.rate
						)
					),
					_react2.default.createElement('div', { className: 'info-disc', dangerouslySetInnerHTML: { __html: this.state.summary } })
				),
				_react2.default.createElement(
					'button',
					{ type: 'button', className: 'info-disc__more', onClick: this.viewDetail, title: '\uC0C1\uC138\uBCF4\uAE30' },
					'\uC0C1\uC138\uBCF4\uAE30'
				)
			);
		}
	}]);

	return DetailPopup;
}(_react2.default.Component);

exports.default = DetailPopup;

},{"./detail_popup.css":34,"react":"react"}],36:[function(require,module,exports){
var css = "/* header gnb */\n.gnb-list {\n  /*display: none;*/\n  position: absolute;\n  top: 57px;\n  left: -100px;\n  width: 900px;\n  height: 200px;\n  padding: 30px 10px;\n  background: #fff;\n  -webkit-box-shadow: 2px 6px 14px #000000;\n  -moz-box-shadow: 2px 6px 14px #000000;\n  box-shadow: 2px 6px 14px #000000;\n  z-index: 10;\n}\n.gnb-list ul {\n  float: left;\n  padding-left: 16px;\n  width: 160px;\n  border-right: 1px solid #e0e0e0;\n}\n.gnb-list ul:nth-child(5) {\n  border-right: 0;\n}\n.gnb-list ul li a {\n  display: block;\n  padding: 8px 4px;\n  font-size: 14px;\n  font-weight: bold;\n  color: #333333;\n}\n.gnb-list ul li a:hover,\n.gnb-list ul li a.selected {\n  color: #ea002c;\n}\n.gnb-list ul li a:hover:after,\n.gnb-list ul li a.selected:after {\n  content: '';\n  display: inline-block;\n  position: relative;\n  top: -1px;\n  left: 10px;\n  width: 4px;\n  height: 7px;\n  background: url(\"/css/images/topmenu-icon.png\") no-repeat 0 -54px;\n}\n.gnb-close {\n  position: absolute;\n  right: 20px;\n  bottom: 20px;\n  width: 22px;\n  height: 22px;\n  text-indent: -9999px;\n  background: url(\"/css/images/topmenu-icon.png\") no-repeat 0 -508px;\n}\n"; (require("browserify-css").createStyle(css, { "href": "src/components/header_menu/header_menu.css" }, { "insertAt": "bottom" })); module.exports = css;
},{"browserify-css":1}],37:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

require('./header_menu.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HeaderMenu = function (_React$Component) {
	_inherits(HeaderMenu, _React$Component);

	function HeaderMenu(props) {
		_classCallCheck(this, HeaderMenu);

		var _this = _possibleConstructorReturn(this, (HeaderMenu.__proto__ || Object.getPrototypeOf(HeaderMenu)).call(this, props));

		_this.state = {
			focused: false
		};
		_this.closeMenu = _this.closeMenu.bind(_this);
		_this.goToMenu = _this.goToMenu.bind(_this);
		return _this;
	}

	_createClass(HeaderMenu, [{
		key: 'closeMenu',
		value: function closeMenu() {
			var event = new Event('request-menu-close', { bubbles: true });
			this.refs.menu.dispatchEvent(event);
		}
	}, {
		key: 'goToMenu',
		value: function goToMenu(menu) {
			//TODO
			console.log('goto', menu);
			if (menu && menu.id === "home") {
				window.location.href = "/home";
			}
		}
	}, {
		key: 'render',
		value: function render() {
			var _this2 = this;

			var _props = this.props,
			    focused = _props.focused,
			    selected = _props.selected,
			    defaultMenu = _props.defaultMenu,
			    category = _props.category;

			if (!focused) return null;
			var _props$categorySplitB = this.props.categorySplitBy,
			    categorySplitBy = _props$categorySplitB === undefined ? Math.ceil(category.length / 4) : _props$categorySplitB;

			var categoryList = [].concat(category);
			var categoryMarkup = [];
			for (var i = 0, l = categoryList.length, cl = parseInt(categorySplitBy, 10); i < l; i += cl) {
				var subMenu = categoryList.slice(i, i + cl);
				categoryMarkup.push(_react2.default.createElement(
					'ul',
					{ key: i },
					subMenu.map(function (menu) {
						return _react2.default.createElement(
							'li',
							{ key: menu.id },
							_react2.default.createElement(
								'a',
								{ href: '/categories/' + menu.id },
								menu.name
							)
						);
					})
				));
			}
			return _react2.default.createElement(
				'div',
				{ className: 'gnb-list', ref: 'menu' },
				_react2.default.createElement(
					'ul',
					null,
					defaultMenu.map(function (menu, idx) {
						return _react2.default.createElement(
							'li',
							{ key: idx, onClick: function onClick() {
									return _this2.goToMenu(menu);
								} },
							_react2.default.createElement(
								'a',
								{ href: '#' },
								menu.name
							)
						);
					})
				),
				categoryMarkup,
				_react2.default.createElement(
					'button',
					{ type: 'button', className: 'gnb-close', onClick: this.closeMenu },
					'\uB2EB\uAE30'
				)
			);
		}
	}]);

	return HeaderMenu;
}(_react2.default.Component);

exports.default = HeaderMenu;

},{"./header_menu.css":36,"react":"react"}],38:[function(require,module,exports){
var css = "/* header profile */\n.profile-detail__title {\n  padding: 18px 20px 14px;\n  font-size: 18px;\n  font-weight: bold;\n  color: #333333;\n  border-bottom: 1px solid #d3d3d3;\n  background: #fbfbfb;\n}\n.profile-detail {\n  /*display: none;*/\n  position: absolute;\n  top: 69px;\n  right: -60px;\n  width: 250px;\n  background: #ffffff;\n  -webkit-box-shadow: 1px 6px 6px #000000;\n  -moz-box-shadow: 1px 6px 6px #000000;\n  box-shadow: 1px 6px 6px #000000;\n  z-index: 10;\n}\n.myprofile {\n  margin-top: 10px;\n}\n.myprofile-photo {\n  position: relative;\n  cursor: pointer;\n  width: 100px;\n  margin: 0 auto;\n}\n.myprofile-photo img {\n  width: 100px;\n  height: 100px;\n  -webkit-border-radius: 50px;\n  -moz-border-radius: 50px;\n  -ms-border-radius: 50px;\n  border-radius: 50px;\n}\n.myprofile-icon {\n  display: block;\n  position: absolute;\n  bottom: 0;\n  right: 5px;\n  width: 20px;\n  height: 20px;\n  background: #ffffff url(\"/css/images/topmenu-icon.png\") no-repeat 4px -595px;\n  border: 1px solid #ababab;\n  -webkit-border-radius: 10px;\n  -moz-border-radius: 10px;\n  -ms-border-radius: 10px;\n  border-radius: 10px;\n}\n.myprofile-name {\n  display: block;\n  margin: 10px 0 20px;\n  font-size: 20px;\n  font-weight: bold;\n  text-align: center;\n  color: #333333;\n}\n.myprofile-btngroup {\n  margin: 0 auto;\n  width: 188px;\n  height: 22px;\n  background: #ffffff;\n  border: 1px solid #666666;\n  -webkit-border-radius: 2px;\n  -moz-border-radius: 2px;\n  -ms-border-radius: 2px;\n  border-radius: 2px;\n}\n.myprofile-btngroup li {\n  float: left;\n  width: 50%;\n}\n.myprofile-btngroup li:first-child {\n  border-right: 1px solid #d1d1d1;\n  width: 92px;\n}\n.myprofile-btngroup li a {\n  display: block;\n  height: 22px;\n  line-height: 22px;\n  font-size: 13px;\n  font-weight: bold;\n  text-align: center;\n  color: #666666;\n}\n"; (require("browserify-css").createStyle(css, { "href": "src/components/header_profile/header_profile.css" }, { "insertAt": "bottom" })); module.exports = css;
},{"browserify-css":1}],39:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

require('./header_profile.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HeaderProfile = function (_React$Component) {
	_inherits(HeaderProfile, _React$Component);

	function HeaderProfile(props) {
		_classCallCheck(this, HeaderProfile);

		var _this = _possibleConstructorReturn(this, (HeaderProfile.__proto__ || Object.getPrototypeOf(HeaderProfile)).call(this, props));

		_this.state = {
			focused: false
		};
		_this.closeProfile = _this.closeProfile.bind(_this);
		_this.goToManageProfile = _this.goToManageProfile.bind(_this);
		_this.goToManageMembership = _this.goToManageMembership.bind(_this);
		_this.requestLogout = _this.requestLogout.bind(_this);
		_this.changeProfilePhoto = _this.changeProfilePhoto.bind(_this);
		return _this;
	}

	_createClass(HeaderProfile, [{
		key: 'toggleVisibility',
		value: function toggleVisibility() {
			this.setState({ focused: !this.state.focused });
		}
	}, {
		key: 'closeProfile',
		value: function closeProfile() {
			var event = new Event('request-profile-close', { bubbles: true });
			this.refs.profile.dispatchEvent(event);
		}
	}, {
		key: 'goToManageProfile',
		value: function goToManageProfile(e) {
			//TODO
			e.preventDefault();
			console.log('Manage Profile', this.state.user);
		}
	}, {
		key: 'goToManageMembership',
		value: function goToManageMembership(e) {
			//TODO
			e.preventDefault();
			console.log('Manage Membership', this.state.user);
		}
	}, {
		key: 'requestLogout',
		value: function requestLogout() {
			//TODO
			console.log('Logout', this.state.user);
		}
	}, {
		key: 'changeProfilePhoto',
		value: function changeProfilePhoto() {
			//TODO
			console.log('change profile photo', this.state.user);
		}
	}, {
		key: 'render',
		value: function render() {
			var _props = this.props,
			    focused = _props.focused,
			    user = _props.user;

			if (!focused) return null;
			return _react2.default.createElement(
				'div',
				{ className: 'profile-detail', ref: 'profile' },
				_react2.default.createElement(
					'button',
					{ type: 'button', className: 'topmenu-close', onClick: this.closeProfile },
					'\uB2EB\uAE30'
				),
				_react2.default.createElement(
					'div',
					{ className: 'profile-detail__title' },
					'\uB9C8\uC774 \uD504\uB85C\uD544'
				),
				_react2.default.createElement(
					'div',
					{ className: 'myprofile' },
					_react2.default.createElement(
						'div',
						{ className: 'myprofile-photo', onClick: this.changeProfilePhoto },
						_react2.default.createElement('img', { src: '/css/images/profile-img.jpg' }),
						_react2.default.createElement('span', { className: 'myprofile-icon' })
					),
					_react2.default.createElement(
						'span',
						{ className: 'myprofile-name' },
						user.name
					),
					_react2.default.createElement(
						'ul',
						{ className: 'myprofile-btngroup' },
						_react2.default.createElement(
							'li',
							null,
							_react2.default.createElement(
								'a',
								{ href: '#', onClick: this.goToManageProfile },
								'\uD504\uB85C\uD544 \uAD00\uB9AC'
							)
						),
						_react2.default.createElement(
							'li',
							null,
							_react2.default.createElement(
								'a',
								{ href: '#', onClick: this.goToManageMembership },
								'\uBA64\uBC84\uC2ED \uAD00\uB9AC'
							)
						)
					)
				),
				_react2.default.createElement(
					'div',
					{ className: 'detail-btn__wrap' },
					_react2.default.createElement(
						'button',
						{ type: 'button', className: 'btn-logout', onClick: this.requestLogout },
						'\uB85C\uADF8\uC544\uC6C3'
					)
				)
			);
		}
	}]);

	return HeaderProfile;
}(_react2.default.Component);

exports.default = HeaderProfile;

},{"./header_profile.css":38,"react":"react"}],40:[function(require,module,exports){
var css = ".profile-wrap {\n  position: relative;\n  cursor: pointer;\n  top: 14px;\n  left: 20px;\n}\n.profile-thumnail {\n  float: left;\n}\n.profile-thumnail img {\n  width: 40px;\n  height: 40px;\n  -webkit-border-radius: 20px;\n  -moz-border-radius: 20px;\n  -ms-border-radius: 20px;\n  border-radius: 20px;\n}\n.profile-name {\n  position: relative;\n  display: inline-block;\n  top: 10px;\n  left: 10px;\n  font-size: 15px;\n  font-weight: bold;\n  color: #333333;\n}\n.profile-name:after {\n  content: '';\n  display: inline-block;\n  position: relative;\n  top: -2px;\n  left: 10px;\n  width: 7px;\n  height: 4px;\n  background: url(\"/css/images/topmenu-icon.png\") no-repeat -16px 0;\n}\n.profile-wrap:hover:after,\n.profile-wrap.selected:after {\n  content: '';\n  display: block;\n  width: 11px;\n  height: 6px;\n  position: relative;\n  top: 27px;\n  left: 62%;\n  background: url(\"/css/images/topmenu-icon.png\") no-repeat 0 -111px;\n}\n.profile-wrap:hover .profile-name,\n.profile-wrap.selected .profile-name {\n  color: #ea002c;\n}\n.profile-wrap:hover .profile-name:after,\n.profile-wrap.selected .profile-name:after {\n  background: url(\"/css/images/topmenu-icon.png\") no-repeat 0 0;\n}\n"; (require("browserify-css").createStyle(css, { "href": "src/components/header_profile/header_profile_summary.css" }, { "insertAt": "bottom" })); module.exports = css;
},{"browserify-css":1}],41:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

require('./header_profile_summary.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HeaderProfileSummary = function (_React$Component) {
	_inherits(HeaderProfileSummary, _React$Component);

	function HeaderProfileSummary(props) {
		_classCallCheck(this, HeaderProfileSummary);

		var _this = _possibleConstructorReturn(this, (HeaderProfileSummary.__proto__ || Object.getPrototypeOf(HeaderProfileSummary)).call(this, props));

		_this.state = {
			user: {}
		};
		return _this;
	}

	_createClass(HeaderProfileSummary, [{
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(nextProps) {
			if (nextProps.user) {
				this.setState({ user: nextProps.user });
			}
		}
	}, {
		key: 'render',
		value: function render() {
			var user = this.state.user;

			return _react2.default.createElement(
				'div',
				{ className: 'profile-wrap', onClick: this.props.onClick },
				_react2.default.createElement(
					'div',
					{ className: 'profile-thumnail' },
					_react2.default.createElement('img', { src: '/css/images/profile-img.jpg' })
				),
				_react2.default.createElement(
					'span',
					{ href: '#', className: 'profile-name' },
					user.name
				)
			);
		}
	}]);

	return HeaderProfileSummary;
}(_react2.default.Component);

exports.default = HeaderProfileSummary;

},{"./header_profile_summary.css":40,"react":"react"}],42:[function(require,module,exports){
var css = ""; (require("browserify-css").createStyle(css, { "href": "src/components/layer_popup/detailinfo/detailinfo.css" }, { "insertAt": "bottom" })); module.exports = css;
},{"browserify-css":1}],43:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

require('./detailinfo.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DetailInfo = function (_React$Component) {
	_inherits(DetailInfo, _React$Component);

	function DetailInfo(props) {
		_classCallCheck(this, DetailInfo);

		var _this = _possibleConstructorReturn(this, (DetailInfo.__proto__ || Object.getPrototypeOf(DetailInfo)).call(this, props));

		_this.state = {
			title: '',
			stargrade: '',
			starGradeCss: {},
			regDate: '',
			rate: '',
			grade: '',
			directorMarkup: ''
		};
		return _this;
	}

	_createClass(DetailInfo, [{
		key: 'componentWillMount',
		value: function componentWillMount() {
			if (this.props.movieInfo != null) {
				var detailData = this.props.movieInfo;
				// console.log(JSON.stringify(detailData));
				// 마크업 생성 
				if (detailData['director'] != null) {
					var directorMarkup = detailData['director'].map(function (data, i) {
						return _react2.default.createElement(
							'li',
							{ key: i },
							data
						);
					});
					this.setState({
						directorMarkup: directorMarkup
					});
				}
				var actorMarkup = detailData['actor'].map(function (data, i) {
					return _react2.default.createElement(
						'li',
						{ key: i },
						data
					);
				});
				var genreMarkup = detailData['genre'].map(function (data, i) {
					return _react2.default.createElement(
						'li',
						{ key: i },
						data
					);
				});
				var voiceMarkup = detailData['voice'].map(function (data, i) {
					return _react2.default.createElement(
						'li',
						{ key: i },
						data
					);
				});
				var subtitleMarkup = detailData['subtitle'].map(function (data, i) {
					return _react2.default.createElement(
						'li',
						{ key: i },
						data
					);
				});
				this.setState({
					title: detailData.title,
					starGradeCss: {
						width: detailData.grade * 20 + '%'
					},
					regDate: detailData.regDate,
					rate: detailData.rate,
					grade: detailData.grade,
					actorMarkup: actorMarkup,
					genreMarkup: genreMarkup,
					voiceMarkup: voiceMarkup,
					subtitleMarkup: subtitleMarkup
				});
			}
		}
	}, {
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'div',
				null,
				_react2.default.createElement(
					'div',
					{ className: 'clip-series' },
					_react2.default.createElement(
						'h4',
						null,
						this.state.title
					)
				),
				_react2.default.createElement(
					'div',
					{ className: 'cast-info' },
					_react2.default.createElement(
						'ul',
						null,
						_react2.default.createElement(
							'li',
							null,
							_react2.default.createElement(
								'span',
								{ className: 'cast-object' },
								'\uAC10\uB3C5'
							),
							_react2.default.createElement(
								'em',
								null,
								':'
							),
							_react2.default.createElement(
								'ul',
								{ className: 'cast-name__list' },
								this.state.directorMarkup
							)
						),
						_react2.default.createElement(
							'li',
							null,
							_react2.default.createElement(
								'span',
								{ className: 'cast-object' },
								'\uAC1C\uBD09\uC77C'
							),
							_react2.default.createElement(
								'em',
								null,
								':'
							),
							_react2.default.createElement(
								'ul',
								{ className: 'cast-name__list' },
								_react2.default.createElement(
									'li',
									null,
									this.state.regDate
								)
							)
						),
						_react2.default.createElement(
							'li',
							null,
							_react2.default.createElement(
								'span',
								{ className: 'cast-object' },
								'\uC7A5\uB974'
							),
							_react2.default.createElement(
								'em',
								null,
								':'
							),
							_react2.default.createElement(
								'ul',
								{ className: 'cast-name__list' },
								this.state.genreMarkup
							)
						),
						_react2.default.createElement(
							'li',
							null,
							_react2.default.createElement(
								'span',
								{ className: 'cast-object' },
								'\uB4F1\uAE09'
							),
							_react2.default.createElement(
								'em',
								null,
								':'
							),
							_react2.default.createElement(
								'span',
								{ className: 'cast-object__info' },
								this.state.rate
							)
						),
						_react2.default.createElement(
							'li',
							null,
							_react2.default.createElement(
								'span',
								{ className: 'cast-object' },
								'\uD3C9\uC810'
							),
							_react2.default.createElement(
								'em',
								null,
								':'
							),
							_react2.default.createElement(
								'span',
								{ className: 'rate-wrap bigstar cast-pos' },
								_react2.default.createElement(
									'span',
									{ className: 'star-grade__wrap' },
									_react2.default.createElement(
										'span',
										{ className: 'star-grade', style: this.state.starGradeCss },
										this.state.grade
									)
								)
							)
						)
					),
					_react2.default.createElement(
						'ul',
						null,
						_react2.default.createElement(
							'li',
							null,
							_react2.default.createElement(
								'span',
								{ className: 'cast-object' },
								'\uCD9C\uC5F0\uC9C4'
							),
							_react2.default.createElement(
								'em',
								null,
								':'
							),
							_react2.default.createElement(
								'ul',
								{ className: 'cast-name__list list-scroll' },
								this.state.actorMarkup
							)
						)
					),
					_react2.default.createElement(
						'ul',
						null,
						_react2.default.createElement(
							'li',
							null,
							_react2.default.createElement(
								'span',
								{ className: 'cast-object' },
								'\uC74C\uC131'
							),
							_react2.default.createElement(
								'em',
								null,
								':'
							),
							_react2.default.createElement(
								'ul',
								{ className: 'cast-name__list' },
								this.state.voiceMarkup
							)
						),
						_react2.default.createElement(
							'li',
							null,
							_react2.default.createElement(
								'span',
								{ className: 'cast-object' },
								'\uC790\uB9C9'
							),
							_react2.default.createElement(
								'em',
								null,
								':'
							),
							_react2.default.createElement(
								'ul',
								{ className: 'cast-name__list' },
								this.state.subtitleMarkup
							)
						)
					)
				)
			);
		}
	}]);

	return DetailInfo;
}(_react2.default.Component);

exports.default = DetailInfo;

},{"./detailinfo.css":42,"react":"react"}],44:[function(require,module,exports){
var css = "/* ------------------------------------\n\tlayerpopup\n--------------------------------------- */\n.layer-popup {\n  display: block;\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  z-index: 100;\n}\n.layer-popup .dim-bg {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background: rgba(0, 0, 0, 0.5);\n}\n.layer-popup__wrap {\n  position: absolute;\n  display: block;\n  top: 10%;\n  left: 10%;\n  width: 1195px;\n  height: 530px;\n  background: #000000;\n  border: 5px solid #ea002c;\n}\n.lypopup-close {\n  position: absolute;\n  top: 10px;\n  right: 10px;\n  width: 27px;\n  height: 27px;\n  background: url(\"/css/images/layer-icon.png\") no-repeat 0 0;\n}\n.lypopup-cnt__wrap {\n  position: relative;\n  width: 1090px;\n  margin: 60px auto 0;\n}\n.lypopup-info__menu {\n  position: absolute;\n  top: 441px;\n}\n.movie-detail__menu {\n  height: 25px;\n}\n.movie-detail__menu li {\n  float: left;\n  background: url(\"/css/images/layer-icon.png\") no-repeat -99px -60px;\n}\n.movie-detail__menu li:first-child {\n  background: none;\n}\n.movie-detail__menu li a {\n  display: inline-block;\n  padding: 0 15px;\n  font-size: 14px;\n  font-weight: bold;\n  color: #999999;\n  cursor: pointer;\n}\n.movie-detail__menu li:first-child a {\n  padding-left: 0;\n  border-left: 0;\n}\n.movie-detail__menu li:hover a,\n.movie-detail__menu li.selected a {\n  color: #ea002c;\n}\n.movie-detail__menu li:hover a:after,\n.movie-detail__menu li.selected a:after {\n  content: '';\n  display: block;\n  position: relative;\n  top: 4px;\n  width: 100%;\n  height: 7px;\n  background: url(\"/css/images/lypop-menu-icon.png\") no-repeat center bottom;\n}\n/* movie clip series list */\n.clip-series__list {\n  position: relative;\n}\n.clip-item {\n  position: relative;\n  width: 1080px;\n  margin: 0 auto;\n}\n.clip-item > div {\n  float: left;\n  margin-left: 3px;\n}\n.clip-item > div:first-child {\n  margin-left: 0;\n}\n.clip-item__wrap {\n  position: relative;\n  cursor: pointer;\n}\n.clip-photo {\n  position: relative;\n}\n.clip-photo:after {\n  content: '';\n  display: block;\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background: #000000;\n  opacity: .3;\n}\n.clip-num {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  width: 30px;\n  height: 30px;\n  font-size: 23px;\n  font-weight: bold;\n  letter-spacing: -2px;\n  color: #ea002c;\n  text-indent: -2px;\n  text-align: center;\n  background: rgba(0, 0, 0, 0.5);\n}\n.clip-btn__prev,\n.clip-btn__next {\n  width: 14px;\n  height: 70px;\n  text-indent: -9999px;\n}\n.clip-btn__prev {\n  position: absolute;\n  top: 50px;\n  left: -22px;\n  background: url(\"/css/images/layer-icon.png\") no-repeat 2px -220px;\n}\n.clip-btn__prev:hover {\n  background: url(\"/css/images/layer-icon.png\") no-repeat -88px -220px;\n}\n.clip-btn__next {\n  position: absolute;\n  top: 50px;\n  right: -22px;\n  background: url(\"/css/images/layer-icon.png\") no-repeat 2px -307px;\n}\n.clip-btn__next:hover {\n  background: url(\"/css/images/layer-icon.png\") no-repeat -88px -307px;\n}\n.clip-disc {\n  width: 226px;\n  margin-top: 10px;\n}\n.clip-disc dt {\n  margin-bottom: 6px;\n  font-size: 15px;\n  color: #a3a3a3;\n}\n.clip-disc dd {\n  padding-right: 4px;\n  font-size: 12px;\n  line-height: 18px;\n  color: #606060;\n}\n.clip-item__wrap:hover .clip-photo:after,\n.clip-item__wrap:focus .clip-photo:after,\n.clip-item__wrap:hover .clip-photo .clip-num {\n  opacity: 0;\n}\n.clip-item__wrap:hover .clip-disc dt,\n.clip-item__wrap:focus .clip-disc dt,\n.clip-item__wrap:hover .clip-disc dd,\n.clip-item__wrap:focus .clip-disc dd,\n.clip-item__wrap:hover .coming-title,\n.clip-item__wrap:focus .coming-title {\n  color: #ffffff;\n}\n.coming-title {\n  margin-top: 10px;\n  font-size: 15px;\n  color: #a3a3a3;\n}\n.clip-star__wrap {\n  margin: 6px 0 10px;\n}\n.rate-wrap.bigstar.cast-pos {\n  position: relative;\n  top: 0;\n  left: 20px;\n}\n.cast-info {\n  position: relative;\n  /*top: 50px;*/\n}\n.cast-info > ul {\n  float: left;\n  height: 270px;\n  padding-left: 30px;\n  border-right: 1px solid #1a1a1a;\n}\n.cast-info > ul {\n  width: 320px;\n}\n.cast-info > ul + ul {\n  width: 430px;\n}\n.cast-info > ul + ul + ul {\n  width: 260px;\n}\n.cast-info > ul:first-child {\n  padding-left: 0;\n}\n.cast-info > ul > li {\n  overflow: hidden;\n  padding-bottom: 8px;\n}\n.cast-info span,\n.cast-info em {\n  display: inline-block;\n}\n.cast-info .cast-object {\n  float: left;\n  width: 80px;\n  color: #c3c3c3;\n  font-size: 15px;\n  font-weight: bold;\n}\n.cast-info em {\n  float: left;\n  font-style: normal;\n  color: #999999;\n  font-size: 14px;\n}\n.cast-object__info {\n  position: relative;\n  left: 20px;\n  color: #999999;\n  font-size: 14px;\n}\n.cast-object__name {\n  color: #999999;\n  font-size: 14px;\n}\n.cast-name__list {\n  float: left;\n  width: 55%;\n  margin-left: 20px;\n}\n.cast-name__list li {\n  padding: 2px 0 6px;\n  color: #999999;\n  font-size: 14px;\n}\n.cast-name__list.list-scroll {\n  height: 270px;\n  overflow: auto;\n  padding-right: 20px;\n}\n.cast-name__list.list-scroll::-webkit-scrollbar {\n  width: 8px;\n  height: 8px;\n  border: 2px solid #aeaeae;\n}\n.cast-name__list.list-scroll::-webkit-scrollbar-button:start:decrement,\n.cast-name__list.list-scroll::-webkit-scrollbar-button:end:increment {\n  display: block;\n  height: 10px;\n  background: #515151;\n}\n.cast-name__list.list-scroll::-webkit-scrollbar-track {\n  background: #434343;\n  -webkit-box-shadow: inset 0 0 4px rgba(0,0,0,.2);\n}\n.cast-name__list.list-scroll::-webkit-scrollbar-thumb {\n  height: 50px;\n  width: 50px;\n  background: #9e9e9e;\n  -webkit-box-shadow: inset 0 0 4px rgba(0,0,0,.1);\n}\n/* 추가된 CSS */\n.clip-item .clip-photo img {\n  width: 292px;\n}\n/* hover시 플레이 버튼 나옴 */\n.play-button {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  top: 0;\n  font-size: 10px;\n  opacity: 0;\n  /*background: -webkit-linear-gradient(bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%);\n\tbackground: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%);*/\n  -webkit-transition: 450ms opacity;\n  transition: 450ms opacity;\n}\n.play-button:after,\n.play-button:before {\n  content: '';\n  position: absolute;\n  top: 80px;\n  left: 48%;\n  display: #000;\n}\n.play-button:after {\n  margin-top: -25px;\n  margin-left: -25px;\n  width: 50px;\n  height: 50px;\n  border: 3px solid #ecf0f1;\n  line-height: 50px;\n  text-align: center;\n  border-radius: 100%;\n  background: rgba(0,0,0,0.5);\n  z-index: 1;\n}\n.play-button:before {\n  content: '▶';\n  color: red;\n  left: 43%;\n  /*width: 100%;*/\n  font-size: 30px;\n  margin-left: 6px;\n  margin-top: -15px;\n  text-align: center;\n  z-index: 2;\n}\n.clip-item__wrap:hover .play-button {\n  opacity: 1;\n}\n"; (require("browserify-css").createStyle(css, { "href": "src/components/layer_popup/layer_popup.css" }, { "insertAt": "bottom" })); module.exports = css;
},{"browserify-css":1}],45:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

require('./layer_popup.css');

var _post = require('../../services/post');

var _movieinfo = require('./movieinfo/movieinfo.js');

var _movieinfo2 = _interopRequireDefault(_movieinfo);

var _series = require('./series/series.js');

var _series2 = _interopRequireDefault(_series);

var _preview = require('./preview/preview.js');

var _preview2 = _interopRequireDefault(_preview);

var _similar = require('./similar/similar.js');

var _similar2 = _interopRequireDefault(_similar);

var _detailinfo = require('./detailinfo/detailinfo.js');

var _detailinfo2 = _interopRequireDefault(_detailinfo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
// import Similar from '../test_carousel/similar.js';


var LayerPopup = function (_React$Component) {
	_inherits(LayerPopup, _React$Component);

	function LayerPopup(props) {
		_classCallCheck(this, LayerPopup);

		var _this = _possibleConstructorReturn(this, (LayerPopup.__proto__ || Object.getPrototypeOf(LayerPopup)).call(this, props));

		_this.state = {
			activeTab: 'movieInfo',
			movieInfo: {},
			episodeList: [],
			trailerList: [],
			similarList: []
		};

		_this.saveMovie = _this.saveMovie.bind(_this);
		_this.close = _this.close.bind(_this);
		_this.changeTab = _this.changeTab.bind(_this);
		return _this;
	}

	_createClass(LayerPopup, [{
		key: 'componentWillMount',
		value: function componentWillMount() {
			// console.log('LayerPopup componentWillMount');
			if (this.props.movieInfo != null) {
				this.setState({
					movieInfo: this.props.movieInfo
				});
			}
		}
	}, {
		key: 'saveMovie',
		value: function saveMovie(e) {
			alert('동영상 목록에 해당 영화를 저장하였습니다.');
		}
	}, {
		key: 'close',
		value: function close(e) {
			this.props.callbackParent(e);
		}
	}, {
		key: 'changeTab',
		value: function changeTab(e) {
			var _this2 = this;

			var index = e.target.getAttribute('data-index');
			if (index != null) {
				if (this.state.activeTab == index) {
					return;
				} else if (index === 'episodes') {
					(0, _post.getEpisodeData)(this.state.movieInfo.id).then(function (res) {
						_this2.setState({
							episodeList: res.data,
							activeTab: index
						});
					});
				} else if (index === 'trailers') {
					(0, _post.getTrailersData)(this.state.movieInfo.id).then(function (res) {
						_this2.setState({
							trailerList: res.data,
							activeTab: index
						});
					});
				} else if (index === 'similars') {
					var id = this.state.movieInfo.id;
					var category = this.state.movieInfo.category;
					(0, _post.getSimilarsData)(id, category).then(function (res) {
						_this2.setState({
							similarList: res.data,
							activeTab: index
						});
					});
				} else {
					this.setState({
						activeTab: index
					});
				}
			}
		}
	}, {
		key: 'render',
		value: function render() {
			var _state = this.state,
			    movieInfo = _state.movieInfo,
			    activeTab = _state.activeTab,
			    episodeList = _state.episodeList,
			    trailerList = _state.trailerList,
			    similarList = _state.similarList;


			return _react2.default.createElement(
				'div',
				{ className: 'layer-popup' },
				_react2.default.createElement('div', { className: 'dim-bg' }),
				_react2.default.createElement(
					'div',
					{ id: 'layer1', className: 'layer-popup__wrap' },
					_react2.default.createElement(
						'button',
						{ type: 'button', className: 'lypopup-close', onClick: this.close },
						'\uB2EB\uAE30'
					),
					_react2.default.createElement(
						'div',
						{ className: 'lypopup-cnt__wrap' },
						_react2.default.createElement(
							'div',
							{ className: 'lypopup-info__menu' },
							_react2.default.createElement(
								'ul',
								{ className: 'movie-detail__menu', onClick: this.changeTab },
								_react2.default.createElement(
									'li',
									{ className: activeTab === 'movieInfo' ? "selected" : "" },
									_react2.default.createElement(
										'a',
										{ 'data-index': 'movieInfo' },
										'\uB3D9\uC601\uC0C1 \uC815\uBCF4'
									)
								),
								movieInfo.hasEpisodes ? _react2.default.createElement(
									'li',
									{ className: activeTab === 'episodes' ? "selected" : "" },
									_react2.default.createElement(
										'a',
										{ 'data-index': 'episodes' },
										'\uD68C\uCC28 \uC815\uBCF4'
									)
								) : '',
								movieInfo.hasTrailers ? _react2.default.createElement(
									'li',
									{ className: activeTab === 'trailers' ? "selected" : "" },
									_react2.default.createElement(
										'a',
										{ 'data-index': 'trailers' },
										'\uC608\uACE0\uD3B8 & \uB2E4\uB978 \uC601\uC0C1'
									)
								) : '',
								_react2.default.createElement(
									'li',
									{ className: activeTab === 'similars' ? "selected" : "" },
									_react2.default.createElement(
										'a',
										{ 'data-index': 'similars' },
										'\uBE44\uC2B7\uD55C \uB3D9\uC601\uC0C1'
									)
								),
								_react2.default.createElement(
									'li',
									{ className: activeTab === 'detail' ? "selected" : "" },
									_react2.default.createElement(
										'a',
										{ 'data-index': 'detail' },
										'\uC0C1\uC138 \uC815\uBCF4'
									)
								)
							)
						),
						_react2.default.createElement(
							'div',
							{ className: 'lypopup-detail__wrap' },
							activeTab == 'movieInfo' ? _react2.default.createElement(_movieinfo2.default, {
								movieInfo: movieInfo
							}) : '',
							activeTab == 'episodes' ? _react2.default.createElement(_series2.default, {
								movieInfo: movieInfo,
								episodeList: episodeList
							}) : '',
							activeTab == 'trailers' ? _react2.default.createElement(_preview2.default, {
								movieInfo: movieInfo,
								trailerList: trailerList
							}) : '',
							activeTab == 'similars' ? _react2.default.createElement(_similar2.default, {
								movieInfo: movieInfo,
								similarList: similarList
							}) : '',
							activeTab == 'detail' ? _react2.default.createElement(_detailinfo2.default, {
								movieInfo: movieInfo
							}) : ''
						)
					)
				)
			);
		}
	}]);

	return LayerPopup;
}(_react2.default.Component);

exports.default = LayerPopup;

},{"../../services/post":74,"./detailinfo/detailinfo.js":43,"./layer_popup.css":44,"./movieinfo/movieinfo.js":47,"./preview/preview.js":49,"./series/series.js":51,"./similar/similar.js":55,"react":"react"}],46:[function(require,module,exports){
var css = "/* layerpopup movie detail discription */\n.lypopup-detail__wrap {\n  display: table;\n}\n.detail-cnt {\n  display: table-cell;\n  vertical-align: top;\n  width: 370px;\n}\n.detail-cnt h4,\n.clip-series h4 {\n  margin: 0;\n  margin-bottom: 20px;\n  font-size: 40px;\n  font-weight: bold;\n  color: #ffffff;\n}\n.rate-wrap.bigstar {\n  position: relative;\n  top: 18px;\n  left: 0;\n}\n.rate-wrap.bigstar .star-grade__wrap {\n  display: inline-block;\n  overflow: hidden;\n  width: 76px;\n  height: 12px;\n  background: url(\"/css/images/layer-icon.png\") no-repeat 0 -128px;\n}\n.rate-wrap.bigstar .star-grade {\n  display: block;\n  text-indent: -9999px;\n  width: 100%;\n  background: url(\"/css/images/layer-icon.png\") no-repeat 0 -178px;\n}\n.rate-wrap.bigstar .open-year {\n  display: inline-block;\n  position: relative;\n  top: -2px;\n  margin: 0 8px;\n  font-size: 15px;\n  font-style: normal;\n  color: #cccccc;\n}\n.rate-wrap.bigstar .age-grade {\n  display: inline-block;\n  position: relative;\n  top: -2px;\n  padding: 1px 8px 1px 4px;\n  font-size: 13px;\n  font-weight: bold;\n  color: #cccccc;\n  border: 1px solid #4d4d4d;\n}\n.detail-cnt .detail-cnt__disc {\n  position: relative;\n  margin: 50px 0 30px;\n  color: #cccccc;\n  font-size: 14px;\n  line-height: 24px;\n}\n.detail-cnt .detail-cnt__disc strong {\n  display: block;\n  font-weight: bold;\n  font-size: 15px;\n  line-height: 24px;\n  color: #ffffff;\n  margin-bottom: 10px;\n}\n.lypop-btn__movielist {\n  height: 36px;\n  padding: 0 26px 0 16px;\n  font-size: 15px;\n  font-weight: bold;\n  line-height: 28px;\n  color: #a3a3a3;\n  background: #000000;\n  border: 1px solid #666666;\n}\n.lypop-btn__movielist:after {\n  content: '';\n  display: inline-block;\n  width: 12px;\n  height: 12px;\n  position: relative;\n  top: 1px;\n  left: 10px;\n  background: url(\"/css/images/btn-icon.png\") no-repeat 0 -116px;\n}\n/* movie clip */\n.movie-clip__wrap {\n  display: table-cell;\n  vertical-align: top;\n  padding-left: 60px;\n}\n"; (require("browserify-css").createStyle(css, { "href": "src/components/layer_popup/movieinfo/movieinfo.css" }, { "insertAt": "bottom" })); module.exports = css;
},{"browserify-css":1}],47:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

require('./movieinfo.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MovieInfo = function (_React$Component) {
	_inherits(MovieInfo, _React$Component);

	function MovieInfo(props) {
		_classCallCheck(this, MovieInfo);

		var _this = _possibleConstructorReturn(this, (MovieInfo.__proto__ || Object.getPrototypeOf(MovieInfo)).call(this, props));

		_this.state = {
			title: '',
			poster: '',
			year: '',
			grade: '',
			rate: '',
			stargrade: '',
			summary: '',
			starGradeCss: {},
			video: ''
		};
		return _this;
	}

	_createClass(MovieInfo, [{
		key: 'componentWillMount',
		value: function componentWillMount() {
			if (this.props.movieInfo != null) {
				var detailData = this.props.movieInfo;
				var videoData = 'https://www.youtube.com/embed/' + detailData['video'] + '?rel=0&autoplay=1';
				this.setState({
					title: detailData.title,
					poster: detailData.poster,
					year: detailData.year,
					grade: detailData.grade,
					rate: detailData.rate,
					summary: detailData.summary,
					starGradeCss: {
						width: detailData.grade * 20 + '%'
					},
					video: videoData
				});
			}
		}
	}, {
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'div',
				null,
				_react2.default.createElement(
					'div',
					{ className: 'detail-cnt' },
					_react2.default.createElement(
						'h4',
						null,
						this.state.title
					),
					_react2.default.createElement(
						'div',
						{ className: 'rate-wrap bigstar' },
						_react2.default.createElement(
							'span',
							{ className: 'star-grade__wrap' },
							_react2.default.createElement(
								'span',
								{ className: 'star-grade', style: this.state.starGradeCss },
								this.state.grade
							)
						),
						_react2.default.createElement(
							'em',
							{ className: 'open-year' },
							this.state.year
						),
						_react2.default.createElement(
							'span',
							{ className: 'age-grade' },
							this.state.rate
						)
					),
					_react2.default.createElement('p', { className: 'detail-cnt__disc', dangerouslySetInnerHTML: { __html: this.state.summary } }),
					_react2.default.createElement(
						'button',
						{ type: 'button', className: 'lypop-btn__movielist', onClick: this.saveMovie },
						'\uB0B4 \uB3D9\uC601\uC0C1 \uBAA9\uB85D'
					)
				),
				_react2.default.createElement(
					'div',
					{ className: 'movie-clip__wrap' },
					_react2.default.createElement('iframe', { width: '645', height: '410', src: this.state.video, allowFullScreen: true })
				)
			);
		}
	}]);

	return MovieInfo;
}(_react2.default.Component);

exports.default = MovieInfo;

},{"./movieinfo.css":46,"react":"react"}],48:[function(require,module,exports){
var css = ""; (require("browserify-css").createStyle(css, { "href": "src/components/layer_popup/preview/preview.css" }, { "insertAt": "bottom" })); module.exports = css;
},{"browserify-css":1}],49:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

require('./preview.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Preview = function (_React$Component) {
	_inherits(Preview, _React$Component);

	function Preview(props) {
		_classCallCheck(this, Preview);

		var _this = _possibleConstructorReturn(this, (Preview.__proto__ || Object.getPrototypeOf(Preview)).call(this, props));

		_this.state = {
			title: ''
		};
		return _this;
	}

	_createClass(Preview, [{
		key: 'componentWillMount',
		value: function componentWillMount() {
			var _this2 = this;

			if (this.props.movieInfo != null) {
				this.setState({
					title: this.props.movieInfo.title
				});

				var trailerList = this.props.trailerList;
				if (trailerList != null && trailerList.length > 0) {
					var markupList = trailerList.map(function (data, i) {
						return _react2.default.createElement(
							'div',
							{ className: 'clip-item__wrap', key: i },
							_react2.default.createElement(
								'div',
								{ className: 'clip-photo' },
								_react2.default.createElement('img', { src: _this2.props.movieInfo.poster, 'data-id': data.content })
							),
							_react2.default.createElement(
								'p',
								{ className: 'coming-title' },
								data.title
							),
							_react2.default.createElement('div', { className: 'play-button' })
						);
					});

					this.setState({
						"markupList": markupList
					});
				}
			}
		}
	}, {
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'div',
				{ className: 'clip-series' },
				_react2.default.createElement(
					'h4',
					null,
					this.state.title
				),
				_react2.default.createElement(
					'div',
					null,
					_react2.default.createElement(
						'div',
						{ className: 'clip-series__list' },
						_react2.default.createElement(
							'div',
							{ className: 'clip-item' },
							this.state.markupList
						)
					)
				)
			);
		}
	}]);

	return Preview;
}(_react2.default.Component);

exports.default = Preview;

},{"./preview.css":48,"react":"react"}],50:[function(require,module,exports){
var css = ".series-select {\n  min-width: 145px;\n  margin-bottom: 10px;\n  padding: 4px 10px 8px;\n  font-size: 15px;\n  color: #a3a3a3;\n  border: 1px solid #666666;\n  background: #000000;\n}\n"; (require("browserify-css").createStyle(css, { "href": "src/components/layer_popup/series/series.css" }, { "insertAt": "bottom" })); module.exports = css;
},{"browserify-css":1}],51:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

require('./series.css');

var _series_carousel = require('./series_carousel/series_carousel.js');

var _series_carousel2 = _interopRequireDefault(_series_carousel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Series = function (_React$Component) {
	_inherits(Series, _React$Component);

	function Series(props) {
		_classCallCheck(this, Series);

		var _this = _possibleConstructorReturn(this, (Series.__proto__ || Object.getPrototypeOf(Series)).call(this, props));

		_this.state = {
			title: ''
		};

		_this.changeEventHandler = _this.changeEventHandler.bind(_this);
		return _this;
	}

	_createClass(Series, [{
		key: 'componentWillMount',
		value: function componentWillMount() {
			if (this.props.movieInfo != null) {
				this.setState({
					title: this.props.movieInfo.title,
					movieInfo: this.props.movieInfo
				});

				// 서버에서 데이터를 가져온다.
				var episodeList = this.props.episodeList;
				if (episodeList != null && episodeList.length > 0) {
					// 시즌 데이터 가져와서 option 리스트 만들어주기
					var optionMarkupList = episodeList.map(function (data, i) {
						return _react2.default.createElement(
							'option',
							{ key: i, value: data.season },
							"시즌 " + data.season
						);
					});
					this.setState({
						episodeList: episodeList,
						episodes: episodeList[0].episodes,
						optionMarkupList: optionMarkupList
					});
				}
			}
		}
	}, {
		key: 'changeEventHandler',
		value: function changeEventHandler(e) {
			var selectIndex = Number(e.currentTarget.value);
			console.log('selectIndex = ' + selectIndex);
			var episodeList = this.state.episodeList;
			this.setState({
				episodes: episodeList[selectIndex - 1].episodes
			});
		}
	}, {
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'div',
				{ className: 'clip-series' },
				_react2.default.createElement(
					'h4',
					null,
					this.state.title
				),
				this.state.episodes != null && this.state.episodes.length > 0 ? _react2.default.createElement(
					'div',
					null,
					_react2.default.createElement(
						'select',
						{ ref: 'season_select', className: 'series-select', onChange: this.changeEventHandler },
						this.state.optionMarkupList
					),
					_react2.default.createElement(
						'div',
						{ className: 'clip-series__list' },
						_react2.default.createElement(_series_carousel2.default, {
							movieInfo: this.state.movieInfo,
							episodes: this.state.episodes
						})
					)
				) : ''
			);
		}
	}]);

	return Series;
}(_react2.default.Component);

exports.default = Series;

},{"./series.css":50,"./series_carousel/series_carousel.js":53,"react":"react"}],52:[function(require,module,exports){
var css = ""; (require("browserify-css").createStyle(css, { "href": "src/components/layer_popup/series/series_carousel/series_carousel.css" }, { "insertAt": "bottom" })); module.exports = css;
},{"browserify-css":1}],53:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactSlick = require('react-slick');

var _reactSlick2 = _interopRequireDefault(_reactSlick);

require('./series_carousel.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SeriesCarousel = function (_React$Component) {
	_inherits(SeriesCarousel, _React$Component);

	function SeriesCarousel(props) {
		_classCallCheck(this, SeriesCarousel);

		var _this = _possibleConstructorReturn(this, (SeriesCarousel.__proto__ || Object.getPrototypeOf(SeriesCarousel)).call(this, props));

		_this.state = {
			"markupList": []
		};

		_this.slide_next = _this.slide_next.bind(_this);
		_this.slide_previous = _this.slide_previous.bind(_this);
		_this.movieClickHandler = _this.movieClickHandler.bind(_this);
		return _this;
	}

	_createClass(SeriesCarousel, [{
		key: 'createMarkup',
		value: function createMarkup(props) {
			if (props.episodes != null) {
				// const movieInfo = props.movieInfo;
				var markupList = props.episodes.map(function (data, i) {
					return _react2.default.createElement(
						'div',
						{ className: 'clip-item__wrap', key: i },
						_react2.default.createElement(
							'div',
							{ className: 'clip-photo' },
							_react2.default.createElement('img', { src: data.poster, 'data-id': data.content }),
							_react2.default.createElement(
								'span',
								{ className: 'clip-num' },
								data.episode
							)
						),
						_react2.default.createElement(
							'dl',
							{ className: 'clip-disc' },
							_react2.default.createElement(
								'dt',
								null,
								data.title
							),
							_react2.default.createElement(
								'dd',
								null,
								data.summary
							)
						),
						_react2.default.createElement('div', { className: 'play-button' })
					);
				});

				this.setState({
					"markupList": markupList
				});
			}
		}
	}, {
		key: 'componentWillMount',
		value: function componentWillMount() {
			this.createMarkup(this.props);
		}
	}, {
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(nextProps) {
			this.createMarkup(nextProps);
		}
	}, {
		key: 'slide_next',
		value: function slide_next() {
			this.refs.slider.slickNext();
		}
	}, {
		key: 'slide_previous',
		value: function slide_previous() {
			this.refs.slider.slickPrev();
		}
	}, {
		key: 'movieClickHandler',
		value: function movieClickHandler(e) {
			console.log('series click');
			// const id = e.target.getAttribute('data-id') ? e.target.getAttribute('data-id'): '';
			// this.props.callbackParent(e, true, id);
		}
	}, {
		key: 'render',
		value: function render() {
			var sliderSettings = {
				dots: false,
				infinite: true,
				speed: 800,
				slidesToShow: 4,
				slidesToScroll: 4
			};
			return _react2.default.createElement(
				'div',
				null,
				_react2.default.createElement(
					'button',
					{ type: 'button', className: 'clip-btn__prev', onClick: this.slide_previous, title: '\uC774\uC804\uB9AC\uC2A4\uD2B8' },
					'\uC774\uC804\uB9AC\uC2A4\uD2B8'
				),
				_react2.default.createElement(
					'div',
					{ className: 'clip-item', onClick: this.movieClickHandler },
					_react2.default.createElement(
						_reactSlick2.default,
						_extends({ ref: 'slider' }, sliderSettings),
						this.state.markupList
					)
				),
				_react2.default.createElement(
					'button',
					{ type: 'button', className: 'clip-btn__next', onClick: this.slide_next, title: '\uB2E4\uC74C\uB9AC\uC2A4\uD2B8' },
					'\uB2E4\uC74C\uB9AC\uC2A4\uD2B8'
				)
			);
		}
	}]);

	return SeriesCarousel;
}(_react2.default.Component);

exports.default = SeriesCarousel;

},{"./series_carousel.css":52,"react":"react","react-slick":9}],54:[function(require,module,exports){
var css = ""; (require("browserify-css").createStyle(css, { "href": "src/components/layer_popup/similar/similar.css" }, { "insertAt": "bottom" })); module.exports = css;
},{"browserify-css":1}],55:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

require('./similar.css');

var _similar_carousel = require('./similar_carousel/similar_carousel.js');

var _similar_carousel2 = _interopRequireDefault(_similar_carousel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Similar = function (_React$Component) {
	_inherits(Similar, _React$Component);

	function Similar(props) {
		_classCallCheck(this, Similar);

		var _this = _possibleConstructorReturn(this, (Similar.__proto__ || Object.getPrototypeOf(Similar)).call(this, props));

		_this.state = {
			title: '',
			movieInfo: {},
			similarList: []
		};
		return _this;
	}

	_createClass(Similar, [{
		key: 'componentWillMount',
		value: function componentWillMount() {
			if (this.props.movieInfo != null) {
				this.setState({
					title: this.props.movieInfo.title,
					movieInfo: this.props.movieInfo
				});
			}
			if (this.props.similarList != null && this.props.similarList.length > 0) {
				this.setState({
					similarList: this.props.similarList
				});
			}
		}
	}, {
		key: 'render',
		value: function render() {
			var _state = this.state,
			    title = _state.title,
			    movieInfo = _state.movieInfo,
			    similarList = _state.similarList;


			return _react2.default.createElement(
				'div',
				{ className: 'clip-series' },
				_react2.default.createElement(
					'h4',
					null,
					title
				),
				similarList != null && similarList.length > 0 ? _react2.default.createElement(
					'div',
					null,
					_react2.default.createElement(
						'div',
						{ className: 'clip-series__list' },
						_react2.default.createElement(_similar_carousel2.default, {
							movieInfo: movieInfo,
							similarList: similarList
						})
					)
				) : ''
			);
		}
	}]);

	return Similar;
}(_react2.default.Component);

exports.default = Similar;

},{"./similar.css":54,"./similar_carousel/similar_carousel.js":57,"react":"react"}],56:[function(require,module,exports){
var css = ""; (require("browserify-css").createStyle(css, { "href": "src/components/layer_popup/similar/similar_carousel/similar_carousel.css" }, { "insertAt": "bottom" })); module.exports = css;
},{"browserify-css":1}],57:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactSlick = require('react-slick');

var _reactSlick2 = _interopRequireDefault(_reactSlick);

require('./similar_carousel.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SimilarCarousel = function (_React$Component) {
	_inherits(SimilarCarousel, _React$Component);

	function SimilarCarousel(props) {
		_classCallCheck(this, SimilarCarousel);

		var _this = _possibleConstructorReturn(this, (SimilarCarousel.__proto__ || Object.getPrototypeOf(SimilarCarousel)).call(this, props));

		_this.state = {
			"markupList": []
		};

		_this.slide_next = _this.slide_next.bind(_this);
		_this.slide_previous = _this.slide_previous.bind(_this);
		_this.movieClickHandler = _this.movieClickHandler.bind(_this);
		return _this;
	}

	_createClass(SimilarCarousel, [{
		key: 'componentWillMount',
		value: function componentWillMount() {
			if (this.props.similarList != null) {
				var markupList = this.props.similarList.map(function (data, i) {
					return _react2.default.createElement(
						'div',
						{ className: 'clip-item__wrap', key: i },
						_react2.default.createElement(
							'div',
							{ className: 'clip-photo' },
							_react2.default.createElement('img', { src: data.poster, 'data-id': data.content })
						),
						_react2.default.createElement(
							'dl',
							{ className: 'clip-disc' },
							_react2.default.createElement(
								'dt',
								null,
								data.title
							),
							_react2.default.createElement(
								'dd',
								{ className: 'clip-star__wrap' },
								_react2.default.createElement(
									'span',
									{ className: 'star-grade__wrap' },
									_react2.default.createElement(
										'span',
										{ className: 'star-grade', style: { width: data.grade * 20 + '%' } },
										data.grade * 20 + '점'
									)
								),
								_react2.default.createElement(
									'em',
									{ className: 'open-year' },
									data.year
								),
								_react2.default.createElement(
									'span',
									{ className: 'age-grade' },
									data.rate
								)
							),
							_react2.default.createElement('dd', { dangerouslySetInnerHTML: { __html: data.summary } })
						),
						_react2.default.createElement('div', { className: 'play-button' })
					);
				});

				this.setState({
					markupList: markupList
				});
			}
		}
	}, {
		key: 'slide_next',
		value: function slide_next() {
			this.refs.slider.slickNext();
		}
	}, {
		key: 'slide_previous',
		value: function slide_previous() {
			this.refs.slider.slickPrev();
		}
	}, {
		key: 'movieClickHandler',
		value: function movieClickHandler(e) {
			console.log('movie click');
		}
	}, {
		key: 'render',
		value: function render() {
			var sliderSettings = {
				dots: false,
				infinite: true,
				speed: 800,
				slidesToShow: 4,
				slidesToScroll: 4
			};
			return _react2.default.createElement(
				'div',
				null,
				_react2.default.createElement(
					'button',
					{ type: 'button', className: 'clip-btn__prev', onClick: this.slide_previous, title: '\uC774\uC804\uB9AC\uC2A4\uD2B8' },
					'\uC774\uC804\uB9AC\uC2A4\uD2B8'
				),
				_react2.default.createElement(
					'div',
					{ className: 'similarcarousel clip-item', onClick: this.movieClickHandler },
					_react2.default.createElement(
						_reactSlick2.default,
						_extends({ ref: 'slider' }, sliderSettings),
						this.state.markupList
					)
				),
				_react2.default.createElement(
					'button',
					{ type: 'button', className: 'clip-btn__next', onClick: this.slide_next, title: '\uB2E4\uC74C\uB9AC\uC2A4\uD2B8' },
					'\uB2E4\uC74C\uB9AC\uC2A4\uD2B8'
				)
			);
		}
	}]);

	return SimilarCarousel;
}(_react2.default.Component);

exports.default = SimilarCarousel;

},{"./similar_carousel.css":56,"react":"react","react-slick":9}],58:[function(require,module,exports){
var css = ".noti-wrap {\n  position: relative;\n  cursor: pointer;\n  top: 24px;\n  margin: 0 30px;\n}\n.noti-wrap .noti-icon {\n  display: inline-block;\n  width: 23px;\n  height: 20px;\n  text-indent: -9999px;\n  background: url(\"/css/images/topmenu-icon.png\") no-repeat 0 -352px;\n}\n.noti-wrap .noti-num {\n  display: inline-block;\n  position: absolute;\n  top: -8px;\n  right: -8px;\n  width: 11px;\n  height: 14px;\n  padding-left: 3px;\n  color: #ffffff;\n  font-size: 11px;\n  font-family: verdana, arial;\n  background: #ff7a00;\n  -webkit-border-radius: 7px;\n  -moz-border-radius: 7px;\n  -ms-border-radius: 7px;\n  border-radius: 7px;\n}\n.noti-wrap:hover:after,\n.noti-wrap.selected:after {\n  content: '';\n  display: block;\n  width: 11px;\n  height: 6px;\n  position: relative;\n  top: 16px;\n  left: 6px;\n  background: url(\"/css/images/topmenu-icon.png\") no-repeat 0 -111px;\n}\n.noti-wrap:hover .noti-icon,\n.noti-wrap.selected .noti-icon {\n  background: url(\"/css/images/topmenu-icon.png\") no-repeat 0 -422px;\n}\n"; (require("browserify-css").createStyle(css, { "href": "src/components/notification/notification_badge.css" }, { "insertAt": "bottom" })); module.exports = css;
},{"browserify-css":1}],59:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

require('./notification_badge.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NotificationBadge = function (_React$Component) {
	_inherits(NotificationBadge, _React$Component);

	function NotificationBadge(props) {
		_classCallCheck(this, NotificationBadge);

		var _this = _possibleConstructorReturn(this, (NotificationBadge.__proto__ || Object.getPrototypeOf(NotificationBadge)).call(this, props));

		_this.state = {};
		return _this;
	}

	_createClass(NotificationBadge, [{
		key: 'render',
		value: function render() {
			var notifications = this.props.notifications;

			return _react2.default.createElement(
				'div',
				{ className: 'noti-wrap', onClick: this.props.onClick },
				_react2.default.createElement(
					'span',
					{ className: 'noti-icon' },
					'\uC0C8\uB85C\uC628 \uBA54\uC138\uC9C0'
				),
				notifications && notifications.length ? _react2.default.createElement(
					'span',
					{ className: 'noti-num' },
					notifications.length
				) : ""
			);
		}
	}]);

	return NotificationBadge;
}(_react2.default.Component);

exports.default = NotificationBadge;

},{"./notification_badge.css":58,"react":"react"}],60:[function(require,module,exports){
var css = "/* header noti */\n.noti-content {\n  /*display: none;*/\n  position: absolute;\n  top: 69px;\n  left: 115px;\n  min-width: 330px;\n  background: #ffffff;\n  -webkit-box-shadow: 1px 6px 6px #000000;\n  -moz-box-shadow: 1px 6px 6px #000000;\n  box-shadow: 1px 6px 6px #000000;\n  z-index: 10;\n}\n.noti-movielist__title {\n  padding: 18px 20px 14px;\n  font-size: 18px;\n  font-weight: bold;\n  color: #333333;\n  border-bottom: 1px solid #d3d3d3;\n  background: #fbfbfb;\n}\n.noti-movielist {\n  overflow: hidden;\n  margin: 20px 18px 0;\n}\n.noti-movielist li {\n  cursor: pointer;\n}\n.noti-movielist__thumbnail {\n  float: left;\n  margin: 0 10px 10px;\n  max-width: 150px;\n  max-height: 85px;\n}\n.noti-movielist__disc {\n  float: left;\n}\n.noti-movielist__disc dt {\n  font-size: 14px;\n  font-weight: bold;\n  color: #333333;\n}\n.noti-movielist__disc dd {\n  padding-top: 6px;\n  font-size: 12px;\n  color: #999999;\n}\n.noti-btn__more {\n  display: block;\n  text-indent: -9999px;\n  width: 100%;\n  height: 35px;\n  background: url(\"/css/images/noti-icon.png\") no-repeat center center;\n}\n.toast-wrap {\n  position: absolute;\n  bottom: 0;\n  right: 0;\n  width: 430px;\n  height: 100px;\n  background: rgba(0, 0, 0, 0.5);\n}\n.toast-close {\n  position: absolute;\n  top: 20px;\n  right: 20px;\n  width: 18px;\n  height: 18px;\n  text-indent: -9999px;\n  background: url(\"/css/images/toast-icon.png\") no-repeat 0 0;\n  border: 0;\n}\n.toast-disc {\n  width: 390px;\n  margin: 14px 20px;\n}\n.toast-disc:after {\n  content: '';\n  display: inline-block;\n  width: 23px;\n  height: 20px;\n  position: absolute;\n  bottom: 14px;\n  right: 20px;\n  background: url(\"/css/images/toast-icon.png\") no-repeat 0 -50px;\n}\n.toast-disc dt {\n  margin-bottom: 4px;\n  font-size: 13px;\n  font-weight: bold;\n  color: #cccccc;\n}\n.toast-disc dd {\n  font-size: 13px;\n  line-height: 18px;\n  color: #999999;\n}\n"; (require("browserify-css").createStyle(css, { "href": "src/components/notification/notification_list.css" }, { "insertAt": "bottom" })); module.exports = css;
},{"browserify-css":1}],61:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

require('./notification_list.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//TODO 알림의 형태는 여러가지 일 수가 있음. 지금과 같이 '동영상알림'이란 굳어진 형태로 구현하지 않는 방안이 있는가?
var NotificationList = function (_React$Component) {
	_inherits(NotificationList, _React$Component);

	function NotificationList(props) {
		_classCallCheck(this, NotificationList);

		var _this = _possibleConstructorReturn(this, (NotificationList.__proto__ || Object.getPrototypeOf(NotificationList)).call(this, props));

		_this.closeNotificationList = _this.closeNotificationList.bind(_this);
		return _this;
	}

	_createClass(NotificationList, [{
		key: 'convertISODate',
		value: function convertISODate(ISOString) {
			var date = new Date(ISOString);
			var today = new Date();
			var diff = today - date;
			if (diff < 60 * 60 * 1000) {
				return Math.floor(diff / (60 * 1000)) + "분전";
			}
			if (diff < 24 * 60 * 60 * 1000) {
				return Math.floor(diff / (60 * 60 * 1000)) + "시간전";
			}
			if (diff < 30 * 24 * 60 * 60 * 1000) {
				return Math.floor(diff / (24 * 60 * 60 * 1000)) + "일전";
			}
			return Math.floor(diff / (30 * 24 * 60 * 60 * 1000)) + "개월전";
		}
	}, {
		key: 'closeNotificationList',
		value: function closeNotificationList() {
			var event = new Event('request-notification-close', { bubbles: true });
			this.refs.noti.dispatchEvent(event);
		}
	}, {
		key: 'checkNotification',
		value: function checkNotification(notification) {
			//TODO url방식으로 notification을 확인할 것인지?
			console.log('check noti', notification);
		}
	}, {
		key: 'render',
		value: function render() {
			var _this2 = this;

			var _props = this.props,
			    notifications = _props.notifications,
			    focused = _props.focused;

			if (!focused) return null;
			return _react2.default.createElement(
				'div',
				{ className: 'noti-content', ref: 'noti' },
				_react2.default.createElement(
					'button',
					{ type: 'button', className: 'topmenu-close', onClick: this.closeNotificationList },
					'\uB2EB\uAE30'
				),
				_react2.default.createElement(
					'div',
					{ className: 'noti-movielist__title' },
					'\uC2E0\uADDC \uB3D9\uC601\uC0C1 \uC54C\uB9BC'
				),
				_react2.default.createElement(
					'ul',
					{ className: 'noti-movielist' },
					notifications.map(function (notification, idx) {
						return _react2.default.createElement(
							'li',
							{ key: idx, onClick: function onClick() {
									return _this2.checkNotification(notification);
								} },
							_react2.default.createElement('img', { src: notification.poster, alt: notification.title, className: 'noti-movielist__thumbnail' }),
							_react2.default.createElement(
								'dl',
								{ className: 'noti-movielist__disc' },
								_react2.default.createElement(
									'dt',
									null,
									notification.title
								),
								_react2.default.createElement(
									'dd',
									null,
									_this2.convertISODate(notification.regDate)
								)
							)
						);
					})
				),
				_react2.default.createElement(
					'a',
					{ href: '#', className: 'noti-btn__more' },
					'\uB354\uBCF4\uAE30'
				)
			);
		}
	}]);

	return NotificationList;
}(_react2.default.Component);

exports.default = NotificationList;

},{"./notification_list.css":60,"react":"react"}],62:[function(require,module,exports){
var css = "/* header search */\n.search-wrap {\n  position: relative;\n  top: 20px;\n}\n.input-search {\n  padding: 0 10px 0 38px;\n  width: 235px;\n  height: 28px;\n  font-size: 15px;\n  color: #666666;\n  background: url(\"/css/images/topmenu-icon.png\") no-repeat 15px -282px;\n  border: 1px solid #999999;\n  -webkit-border-radius: 14px;\n  -moz-border-radius: 14px;\n  -ms-border-radius: 14px;\n  border-radius: 14px;\n}\n"; (require("browserify-css").createStyle(css, { "href": "src/components/search_bar/search_bar.css" }, { "insertAt": "bottom" })); module.exports = css;
},{"browserify-css":1}],63:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

require('./search_bar.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SearchBar = function (_React$Component) {
	_inherits(SearchBar, _React$Component);

	function SearchBar(props) {
		_classCallCheck(this, SearchBar);

		var _this = _possibleConstructorReturn(this, (SearchBar.__proto__ || Object.getPrototypeOf(SearchBar)).call(this, props));

		_this.state = {
			value: ""
		};
		_this.previewTimeout = null;

		_this.handleChange = _this.handleChange.bind(_this);
		_this.handleSubmit = _this.handleSubmit.bind(_this);
		return _this;
	}

	_createClass(SearchBar, [{
		key: 'handleChange',
		value: function handleChange(e) {
			this.setState({ value: e.target.value });
		}
	}, {
		key: 'componentDidUpdate',
		value: function componentDidUpdate(prevProps, prevState) {
			var _this2 = this;

			if (prevState.value !== this.state.value && this.props.hasOwnProperty("enablePreviewSearch")) {
				clearTimeout(this.previewTimeout);
				this.previewTimeout = setTimeout(function () {
					_this2.performPreviewSearch(_this2.state.value);
				}, parseInt(this.props.delay || 500, 10)); //TODO delay default값 선언방식?
			}
		}
	}, {
		key: 'performPreviewSearch',
		value: function performPreviewSearch(value) {
			//TODO preview search dropdown list
			// console.log('[Preview] Search for',value);
			// this.triggerSearchEvent(value);
		}
	}, {
		key: 'performSearch',
		value: function performSearch(value) {
			//TODO search?
			console.log('Search for', value);
			this.triggerSearchEvent(value);
		}
	}, {
		key: 'triggerSearchEvent',
		value: function triggerSearchEvent(keyword) {
			var event = new CustomEvent('request-search', { bubbles: true,
				detail: { keyword: keyword }
			});
			this.refs.search.dispatchEvent(event);
		}
	}, {
		key: 'handleSubmit',
		value: function handleSubmit(e) {
			if (e.key === 'Enter') {
				this.performSearch(this.state.value);
			}
		}
	}, {
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'div',
				{ className: 'search-wrap', ref: 'search' },
				_react2.default.createElement('input', { type: 'search', className: 'input-search', placeholder: '\uAC80\uC0C9\uC5B4\uB97C \uC785\uB825\uD558\uC138\uC694',
					value: this.state.value, onChange: this.handleChange, onKeyPress: this.handleSubmit
				})
			);
		}
	}]);

	return SearchBar;
}(_react2.default.Component);

exports.default = SearchBar;

},{"./search_bar.css":62,"react":"react"}],64:[function(require,module,exports){
var css = ".footer-sns {\n  position: relative;\n  top: 18px;\n}\n.footer-sns li {\n  float: left;\n  padding-right: 10px;\n}\n.footer-sns li:last-child {\n  padding-right: 0;\n}\n.footer-sns li a {\n  display: inline-block;\n  width: 45px;\n  height: 45px;\n  text-indent: -9999px;\n  background: url(\"/css/images/sns-icon.png\") no-repeat;\n}\n.footer-sns .facebook {\n  background-position: 0 0;\n}\n.footer-sns .tweeter {\n  background-position: -55px 0;\n}\n.footer-sns .gplus {\n  background-position: -110px 0;\n}\n.footer-sns .pinterest {\n  background-position: -110px 0;\n}\n.footer-sns .kakaostory {\n  background-position: -165px 0;\n}\n.footer-sns .line {\n  background-position: -220px 0;\n}\n.footer-sns .kakaotalk {\n  background-position: -275px 0;\n}\n"; (require("browserify-css").createStyle(css, { "href": "src/components/sns_button/sns_button.css" }, { "insertAt": "bottom" })); module.exports = css;
},{"browserify-css":1}],65:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

require('./sns_button.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SNSButton = function SNSButton() {
	return _react2.default.createElement(
		'ul',
		{ className: 'footer-sns' },
		_react2.default.createElement(
			'li',
			null,
			_react2.default.createElement(
				'a',
				{ href: '#', className: 'facebook' },
				'\uD398\uC774\uC2A4\uBD81'
			)
		),
		_react2.default.createElement(
			'li',
			null,
			_react2.default.createElement(
				'a',
				{ href: '#', className: 'tweeter' },
				'\uD2B8\uC704\uD130'
			)
		),
		_react2.default.createElement(
			'li',
			null,
			_react2.default.createElement(
				'a',
				{ href: '#', className: 'gplus' },
				'\uAD6C\uAE00\uD50C\uB7EC\uC2A4'
			)
		),
		_react2.default.createElement(
			'li',
			null,
			_react2.default.createElement(
				'a',
				{ href: '#', className: 'pinterest' },
				'Pinterest'
			)
		),
		_react2.default.createElement(
			'li',
			null,
			_react2.default.createElement(
				'a',
				{ href: '#', className: 'kakaostory' },
				'Kakao Story'
			)
		),
		_react2.default.createElement(
			'li',
			null,
			_react2.default.createElement(
				'a',
				{ href: '#', className: 'line' },
				'Line'
			)
		),
		_react2.default.createElement(
			'li',
			null,
			_react2.default.createElement(
				'a',
				{ href: '#', className: 'kakaotalk' },
				'Kakao Talk'
			)
		)
	);
};

exports.default = SNSButton;

},{"./sns_button.css":64,"react":"react"}],66:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _post = require('../../services/post');

var _body_promotion = require('../../components/body_promotion/body_promotion.js');

var _body_promotion2 = _interopRequireDefault(_body_promotion);

var _body_category = require('../../components/body_category/body_category.js');

var _body_category2 = _interopRequireDefault(_body_category);

var _body_movielist = require('../../components/body_movielist/body_movielist.js');

var _body_movielist2 = _interopRequireDefault(_body_movielist);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
// import './body.css'

var Body = function (_React$Component) {
	_inherits(Body, _React$Component);

	function Body(props) {
		_classCallCheck(this, Body);

		var _this = _possibleConstructorReturn(this, (Body.__proto__ || Object.getPrototypeOf(Body)).call(this, props));

		_this.state = {
			bodyPromotionData: {},
			bodyCategoryData: [],
			bodyCategoryMovieList: [],
			searchMovieList: [],
			searchKeyword: ''
		};
		return _this;
	}

	_createClass(Body, [{
		key: 'fetchBody',
		value: function fetchBody(props) {
			if (props.searchKeyword) {
				this.fetchSearchResult(props.searchKeyword);
				this.setState({
					searchKeyword: props.searchKeyword
				});
			} else {
				this.fetchPromotion();
				this.fetchCategory();
				this.setState({
					searchKeyword: ''
				});
			}
		}
	}, {
		key: 'componentWillMount',
		value: function componentWillMount() {
			this.fetchBody(this.props);
		}
	}, {
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(nextProps) {
			this.fetchBody(nextProps);
		}
	}, {
		key: 'fetchPromotion',
		value: function fetchPromotion() {
			var _this2 = this;

			(0, _post.getBodyPromotionData)().then(function (res) {
				// console.log(res.data);
				_this2.setState({
					bodyPromotionData: res.data
				});
			});
		}
	}, {
		key: 'fetchCategory',
		value: function fetchCategory() {
			var _this3 = this;

			(0, _post.getBodyCategoryData)().then(function (res) {
				// console.log(res.data);
				Promise.all(res.data.map(function (data) {
					return (0, _post.getCategoryMovieList)(data.id);
				})).then(function (dataArr) {
					// console.log('dataArr = '+dataArr);
					_this3.setState({
						bodyCategoryMovieList: dataArr,
						bodyCategoryData: res.data
					});
				});
			});
		}
	}, {
		key: 'fetchSearchResult',
		value: function fetchSearchResult(keyword) {
			var _this4 = this;

			(0, _post.getSearchResult)(keyword).then(function (res) {
				// console.log(res.data);
				_this4.setState({
					searchMovieList: res.data,
					searchKeyword: keyword
				});
			});
		}
	}, {
		key: 'render',
		value: function render() {
			if (this.props.category) {
				return _react2.default.createElement(
					'div',
					{ className: 'cnt-wrapper' },
					_react2.default.createElement(_body_movielist2.default, {
						title: this.props.category.title,
						list: this.props.category.list })
				);
			}
			return _react2.default.createElement(
				'div',
				{ className: 'cnt-wrapper' },
				this.state.searchKeyword ? _react2.default.createElement(_body_movielist2.default, {
					title: this.state.searchKeyword,
					list: this.state.searchMovieList
				}) : '',
				!this.state.searchKeyword ? _react2.default.createElement(_body_promotion2.default, {
					bodyPromotionData: this.state.bodyPromotionData
				}) : '',
				!this.state.searchKeyword ? _react2.default.createElement(_body_category2.default, {
					bodyCategoryData: this.state.bodyCategoryData,
					bodyCategoryMovieList: this.state.bodyCategoryMovieList
				}) : ''
			);
		}
	}]);

	return Body;
}(_react2.default.Component);

exports.default = Body;

},{"../../components/body_category/body_category.js":29,"../../components/body_movielist/body_movielist.js":31,"../../components/body_promotion/body_promotion.js":33,"../../services/post":74,"react":"react"}],67:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _sns_button = require('../../components/sns_button/sns_button.js');

var _sns_button2 = _interopRequireDefault(_sns_button);

require('./footer.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Footer = function (_React$Component) {
	_inherits(Footer, _React$Component);

	function Footer() {
		_classCallCheck(this, Footer);

		return _possibleConstructorReturn(this, (Footer.__proto__ || Object.getPrototypeOf(Footer)).apply(this, arguments));
	}

	_createClass(Footer, [{
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'div',
				{ className: 'footer' },
				_react2.default.createElement(
					'div',
					{ className: 'footer-wrap' },
					_react2.default.createElement(
						'div',
						{ className: 'footer-left' },
						_react2.default.createElement(
							'ul',
							{ className: 'footer-menu' },
							_react2.default.createElement(
								'li',
								null,
								_react2.default.createElement(
									'a',
									{ href: '#' },
									'\uD68C\uC0AC\uC18C\uAC1C'
								)
							),
							_react2.default.createElement(
								'li',
								null,
								_react2.default.createElement(
									'a',
									{ href: '#' },
									'\uACE0\uAC1D\uC13C\uD130'
								)
							),
							_react2.default.createElement(
								'li',
								null,
								_react2.default.createElement(
									'a',
									{ href: '#' },
									'\uAE30\uD504\uD2B8\uCE74\uB4DC \uAD6C\uB9E4/\uC0AC\uC6A9'
								)
							),
							_react2.default.createElement(
								'li',
								null,
								_react2.default.createElement(
									'a',
									{ href: '#' },
									'\uBBF8\uB514\uC5B4 \uC13C\uD130'
								)
							),
							_react2.default.createElement(
								'li',
								null,
								_react2.default.createElement(
									'a',
									{ href: '#' },
									'\uD22C\uC790\uC815\uBCF4'
								)
							),
							_react2.default.createElement(
								'li',
								null,
								_react2.default.createElement(
									'a',
									{ href: '#' },
									'\uCC44\uC6A9\uC815\uBCF4'
								)
							),
							_react2.default.createElement(
								'li',
								null,
								_react2.default.createElement(
									'a',
									{ href: '#' },
									'\uC774\uC6A9\uC57D\uAD00'
								)
							),
							_react2.default.createElement(
								'li',
								null,
								_react2.default.createElement(
									'a',
									{ href: '#' },
									'\uAC1C\uC778\uC815\uBCF4'
								)
							),
							_react2.default.createElement(
								'li',
								null,
								_react2.default.createElement(
									'a',
									{ href: '#' },
									'\uCFE0\uD0A4\uC124\uC815'
								)
							),
							_react2.default.createElement(
								'li',
								null,
								_react2.default.createElement(
									'a',
									{ href: '#' },
									'\uC774\uBA54\uC77C \uBB38\uC758'
								)
							)
						)
					),
					_react2.default.createElement(
						'div',
						{ className: 'footer-right' },
						_react2.default.createElement(_sns_button2.default, null)
					),
					_react2.default.createElement(
						'div',
						{ className: 'copyright' },
						'For further service information or service subscription, contact the foreigner call center at 080-2525-011.',
						_react2.default.createElement('br', null),
						'65, Eulji-ro, Jung-gu Seoul / President Jung Ho Park / Customer Center 114 (Free) without Toll Number or 1599-0011 (Paid)',
						_react2.default.createElement('br', null),
						'COPYRIGHT \xA9 SK CO., LTD. ALL RIGHTS RESERVED.'
					)
				)
			);
		}
	}]);

	return Footer;
}(_react2.default.Component);

exports.default = Footer;

},{"../../components/sns_button/sns_button.js":65,"./footer.css":68,"react":"react","react-dom":"react-dom"}],68:[function(require,module,exports){
var css = "/* ------------------------------------\n\tfooter\n--------------------------------------- */\n.footer {\n  border-top: 3px solid #ea002c;\n  background: #020202;\n  padding-bottom: 60px;\n}\n.footer-wrap {\n  width: 1196px;\n  margin: 0 auto;\n}\n.footer-left {\n  float: left;\n}\n.footer-menu {\n  margin-top: 20px;\n  width: 670px;\n}\n.footer-menu li:nth-child(6) a:after,\n.footer-menu li:last-child a:after {\n  content: none;\n}\n.footer-menu li {\n  float: left;\n  margin: 10px 0;\n}\n.footer-menu li a {\n  display: inline-block;\n  padding: 0 20px;\n  font-size: 14px;\n  color: #999999;\n}\n.footer-menu li:first-child a,\n.footer-menu li:nth-child(7) a {\n  padding-left: 0;\n}\n.footer-menu li a:after {\n  content: '';\n  display: inline-block;\n  position: relative;\n  width: 1px;\n  height: 12px;\n  top: 2px;\n  left: 20px;\n  background: #1c1c1c;\n}\n.footer-right {\n  float: right;\n}\n.footer-sns {\n  position: relative;\n  top: 18px;\n}\n.footer-sns li {\n  float: left;\n  padding-right: 10px;\n}\n.footer-sns li:last-child {\n  padding-right: 0;\n}\n.footer-sns li a {\n  display: inline-block;\n  width: 45px;\n  height: 45px;\n  text-indent: -9999px;\n  background: url(\"/css/images/sns-icon.png\") no-repeat;\n}\n.footer-sns .facebook {\n  background-position: 0 0;\n}\n.footer-sns .tweeter {\n  background-position: -55px 0;\n}\n.footer-sns .gplus {\n  background-position: -110px 0;\n}\n.footer-sns .pinterest {\n  background-position: -110px 0;\n}\n.footer-sns .kakaostory {\n  background-position: -165px 0;\n}\n.footer-sns .line {\n  background-position: -220px 0;\n}\n.footer-sns .kakaotalk {\n  background-position: -275px 0;\n}\n.copyright {\n  clear: both;\n  position: relative;\n  top: 25px;\n  font-size: 12px;\n  line-height: 22px;\n  color: #666666;\n}\n/* ------------------------------------\n\tfooter\n--------------------------------------- */\n"; (require("browserify-css").createStyle(css, { "href": "src/containers/footer/footer.css" }, { "insertAt": "bottom" })); module.exports = css;
},{"browserify-css":1}],69:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

require('./header.css');

var _header_menu = require('../../components/header_menu/header_menu.js');

var _header_menu2 = _interopRequireDefault(_header_menu);

var _header_profile = require('../../components/header_profile/header_profile.js');

var _header_profile2 = _interopRequireDefault(_header_profile);

var _header_profile_summary = require('../../components/header_profile/header_profile_summary.js');

var _header_profile_summary2 = _interopRequireDefault(_header_profile_summary);

var _notification_badge = require('../../components/notification/notification_badge.js');

var _notification_badge2 = _interopRequireDefault(_notification_badge);

var _notification_list = require('../../components/notification/notification_list.js');

var _notification_list2 = _interopRequireDefault(_notification_list);

var _search_bar = require('../../components/search_bar/search_bar.js');

var _search_bar2 = _interopRequireDefault(_search_bar);

var _menu = require('../../services/menu.js');

var _user = require('../../services/user.js');

var _notification = require('../../services/notification.js');

var _search = require('../../services/search.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Header = function (_React$Component) {
	_inherits(Header, _React$Component);

	function Header(props) {
		_classCallCheck(this, Header);

		var _this = _possibleConstructorReturn(this, (Header.__proto__ || Object.getPrototypeOf(Header)).call(this, props));

		_this.state = {
			headerMenuFocused: false,
			selectedMenuId: null,
			selectedMenuTitle: null,
			profileFocused: false,
			notificationFocused: false,
			notifications: []
		};

		_this.toggleMenuVisibility = _this.toggleMenuVisibility.bind(_this);
		_this.toggleProfileVisibility = _this.toggleProfileVisibility.bind(_this);
		_this.toggleNotificationVisibility = _this.toggleNotificationVisibility.bind(_this);
		_this.showMenus = _this.showMenus.bind(_this);
		_this.closeHeaderMenu = _this.closeHeaderMenu.bind(_this);
		_this.closeProfileDetail = _this.closeProfileDetail.bind(_this);
		_this.closeNotificationDetail = _this.closeNotificationDetail.bind(_this);
		_this.performSearch = _this.performSearch.bind(_this);
		return _this;
	}

	_createClass(Header, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			this.fetchMenus();
			this.fetchNotifications();
			this.fetchUser();
			this.refs.header.addEventListener("request-menu-close", this.closeHeaderMenu, false);
			this.refs.header.addEventListener("request-profile-close", this.closeProfileDetail, false);
			this.refs.header.addEventListener("request-notification-close", this.closeNotificationDetail, false);
			// this.refs.header.addEventListener("request-search", this.performSearch, false);
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			this.refs.header.removeEventListener("request-menu-close", this.closeProfileDetail);
			this.refs.header.removeEventListener("request-profile-close", this.closeHeaderMenu);
			this.refs.header.removeEventListener("request-notification-close", this.closeNotificationDetail);
			// this.refs.header.removeEventListener("request-search", this.performSearch);
		}
	}, {
		key: 'closeHeaderMenu',
		value: function closeHeaderMenu() {
			this.setState({
				headerMenuFocused: false
			});
		}
	}, {
		key: 'closeProfileDetail',
		value: function closeProfileDetail() {
			this.setState({
				profileFocused: false
			});
		}
	}, {
		key: 'closeNotificationDetail',
		value: function closeNotificationDetail() {
			this.setState({
				notificationFocused: false
			});
		}
	}, {
		key: 'fetchMenus',
		value: function fetchMenus() {
			var _this2 = this;

			(0, _menu.getMenus)().then(function (res) {
				_this2.setState({
					defaultMenu: [{ "name": "홈", "id": "home" }, { "name": "내 동영상 목록", "id": "M1" }, { "name": "오리지널 시리즈", "id": "M2" }, { "name": "신규 동영상", "id": "M3" }, { "name": "음성 및 자막", "id": "M4" }, { "name": "B movie 지원 디바이스", "id": "M5" }],
					categoryMenu: res.data
				});
			});
		}
	}, {
		key: 'fetchNotifications',
		value: function fetchNotifications() {
			var _this3 = this;

			(0, _notification.getCurrentNotifications)().then(function (res) {
				_this3.setState({ notifications: res.data });
			});
		}
	}, {
		key: 'fetchUser',
		value: function fetchUser() {
			var _this4 = this;

			(0, _user.getUser)().then(function (res) {
				_this4.setState({ user: res.data[0] });
			});
		}
	}, {
		key: 'showMenus',
		value: function showMenus() {
			//TODO mouseenter 후에 헤더/메뉴 로부터의 mouseleave로 메뉴를 닫을 수 있게
			// this.setState({headerMenuFocused : true});
		}
	}, {
		key: 'toggleMenuVisibility',
		value: function toggleMenuVisibility(e) {
			e.preventDefault();
			this.setState({
				headerMenuFocused: !this.state.headerMenuFocused,
				profileFocused: false,
				notificationFocused: false
			});
		}
	}, {
		key: 'toggleProfileVisibility',
		value: function toggleProfileVisibility() {
			this.setState({
				headerMenuFocused: false,
				profileFocused: !this.state.profileFocused,
				notificationFocused: false
			});
		}
	}, {
		key: 'toggleNotificationVisibility',
		value: function toggleNotificationVisibility() {
			this.setState({
				headerMenuFocused: false,
				profileFocused: false,
				notificationFocused: !this.state.notificationFocused
			});
		}
	}, {
		key: 'hideAllDetails',
		value: function hideAllDetails() {
			this.setState({
				headerMenuFocused: false,
				profileFocused: false,
				notificationFocused: false
			});
		}
	}, {
		key: 'performSearch',
		value: function performSearch(event) {
			var keyword = event.detail.keyword;
			console.log('perform search for keyword [' + keyword + ']');
			(0, _search.getSearchResult)(keyword).then(function (res) {
				console.log("result");
				console.log(res.data);
			});
		}
	}, {
		key: 'goHome',
		value: function goHome() {
			window.location.href = "/home";
		}
	}, {
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'div',
				{ className: 'header-wrapper', ref: 'header' },
				_react2.default.createElement(
					'div',
					{ className: 'header' },
					_react2.default.createElement(
						'h1',
						{ className: 'logo', onClick: this.goHome },
						'Btv'
					),
					_react2.default.createElement(
						'div',
						{ className: 'topmenu' },
						_react2.default.createElement(
							'ul',
							{ className: 'topmenu-list' },
							_react2.default.createElement(
								'li',
								null,
								_react2.default.createElement(
									'a',
									{ href: '#',
										onClick: this.toggleMenuVisibility,
										onMouseEnter: this.showMenus },
									'\uBA54\uB274'
								),
								_react2.default.createElement(_header_menu2.default, {
									focused: this.state.headerMenuFocused,
									defaultMenu: this.state.defaultMenu,
									category: this.state.categoryMenu
									//categorySplitBy={3}
								})
							)
						),
						_react2.default.createElement(
							'div',
							{ className: 'topmenu-right' },
							_react2.default.createElement(_search_bar2.default, {
								enablePreviewSearch: true
							}),
							_react2.default.createElement(_notification_badge2.default, {
								notifications: this.state.notifications,
								onClick: this.toggleNotificationVisibility
							}),
							_react2.default.createElement(_notification_list2.default, {
								notifications: this.state.notifications,
								focused: this.state.notificationFocused }),
							_react2.default.createElement(_header_profile_summary2.default, {
								user: this.state.user,
								onClick: this.toggleProfileVisibility //커스텀 컴포넌트는 onClick이 없으므로 컴포넌트가 지원하려면 코딩 해놔야함..
							}),
							_react2.default.createElement(_header_profile2.default, {
								user: this.state.user,
								focused: this.state.profileFocused
							})
						)
					)
				)
			);
		}
	}]);

	return Header;
}(_react2.default.Component);

exports.default = Header;

},{"../../components/header_menu/header_menu.js":37,"../../components/header_profile/header_profile.js":39,"../../components/header_profile/header_profile_summary.js":41,"../../components/notification/notification_badge.js":59,"../../components/notification/notification_list.js":61,"../../components/search_bar/search_bar.js":63,"../../services/menu.js":72,"../../services/notification.js":73,"../../services/search.js":75,"../../services/user.js":76,"./header.css":70,"react":"react"}],70:[function(require,module,exports){
var css = "/* ------------------------------------\n\theader\n--------------------------------------- */\n/* header topmenu */\n.header-wrapper {\n  height: 78px;\n  background: #fff;\n  border-bottom: 3px solid #ea002c;\n}\n.header {\n  display: table;\n  position: relative;\n  width: 1196px;\n  margin: 0 auto;\n}\n.header .logo,\n.header .topmenu {\n  display: table-cell;\n  vertical-align: middle;\n}\n.header .logo {\n  width: 100px;\n  height: 78px;\n  text-indent: -9999px;\n  background: url(\"/css/images/bmovie-logo.png\") no-repeat 0 18px;\n  cursor: pointer;\n}\n.topmenu-list {\n  float: left;\n  position: relative;\n  top: 12px;\n}\n.topmenu-list > li {\n  float: left;\n}\n.topmenu-list > li > a {\n  display: inline-block;\n  padding: 16px 20px 20px 10px;\n  font-size: 15px;\n  font-weight: bold;\n  color: #494949;\n}\n.topmenu-list > li > a:after {\n  content: '';\n  display: inline-block;\n  width: 7px;\n  height: 4px;\n}\n.topmenu-list > li > a:hover,\n.topmenu-list > li > a.selected {\n  padding-bottom: 16px;\n  color: #ea002c;\n  border-bottom: 5px solid #ea002c;\n}\n.topmenu-list > li > a:hover:after,\n.topmenu-list > li > a.selected:after {\n  content: '';\n  display: inline-block;\n  position: relative;\n  top: -2px;\n  left: 10px;\n  width: 7px;\n  height: 4px;\n  background: url(\"/css/images/topmenu-icon.png\") no-repeat 0 0;\n}\n.topmenu-right {\n  float: right;\n  position: relative;\n  width: 500px;\n}\n.topmenu-right > div {\n  float: left;\n}\n.topmenu-close {\n  position: absolute;\n  top: 17px;\n  right: 10px;\n  width: 18px;\n  height: 18px;\n  text-indent: -9999px;\n  background: url(\"/css/images/topmenu-icon.png\") no-repeat 3px -223px;\n  border: 0;\n}\n.detail-btn__wrap {\n  margin: 20px;\n  padding-top: 15px;\n  text-align: center;\n  border-top: 1px solid #e3e3e3;\n}\n.btn-logout {\n  width: 89px;\n  height: 24px;\n  line-height: 22px;\n  font-size: 13px;\n  font-weight: bold;\n  color: #ffffff;\n  background: #666666;\n  -webkit-border-radius: 2px;\n  -moz-border-radius: 2px;\n  -ms-border-radius: 2px;\n  border-radius: 2px;\n}\n"; (require("browserify-css").createStyle(css, { "href": "src/containers/header/header.css" }, { "insertAt": "bottom" })); module.exports = css;
},{"browserify-css":1}],71:[function(require,module,exports){
var css = "/* Slider */\n.slick-slider {\n  position: relative;\n  display: block;\n  width: 100%;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  -webkit-touch-callout: none;\n  -khtml-user-select: none;\n  -ms-touch-action: pan-y;\n  touch-action: pan-y;\n  -webkit-tap-highlight-color: transparent;\n}\n.slick-list {\n  position: relative;\n  display: block;\n  overflow: hidden;\n  margin: 0;\n  padding: 0;\n}\n.slick-list:focus {\n  outline: none;\n}\n.slick-list.dragging {\n  cursor: pointer;\n  cursor: hand;\n}\n.slick-slider .slick-track,\n.slick-slider .slick-list {\n  -webkit-transform: translate3d(0, 0, 0);\n  -moz-transform: translate3d(0, 0, 0);\n  -ms-transform: translate3d(0, 0, 0);\n  -o-transform: translate3d(0, 0, 0);\n  transform: translate3d(0, 0, 0);\n}\n.slick-track {\n  position: relative;\n  top: 0;\n  left: 0;\n  display: block;\n}\n.slick-track:before,\n.slick-track:after {\n  display: table;\n  content: '';\n}\n.slick-track:after {\n  clear: both;\n}\n.slick-loading .slick-track {\n  visibility: hidden;\n}\n.slick-slide {\n  display: none;\n  float: left;\n  height: 100%;\n  min-height: 1px;\n}\n[dir='rtl'] .slick-slide {\n  float: right;\n}\n.slick-slide img {\n  display: block;\n}\n.slick-slide.slick-loading img {\n  display: none;\n}\n.slick-slide.dragging img {\n  pointer-events: none;\n}\n.slick-initialized .slick-slide {\n  display: block;\n}\n.slick-loading .slick-slide {\n  visibility: hidden;\n}\n.slick-vertical .slick-slide {\n  display: block;\n  height: auto;\n  border: 1px solid transparent;\n}\n.slick-arrow.slick-hidden {\n  display: none;\n}\n"; (require("browserify-css").createStyle(css, { "href": "src/css/slick.css" }, { "insertAt": "bottom" })); module.exports = css;
},{"browserify-css":1}],72:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getMenus = getMenus;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getMenus() {
	// return axios.get('/services/local/menu.json')
	return _axios2.default.get('/v1/categories');
}

},{"axios":"axios"}],73:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getCurrentNotifications = getCurrentNotifications;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getCurrentNotifications() {
	// return axios.get('/services/local/notifications.json');
	return _axios2.default.get('/v1/notifications');
}

},{"axios":"axios"}],74:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getBodyPromotionData = getBodyPromotionData;
exports.getBodyCategoryData = getBodyCategoryData;
exports.getCategoryMovieList = getCategoryMovieList;
exports.getCategoryDetail = getCategoryDetail;
exports.getMovieDetailData = getMovieDetailData;
exports.getEpisodeData = getEpisodeData;
exports.getTrailersData = getTrailersData;
exports.getSimilarsData = getSimilarsData;
exports.getSearchResult = getSearchResult;
exports.getLogin = getLogin;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getBodyPromotionData() {
	return _axios2.default.get('/v1/promotions');
	// return axios.get('/services/local/body_promotion.json');
}

function getBodyCategoryData() {
	return _axios2.default.get('/v1/categories');
	// return axios.get('/services/local/body_category.json');
}

function getCategoryMovieList(categoryId) {
	return _axios2.default.get('/v1/contents?category=' + categoryId);
	// return axios.get('/services/local/body_category_movielist.json');
}

function getCategoryDetail(categoryId) {
	return _axios2.default.get('/v1/categories/' + categoryId);
	// 
}

function getMovieDetailData(movieId) {
	return _axios2.default.get('/v1/contents/' + movieId);
	// return axios.get('/services/local/body_moviedetail.json');
}

function getEpisodeData(movieId) {
	return _axios2.default.get('/v1/contents/' + movieId + '/episodes');
	// return axios.get('/services/local/episode.json');
}

function getTrailersData(movieId) {
	return _axios2.default.get('/v1/contents/' + movieId + '/trailers');
	// return axios.get('/services/local/trailers.json');
}

function getSimilarsData(movieId, category) {
	return _axios2.default.get('v1/contents/' + movieId + '/similars?category=' + category);
	// return axios.get('/services/local/similars.json');
}

function getSearchResult(keyword) {
	return _axios2.default.get('/v1/contents/search?title=' + keyword);
	// return axios.get('/services/local/body_search_result.json');
}

function getLogin(loginInfo) {
	// return {
	//     email: "garfield@sk.com",
	//     pw: "1234",
	//     profile : "JIM"
	// }
	var querystring = require('querystring');
	return _axios2.default.post('/login', querystring.stringify(loginInfo));
};

},{"axios":"axios","querystring":5}],75:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getSearchResult = getSearchResult;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getSearchResult(keyword) {
	// return axios.get('/services/local/search.json');
	return _axios2.default.get('/v1/contents/search?title=' + keyword);
}

},{"axios":"axios"}],76:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getUser = getUser;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getUser() {
	return _axios2.default.get('/v1/profiles');
	//return axios.get('/services/local/user.json');
}

},{"axios":"axios"}]},{},[25]);
