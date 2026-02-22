/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';var h=require("@lexical/react/LexicalComposerContext"),q=require("@lexical/rich-text"),v=require("@lexical/utils"),w=require("lexical"),x=require("react");function y(e){return[e.getKey(),e.getTextContent(),e.getTag()]}function z(e,t,n){let f=[],c=y(t);e||f.push(c);for(let r of n)r[0]!==t.getKey()&&(f.push(r),e&&r[0]===e.getKey()&&f.push(c));return f}function B(e){for(e=v.$getNextRightPreorderNode(e);null!==e&&!q.$isHeadingNode(e);)e=v.$getNextRightPreorderNode(e);return e}
exports.default=function({children:e}){let [t,n]=x.useState([]),[f]=h.useLexicalComposerContext();x.useEffect(()=>{let c=[];f.getEditorState().read(()=>{let k=b=>{for(const d of b.getChildren())q.$isHeadingNode(d)?c.push([d.getKey(),d.getTextContent(),d.getTag()]):w.$isElementNode(d)&&k(d)};k(w.$getRoot());n(c)});let r=f.registerUpdateListener(({editorState:k,dirtyElements:b})=>{k.read(()=>{const d=a=>{for(const g of a.getChildren())q.$isHeadingNode(g)?(a=B(g),c=z(a,g,c),n(c)):w.$isElementNode(g)&&
d(g)};w.$getRoot().getChildren().forEach(a=>{w.$isElementNode(a)&&b.get(a.__key)&&d(a)})})}),C=f.registerMutationListener(q.HeadingNode,k=>{f.getEditorState().read(()=>{for(const [g,m]of k)if("created"===m){var b=w.$getNodeByKey(g);if(null!==b)a:{var d=B(b),a=c;if(null===b){c=a;break a}let l=y(b),u=[];if(null===d){if(0<a.length&&a[0][0]===b.__key){c=a;break a}u=[l,...a]}else for(let p=0;p<a.length;p++){let A=a[p][0];u.push(a[p]);if(A===d.getKey()&&A!==b.getKey()){if(p+1<a.length&&a[p+1][0]===b.__key){c=
a;break a}u.push(l)}}c=u}}else if("destroyed"===m){d=g;b=c;a=[];for(let l of b)l[0]!==d&&a.push(l);c=a}else"updated"===m&&(d=w.$getNodeByKey(g),null!==d&&(b=B(d),c=z(b,d,c)));n(c)})},{skipInitialization:!0}),D=f.registerMutationListener(w.TextNode,k=>{f.getEditorState().read(()=>{for(const [a,g]of k)if("updated"===g){var b=w.$getNodeByKey(a);if(null!==b&&(b=b.getParentOrThrow(),q.$isHeadingNode(b))){var d=c;let m=[];for(let l of d)l[0]===b.getKey()?m.push(y(b)):m.push(l);c=m;n(c)}}})},{skipInitialization:!0});
return()=>{C();D();r()}},[f]);return e(t,f)}
