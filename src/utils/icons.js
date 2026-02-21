/**
 * icons.js
 *
 * Centralized SVG path data for all toolbar and UI icons.
 * Keeping icon definitions separate from components means:
 * - Icons are reusable across multiple components without duplication
 * - Swapping an icon library requires editing only this file
 * - Component files stay focused on behavior, not SVG strings
 *
 * Each value is an SVG `d` attribute string, rendered via the
 * shared <Icon> component in Toolbar.jsx.
 */

const icons = {
    // --- History ---
    undo: 'M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z',
    redo: 'M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 15.7c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 15h9V6l-3.6 4.6z',

    // --- Text format ---
    bold: 'M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5S13.83 9.5 13 9.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z',
    italic: 'M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z',
    underline: 'M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z',
    strikethrough: 'M6.85 7.08C6.85 4.37 9.45 3 12.24 3c1.64 0 3 .49 3.9 1.28.77.65 1.46 1.73 1.46 3.24h-2.5c0-.19-.05-1.15-.8-1.67-.43-.29-.99-.48-1.75-.48-1.69 0-2.36.91-2.36 1.68 0 .48.25.88.74 1.21.28.18.74.36 1.37.48H6.85zm10.26 8.28c-.42.27-1.13.55-1.65.67-1.46.38-2.65.36-3.82.1-1.07-.23-1.89-.67-2.6-1.24l-.94 2.09c.86.72 1.9 1.24 3.04 1.52 1.64.4 3.34.34 4.96-.14.38-.11 1.01-.33 1.62-.73l-.61-2.27zM2 12.5h20v-2H2v2z',
    code: 'M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z',

    // --- Alignment ---
    alignLeft: 'M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z',
    alignCenter: 'M7 15v2h10v-2H7zm-4 6h18v-2H3v2zm0-8h18v-2H3v2zm4-6v2h10V7H7zM3 3v2h18V3H3z',
    alignRight: 'M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z',

    // --- Insert ---
    table: 'M20 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 2v3H5V5h15zm-8 14H5v-5h7v5zm0-7H5V9h7v3zm8 7h-7v-5h7v5zm0-7h-7V9h7v3z',
    math: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5.5 6H16v1.5h-2.5V13H12v-2.5H9.5V9H12V6.5h1.5V9zM7 15.5h5V17H7v-1.5zm9.5 0h-3V14h3v1.5z',

    // --- File actions ---
    save: 'M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z',
}

export default icons
