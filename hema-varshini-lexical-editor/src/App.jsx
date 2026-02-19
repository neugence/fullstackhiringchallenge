import { Editor } from './components/Editor/Editor';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1 className="app-h1">Document Editor</h1>
      <div className="card">
        <Editor />
      </div>
    </div>
  );
}

export default App;
