import React, { useCallback, useEffect } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

export default function MathComponent({ latex }) {
  const ref = useCallback((container) => {
    if (!container) return;

    try {
      // Clear previous content
      container.innerHTML = '';
      
      const html = katex.renderToString(latex, {
        throwOnError: false,
        displayMode: true,
      });
      container.innerHTML = html;
    } catch (err) {
      container.innerHTML = `<span style="color: #dc3545; font-family: monospace;">Error: ${err.message}</span>`;
    }
  }, [latex]);

  // Re-render when latex changes
  useEffect(() => {
    if (ref.current) {
      ref(ref.current);
    }
  }, [latex, ref]);

  return (
    <div 
      ref={ref} 
      contentEditable={false}
      style={{
        display: "block",
        padding: "20px",
        margin: "20px 0",
        background: "#f8f9fa",
        border: "1px solid #e9ecef",
        borderRadius: "8px",
        textAlign: "center",
        fontSize: "18px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.target.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
        e.target.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.target.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.05)";
        e.target.style.transform = "translateY(0)";
      }}
    />
  );
}