
# 🧠 Rich Text Editor Using Lexical

A structured, extensible rich text editor built using **Next.js + Lexical + Zustand**, created as part of the hiring challenge.

The goal of this implementation is clarity of architecture, clean state modeling, and modular integration of third-party libraries.


## 🚀 Tech Stack

-   **Next.js (App Router, TypeScript)**
    
-   **Lexical (React bindings)**
    
-   **Zustand (State management)**
    
-   **KaTeX (Math rendering)**
    
-   **Tailwind CSS**


# 📌 Features Implemented

## 1️⃣ Core Editor Setup

-   Lexical Composer properly initialized
    
-   Clean separation between:
    
    -   Editor configuration
        
    -   Commands
        
    -   Nodes
        
    -   Toolbar UI
        
-   No direct DOM manipulation
    
-   Uses Lexical plugins:
    
    -   `HistoryPlugin`
        
    -   `ListPlugin`
        
    -   `TablePlugin`
        
    -   `OnChangePlugin`


## 2️⃣ Text Formatting

-   Bold
    
-   Italic
    
-   Underline
    
-   Paragraph
    

    

Implemented using Lexical command dispatch system.


## 3️⃣ List Support

-   Bullet list
    
-   Numbered list
    
-   Remove list
    

Handled using `@lexical/list` commands in a modular command layer.


## 4️⃣ Table Support

-   Insert 3x3 table via toolbar
    
-   Editable cell content
    
-   Styled with visible borders
    
-   Clean separation between UI and Lexical commands
    

Uses:

-   `@lexical/table`
    
-   `TablePlugin`
    
-   Proper node registration
    

Table styling handled via global CSS for consistent appearance.

----------

## 5️⃣ Mathematical Expression Support

-   Insert inline math node
    
-   Accepts LaTeX-style syntax
    
-   Rendered using KaTeX
    
-   Editable (not static HTML)
    

Custom `MathNode` implemented as a Lexical DecoratorNode.

This ensures:

-   Proper serialization
    
-   Controlled rendering
    
-   Extensible node behavior
    

----------

## 6️⃣ State Management (Zustand)

Editor state is modeled using Zustand with separation between:

### Editor State

-   Serialized JSON
    
-   Managed through `OnChangePlugin`
    
-   Stored independently from UI state
    

### UI State

-   Toolbar interaction
    
-   Modal/Math input logic
    

This avoids unnecessary re-renders and keeps Lexical editor instance isolated.

----------

## 7️⃣ Persistence

Editor content is:

-   Serialized using `editorState.toJSON()`
    
-   Stored in Zustand
    
-   Persisted to `localStorage`
    
-   Restored on reload via a custom `LoadContentPlugin`
    

This simulates real backend persistence while keeping the architecture API-ready.

----------

# 🏗️ Architecture Overview

```
Next.js (App  Router)
        │
        ▼
 LexicalComposer 
		│
	    ├── RichTextPlugin 
	    ├── HistoryPlugin 
	    ├── ListPlugin 
	    ├── TablePlugin 
	    ├── OnChangePlugin 
	    │
        ▼ 
  Zustand Store 
		│
        ▼ 
localStorage  Persistence
```

# 📂 Folder Structure
```
`editor-app/
│
├── app/
│   ├── page.tsx 
|	├── layout.tsx
│   ├── global.css
│
├── components/
│   └── editor/
│       ├── Editor.tsx 
│       ├── Toolbar
│       └── LoadContentPlugin.tsx 
│
├── lib/
│   ├── lexicalConfig.ts 
│   ├── editorCommands.ts 
│   └── nodes/
│       └── MathNode.ts 
├── store/
│   └── editorStore.ts 
└── package.json` 
```


# 🧩 Design Decisions

## Why Zustand?

-   Lightweight
    
-   No boilerplate
    
-   Clean separation between editor data and UI state
    
-   Prevents unnecessary re-renders
    

## Why JSON Serialization?

Lexical internally uses immutable editor states.  
Storing serialized JSON ensures:

-   Correct restoration
    
-   Extensibility
    
-   API-ready design
    
-   No coupling to DOM structure
    

## Why Custom MathNode?

Using a DecoratorNode:

-   Keeps math rendering isolated
    
-   Allows KaTeX rendering
    
-   Maintains proper Lexical serialization
    
-   Clean separation from editor UI
    


## Why Modular Command Layer?

All commands are abstracted into `editorCommands.ts`.

This ensures:

-   Toolbar stays clean
    
-   Editor logic is reusable
    
-   Architecture scales if more features are added
    


# 🧪 How to Run

`npm install`

`npm run dev` 

Open:

`http://localhost:3000` 





# 📝 Notes

This implementation focuses on:

-   Architectural clarity
    
-   Proper third-party integration
    
-   Clean state modeling
    
-   Production-style code organization
    

Not on visual perfection or feature overload.