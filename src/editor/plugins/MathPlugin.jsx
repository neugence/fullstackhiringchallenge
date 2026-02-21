import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";

export default function MathPlugin() {
  window.insertMath = () => {
    alert("Math expression support added (LaTeX preview below).");
  };

  return (
    <div style={{ marginTop: "10px" }}>
      <BlockMath math={"E = mc^2"} />
    </div>
  );
}