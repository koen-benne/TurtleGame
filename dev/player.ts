class Player extends HTMLElement {
    private realX : number;
    private realY : number;
    private facingRight : boolean;

    private isExecutingAction : boolean = false;
    private isOnSurface : boolean = false;

    public movementSpeed : number;
    private jumpStrength : number = 1.8;

    private verticalVelocity : number = 0;

    private attackKey : string;
    private defendKey : string;
    private upKey : string;
    private leftKey : string;
    private rightKey : string;

    public attackKeyPressed : number = 0;
    public defendKeyPressed : number = 0;
    public upPressed : boolean = false;
    public leftPressed : boolean = false;
    public rightPressed : boolean = false;


    constructor() {
        super();
    }

    public init(attackKey : string, defendKey : string, upKey : string, leftKey : string, rightKey : string, id : string, facing : string, game : HTMLElement) {
        // Set orientation
        if(facing === "right") {
            this.facingRight = true;
        } else if(facing === "left") {
            this.facingRight = false;
        } else {
            // Throw custom error if facing is incorrect
            throw "exeption: the parameter 'facing' in Player.init sould be either 'right' or 'left'."
        }

        // Set id
        this.id = id;

        // Set movement speed
        this.movementSpeed = 0.8;

        // Initialize player HTML Element
        const style = this.style;
        style.position = "absolute";
        style.width = "5vw";
        style.height = "10vw";
        style.backgroundImage = "url('docs/img/Red-dummy-texture.png')";
        style.backgroundRepeat = "repeat";
        style.backgroundSize = (PIXEL_WIDTH * 2).toString() + "vw";

        // Set keys
        this.attackKey = attackKey;
        this.defendKey = defendKey;
        this.upKey = upKey;
        this.leftKey = leftKey;
        this.rightKey = rightKey;

        // Add event listeners
        document.addEventListener("keydown", (e) => this.keyDown(e));
        document.addEventListener("keyup", (e) => this.keyUp(e));

        // Append player HTML Element
        game.appendChild(this);
    }


    // Returns the real x value
    get x() : number {
        return this.realX;
    }

    // Sets both the real and the visible x values
    set x (x) {
        this.realX = x;
        // Put x in the grid
        x = toGrid(x);
        this.style.left = x.toString() + "vw";
    }

    // Returns the real y value
    get y() : number {
        return this.realY;
    }

    // Sets both the real and the visible y values
    set y(y) {
        this.realY = y;
        // Put y in the grid
        y = toGrid(y);
        this.style.bottom = y.toString() + "vw";
    }


    // Keeps track of pressed keys
    private keyDown(event : KeyboardEvent) {
        switch (event.code) {
            case this.upKey: {
                this.upPressed = true;
                break;
            } case this.rightKey: {
                this.rightPressed = true;
                break;
            } case this.leftKey: {
                this.leftPressed = true;
                break;
            } case this.attackKey: {
                this.attackKeyPressed += 1;
                break;
            } case this.defendKey: {
                this.defendKeyPressed+= 1;
                break;
            }
        }
    }

    // Keeps track of released keys
    private keyUp(event : KeyboardEvent) {
        switch (event.code) {
            case this.upKey: {
                this.upPressed = false;
                break;
            } case this.rightKey: {
                this.rightPressed = false;
                break;
            } case this.leftKey: {
                this.leftPressed = false;
                break;
            } case this.attackKey: {
                this.attackKeyPressed = 0;
                break;
            } case this.defendKey: {
                this.defendKeyPressed = 0;
                break;
            }
        }
    }


    // Attack action
    private async attack() {
        this.style.backgroundImage = "url('docs/img/Green-dummy-texture.png')";
        await wait(100);
        this.style.backgroundImage = "url('docs/img/Red-dummy-texture.png')";
        await wait(50);
        this.isExecutingAction = false;
    }

    // Defend action
    private async defend() {
        this.style.backgroundImage = "url('docs/img/Green-dummy-texture.png')";
        await wait(100);
        this.style.backgroundImage = "url('docs/img/Red-dummy-texture.png')";
        await wait(50);
        this.isExecutingAction = false;
    }


    // Calculates velocity
    public calculateVelocity() : void {
        if (!this.isOnSurface) {
            this.verticalVelocity -= GRAVITY_PER_FRAME;
        } else if (this.upPressed) {
            this.verticalVelocity = this.jumpStrength;
            this.isOnSurface = false;
        } else {
            this.verticalVelocity = 0;
        }
    }

    // Executes the player actions
    public executePlayerAction() : void {
        // Make sure that player can not execute action if action is already being executed
        if (!this.isExecutingAction) {

            const maxKeypressTime = 2;
            if (this.attackKeyPressed < maxKeypressTime && this.attackKeyPressed > 0) {
                this.attackKeyPressed = maxKeypressTime;
                this.isExecutingAction = true;
                this.attack();
            } else if (this.defendKeyPressed < maxKeypressTime && this.defendKeyPressed > 0) {
                this.defendKeyPressed = maxKeypressTime;
                this.isExecutingAction = true;
                this.defend();
            } else {
                this.isExecutingAction = false
            }
        }
    }


    // Alters x value so that it does not pass through other objects
    public formatX(x : number, opponent : Player) : number {
        const width = vwToNum(this.style.width);
        const opponentWidth = vwToNum(opponent.style.width);
        const height = vwToNum(this.style.height);

        if (!(opponent.y - this.y >= height) && !(this.y - opponent.y >= vwToNum(opponent.style.height)) &&
            !(this.y - opponent.y - vwToNum(opponent.style.height) >= this.verticalVelocity - opponent.verticalVelocity) &&
            !(opponent.y - this.y - height >= opponent.verticalVelocity - this.verticalVelocity)) {

            if (opponent.x + opponentWidth > x && opponent.x <= x) {
                x = opponent.x + opponentWidth;
            } else if (x + width > opponent.x && x <= opponent.x) {
                x = opponent.x - width;
            }

        }

        // Make sure the player never goes off screen
        if((100 - x - width) < 0) {
            x = 100 - width;
        } else if(x < 0) {
            x = 0;
        }

        return x;
    }

    // Alters y value so that it does not pass through other objects
    public formatY(y : number, opponent : Player, floorHeight : number) : number {
        const width = vwToNum(this.style.width);
        const opponentHeight = opponent.style.height;
        const height = vwToNum(this.style.height);

        this.isOnSurface = false;
        if (!(opponent.x - this.x >= width) && !(this.x - opponent.x >= vwToNum(opponent.style.width))) {
            if (opponent.y + vwToNum(opponentHeight) > y && opponent.y < y) {
                if (opponent.isOnSurface) {
                    this.isOnSurface = true;
                }
                y = opponent.y + vwToNum(opponentHeight);
            } else if (y + height > opponent.y && y <= opponent.y) {
                opponent.isOnSurface = false;
                this.verticalVelocity /= 2;
                opponent.verticalVelocity = this.verticalVelocity;
                y = (this.y - y) / 2 + this.y;
            }
        }

        if(y <= floorHeight) {
            y = floorHeight;
            this.isOnSurface = true;
        } else if (y + height >= gameHeightInVw) {
            this.verticalVelocity = 0;
            y = gameHeightInVw - height;
        }

        return y;
    }

    // Moves x value of player (no proper physics yet)
    public moveX(opponent : Player) : void {
        let x = this.x;
        if(this.leftPressed) {
            x -= this.movementSpeed;
        }
        if(this.rightPressed) {
            x += this.movementSpeed;
        }
        if(this.x != x) {
            this.x = this.formatX(x, opponent);
        }
    }

    // Returns the new un-formatted y value
    public getNewY() : number {
        return this.y + this.verticalVelocity;
    }


}
// @ts-ignore
customElements.define('player-element', Player); // Custom element name MUST contain a hyphen!!!


