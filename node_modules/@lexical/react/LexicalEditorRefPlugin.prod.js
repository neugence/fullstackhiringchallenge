/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';var a=require("@lexical/react/LexicalComposerContext"),c=require("react"),e=Object.create(null);if(c)for(var f in c)e[f]=c[f];e.default=c;exports.EditorRefPlugin=function({editorRef:b}){let [d]=a.useLexicalComposerContext();e.useEffect(()=>{"function"===typeof b?b(d):"object"===typeof b&&(b.current=d)},[d]);return null}
