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

  // **New Step: Install web-vitals**
  console.log('Installing web-vitals...');
  try {
    execSync(`npm install web-vitals`, { stdio: 'inherit' });
  } catch (error) {
    console.error('Error while installing web-vitals:', error);
    process.exit(1);
  }

  // Step 3: Create the electron folder and electron.js file
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

  // Step 4: Update package.json with the main field and electron script
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

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

  console.log('Project setup complete!');
  console.log('Next steps:');
  console.log('  1. Open one terminal and run: npm start');
  console.log('  2. Open a second terminal and run: npm run electron');
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
