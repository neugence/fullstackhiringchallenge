import React, { useCallback } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

export default function MathComponent({ latex }) {
  const ref = useCallback((container) => {
    if (!container) return;

    try {
      const html = katex.renderToString(latex, {
        throwOnError: false,
        displayMode: true,
      });
      container.innerHTML = html;
    } catch (err) {
      container.innerHTML = `<span style="color:red">${err.message}</span>`;
    }
  }, [latex]);

  return <span ref={ref} contentEditable={false} />;
}