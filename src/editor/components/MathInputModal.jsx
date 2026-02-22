import { useState, useEffect } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import { useEditorStore } from "../../store/editorStore";

export default function MathInputModal() {
  const { isMathModalOpen, closeMathModal, insertMath } = useEditorStore();
  const [latexInput, setLatexInput] = useState("\\int_{0}^{\\infty} e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}");
  const [previewError, setPreviewError] = useState(null);

  useEffect(() => {
    if (isMathModalOpen) {
      setLatexInput("\\int_{0}^{\\infty} e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}");
      setPreviewError(null);
    }
  }, [isMathModalOpen]);

  const handleLatexChange = (e) => {
    const value = e.target.value;
    setLatexInput(value);

    // Validate LaTeX in real-time
    try {
      katex.renderToString(value, { throwOnError: false });
      setPreviewError(null);
    } catch (error) {
      setPreviewError(error.message);
    }
  };

  const handleInsertMath = () => {
    try {
      if (insertMath) {
        insertMath(latexInput);
      }
      closeMathModal();
    } catch (error) {
      console.error("Error inserting math:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleInsertMath();
    } else if (e.key === 'Escape') {
      closeMathModal();
    }
  };

  if (!isMathModalOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onKeyDown={handleKeyDown} tabIndex={0}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>Insert Mathematical Expression</h3>
          <button
            className="modal-close"
            onClick={closeMathModal}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="input-group">
            <label htmlFor="latex-input">LaTeX Expression:</label>
            <textarea
              id="latex-input"
              value={latexInput}
              onChange={handleLatexChange}
              placeholder="Enter LaTeX expression (e.g., \int_{0}^{\infty} e^{-x^2} dx)"
              className="latex-input"
              rows={4}
              autoFocus
            />
            {previewError && (
              <div className="error-message">
                Error: {previewError}
              </div>
            )}
          </div>

          <div className="preview-group">
            <label>Preview:</label>
            <div className="math-preview">
              {latexInput ? (
                (() => {
                  try {
                    const html = katex.renderToString(latexInput, {
                      throwOnError: false,
                      displayMode: true,
                    });
                    return <div dangerouslySetInnerHTML={{ __html: html }} />;
                  } catch (error) {
                    return <div className="preview-error">Invalid LaTeX: {error.message}</div>;
                  }
                })()
              ) : (
                <div className="preview-placeholder">Enter LaTeX to see preview</div>
              )}
            </div>
          </div>

          <div className="examples">
            <label>Examples:</label>
            <div className="example-buttons">
              <button
                type="button"
                onClick={() => setLatexInput("\\int_{0}^{\\infty} e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}")}
                className="example-button"
              >
                Gaussian Integral
              </button>
              <button
                type="button"
                onClick={() => setLatexInput("E = mc^2")}
                className="example-button"
              >
                Einstein's Equation
              </button>
              <button
                type="button"
                onClick={() => setLatexInput("\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}")}
                className="example-button"
              >
                Basel Problem
              </button>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            onClick={closeMathModal}
            className="button secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleInsertMath}
            className="button primary"
            disabled={!latexInput.trim() || previewError}
          >
            Insert Math
          </button>
        </div>
      </div>
    </div>
  );
}