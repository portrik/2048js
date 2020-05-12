# 2048JS

2048JS is a reimagination of (2048 by Gabriele Cirulli)[https://play2048.co/] written in pure ES6 JavaScript. The premise is still the same: move the tiles on the board to merge tiles of the same value until you get 2048. Or an equivalent for the bigger boards.

## Controls

* **Arrow Keys**
* **WASD**
* **Touchsreen** is obviously only supported on devices with touch input. Swipe on the game board to move the tiles.

## Technical Information

The game is packaged with Webpack and Babel to support older browsers and move all of the modules into one file. 2048JS is structured into separate modules that communicate through dispatched events and event listeners.

### Installation and Local Execution

#### Prerequisities

* Node.js 12 or newer
* Run `npm install` in the project's root folder

### Executing the Game

* Run `npm run start` in the project's root folder to start a local HTTP server on localhost:8080
* Run `npm run build` in the project's root folder to generate a distributable static files in the ./dist folder