import Editor from "./editor/Editor";

function App() {
  return (
    <div style={{ maxWidth: "900px", margin: "40px auto", padding: "20px" }}>
      <h1>Rich Text Editor Using Lexical</h1>
      <Editor />
    </div>
  );
}

export default App;