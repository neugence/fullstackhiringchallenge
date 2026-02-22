/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';var a=require("@lexical/react/LexicalComposerContext"),e=require("lexical"),h=require("react");let k="undefined"!==typeof window&&"undefined"!==typeof window.document&&"undefined"!==typeof window.document.createElement?h.useLayoutEffect:h.useEffect;
exports.ClearEditorPlugin=function({onClear:b}){let [c]=a.useLexicalComposerContext();k(()=>c.registerCommand(e.CLEAR_EDITOR_COMMAND,()=>{c.update(()=>{if(null==b){let f=e.$getRoot(),d=e.$getSelection(),g=e.$createParagraphNode();f.clear();f.append(g);null!==d&&g.select();e.$isRangeSelection(d)&&(d.format=0)}else b()});return!0},e.COMMAND_PRIORITY_EDITOR),[c,b]);return null}
