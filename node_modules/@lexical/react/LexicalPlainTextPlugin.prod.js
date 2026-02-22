/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';var e=require("@lexical/react/LexicalComposerContext"),g=require("@lexical/react/useLexicalEditable"),h=require("@lexical/text"),m=require("@lexical/utils"),n=require("react"),p=require("react-dom"),q=require("react/jsx-runtime"),u=require("@lexical/dragon"),v=require("@lexical/plain-text");let w="undefined"!==typeof window&&"undefined"!==typeof window.document&&"undefined"!==typeof window.document.createElement?n.useLayoutEffect:n.useEffect;
function x(a){return a.getEditorState().read(h.$canShowPlaceholderCurry(a.isComposing()))}function y(a){let [c,b]=n.useState(()=>x(a));w(()=>{function d(){let f=x(a);b(f)}d();return m.mergeRegister(a.registerUpdateListener(()=>{d()}),a.registerEditableListener(()=>{d()}))},[a]);return c}
function z(a,c){let [b,d]=n.useState(()=>a.getDecorators());w(()=>a.registerDecoratorListener(f=>{p.flushSync(()=>{d(f)})}),[a]);n.useEffect(()=>{d(a.getDecorators())},[a]);return n.useMemo(()=>{let f=[],r=Object.keys(b);for(let k=0;k<r.length;k++){let l=r[k],B=q.jsx(c,{onError:A=>a._onError(A),children:q.jsx(n.Suspense,{fallback:null,children:b[l]})}),t=a.getElementByKey(l);null!==t&&f.push(p.createPortal(B,t,l))}return f},[c,b,a])}
function C(a){w(()=>m.mergeRegister(v.registerPlainText(a),u.registerDragonSupport(a)),[a])}function D({content:a}){var [c]=e.useLexicalComposerContext();c=y(c);let b=g.useLexicalEditable();return c?"function"===typeof a?a(b):a:null}exports.PlainTextPlugin=function({contentEditable:a,placeholder:c=null,ErrorBoundary:b}){let [d]=e.useLexicalComposerContext();b=z(d,b);C(d);return q.jsxs(q.Fragment,{children:[a,q.jsx(D,{content:c}),b]})}
