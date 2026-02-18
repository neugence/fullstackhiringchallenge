# SmartBlog — System Architecture Diagram

---

## 1. High-Level System Architecture

```mermaid
graph TB
    subgraph CLIENT["🖥️ Client Browser"]
        REACT["React 19 SPA<br/>(Vite + Tailwind CSS v4)"]
    end

    subgraph BACKEND["⚙️ Backend Server"]
        FASTAPI["FastAPI<br/>(Python, Uvicorn)"]
    end

    subgraph DATABASE["🗄️ Database"]
        MONGO[("MongoDB Atlas<br/>(users & posts collections)")]
    end

    subgraph EXTERNAL["🌐 External Services"]
        GEMINI["Google Gemini 2.0 Flash<br/>(AI API)"]
    end

    REACT -- "REST API (JSON)<br/>via Axios" --> FASTAPI
    FASTAPI -- "Motor (async)" --> MONGO
    FASTAPI -- "Streaming HTTP" --> GEMINI
    FASTAPI -- "StreamingResponse" --> REACT
```

---

## 2. Frontend Architecture

```mermaid
graph TD
    subgraph ENTRY["Entry Point"]
        MAIN["main.jsx"]
        APP["App.jsx<br/>(React Router)"]
    end

    subgraph PAGES["Pages"]
        HOME["HomePage"]
        LOGIN["LoginPage"]
        SIGNUP["SignupPage"]
        POSTS["PostsPage<br/>(Dashboard)"]
        EDITOR["EditorPage"]
        POSTVIEW["PostViewPage"]
    end

    subgraph COMPONENTS["Components"]
        LAYOUT["Layout.jsx<br/>(Header + Nav + Outlet)"]
        PROTECTED["ProtectedRoute.jsx"]

        subgraph UI["UI Components"]
            BTN["Button"]
            BADGE["Badge"]
            SPIN["Spinner"]
            MODAL["Modal"]
            SAVE["SaveStatus"]
        end

        subgraph EDITOR_CMP["Editor Components"]
            ED["Editor.jsx<br/>(Lexical Composer)"]
            TOOLBAR["Toolbar.jsx"]
            ONCHANGE["OnChangePlugin"]
            AISEC["AISection"]
            AIPANEL["AIPanel"]
            USETEXT["useEditorText"]
        end
    end

    subgraph STATE["State Management (Zustand)"]
        AUTH_STORE["useAuthStore<br/>(login, signup, logout, token)"]
        POST_STORE["usePostStore<br/>(CRUD, active post, save status)"]
    end

    subgraph HOOKS["Custom Hooks"]
        DEBOUNCE["useDebounce"]
        AUTOSAVE["useAutoSave"]
    end

    subgraph SERVICES["Services"]
        API["api.js<br/>(Axios instance + auth interceptor)"]
    end

    MAIN --> APP
    APP --> HOME & LOGIN & SIGNUP
    APP --> PROTECTED --> LAYOUT
    LAYOUT --> POSTS & EDITOR

    EDITOR --> ED & TOOLBAR & AISEC
    AISEC --> AIPANEL
    ED --> ONCHANGE
    AIPANEL --> USETEXT

    EDITOR --> AUTOSAVE --> DEBOUNCE
    AUTOSAVE --> API
    AUTH_STORE --> API
    POST_STORE --> API
```

---

## 3. Backend Architecture

```mermaid
graph TD
    subgraph ENTRY["Entry Point"]
        MAINPY["main.py<br/>(CORS, route registration)"]
    end

    subgraph CONFIG["Configuration"]
        CONFIGPY["config.py<br/>(env variables)"]
        DBPY["database.py<br/>(Motor async MongoDB client)"]
    end

    subgraph AUTH_MODULE["Auth Module"]
        AUTHPY["auth.py<br/>(JWT create/verify, bcrypt hashing,<br/>get_current_user dependency)"]
    end

    subgraph MODELS["Pydantic Models"]
        USER_M["user.py<br/>(SignupRequest, LoginRequest,<br/>UserResponse)"]
        POST_M["post.py<br/>(PostCreate, PostUpdate,<br/>PostResponse)"]
    end

    subgraph ROUTES["API Routes"]
        R_AUTH["routes/auth.py<br/>/api/auth/*<br/>(signup, login, me)"]
        R_POSTS["routes/posts.py<br/>/api/posts/*<br/>(CRUD, publish, public)"]
        R_AI["routes/ai.py<br/>/api/ai/generate<br/>(summary, grammar fix)"]
    end

    subgraph DB["MongoDB Atlas"]
        USERS_COL[("users collection")]
        POSTS_COL[("posts collection")]
    end

    subgraph EXT["External"]
        GEMINI_API["Gemini 2.0 Flash"]
    end

    MAINPY --> R_AUTH & R_POSTS & R_AI
    MAINPY --> CONFIGPY & DBPY

    R_AUTH --> AUTHPY --> DBPY
    R_AUTH --> USER_M
    R_POSTS --> AUTHPY
    R_POSTS --> POST_M --> DBPY
    R_AI --> GEMINI_API

    DBPY --> USERS_COL & POSTS_COL
```

---

## 4. Authentication Flow

```mermaid
sequenceDiagram
    actor User
    participant Frontend as React Frontend
    participant Store as useAuthStore (Zustand)
    participant Axios as api.js (Axios)
    participant API as FastAPI Backend
    participant JWT as auth.py (JWT)
    participant DB as MongoDB Atlas

    User->>Frontend: Fill signup/login form
    Frontend->>Store: call signup() / login()
    Store->>Axios: POST /api/auth/signup or /login
    Axios->>API: HTTP Request
    API->>DB: Find/Create user
    DB-->>API: User document
    API->>JWT: Create JWT token
    JWT-->>API: Signed token
    API-->>Axios: { token, user }
    Axios-->>Store: Response
    Store->>Store: Save token to localStorage
    Store-->>Frontend: Authenticated ✅

    Note over Axios: All subsequent requests include<br/>Authorization: Bearer <token>

    User->>Frontend: Access protected page
    Frontend->>Axios: GET /api/posts/
    Axios->>API: + Bearer token header
    API->>JWT: Verify & decode token
    JWT-->>API: user_id
    API->>DB: Query posts by author_id
    DB-->>API: Posts array
    API-->>Frontend: Posts JSON
```

---

## 5. Auto-Save Flow

```mermaid
sequenceDiagram
    actor User
    participant Editor as Lexical Editor
    participant OnChange as OnChangePlugin
    participant AutoSave as useAutoSave Hook
    participant Debounce as useDebounce Hook
    participant API as FastAPI Backend
    participant DB as MongoDB

    User->>Editor: Types in editor
    Editor->>OnChange: Editor state changed
    OnChange->>AutoSave: onChange(editorJSON)
    AutoSave->>AutoSave: Skip first call (initial load)
    AutoSave->>Debounce: debounced(saveFunction)
    Note over Debounce: Start 1.5s timer

    User->>Editor: Types more
    Editor->>OnChange: Editor state changed again
    OnChange->>AutoSave: onChange(editorJSON)
    AutoSave->>Debounce: debounced(saveFunction)
    Note over Debounce: Reset timer to 1.5s

    Note over Debounce: 1.5s of silence...
    Debounce->>API: PATCH /api/posts/{id}
    Note over AutoSave: saveStatus = "saving"
    API->>DB: Update post document
    DB-->>API: OK
    API-->>AutoSave: 200 OK
    Note over AutoSave: saveStatus = "saved"

    User->>Editor: Navigate away
    AutoSave->>Debounce: flush()
    Debounce->>API: Immediate PATCH (no data loss)
```

---

## 6. AI Feature Flow

```mermaid
sequenceDiagram
    actor User
    participant AIPanel as AIPanel Component
    participant Hook as useEditorText Hook
    participant API as api.js (Axios)
    participant Backend as FastAPI Backend
    participant Gemini as Gemini 2.0 Flash

    User->>AIPanel: Click "Generate Summary"<br/>or "Fix Grammar"
    AIPanel->>Hook: Extract plain text from editor
    Hook-->>AIPanel: plainText
    AIPanel->>API: POST /api/ai/generate<br/>{ text, action }
    API->>Backend: HTTP Request
    Backend->>Gemini: Streaming API call<br/>with crafted prompt
    Gemini-->>Backend: Stream chunks
    Backend-->>API: StreamingResponse (chunks)
    API-->>AIPanel: ReadableStream
    loop For each chunk
        AIPanel->>AIPanel: Append text to display
    end
    Note over AIPanel: Full AI result displayed
```

---

## 7. Database Schema

```mermaid
erDiagram
    USERS {
        ObjectId _id PK
        string email UK
        string password "bcrypt hash"
        string name
        datetime created_at
    }

    POSTS {
        ObjectId _id PK
        string title
        json content "Lexical editor JSON state"
        string status "draft | published"
        string author_id FK
        string author_name
        datetime created_at
        datetime updated_at
    }

    USERS ||--o{ POSTS : "authors"
```

---

## 8. Project File Tree

```mermaid
graph LR
    subgraph ROOT["fullstackhiringchallenge/"]
        README["README.md"]
        ARCH["ARCHITECTURE.md"]

        subgraph BE["backend/"]
            MAIN["main.py"]
            REQ["requirements.txt"]
            ENV[".env"]

            subgraph APP["app/"]
                CFG["config.py"]
                DBPY["database.py"]
                AUTHPY["auth.py"]

                subgraph MOD["models/"]
                    UM["user.py"]
                    PM["post.py"]
                end

                subgraph RTS["routes/"]
                    RA["auth.py"]
                    RP["posts.py"]
                    RAI["ai.py"]
                end
            end
        end

        subgraph FE["frontend/"]
            IDX["index.html"]
            PKG["package.json"]
            VITE["vite.config.js"]

            subgraph SRC["src/"]
                MJ["main.jsx"]
                AJ["App.jsx"]
                CSS["index.css"]

                subgraph SVC["services/"]
                    APIJS["api.js"]
                end

                subgraph STR["store/"]
                    UAS["useAuthStore.js"]
                    UPS["usePostStore.js"]
                end

                subgraph HK["hooks/"]
                    UD["useDebounce.js"]
                    UAS2["useAutoSave.js"]
                end

                subgraph CMP["components/"]
                    LY["Layout.jsx"]
                    PR["ProtectedRoute.jsx"]

                    subgraph UI2["ui/"]
                        BT["Button, Badge,<br/>Spinner, Modal,<br/>SaveStatus"]
                    end

                    subgraph ED2["editor/"]
                        EDJ["Editor.jsx"]
                        TB["Toolbar.jsx"]
                        OC["OnChangePlugin.jsx"]
                        AIS["AISection.jsx"]
                        AIP["AIPanel.jsx"]
                        UET["useEditorText.js"]
                    end
                end

                subgraph PG["pages/"]
                    HP["HomePage"]
                    LP["LoginPage"]
                    SP["SignupPage"]
                    PP["PostsPage"]
                    EP["EditorPage"]
                    PVP["PostViewPage"]
                end
            end
        end
    end
```

---

## 9. API Endpoint Map

```mermaid
graph LR
    subgraph AUTH_ROUTES["/api/auth"]
        A1["POST /signup"]
        A2["POST /login"]
        A3["GET /me 🔒"]
    end

    subgraph POST_ROUTES["/api/posts"]
        P1["POST / 🔒 Create draft"]
        P2["GET / 🔒 List my posts"]
        P3["GET /:id 🔒 Get post"]
        P4["PATCH /:id 🔒 Update post"]
        P5["POST /:id/publish 🔒 Publish"]
        P6["DELETE /:id 🔒 Delete"]
        P7["GET /public List published"]
        P8["GET /public/:id Read post"]
    end

    subgraph AI_ROUTES["/api/ai"]
        AI1["POST /generate<br/>(summary / fix grammar)"]
    end

    AUTH_ROUTES --- POST_ROUTES --- AI_ROUTES
```

> 🔒 = Requires JWT authentication

---

## 10. Deployment Architecture

```mermaid
graph LR
    subgraph VERCEL["Vercel"]
        FE["React Frontend<br/>(Static Build)"]
    end

    subgraph RENDER["Render"]
        BE["FastAPI Backend<br/>(Uvicorn)"]
    end

    subgraph ATLAS["MongoDB Atlas"]
        DB[("Cloud Database")]
    end

    subgraph GOOGLE["Google Cloud"]
        GEM["Gemini 2.0 Flash API"]
    end

    FE -- "HTTPS REST API" --> BE
    BE -- "Motor (async)" --> DB
    BE -- "Streaming HTTPS" --> GEM
```
