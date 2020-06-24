class Player extends HTMLElement {
    public hitbox : HitboxBase;
    public healthBar : HealthBar;

    private screen : PlayScreen;

    public body : string;
    public image: HTMLElement;

    public position : Vector2 = new Vector2(0, 0);

    public maxHealth : number;
    public health : number;

    private facingRight : boolean;

    private isExecutingAction : boolean = false;

    public movementSpeed : number = 0.3;
    private jumpStrength : number = 2.2;

    public isOnGround : boolean = false;
    public isWalking : boolean = false;

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
    private isDefending: boolean;


    constructor() {
        super();
    }

    // Get the position of the next frame according to the current velocity
    public get newPosition() : Vector2 {
        return Vector2.add(this.position, this.velocity);
    }

    // Initialise the player, unfortunately this can't be done inside the constructor as player is an instance of HTMLElement
    public init(maxHealth : number, attackKey : string, defendKey : string, upKey : string, leftKey : string, rightKey : string, id : string, facing : string, healthBarSide : string, game : HTMLElement, screen : PlayScreen) {
        this.maxHealth = maxHealth;
        this.health = maxHealth;

        this.screen = screen;

        // Set orientation
        if(facing === "right") {
            this.facingRight = true;
        } else if(facing === "left") {
            this.facingRight = false;
        } else {
            // Throw custom error if facing is incorrect
            throw "exeption: the parameter 'facing' in Player.init should be either 'right' or 'left'."
        }

        // Create health bar
        this.healthBar = new HealthBar(healthBarSide, game);

        // Set id
        this.id = id;

        this.hitbox = new ConvexHitbox(false,[
            new Vector2(2, 0),
            new Vector2(0, 4),
            new Vector2(0, 10.4),
            new Vector2(2, 14.9),
            new Vector2(6.5, 14.9),
            new Vector2(8.5, 10.4),
            new Vector2(8.5, 4),
            new Vector2(6.5, 0),
        ], this);

        // Initialize player HTML Element
        this.width = this.hitbox.maxX + this.hitbox.minX;
        this.height = this.hitbox.maxY + this.hitbox.minY;
        const style = this.style;
        style.position = "absolute";
        this.image = document.createElement("div");
        this.appendChild(this.image);
        const imageStyle = this.image.style;
        this.body = "1";

        // Preload images
        preloadImages([
            "docs/img/turtle/"+ this.body +"/Default.png",
            "docs/img/turtle/" + this.body + "/Jumping1.png",
            "docs/img/turtle/" + this.body + "/Jumping2.png",
            "docs/img/turtle/" + this.body + "/Jumping3.png",
            "docs/img/turtle/" + this.body + "/Jumping4.png",
            "docs/img/turtle/" + this.body + "/Walking1.png",
            "docs/img/turtle/" + this.body + "/Walking2.png",
            "docs/img/turtle/" + this.body + "/Walking3.png",
            "docs/img/turtle/" + this.body + "/Walking4.png",
            "docs/img/turtle/" + this.body + "/Walking5.png",
            "docs/img/turtle/" + this.body + "/Walking6.png",
        ]);


        // Initialize image element
        //imageStyle.backgroundImage = "url('docs/img/turtle/"+ this.body +"/Default.png')";
        imageStyle.backgroundImage = "url('docs/img/turtle/"+ this.body +"/Default.png')";
        imageStyle.backgroundRepeat = "no-repeat"
        const playerHeight : number = 19.5;
        imageStyle.width = (playerHeight * 1.14).toString() + "vw ";
        imageStyle.height = playerHeight.toString() + "vw";
        imageStyle.backgroundSize ="100% 100%";
        imageStyle.position = "absolute"
        imageStyle.left = "-7.27vw";
        imageStyle.top = "-2.87vw";

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


    // Renders position
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
        if (this.health > 0) {
            switch (event.code) {
                case this.upKey: {
                    this.upPressed = true;
                    break;
                }
                case this.rightKey: {
                    this.rightPressed = true;
                    break;
                }
                case this.leftKey: {
                    this.leftPressed = true;
                    break;
                }
                case this.attackKey: {
                    this.attackKeyPressed += 1;
                    break;
                }
                case this.defendKey: {
                    this.defendKeyPressed += 1;
                    break;
                }
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

    // Damages this player
    public async damage(amount: number, knockBack : number, opponent : Player) {
        this.isExecutingAction = true;

        if (this.isDefending) {
            amount /= 2;
        }

        if (this.health <= 0) {
            return
        }
        this.health -= amount;

        if (this.health <= 0) {
            this.die();
        }
        else if (!this.isDefending) {

            const images = [];
            for (let i = 1; i <= 6; i++) {
                images.push("docs/img/turtle/" + this.body + "/Damaged" + i + ".png");
            }
            preloadImages(images);

            if (opponent.position.x <= this.position.x) {
                this.velocity.x += knockBack;
            } else {
                this.velocity.x -= knockBack;
            }

            for (let i = 0; i < 6; i++) {
                this.image.style.backgroundImage = "url('" + images[i] + "')";
                await wait(40);
            }

            this.image.style.backgroundImage = "url('docs/img/turtle/" + this.body + "/Default.png')";

            this.isExecutingAction = false;
        }

        this.healthBar.health = this.health;

    }

    // Die animation and stops game
    private async die() {

        const images = [];
        for (let i = 0; i <= 14; i++) {
            images.push("docs/img/turtle/" + this.body + "/Dying" + i + ".png");
        }

        preloadImages(images);

        if (this.facingRight) {
            this.hitbox = new AabbHitbox(false, new Vector2(-6.4, 0), new Vector2(8, 6), this);
        } else {
            this.hitbox = new AabbHitbox(false, new Vector2(0, 0), new Vector2(14.4, 6), this);
        }

        for (let i = 0; i < images.length; i++) {
            this.image.style.backgroundImage = "url('" + images[i] + "')";
            await wait(35);
        }

        this.screen.gameOver(this.id);

    }

    // Attack action
    private async attack(opponent : Player) {
        this.image.style.backgroundImage = "url('docs/img/Green-dummy-texture.png')";
        let attackHitbox : AabbHitbox;
        const reach = 5;
        const hitbox = this.hitbox;
        if (this.facingRight) {
            attackHitbox = new AabbHitbox(false, new Vector2(hitbox.maxX, hitbox.minY), new Vector2(hitbox.maxX + reach, hitbox.maxY), this);
        } else {
            attackHitbox = new AabbHitbox(false, new Vector2(-reach, hitbox.minY), new Vector2(0, hitbox.maxY), this);
        }
        if (CollisionDetection.isCollidingAABB(opponent.hitbox.getCurrentHitbox(opponent.position),
            attackHitbox.getCurrentHitbox(this.position))) {
            opponent.damage(7,3, this);
        }
        await wait(100);
        this.image.style.backgroundImage = "url('docs/img/turtle/"+ this.body +"/Default.png')";

        await wait(50);
        this.isExecutingAction = false;
    }

    // Defend action
    private async defend() {
        this.isDefending = true;
        this.image.style.backgroundImage = "url('docs/img/Green-dummy-texture.png')";
        await wait(300);
        this.image.style.backgroundImage = "url('docs/img/turtle/"+ this.body +"/Default.png')";
        await wait(50);
        this.isDefending = false;
        this.isExecutingAction = false;
    }


    // Execute jump animation
    private async jumpAnimation() {
        for(let i = 1; i <= 4; i++) {
            if (this.isOnGround || this.health <= 0) {
                return;
            }
            await wait(30);
            this.image.style.backgroundImage = "url('docs/img/turtle/" + this.body + "/Jumping" + i.toString() + ".png')";
        }
        while(!this.isOnGround) {
            await wait(60) // Wait and recheck
        }
    }

    // Execute walking animation
    private async walkingAnimation() {
        const frames = 6;
            for (let i = 1; i < frames * 2; i++) {
                if (!this.isWalking || !this.isOnGround || this.health <= 0) {
                    return;
                }
                let frame : number;
                if (i > frames) {
                    frame = i * -1 + frames * 2;
                } else {
                    frame = i;
                }

                await wait(40);
                this.image.style.backgroundImage = "url('docs/img/turtle/" + this.body + "/Walking" + frame.toString() + ".png')";

                if (i >= frames * 2 - 1) i = 1;
        }
    }

    // Calculates velocity
    public calculateVelocity() : void {
        // Horizontal
        this.velocity.x -= FRICTION * this.velocity.x;
        if(this.leftPressed) {
            this.facingRight = false;
            this.velocity.x += -this.movementSpeed;
        }
        if(this.rightPressed) {
            this.facingRight = true;
            this.velocity.x += this.movementSpeed;
        }

        // For walking animation
        if ((this.leftPressed != this.rightPressed) && this.isOnGround) {
            if (!this.isWalking) {
                this.isWalking = true;
                this.walkingAnimation().then(() => {
                    this.image.style.backgroundImage = "url('docs/img/turtle/"+ this.body +"/Default.png')";
                });
            } else {
                this.isWalking = true;
            }
        } else {
            this.isWalking = false;
        }

        // Set velocity to 0 when it is very small
        if ((this.velocity.x < 0.01 && this.velocity.x > 0) || (this.velocity.x > -0.01 && this.velocity.x < 0)) {
            this.velocity.x = 0;
        }


        // Vertical
        this.velocity.y -= GRAVITY_PER_FRAME;
        if (this.upPressed && this.isOnGround) {
            this.isOnGround = false;
            this.jumpAnimation().then(() => {
                this.image.style.backgroundImage = "url('docs/img/turtle/"+ this.body +"/Default.png')";
            })
            this.velocity.y = this.jumpStrength;
        }
    }


    // Executes the player actions
    public executePlayerAction(opponent : Player) : void {
        // Make sure that player can not execute action if action is already being executed
        if (!this.isExecutingAction) {

            const maxKeypressTime = 2;
            if (this.attackKeyPressed < maxKeypressTime && this.attackKeyPressed > 0) {
                this.attackKeyPressed = maxKeypressTime;
                this.isExecutingAction = true;
                this.attack(opponent);
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