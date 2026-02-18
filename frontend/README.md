# Smart Blog Editor - Frontend

Modern React application built with Vite, Lexical editor, and Zustand state management.

## Features

- ✅ Rich text editing with Lexical
- ✅ Auto-save with debouncing (2s delay)
- ✅ Zustand state management
- ✅ Tailwind CSS styling
- ✅ Responsive design

## Setup

```bash
npm install
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests

## Environment Variables

Create a `.env` file:

```
VITE_API_URL=http://localhost:8000
```

## Project Structure

```
src/
├── features/       # Feature modules
│   ├── editor/    # Lexical editor
│   └── posts/     # Posts management
├── store/         # Zustand stores
├── services/      # API services
├── hooks/         # Custom hooks
└── App.jsx        # Main app
```
