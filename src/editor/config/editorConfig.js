import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Image from "@tiptap/extension-image"
import Table from "@tiptap/extension-table"
import TableRow from "@tiptap/extension-table-row"
import TableHeader from "@tiptap/extension-table-header"
import TableCell from "@tiptap/extension-table-cell"


export const editorConfig = {
  extensions: [
    StarterKit,
    Underline,
    Image,
    Table.configure({
      resizable: true,
    }),
    TableRow,
    TableHeader,
    TableCell,
  ],
  content: "",
  autofocus: true,
}