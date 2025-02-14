#!/usr/bin/env node

const { program } = require('commander');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

function createProject(projectDirectory, options) {
  console.log(`Creating project in ${projectDirectory}...`);

  // Step 1: Create the React project using Create React App
  try {
    execSync(`npx create-react-app ${projectDirectory}`, { stdio: 'inherit' });
  } catch (error) {
    console.error('Error while running create-react-app:', error);
    process.exit(1);
  }

  // Change directory to the new project
  process.chdir(projectDirectory);

  // Step 2: Install Electron as a dev dependency
  console.log('Installing Electron...');
  try {
    execSync(`npm install electron --save-dev`, { stdio: 'inherit' });
  } catch (error) {
    console.error('Error while installing Electron:', error);
    process.exit(1);
  }

  // Step 3: Install web-vitals
  console.log('Installing web-vitals...');
  try {
    execSync(`npm install web-vitals`, { stdio: 'inherit' });
  } catch (error) {
    console.error('Error while installing web-vitals:', error);
    process.exit(1);
  }

  // Step 4: Install concurrently (to run multiple commands) and wait-on (to wait for the dev server)
  console.log('Installing concurrently and wait-on...');
  try {
    execSync(`npm install concurrently wait-on --save-dev`, { stdio: 'inherit' });
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
  const electronCode = `// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron');

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  });
  
  // and load the React app on localhost.
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

  // Script to start Electron
  packageJson.scripts.electron = "electron .";

  // Script to run React and Electron concurrently with wait-on
  // This waits for http://localhost:3000 to be ready before starting Electron.
  packageJson.scripts.dev = "concurrently \"npm start\" \"wait-on http://localhost:3000 && npm run electron\"";

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

  console.log('Project setup complete!');
  console.log('Next steps:');
  console.log('  1. To run both React and Electron concurrently, run: npm run dev');
  console.log('     (Electron will wait for the React dev server to be ready before loading the page.)');
  console.log('  2. Alternatively, run in separate terminals:');
  console.log('       Terminal 1: npm start');
  console.log('       Terminal 2: npm run electron');
}

program
  .name('eletract')
  .version('1.0.0')
  .arguments('<project-directory>')
  .option('--template <template-name>', 'Specify a custom template (future enhancement)')
  .action((projectDirectory, options) => {
    createProject(projectDirectory, options);
  });

program.parse(process.argv);
