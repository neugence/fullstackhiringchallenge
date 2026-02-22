/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import{$isLinkNode as e}from"@lexical/link";import{useLexicalComposerContext as t}from"@lexical/react/LexicalComposerContext";import{$findMatchingParent as n,isHTMLAnchorElement as r}from"@lexical/utils";import{getNearestEditorFromDOMNode as l,$getNearestNodeFromDOMNode as o,$isElementNode as i,$getSelection as u,$isRangeSelection as a}from"lexical";import{useEffect as s}from"react";function c({newTab:c=!0,disabled:f=!1}){const[m]=t();return s((()=>{const t=t=>{const s=t.target;if(!(s instanceof Node))return;const p=l(s);if(null===p)return;let d=null,v=null;if(p.update((()=>{const t=o(s);if(null!==t){const l=n(t,i);if(!f)if(e(l))d=l.sanitizeUrl(l.getURL()),v=l.getTarget();else{const e=function(e,t){let n=e;for(;null!=n;){if(t(n))return n;n=n.parentNode}return null}(s,r);null!==e&&(d=e.href,v=e.target)}}})),null===d||""===d)return;const x=m.getEditorState().read(u);if(a(x)&&!x.isCollapsed())return void t.preventDefault();const g="auxclick"===t.type&&1===t.button;window.open(d,c||g||t.metaKey||t.ctrlKey||"_blank"===v?"_blank":"_self"),t.preventDefault()},s=e=>{1===e.button&&t(e)};return m.registerRootListener(((e,n)=>{null!==n&&(n.removeEventListener("click",t),n.removeEventListener("mouseup",s)),null!==e&&(e.addEventListener("click",t),e.addEventListener("mouseup",s))}))}),[m,c,f]),null}export{c as ClickableLinkPlugin,c as default};
