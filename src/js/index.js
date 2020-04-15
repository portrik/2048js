'use strict';

import { Game } from './gamemodules/Game.mjs';

const game = new Game();

// Initializes Index page with the Game
(() => {
    let warning = document.getElementById('warning');
    warning.parentNode.removeChild(warning);

    game.setUpGame(document.getElementById('game-area'));
})();