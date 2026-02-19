Hiring Challenge: Rich Text Editor Using Lexical

For this assignment, I built a functional rich text editor using Lexical. This project shows how I handle frontend architecture, state management, and clean design.

Task Overview
I built a React editor that supports more than just plain text. It is designed to be easy to grow and keep clean.

Main Features

1. Lexical Editor Setup
I used Lexical with React and followed the official way of setting things up. I avoided touching the DOM directly which keeps things fast and stable.

2. Table Support
You can insert tables from the toolbar. It supports rows and columns, and you can edit any cell directly. I kept the table logic separate from the UI so it's easy to change later.

3. Math Expressions
I added support for math formulas. You can insert them and they render beautifully using KaTeX. They are also fully editable so you can change the formula after putting it in.

4. State Management
I used Zustand to manage the state. I kept the editor content separate from the UI controls like the toolbar. This makes the app much faster because it only updates what it needs to.

5. Saving and Loading
The editor saves everything as JSON. When you reload the page, your work is still there. I used localStorage but wrote the code so it can talk to a real server very easily.

Notes
I focused on making the code clear and modular. This project shows how I would solve real-world problems in a professional development environment.
