import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthScreen } from '@features/auth';
import { BlogView } from '@features/editor';
import { MainLayout } from '@components/layout/MainLayout';
import { ProtectedRoute } from '@features/auth/components/ProtectedRoute';
import { EditorWorkspace } from './pages/EditorWorkspace';
import { ThemeProvider } from '@components/providers/ThemeProvider';  


function App() {
  return (
        <ThemeProvider>  
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<AuthScreen />} />
        
        {/* READ-ONLY PREVIEW ROUTE (Guests allowed) */}
        <Route path="/preview/:id" element={<BlogView />} />

        {/* PROTECTED ROUTES (Requires Login) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            {/* Creates a new document automatically */}
            <Route path="/" element={<EditorWorkspace />} /> 
            
            {/* Edits a specific existing document */}
            <Route path="/edit/:id" element={<EditorWorkspace />} /> 
          </Route>
        </Route>

        {/* CATCH-ALL (404 Fallback) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
    </ThemeProvider>

  );
}

export default App;