/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'editor-bg': '#ffffff',
                'editor-border': '#e5e7eb',
                'toolbar-bg': '#f3f4f6',
            }
        },
    },
    plugins: [],
}
