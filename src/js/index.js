'use strict';

import { Game } from './gamemodules/Game.js';

const game = new Game();

// TODO: Solve the module thing (browserify a watchify)
// Initializes Index page with the Game
(function () {
    let warning = document.getElementById('warning');
    warning.parentNode.removeChild(warning);

    game.setPlayArea(document.getElementById('game-area'));
})();