import React, { useState, useEffect, useRef } from "react";
import katex from "katex";
import { $getNodeByKey } from "lexical";

export default function EditableMath({ latex, nodeKey, editor }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(latex);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  const renderKatex = () => {
    try {
      return katex.renderToString(value, { throwOnError: false });
    } catch {
      return `<span style="color:red">${value}</span>`;
    }
  };

  const saveChanges = () => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if (node) {
        const writable = node.getWritable();
        writable.__latex = value;
      }
    });
    setEditing(false);
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={saveChanges}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            saveChanges();
          }
        }}
        style={{
          fontSize: "14px",
          border: "1px solid #ccc",
          padding: "2px 4px",
        }}
      />
    );
  }

  return (
    <span
      onDoubleClick={() => setEditing(true)}
      dangerouslySetInnerHTML={{ __html: renderKatex() }}
      style={{ cursor: "pointer" }}
    />
  );
}
