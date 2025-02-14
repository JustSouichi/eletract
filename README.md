# eletract

<p align="center">
  <img src="https://raw.githubusercontent.com/JustSouichi/eletract/refs/heads/main/assets/banner.png" alt="Eletract Logo">
  <br><strong>Command-line tool for creating React + Electron apps with ease.</strong>
  <br><a href="https://github.com/JustSouichi/eletract">GitHub Repository</a>
</p>

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://raw.githubusercontent.com/JustSouichi/eletract/refs/heads/main/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/JustSouichi/eletract.svg)](https://github.com/JustSouichi/eletract/issues)
[![GitHub stars](https://img.shields.io/github/stars/JustSouichi/eletract.svg?style=social&label=Stars)](https://github.com/JustSouichi/eletract/stargazers)
[![Downloads](https://img.shields.io/npm/dt/eletract.svg)](https://www.npmjs.com/package/eletract)

---

## 📦 Installation

Install **Eletract** globally using npm:

```bash
npm install -g eletract
```

You can create a new project using:

```bash
npx eletract projectname
```

To create a **TypeScript** project:

```bash
npx eletract projectname --template typescript
```

---

## 🚀 Features

- **Instant React + Electron App Setup:**  
  Create a **fully working React + Electron project** with just one command.

- **Supports TypeScript and JavaScript:**  
  Choose between JavaScript or TypeScript for your project.

- **Electron Integration:**  
  Automatically sets up Electron with your React app, including scripts to launch it.

- **Dev Scripts Ready to Use:**  
  Run your project with a single command (`npm run dev`) that starts React and Electron together.

- **Auto-Generated Project Structure:**  
  The created project follows best practices and includes a working `electron.js` entry file.

---

## 🎯 Usage

Once installed, run:

```bash
npx eletract <project-name>
```

Example:

```bash
npx eletract my-electron-app
```

To create a **TypeScript** project:

```bash
npx eletract my-electron-app --template typescript
```

Then navigate into the project directory and start the development environment:

```bash
cd my-electron-app
npm run dev
```

This command will launch both the **React development server** and **Electron**.

---

## 🛠 Commands

### `eletract --help`
Displays help information with all available commands and options.

### `eletract <project-name>`
Creates a new React + Electron project inside a folder with the specified name.

### `eletract <project-name> --template typescript`
Creates a new project using TypeScript instead of JavaScript.

---

## 📂 Project Structure

After running `eletract`, your project will have the following structure:

```
my-electron-app/
├── node_modules/
├── public/
├── src/
│   ├── App.tsx (or App.js for JavaScript projects)
│   ├── index.tsx (or index.js for JavaScript projects)
│   ├── styles.css
├── electron/
│   ├── electron.js (Main Electron process)
├── package.json
├── tsconfig.json (only for TypeScript projects)
├── README.md
```

---

## ⚙️ Configuration

Your `package.json` will be automatically configured with the following scripts:

```json
"scripts": {
  "start": "react-scripts start",
  "electron": "electron .",
  "dev": "concurrently \"npm start\" \"wait-on http://localhost:3000 && npm run electron\""
}
```

This allows you to:
- Start the React development server: `npm start`
- Start Electron separately: `npm run electron`
- Run both together: `npm run dev`

---

## 🤝 Contributing

We welcome contributions! If you'd like to improve Eletract, please fork the repository and submit a pull request. Before submitting, ensure that your changes follow the coding and documentation standards.

1. Fork the repository
2. Create a new branch for your feature or bug fix
3. Implement your changes and ensure tests are passing
4. Open a pull request with a description of your changes

---

## 📜 License

This project is licensed under the [MIT License](https://raw.githubusercontent.com/JustSouichi/eletract/refs/heads/main/LICENSE).

---

## 👤 Author

Developed by **Tommaso Bertocchi** (alias [JustSouichi](https://github.com/JustSouichi)).

