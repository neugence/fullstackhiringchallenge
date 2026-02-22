/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';var h=require("react"),l=require("react/jsx-runtime"),n=Object.create(null);if(h)for(var p in h)n[p]=h[p];n.default=h;function q(b,c){q=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(g,a){g.__proto__=a;return g};return q(b,c)}function r(b,c){b.prototype=Object.create(c.prototype);b.prototype.constructor=b;q(b,c)}function v(b,c){void 0===b&&(b=[]);void 0===c&&(c=[]);return b.length!==c.length||b.some(function(g,a){return!Object.is(g,c[a])})}
var w={error:null},x=function(b){function c(){for(var a,d=arguments.length,f=Array(d),e=0;e<d;e++)f[e]=arguments[e];a=b.call.apply(b,[this].concat(f))||this;a.state=w;a.resetErrorBoundary=function(){for(var k,t=arguments.length,u=Array(t),m=0;m<t;m++)u[m]=arguments[m];null==a.props.onReset?void 0:(k=a.props).onReset.apply(k,u);a.reset()};return a}r(c,b);c.getDerivedStateFromError=function(a){return{error:a}};var g=c.prototype;g.reset=function(){this.setState(w)};g.componentDidCatch=function(a,d){var f,
e;null==(f=(e=this.props).onError)?void 0:f.call(e,a,d)};g.componentDidUpdate=function(a,d){var f=this.props.resetKeys;if(null!==this.state.error&&null!==d.error&&v(a.resetKeys,f)){var e,k;null==(e=(k=this.props).onResetKeysChange)?void 0:e.call(k,a.resetKeys,f);this.reset()}};g.render=function(){var a=this.state.error,d=this.props,f=d.fallbackRender,e=d.FallbackComponent;d=d.fallback;if(null!==a){a={error:a,resetErrorBoundary:this.resetErrorBoundary};if(n.isValidElement(d))return d;if("function"===
typeof f)return f(a);if(e)return n.createElement(e,a);throw Error("react-error-boundary requires either a fallback, fallbackRender, or FallbackComponent prop");}return this.props.children};return c}(n.Component);function y({children:b,onError:c}){return l.jsx(x,{fallback:l.jsx("div",{style:{border:"1px solid #f00",color:"#f00",padding:"8px"},children:"An error was thrown."}),onError:c,children:b})}exports.LexicalErrorBoundary=y;exports.default=y
