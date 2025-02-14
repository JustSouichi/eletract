#!/usr/bin/env node

const { program } = require('commander');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

function createProject(projectDirectory, options) {
  const projectPath = path.join(process.cwd(), projectDirectory);

  // 🚨 Check if the project directory already exists
  if (fs.existsSync(projectPath)) {
    console.error(`\n🚨 Error: The folder '${projectDirectory}' already exists!`);
    console.error(`📂 Path: ${projectPath}`);
    console.error('❌ Aborting to prevent overwriting existing files.');
    console.error('👉 Please choose a different project name or delete the existing folder.');
    process.exit(1);
  }

  console.log(`\n🚀 Creating project in ${projectPath}...\n`);

  // Step 1: Create the React project using Create React App
  const craCommand = options.template
    ? `npx create-react-app ${projectDirectory} --template ${options.template}`
    : `npx create-react-app ${projectDirectory}`;

  try {
    execSync(craCommand, { stdio: 'inherit' });
  } catch (error) {
    console.error('Error while running create-react-app:', error);
    process.exit(1);
  }

  // Change directory to the new project
  process.chdir(projectDirectory);

  // Step 2: Install Electron as a dev dependency
  console.log('📦 Installing Electron...');
  try {
    execSync('npm install electron --save-dev', { stdio: 'inherit' });
  } catch (error) {
    console.error('Error while installing Electron:', error);
    process.exit(1);
  }

  // Step 3: Install web-vitals (only if NOT using TypeScript)
  const isTypeScript = options.template === 'typescript';
  if (isTypeScript) {
    console.log('⚡ Skipping web-vitals install for TypeScript template...');
  } else {
    console.log('📦 Installing web-vitals...');
    try {
      execSync('npm install web-vitals', { stdio: 'inherit' });
    } catch (error) {
      console.error('Error while installing web-vitals:', error);
      process.exit(1);
    }
  }

  // Step 3.1: Ensure an App file exists to avoid "Can't resolve './App'" errors
  const srcDir = path.join(process.cwd(), 'src');
  if (isTypeScript) {
    // Check if either App.tsx or App.ts exists.
    const appTsxPath = path.join(srcDir, 'App.tsx');
    const appTsPath = path.join(srcDir, 'App.ts');

    if (!fs.existsSync(appTsxPath) && !fs.existsSync(appTsPath)) {
      console.log('📂 Creating App.tsx (TypeScript version)...');
      fs.writeFileSync(
        appTsxPath,
        `import React from 'react';

function App() {
  return <h1>Hello from App.tsx!</h1>;
}

export default App;
`,
        'utf8'
      );
    } else {
      console.log('✅ TypeScript App file already exists!');
    }
  } else {
    // JavaScript branch – check if App.js exists.
    const appJsPath = path.join(srcDir, 'App.js');
    if (!fs.existsSync(appJsPath)) {
      console.log('📂 Creating App.js (JavaScript version)...');
      fs.writeFileSync(
        appJsPath,
        `import React from 'react';

function App() {
  return <h1>Hello from App.js!</h1>;
}

export default App;
`,
        'utf8'
      );
    } else {
      console.log('✅ App.js already exists!');
    }
  }

  // Step 3.2: Remove `reportWebVitals` import in index.tsx for TypeScript
  const indexTsx = path.join(srcDir, 'index.tsx');
  if (isTypeScript && fs.existsSync(indexTsx)) {
    console.log('🧹 Removing reportWebVitals from index.tsx...');
    let content = fs.readFileSync(indexTsx, 'utf8');

    // Remove only the reportWebVitals import statement.
    content = content.replace(
      /import\s+reportWebVitals\s+from\s+['"]\.\/reportWebVitals['"];\s*/g,
      ''
    );

    // Remove the reportWebVitals invocation.
    content = content.replace(/reportWebVitals\(\);?/g, '');

    // 🚨 Forza l'import App ad usare .tsx invece di ./App
    // Attenzione: se l'import è scritto in modo diverso (es. "import { App } from './App';"), questa replace potrebbe non trovarlo.
    content = content.replace(
      /import\s+App\s+from\s+['"]\.\/App['"];/,
      "import App from './App.tsx';"
    );

    fs.writeFileSync(indexTsx, content, 'utf8');
  }

  // Step 4: Install concurrently & wait-on
  console.log('📦 Installing concurrently and wait-on...');
  try {
    execSync('npm install concurrently wait-on --save-dev', { stdio: 'inherit' });
  } catch (error) {
    console.error('Error while installing concurrently or wait-on:', error);
    process.exit(1);
  }

  // Step 5: Create the electron folder and electron.js file
  const electronFolder = path.join(process.cwd(), 'electron');
  if (!fs.existsSync(electronFolder)) {
    fs.mkdirSync(electronFolder);
  }

  const electronFilePath = path.join(electronFolder, 'electron.js');
  const electronCode = `const { app, BrowserWindow } = require('electron');

function createWindow() {
  const mainWindow = new BrowserWindow({ width: 800, height: 600 });
  mainWindow.loadURL('http://localhost:3000');
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
`;
  fs.writeFileSync(electronFilePath, electronCode);

  // Step 6: Update package.json with main field and scripts for electron and dev
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  let packageJson;
  try {
    packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  } catch (error) {
    console.error('Error reading package.json:', error);
    process.exit(1);
  }

  packageJson.main = "./electron/electron.js";
  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts.electron = "electron .";
  packageJson.scripts.dev = "concurrently \"npm start\" \"wait-on http://localhost:3000 && npm run electron\"";

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

  // Success message
  console.log(`\n✅ Project setup complete!\n`);
  console.log(`📂 Your project is ready at: ${projectPath}`);
  console.log(`\n🚀 Next steps:\n`);
  console.log(`  1. cd ${projectDirectory}`);
  console.log(`  2. To run both React and Electron concurrently, run: npm run dev`);
  console.log(`     (Electron will wait for the React dev server to be ready before loading the page.)`);
  console.log(`  3. Alternatively, run in separate terminals:`);
  console.log(`       Terminal 1: npm start`);
  console.log(`       Terminal 2: npm run electron`);
}

program
  .name('eletract')
  .version('1.0.0')
  .arguments('<project-directory>')
  .option('--template <template-name>', 'Specify a custom Create React App template (e.g., "typescript")')
  .action((projectDirectory, options) => {
    createProject(projectDirectory, options);
  });

program.parse(process.argv);
