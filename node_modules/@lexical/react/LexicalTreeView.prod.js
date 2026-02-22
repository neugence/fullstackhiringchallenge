/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';var c=require("@lexical/devtools-core"),d=require("@lexical/utils"),e=require("react"),g=require("react/jsx-runtime"),l=Object.create(null);if(e)for(var m in e)l[m]=e[m];l.default=e;
exports.TreeView=function({treeTypeButtonClassName:n,timeTravelButtonClassName:p,timeTravelPanelSliderClassName:q,timeTravelPanelButtonClassName:r,viewClassName:t,timeTravelPanelClassName:u,editor:a,customPrintNode:v}){let f=l.createRef(),[w,h]=e.useState(a.getEditorState()),x=c.useLexicalCommandsLog(a);e.useEffect(()=>d.mergeRegister(a.registerUpdateListener(({editorState:b})=>{h(b)}),a.registerEditableListener(()=>{h(a.getEditorState())})),[a]);e.useEffect(()=>{let b=f.current;if(null!==b)return b.__lexicalEditor=
a,()=>{b.__lexicalEditor=null}},[a,f]);return g.jsx(c.TreeView,{treeTypeButtonClassName:n,timeTravelButtonClassName:p,timeTravelPanelSliderClassName:q,timeTravelPanelButtonClassName:r,viewClassName:t,timeTravelPanelClassName:u,setEditorReadOnly:b=>{const k=a.getRootElement();null!=k&&(k.contentEditable=b?"false":"true")},editorState:w,setEditorState:b=>a.setEditorState(b),generateContent:async function(b){return c.generateContent(a,x,b,v)},ref:f})}
