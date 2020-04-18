const defaultSizes = [2, 4, 8, 16];

export function setUpMenu(initialSize, playArea) {
    sizeSetUp(initialSize, playArea);
    sideMenuSetUp();    
}

function sizeSetUp(initialSize, playArea) {
    let sizeToggles = document.getElementsByClassName('change-size');
    let resizeModal = document.getElementById('resize-modal');
    let resizeContent = document.querySelector('#resize-modal .modal-content');

    for (let i = 0; i < sizeToggles.length; ++i) {
        sizeToggles[i].addEventListener('click', event => {
            event.preventDefault();

            resizeModal.style.visibility = 'visible';
            resizeContent.style.transform = 'scale(1)';
        });
    }

    document.getElementById('resize-cancel').addEventListener('click', event => {
        event.preventDefault();
        resizeContent.style.transform = 'scale(0)';
        resizeModal.style.visibility = 'hidden';
    });

    document.getElementById('resize-confirm').addEventListener('click', event => {
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
    document.forms["size-form"][defaultSizes.indexOf(initialSize)].checked = true;
}

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