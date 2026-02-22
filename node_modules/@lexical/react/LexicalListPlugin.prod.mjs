/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import{registerList as o,ListNode as t,ListItemNode as r}from"@lexical/list";import{useLexicalComposerContext as e}from"@lexical/react/LexicalComposerContext";import{useEffect as i}from"react";function n(){const[n]=e();return i((()=>{if(!n.hasNodes([t,r]))throw new Error("ListPlugin: ListNode and/or ListItemNode not registered on editor")}),[n]),function(t){i((()=>o(t)),[t])}(n),null}export{n as ListPlugin};
