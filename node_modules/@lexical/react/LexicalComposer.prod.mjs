/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import{createLexicalComposerContext as e,LexicalComposerContext as t}from"@lexical/react/LexicalComposerContext";import{createEditor as o,$getRoot as n,$createParagraphNode as i,$getSelection as r}from"lexical";import{useLayoutEffect as a,useEffect as c,useMemo as l}from"react";import{jsx as d}from"react/jsx-runtime";const s="undefined"!=typeof window&&void 0!==window.document&&void 0!==window.document.createElement,m=s?a:c,u={tag:"history-merge"};function p({initialConfig:a,children:c}){const p=l((()=>{const{theme:t,namespace:c,nodes:l,onError:d,editorState:m,html:p}=a,f=e(null,t),E=o({editable:a.editable,html:p,namespace:c,nodes:l,onError:e=>d(e,E),theme:t});return function(e,t){if(null===t)return;if(void 0===t)e.update((()=>{const t=n();if(t.isEmpty()){const o=i();t.append(o);const n=s?document.activeElement:null;(null!==r()||null!==n&&n===e.getRootElement())&&o.select()}}),u);else if(null!==t)switch(typeof t){case"string":{const o=e.parseEditorState(t);e.setEditorState(o,u);break}case"object":e.setEditorState(t,u);break;case"function":e.update((()=>{n().isEmpty()&&t(e)}),u)}}(E,m),[E,f]}),[]);return m((()=>{const e=a.editable,[t]=p;t.setEditable(void 0===e||e)}),[]),d(t.Provider,{value:p,children:c})}export{p as LexicalComposer};
