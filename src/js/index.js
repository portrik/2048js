'use strict';

import { Game } from './gamemodules/Game.mjs';

const game = new Game();

// Initializes Index page with the Game
(() => {
    let warning = document.getElementById('warning');
    warning.parentNode.removeChild(warning);

    document.getElementById('menu-toggle').addEventListener('click', (event) => {
        event.preventDefault();
        document.getElementById('mobile-menu').style.transform = 'translateX(100%)';
    });

    document.getElementById('close-menu').addEventListener('click', (event) => {
        event.preventDefault();
        document.getElementById('mobile-menu').style.transform = 'translateX(-100%)';
    });

    game.setUpGame(document.getElementById('game-area'));
})();