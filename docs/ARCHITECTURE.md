# Architecture Guide

This document provides a high-level overview of the architecture of **Treasure Hunters**.

## Core Technologies

- **Phaser 3**: The core game engine used for rendering, physics, input handling, and audio.
- **Vite**: The build tool and development server used to serve the application locally and bundle it for production.
- **HTML/CSS/JS**: Vanilla web technologies for the user interface outside the game canvas (e.g., buttons, overlays).

## Directory Structure

- `public/`: Contains static assets like images, sprite sheets, sounds, and map files. These are served as-is by Vite.
- `src/`: Contains the source code of the application.
  - `main.js`: The entry point of the game. Contains the Phaser game configuration and scene definitions.
  - `style.css`: Contains CSS for the HTML elements wrapping the game canvas.

## Game Scenes

The game is divided into several logical scenes (though they may be combined in `main.js`):
1. **Boot/Preload Scene**: Responsible for loading all necessary assets (images, audio) before the game starts.
2. **Menu Scene**: The main menu interface where the user can start the game.
3. **Play Scene**: The core gameplay loop. Handles player movement, collision detection, enemy AI, and state updates.
4. **Game Over Scene**: Displayed when the player dies or completes the game.

## Physics & Collision

We use Phaser's **Arcade Physics** system.
- Static bodies are used for platforms, ground, and walls.
- Dynamic bodies are used for the player, enemies, and interactive objects like coins.
- Collision callbacks are defined to handle interactions (e.g., collecting a coin, taking damage).

## Deployment

The project is bundled into static files using Vite (`npm run build`). The resulting `dist/` directory contains everything needed to host the game on any static web server (e.g., GitHub Pages, Vercel, Netlify).
