import { InitialConfigType } from "@lexical/react/LexicalComposer";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { TableNode, TableCellNode, TableRowNode } from "@lexical/table";
import { MathNode } from "./nodes/MathNode";

export const lexicalConfig: InitialConfigType = {
  namespace: "HiringChallengeEditor",
  theme: {
    paragraph: "mb-2",
    heading: {
      h1: "text-3xl font-bold mt-4 mb-2",
      h2: "text-2xl font-semibold mt-3 mb-2",
    },
    list: {
      ul: "list-disc pl-6",
      ol: "list-decimal pl-6",
    },
    table: "lexical-table",
    tableCell: "border border-gray-400 p-2",
    tableCellHeader: "border border-gray-500 bg-gray-100 p-2 font-semibold",
  },
  nodes: [
    HeadingNode,
    QuoteNode,
    ListNode,
    ListItemNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    MathNode
  ],
  onError(error) {
    console.error(error);
  },
};
