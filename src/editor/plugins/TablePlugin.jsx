import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { TablePlugin as LexicalTablePlugin } from "@lexical/react/LexicalTablePlugin";

export default function TablePlugin() {
  return <LexicalTablePlugin />;
}