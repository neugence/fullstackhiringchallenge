import React from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

const MathComponent = ({ latex }) => {
  let html;
  try {
    html = katex.renderToString(latex, { throwOnError: false, displayMode: false });
  } catch {
    html = `$${latex}$`;
  }

  return (
    <span 
      className="math-node"
      style={{
        display: "inline-block",
        padding: "2px 6px",
        margin: "0 4px",
        backgroundColor: "#f8f9fa",
        border: "1px solid #dee2e6",
        borderRadius: "4px",
        fontFamily: "KaTeX_Main, serif",
        fontStyle: "italic",
        fontSize: "14px",
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default MathComponent;