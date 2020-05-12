const boardSizes = [2, 4, 8, 16, 32];

/**
 * Wrapper for starting functions.
 * 
 * @param initialSize - Size of the board
 * @param playArea - HTML Element with canvas
 */
export function setUpMenu(initialSize, playArea) {
    sizeSetUp(initialSize, playArea);
    sideMenuSetUp();
    highscoresSetUp();
    aboutSetUp();
}

/**
 * Sets up listeners for the resizing modal.
 * Also dispatches event for Game in case of board resizing.
 * 
 * @param initialSize - Size of the board
 * @param playArea - HTML Element with Canvas
 */
function sizeSetUp(initialSize, playArea) {
    let sizeToggles = document.getElementsByClassName('change-size');
    let resizeModal = document.getElementById('resize-modal');
    let resizeContent = document.querySelector('#resize-modal .modal-content');

    for (let i = 0; i < sizeToggles.length; ++i) {
        sizeToggles[i].addEventListener('click', (event) => {
            event.preventDefault();

            resizeModal.style.visibility = 'visible';
            resizeContent.style.transform = 'scale(1)';
        });
    }

    document.getElementById('resize-cancel').addEventListener('click', (event) => {
        event.preventDefault();
        resizeContent.style.transform = 'scale(0)';
        resizeModal.style.visibility = 'hidden';
    });

    document.getElementById('resize-confirm').addEventListener('click', (event) => {
        event.preventDefault();
        playArea.dispatchEvent(new CustomEvent('resize', {
            detail: {
                'size': Number(document.forms["size-form"]["size"].value),
            }
        }));

        resizeContent.style.transform = 'scale(0)';
        resizeModal.style.visibility = 'hidden';
    });

    // Set initial size to the resize form
    document.forms["size-form"][boardSizes.indexOf(initialSize)].checked = true;
}

/**
 * Sets up listeners for side menu used with smaller devices.
 */
function sideMenuSetUp() {
    // Adds listeners for side menu
    document.getElementById('menu-toggle').addEventListener('click', (event) => {
        event.preventDefault();
        document.getElementById('mobile-menu').style.transform = 'translateX(100%)';
    });

    document.getElementById('close-menu').addEventListener('click', (event) => {
        event.preventDefault();
        document.getElementById('mobile-menu').style.transform = 'translateX(-100%)';
    });
}

/**
 * Sets up listeners for highscores modal.
 */
function highscoresSetUp() {
    let highscoresToggles = document.getElementsByClassName('highscores');
    let highscoresModal = document.getElementById('highscores-modal');
    let highscoresContent = document.querySelector('#highscores-modal .modal-content');

    for (let i = 0; i < highscoresToggles.length; ++i) {
        highscoresToggles[i].addEventListener('click', (event) => {
            event.preventDefault();

            highscoresModal.style.visibility = 'visible';
            highscoresContent.style.transform = 'scale(1)';
        });
    }

    document.getElementById('highscores-cancel').addEventListener('click', (event) => {
        event.preventDefault();

        highscoresContent.style.transform = 'scale(0)';
        highscoresModal.style.visibility = 'hidden';
    });
}

/**
 * Sets up listeners for about modal.
 */
function aboutSetUp() {
    let aboutToggle = document.getElementsByClassName('about');
    let aboutModal = document.getElementById('about-modal');
    let aboutContent = document.querySelector('#about-modal .modal-content');

    for (let i = 0; i < aboutToggle.length; ++i) {
        aboutToggle[i].addEventListener('click', (event) => {
            event.preventDefault();

            aboutModal.style.visibility = 'visible';
            aboutContent.style.transform = 'scale(1)';
        });
    }

    document.getElementById('about-cancel').addEventListener('click', (event) => {
        event.preventDefault();

        aboutContent.style.transform = 'scale(0)';
        aboutModal.style.visibility = 'hidden';
    });
}