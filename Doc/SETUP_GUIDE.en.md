# Setup Guide

This guide will help you set up the local development environment to run **Treasure Hunters**.

## 1. System Prerequisites
Before you begin, ensure your device has the following software installed:
- **Node.js** (version 16.x or newer) - [Download Node.js](https://nodejs.org/)
- **Git** - [Download Git](https://git-scm.com/)
- **Text Editor** (Recommended: VS Code)
- Modern web browser (Chrome, Firefox, Edge, or Safari)

## 2. Cloning the Repository
The first step is to get a copy of the code onto your local machine. Open your terminal or command prompt, and run the following commands:

```bash
git clone https://github.com/username/treasure-hunters.git
cd treasure-hunters
```

## 3. Installing Dependencies
This project uses `npm` (Node Package Manager) to manage its dependencies (Phaser and Vite).
Run this command inside the project directory:

```bash
npm install
```

This process will download all required packages into the `node_modules` folder.

## 4. Running the Development Server
Once all dependencies are installed, you can run the game in development mode using Vite, which features Hot Module Replacement (HMR).

```bash
npm run dev
```

You will see output indicating where the server is running, typically at `http://localhost:5173`. Open that URL in your browser to play the game!

## 5. Building for Production
If you want to release or deploy this game, you need to create an optimized production build.

```bash
npm run build
```

This command will create a `dist/` folder containing all the static, minified HTML, CSS, and JavaScript files. The files inside the `dist/` folder are ready to be uploaded to hosting services like Vercel, Netlify, or GitHub Pages.

## Troubleshooting
- **Error "Command not found: npm"**: Ensure Node.js is installed and added to your system PATH.
- **Port Conflict**: If port 5173 is already in use by another application, Vite will usually try the next available port (e.g., 5174). You can check this in the terminal log.
