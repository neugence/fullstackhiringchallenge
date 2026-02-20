import Editor from './components/Editor/Editor'
import FeatureGuide from './components/Editor/FeatureGuide'


function App() {
    return (
        <div className="app-container">
            <header className="app-header">
                <h1>Lexical Rich Text Editor</h1>
                <p>Built with Lexical, Zustand, and KaTeX</p>
            </header>
            <main>
                <Editor />
                <FeatureGuide />
            </main>
            <footer className="app-footer">
                <p>Hiring Challenge - Georgetown</p>
            </footer>
        </div>
    )
}

export default App
