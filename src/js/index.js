'use strict';

import { Game } from './gamemodules/Game.js';

const game = new Game();

// Initializes Index page with the Game
(function () {
    let warning = document.getElementById('warning');
    warning.parentNode.removeChild(warning);

    game.setPlayArea(document.getElementById('game-area'));
})();