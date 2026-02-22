/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import{addClassNamesToElement as t}from"@lexical/utils";import{TextNode as e,$applyNodeReplacement as r}from"lexical";class n extends e{static getType(){return"hashtag"}static clone(t){return new n(t.__text,t.__key)}constructor(t,e){super(t,e)}createDOM(e){const r=super.createDOM(e);return t(r,e.theme.hashtag),r}static importJSON(t){const e=s(t.text);return e.setFormat(t.format),e.setDetail(t.detail),e.setMode(t.mode),e.setStyle(t.style),e}exportJSON(){return{...super.exportJSON(),type:"hashtag"}}canInsertTextBefore(){return!1}isTextEntity(){return!0}}function s(t=""){return r(new n(t))}function o(t){return t instanceof n}export{s as $createHashtagNode,o as $isHashtagNode,n as HashtagNode};
