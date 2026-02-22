/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';var d=require("@lexical/react/LexicalComposerContext"),history=require("@lexical/history"),f=require("react");function g(a,b,c=1E3){let e=f.useMemo(()=>b||history.createEmptyHistoryState(),[b]);f.useEffect(()=>history.registerHistory(a,e,c),[c,a,e])}exports.createEmptyHistoryState=history.createEmptyHistoryState;exports.HistoryPlugin=function({delay:a,externalHistoryState:b}){let [c]=d.useLexicalComposerContext();g(c,b,a);return null}
