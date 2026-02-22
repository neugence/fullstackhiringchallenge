/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import{useLexicalComposerContext as e}from"@lexical/react/LexicalComposerContext";import{useLayoutEffect as t,useEffect as o}from"react";const r="undefined"!=typeof window&&void 0!==window.document&&void 0!==window.document.createElement?t:o;function i({ignoreHistoryMergeTagChange:t=!0,ignoreSelectionChange:o=!1,onChange:i}){const[n]=e();return r((()=>{if(i)return n.registerUpdateListener((({editorState:e,dirtyElements:r,dirtyLeaves:a,prevEditorState:d,tags:s})=>{o&&0===r.size&&0===a.size||t&&s.has("history-merge")||d.isEmpty()||i(e,n,s)}))}),[n,t,o,i]),null}export{i as OnChangePlugin};
