/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

var list = require('@lexical/list');
var LexicalComposerContext = require('@lexical/react/LexicalComposerContext');
var react = require('react');

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

function useList(editor) {
  react.useEffect(() => {
    return list.registerList(editor);
  }, [editor]);
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

function ListPlugin() {
  const [editor] = LexicalComposerContext.useLexicalComposerContext();
  react.useEffect(() => {
    if (!editor.hasNodes([list.ListNode, list.ListItemNode])) {
      throw new Error('ListPlugin: ListNode and/or ListItemNode not registered on editor');
    }
  }, [editor]);
  useList(editor);
  return null;
}

exports.ListPlugin = ListPlugin;
