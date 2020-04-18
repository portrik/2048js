'use strict';

import { Game } from './components/Game.mjs';
import { setUpMenu } from './components/MenuAndModal.mjs';

const game = new Game();

// Initializes Index page with the Game
(() => {
    let warning = document.getElementById('warning');
    warning.parentNode.removeChild(warning);

    let playArea = document.getElementById('game-area');

    game.setUpGame(playArea);

    setUpMenu(game.size, playArea);
})();