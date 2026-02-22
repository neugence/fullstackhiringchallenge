/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';var e=require("@lexical/link"),m=require("@lexical/react/LexicalComposerContext"),n=require("@lexical/utils"),t=require("lexical"),u=require("react");
function v({newTab:p=!0,disabled:q=!1}){let [h]=m.useLexicalComposerContext();u.useEffect(()=>{let l=b=>{const c=b.target;if(c instanceof Node){var d=t.getNearestEditorFromDOMNode(c);if(null!==d){var f=null,k=null;d.update(()=>{var a=t.$getNearestNodeFromDOMNode(c);if(null!==a&&(a=n.$findMatchingParent(a,t.$isElementNode),!q))if(e.$isLinkNode(a))f=a.sanitizeUrl(a.getURL()),k=a.getTarget();else{a:{a=n.isHTMLAnchorElement;let g=c;for(;null!=g;){if(a(g)){a=g;break a}g=g.parentNode}a=null}null!==a&&(f=
a.href,k=a.target)}});if(null!==f&&""!==f){d=h.getEditorState().read(t.$getSelection);if(!t.$isRangeSelection(d)||d.isCollapsed())d="auxclick"===b.type&&1===b.button,window.open(f,p||d||b.metaKey||b.ctrlKey||"_blank"===k?"_blank":"_self");b.preventDefault()}}}},r=b=>{1===b.button&&l(b)};return h.registerRootListener((b,c)=>{null!==c&&(c.removeEventListener("click",l),c.removeEventListener("mouseup",r));null!==b&&(b.addEventListener("click",l),b.addEventListener("mouseup",r))})},[h,p,q]);return null}
exports.ClickableLinkPlugin=v;exports.default=v
