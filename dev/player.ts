class Player extends HTMLElement {
    public hitbox : HitboxBase;

    public position : Vector2 = new Vector2(0, 0);

    public maxHealth : number;
    public health : number;

    private facingRight : boolean;

    private isExecutingAction : boolean = false;

    public movementSpeed : number = 0.3;
    private jumpStrength : number = 2.2;

    public isOnGround : boolean = false;

    public velocity : Vector2 = new Vector2(0, 0);

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

    // Get the position of the next frame according to the current velocity
    public get newPosition() : Vector2 {
        return Vector2.add(this.position, this.velocity)
    }

    // Initialise the player, unfortunately this can't be done inside the constructor as player is an instance of HTMLElement
    public init(maxHealth : number, attackKey : string, defendKey : string, upKey : string, leftKey : string, rightKey : string, id : string, facing : string, game : HTMLElement) {
        this.maxHealth = maxHealth;
        this.health = maxHealth;

        // Set orientation
        if(facing === "right") {
            this.facingRight = true;
        } else if(facing === "left") {
            this.facingRight = false;
        } else {
            // Throw custom error if facing is incorrect
            throw "exeption: the parameter 'facing' in Player.init should be either 'right' or 'left'."
        }

        // Set id
        this.id = id;

        this.hitbox = new ConvexHitbox(false,[
            new Vector2(2, 0),
            new Vector2(0, 4),
            new Vector2(0, 13),
            new Vector2(2, 17.5),
            new Vector2(6.5, 17.5),
            new Vector2(8.5, 13),
            new Vector2(8.5, 4),
            new Vector2(6.5, 0),
        ], this);

        // Initialize player HTML Element
        this.width = 9;
        this.height = 18;
        const style = this.style;
        style.position = "absolute";
        style.backgroundImage = "url('docs/img/Turtle1.png')";
        style.backgroundRepeat = "no-repeat"
        style.backgroundSize = "100% 101%";

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


    get height() : number {
        return vwToNum(this.style.height);
    }

    set height(height : number) {
        this.style.height = height.toString() + "vw";
    }

    get width() : number {
        return vwToNum(this.style.width);
    }

    set width(width : number) {
        this.style.width = width.toString() + "vw";
    }


    // Renders position to grid
    public render() {
        this.style.left = this.position.x.toString() + "vw";

        this.style.bottom = this.position.y.toString() + "vw";

        this.hitbox.flip(this.facingRight);
        if (this.facingRight) {
            this.style.transform = "scaleX(1)";
        } else {
            this.style.transform = "scaleX(-1)";
        }

        this.hitbox.display();

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
        this.velocity.x -= FRICTION * this.velocity.x;
        if(this.leftPressed) {
            this.velocity.x += -this.movementSpeed;
        }
        if(this.rightPressed) {
            this.velocity.x += this.movementSpeed;
        }
        if ((this.velocity.x < 0.01 && this.velocity.x > 0) || (this.velocity.x > -0.01 && this.velocity.x < 0)) {
            this.velocity.x = 0;
        }

        if (this.velocity.x > 0) {
            this.facingRight = true;
        } else if (this.velocity.x < 0) {
            this.facingRight = false;
        }

        // Vertical
        this.velocity.y -= GRAVITY_PER_FRAME;
        if (this.upPressed && this.isOnGround) {
            this.isOnGround = false;
            this.velocity.y = this.jumpStrength;
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
        this.position.add(this.velocity);
    }


}
// @ts-ignore
customElements.define('player-element', Player); // Custom element name MUST contain a hyphen!!!