class Player extends HTMLElement {
    private realX : number;
    private realY : number;
    private facingRight : boolean;

    isExecutingAction : boolean = false;

    private movementSpeed : number;

    private attackKey : string;
    private defendKey : string;
    private leftKey : string;
    private rightKey : string;

    public attackKeyPressed : number = 0;
    public defendKeyPressed : number = 0;
    public leftPressed : boolean = false;
    public rightPressed : boolean = false;


    constructor() {
        super();
    }


    /////////////////////////////////////////// X and Y setters and getters ////////////////////////////////////////////
    get x() : number {
        return this.realX;
    }

    set x(x) {
        // Collision detection
        const playerList = document.getElementsByTagName("player-element");
        const width = this.style.width;
        if(this.facingRight) {
            // So that right facing character cannot pass through left facing character
            let lowestValue = 100;
            for (let i = 0; i < playerList.length; i++) {
                let currentPlayer = <Player>playerList[i];
                if(!currentPlayer.facingRight) {
                    let leftSide = currentPlayer.x;
                    if (leftSide < lowestValue) {
                        lowestValue = leftSide;
                    }
                }
            }
            if ((x + vwToNum(width)) > lowestValue) {
                x = lowestValue - vwToNum(width);
            }
        } else {
            // So that left facing character cannot pass through right facing character
            let highestValue = 0;
            for (let i = 0; i < playerList.length; i++) {
                let currentPlayer = (<Player>playerList[i]);
                if(currentPlayer.facingRight) {
                    let rightSide = currentPlayer.x + vwToNum(currentPlayer.style.width);
                    if (rightSide > highestValue) {
                        highestValue = rightSide;
                    }
                }
            }
            if (x < highestValue) {
                x = highestValue;
            }
        }

        // Make sure the player never goes off screen
        if((100 - x - vwToNum(width)) < 0) {
            x = 100 - vwToNum(width);
        } else if(x < 0) {
            x = 0;
        }
        this.realX = x;
        // Put x in the grid
        x = toGrid(x);
        this.style.left = x.toString() + "vw";
    }

    get y() : number {
        return this.realY;
    }

    set y(y) {
        // Make sure the player never goes off screen downward
        if(y < 0) {
            y = 0;
        }
        this.realY = y;
        // Put y in the grid
        y = toGrid(y);
        this.style.bottom = y.toString() + "vw";
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    public init(attackKey : string, defendKey : string, leftKey : string, rightKey : string, id : string, facing : string) {
        if(facing === "right") {
            this.facingRight = true;
        } else if(facing === "left") {
            this.facingRight = false;
        } else {
            // Throw custom error if facing is incorrect
            throw "exeption: the parameter 'facing' in Player.init sould be either 'right' or 'left'."
        }

        this.id = id;

        this.movementSpeed = 0.8;

        const style = this.style;
        style.position = "absolute";
        style.width = "10vw";
        style.height = "20vw";
        style.backgroundColor = "red";

        this.attackKey = attackKey;
        this.defendKey = defendKey;
        this.leftKey = leftKey;
        this.rightKey = rightKey;

        document.addEventListener("keydown", (e) => this.keyDown(e));
        document.addEventListener("keyup", (e) => this.keyUp(e));

        // Create player
        document.body.appendChild(this);
    }

    private keyUp(event : KeyboardEvent) {
        switch (event.code) {
            case this.rightKey: {
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

    private keyDown(event : KeyboardEvent) {
        switch (event.code) {
            case this.rightKey: {
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


    private async attack() {
        this.style.backgroundColor = "green";

        return await wait(100).then(async () => {
            this.style.backgroundColor = "red";
            return await wait(50);
        });
    }

    private async defend() {
        this.style.backgroundColor = "yellow";

        return await wait(100).then(async () => {
            this.style.backgroundColor = "red";
            return await wait(50);
        });
    }


    public executePlayerAction() {
        // Make sure that player can not execute action if action is already being executed
        if (!this.isExecutingAction) {

            const maxKeypressTime = 2;
            if (this.attackKeyPressed < maxKeypressTime && this.attackKeyPressed > 0) {
                this.attackKeyPressed = maxKeypressTime;
                this.isExecutingAction = true;
                this.attack().then(() => {
                    this.isExecutingAction = false;
                });
            } else if (this.defendKeyPressed < maxKeypressTime && this.defendKeyPressed > 0) {
                this.defendKeyPressed = maxKeypressTime;
                this.isExecutingAction = true;
                this.defend().then(() => {
                    this.isExecutingAction = false;
                });
            } else {
                this.isExecutingAction = false
            }
        }
    }


    public async movePlayer() {
        let x = this.x;
        if(this.leftPressed) {
            x -= this.movementSpeed;
        }
        if(this.rightPressed) {
            x += this.movementSpeed;
        }
        if(this.x != x) {
            this.x = x;
        }
    }
}
// @ts-ignore
customElements.define('player-element', Player); // Custom element name MUST contain a hyphen!!!


