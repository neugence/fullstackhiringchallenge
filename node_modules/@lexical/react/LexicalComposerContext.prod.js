/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';var d=require("react"),e;function f(a){let c=new URLSearchParams;c.append("code",a);for(let b=1;b<arguments.length;b++)c.append("v",arguments[b]);throw Error(`Minified Lexical error #${a}; visit https://lexical.dev/docs/error?${c} for the full message or `+"use the non-minified dev environment for full errors and additional helpful warnings.");}e=f&&f.__esModule&&Object.prototype.hasOwnProperty.call(f,"default")?f["default"]:f;let g=d.createContext(null);
exports.LexicalComposerContext=g;exports.createLexicalComposerContext=function(a,c){let b=null;null!=a&&(b=a[1]);return{getTheme:function(){return null!=c?c:null!=b?b.getTheme():null}}};exports.useLexicalComposerContext=function(){let a=d.useContext(g);null==a&&e(8);return a}
