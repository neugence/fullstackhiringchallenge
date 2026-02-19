System Architecture & Design Decisions
1. File Structure Overview
The project is divided into a clear frontend and backend separation to ensure modularity and ease of deployment.

Frontend (/frontend)
/src/components: Contains reusable UI components (Atomic design-ish).
Editor.tsx: The core Lexical implementation.
plugins/: Custom Lexical plugins like the ToolbarPlugin.
/src/hooks: Custom React hooks for business logic.
useAutoSave.ts: Encapsulates the debounce logic for API syncing.
/src/store: State management using Zustand.
useEditorStore.tsx: Centralized source of truth for the current post.
authStore.ts: Handles JWT and user session state.
/src/utils: Global utilities like the Axios interceptor (api.ts).
Backend (/backend)
main.py: A single-file FastAPI entry point (suitable for the assignment scale) containing routes, dependency injection for auth, and database logic.
2. Technical Choices & Justification
State Management: Zustand
Why? Zustand was chosen over Redux for its boilerplate-free API and high performance with React's concurrent features. It allows the Editor state to be synced with the Header's "Saving" status without complex prop drilling.
Editor Framework: Lexical
Why? Unlike simple textareas, Lexical provides a robust "state-to-JSON" serialization that is production-ready. We store the content as a SerializedEditorState (JSON) in MongoDB to preserve rich formatting and nested nodes without data loss.
Database: MongoDB (Motor)
Why? Since blog posts are document-based and Lexical outputs JSON, a NoSQL database like MongoDB is a natural fit. The motor library provides asynchronous drivers for FastAPI, ensuring the API doesn't block during heavy I/O operations.