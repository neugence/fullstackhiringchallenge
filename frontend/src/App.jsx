import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import PostsList from './features/posts/PostsList'
import EditorPage from './features/editor/EditorPage'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<PostsList />} />
                <Route path="/editor/:id?" element={<EditorPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    )
}

export default App
