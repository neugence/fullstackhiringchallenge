import type { LexicalEditor } from "lexical";

import {
  FORMAT_TEXT_COMMAND,
  $getSelection,
  $insertNodes,
  $createParagraphNode,
} from "lexical";

import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";

import { INSERT_TABLE_COMMAND } from "@lexical/table";

import { $setBlocksType } from "@lexical/selection";
import { $createHeadingNode } from "@lexical/rich-text";

import { MathNode } from "@/lib/nodes/MathNode";

/* =========================
   Text Formatting
========================= */

export const toggleBold = (editor: LexicalEditor) => {
  editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
};

export const toggleItalic = (editor: LexicalEditor) => {
  editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
};

export const toggleUnderline = (editor: LexicalEditor) => {
  editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
};

/* =========================
   Block Formatting
========================= */

export const setHeading = (
  editor: LexicalEditor,
  level: "h1" | "h2" | "h3"
) => {
  editor.update(() => {
    const selection = $getSelection();
    if (!selection) return;

    $setBlocksType(selection, () =>
      $createHeadingNode(level)
    );
  });
};

export const setParagraph = (editor: LexicalEditor) => {
  editor.update(() => {
    const selection = $getSelection();
    if (!selection) return;

    $setBlocksType(selection, () =>
      $createParagraphNode()
    );
  });
};

/* =========================
   Lists
========================= */

export const toggleBulletList = (editor: LexicalEditor) => {
  editor.dispatchCommand(
    INSERT_UNORDERED_LIST_COMMAND,
    undefined
  );
};

export const toggleNumberList = (editor: LexicalEditor) => {
  editor.dispatchCommand(
    INSERT_ORDERED_LIST_COMMAND,
    undefined
  );
};

export const removeList = (editor: LexicalEditor) => {
  editor.dispatchCommand(
    REMOVE_LIST_COMMAND,
    undefined
  );
};

/* =========================
   Tables
========================= */

export const insertTable = (editor: LexicalEditor) => {
  editor.dispatchCommand(INSERT_TABLE_COMMAND, {
    rows: "3",
    columns: "3",
  });
};

/* =========================
   Math
========================= */

export const insertMath = (
  editor: LexicalEditor,
  latex: string
) => {
  editor.update(() => {
    const selection = $getSelection();
    if (!selection) return;

    const mathNode = new MathNode(latex);
    $insertNodes([mathNode]);
  });
};
