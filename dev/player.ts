class Player extends HTMLElement {
    private realX : number;
    private realY : number;
    private facingRight : boolean;

    private isExecutingAction : boolean = false;

    public movementSpeed : number = 0.3;
    private jumpStrength : number = 1.8;

    public isOnGround : boolean = false;

    horizontalVelocity : number = 0;
    verticalVelocity : number = 0;

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
        // Horizontal
        this.horizontalVelocity -= FRICTION * this.horizontalVelocity;
        if(this.leftPressed) {
            this.horizontalVelocity += -this.movementSpeed;
        }
        if(this.rightPressed) {
            this.horizontalVelocity += this.movementSpeed;
        }
        if ((this.horizontalVelocity < 0.01 && this.horizontalVelocity > 0) || (this.horizontalVelocity > -0.01 && this.horizontalVelocity < 0)) {
            this.horizontalVelocity = 0;
        }

        // Vertical
        this.verticalVelocity -= GRAVITY_PER_FRAME;
        if (this.upPressed && this.isOnGround) {
            this.isOnGround = false;
            this.verticalVelocity = this.jumpStrength;
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

    public applyVelocity() : void {
        this.x += this.horizontalVelocity;
        this.y += this.verticalVelocity;
    }


}
// @ts-ignore
customElements.define('player-element', Player); // Custom element name MUST contain a hyphen!!!