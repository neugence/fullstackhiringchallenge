import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import App from "./App";
import EditorPage from "./pages/EditorPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // Layout
    children: [
      {
        index: true,
        element: <EditorPage />,
      },
      {
        path: "editor",
        element: <EditorPage />,
      },
      {
        path: "*",
        element: (
          <div className="flex items-center justify-center h-screen text-gray-500 text-xl">
            404 - Page Not Found
          </div>
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);