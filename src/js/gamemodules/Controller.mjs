export class Controller {

    /**
     * Sets up Controller on an HTML element and enables input detection.
     * Supports arrow keys, WASD and touches.
     * @param targetElement - HTML Element where events are fired and swipes are detected.
     */
    constructor(targetElement) {

        // Look up table for keyboard inputs
        this.keyCodes = {
            'ArrowLeft': 'Left',
            'ArrowUp': 'Up',
            'ArrowRight': 'Right',
            'ArrowDown': 'Down',
            'a': 'Left',
            'w': 'Up',
            'd': 'Right',
            's': 'Down',
        };

        // Initial values for touch input. Will be rewritten in handleTouchStart
        this.touchX = 0;
        this.touchY = 0;

        // Tolerance used for swipe directions
        this.tolerance = 50;

        this.targetElement = targetElement;
        this.enableController();
    }

    /**
     * Enables controller listening for inputs.
     */
    enableController() {
        document.addEventListener('keydown', (event) => this.handleKeydown(event));

        this.targetElement.addEventListener('touchstart', (event) => this.handleTouchStart(event));
        this.targetElement.addEventListener('touchend', (event) => this.handleTouchEnd(event));
    }

    /**
     * Disables controller listening for inputs.
     */
    disableController() {
        document.removeEventListener('keydown', (event) => this.handleKeydown(event));
        
        this.targetElement.removeEventListener('touchstart', (event) => this.handleTouchStart(event));
        this.targetElement.removeEventListener('touchend', (event) => this.handleTouchEnd(event));
    }

    /**
     * Dispatches move event on this.targetElement if key pressed is present in this.keyCodes.
     * Handles arrow keys and WASD input.
     * @param event - keyDown event
     */
    handleKeydown(event) {
        if (Object.keys(this.keyCodes).indexOf(event.key) > -1) {
            let moveEvent = new Event('move' + this.keyCodes[event.key]);
            this.targetElement.dispatchEvent(moveEvent);

            // Stops window from scrolling on Arrow press
            if (event.key.includes('Arrow')) {
                event.preventDefault();
            }
        }
    }
    
    /**
     * Records a swipe starting point.
     * @param event - touchStart event
     */
    handleTouchStart(event) {
        event.preventDefault();

        this.touchX = Math.round(event.touches[0].screenX);
        this.touchY = Math.round(event.touches[0].screenY);
    }

    /**
     * Calculates differences between starting and ending positions of a touch.
     * If a difference is bigger than this.tolerance, corresponding move on this.targetElement is dispatched.
     * Vertical move is prioritized.
     * @param event - touchEnd event
     */
    handleTouchEnd(event) {
        let newX = Math.round(event.changedTouches[0].screenX);
        let newY = Math.round(event.changedTouches[0].screenY);
        let direction = '';

        if (Math.abs(newY - this.touchY) > this.tolerance) {
            if (newY > this.touchY) {
                direction = 'Down';
            }
            else {
                direction = 'Up';
            }
        }
        else if (Math.abs(newX - this.touchX) > this.tolerance) {
            if (newX > this.touchX) {
                direction = 'Right';
            }
            else {
                direction = 'Left';
            }
        }

        // Event is dispatched only if differneces are bigger than tolerance.
        if (direction !== '') {
            this.targetElement.dispatchEvent(new Event('move' + direction));
        }
    }
}