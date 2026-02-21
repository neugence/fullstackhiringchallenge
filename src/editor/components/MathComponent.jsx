import { useState, useEffect, useRef } from 'react';
import katex from "katex";
import "katex/dist/katex.min.css";

export default function MathComponent({ latex, onLoad, onError }) {
  const containerRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!containerRef.current) return;

    try {
      // Clear previous content
      containerRef.current.innerHTML = '';
      
      // Render the KaTeX equation
      const html = katex.renderToString(latex, {
        throwOnError: false,
        displayMode: true,
      });
      
      containerRef.current.innerHTML = html;
      
      if (onLoad) onLoad();
    } catch (err) {
      setError(err.message);
      if (onError) onError(err);
    }
  }, [latex, onLoad, onError]);

  if (error) {
    return <div className="math-error">Error: {error}</div>;
  }

  return <span ref={containerRef} className="math-node" />;
}