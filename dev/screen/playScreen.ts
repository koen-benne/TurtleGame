/// <reference path="screenBase.ts"/>
class PlayScreen implements ScreenBase {
    private readonly playerOne : Player;
    private readonly playerTwo : Player;

    private readonly floorHeight : number;

    constructor(game: HTMLElement) {

        // Set floor height
        this.floorHeight = toGrid(6);

        //////////////////////////////// Set scene ////////////////////////////////
        // Set background
        const background = document.createElement("background");
        const backgroundStyle = background.style;
        backgroundStyle.backgroundImage = "url('docs/img/Blue-dummy-texture.png')";
        backgroundStyle.backgroundRepeat = "repeat";
        backgroundStyle.backgroundSize = (PIXEL_WIDTH * 2).toString() + "vw";
        backgroundStyle.width = "100%";
        backgroundStyle.height = "100%";
        backgroundStyle.position = "absolute";
        game.appendChild(background);

        // Set floor
        const floorHeight = this.floorHeight;
        const floor = document.createElement("floor");
        const floorStyle = floor.style;
        floorStyle.backgroundImage = "url('docs/img/Green-dummy-texture.png')";
        floorStyle.backgroundRepeat = "repeat";
        floorStyle.backgroundSize = (PIXEL_WIDTH * 2).toString() + "vw";
        floorStyle.position = "absolute";
        floorStyle.width = "100vw";
        floorStyle.height = floorHeight.toString() + "vw";
        floorStyle.bottom = "0"
        game.appendChild(floor);

        // Create players
        const playerOne = <Player>document.createElement("player-element", {is: "player-element"});
        const playerTwo = <Player>document.createElement("player-element", {is: "player-element"});
        playerOne.init("KeyU", "KeyY","KeyW", "KeyA", "KeyD", "player-one", "right", game);
        playerTwo.init("Numpad2", "Numpad1", "ArrowUp", "ArrowLeft", "ArrowRight", "player-two", "left", game);

        // Set start positions of players
        playerOne.y = floorHeight;
        playerTwo.y = floorHeight;
        playerOne.x = 10;
        playerTwo.x = 85;

        this.playerOne = playerOne;
        this.playerTwo = playerTwo;
    }

    // Move player one and two
    private movePlayers() {
        const playerOne = this.playerOne;
        const playerTwo = this.playerTwo;
        playerOne.calculateVelocity();
        playerTwo.calculateVelocity();

        const horizontalVelocity1 = this.formatHorizontalVelocity(playerOne, playerTwo);
        const horizontalVelocity2 = this.formatHorizontalVelocity(playerTwo, playerOne);
        const verticalVelocity1 = this.formatVerticalVelocity(playerOne, playerTwo);
        const verticalVelocity2 = this.formatVerticalVelocity(playerTwo, playerOne);

        playerOne.horizontalVelocity = horizontalVelocity1;
        playerTwo.horizontalVelocity = horizontalVelocity2;
        playerOne.verticalVelocity = verticalVelocity1;
        playerTwo.verticalVelocity = verticalVelocity2;

        playerOne.applyVelocity();
        playerTwo.applyVelocity();
    }

    public formatHorizontalVelocity(thisPlayer : Player, opponent : Player) : number {
        let thisPlayerVelocity : number = thisPlayer.horizontalVelocity;
        let opponentVelocity : number = opponent.horizontalVelocity;

        let isLeftPlayer : boolean;

        if (thisPlayer.id == 'player-one') {
            isLeftPlayer = (thisPlayer.x <= opponent.x);
        } else {
            isLeftPlayer = (thisPlayer.x < opponent.x);
        }

        const thisPlayerHeight = vwToNum(thisPlayer.style.height);
        const opponentHeight = vwToNum(opponent.style.height);
        const thisPlayerWidth = vwToNum(thisPlayer.style.width);
        const opponentWidth = vwToNum(opponent.style.width);

        if (thisPlayer.x + thisPlayerVelocity < 0) {
            thisPlayerVelocity = 0 - thisPlayer.x
        } else if (thisPlayer.x + thisPlayerWidth + thisPlayerVelocity > 100) {
            thisPlayerVelocity = 100 - thisPlayer.x - thisPlayerWidth
        }
        if (opponent.x + opponentVelocity < 0) {
            opponentVelocity = 0 - opponent.x
        } else if (opponent.x + opponentWidth + opponentVelocity > 100) {
            opponentVelocity = 100 - opponent.x - opponentWidth
        }

        if (thisPlayer.y + thisPlayerHeight > opponent.y && opponent.y + opponentHeight > thisPlayer.y) { // Only necessary if players are next to each other

            if (thisPlayer.x + thisPlayerWidth + thisPlayerVelocity > opponent.x + opponentVelocity &&
                opponent.x + opponentWidth + opponentVelocity > thisPlayer.x + thisPlayerVelocity) { // Prevents infinite number due to dividing by zero

                let distance : number;
                if (isLeftPlayer) {
                    distance = opponent.x - (thisPlayer.x + thisPlayerWidth);
                } else {
                    distance = (opponent.x + opponentWidth) - thisPlayer.x;
                }

                if (thisPlayerVelocity == opponentVelocity) {
                    if (isLeftPlayer) {
                        thisPlayerVelocity += distance / 2;
                        opponentVelocity += distance / 2;
                    } else {
                        thisPlayerVelocity += distance / 2;
                        opponentVelocity += distance / 2;
                    }
                } else {
                    thisPlayerVelocity = thisPlayerVelocity / (thisPlayerVelocity - opponentVelocity) * distance;
                }
            }
        }

        return thisPlayerVelocity;
    }

    public formatVerticalVelocity(thisPlayer : Player, opponent : Player) : number {
        let thisPlayerVelocity : number = thisPlayer.verticalVelocity;
        let opponentVelocity : number = opponent.verticalVelocity;

        const thisPlayerHeight = vwToNum(thisPlayer.style.height);
        const opponentHeight = vwToNum(opponent.style.height);
        const thisPlayerWidth = vwToNum(thisPlayer.style.width);
        const opponentWidth = vwToNum(opponent.style.width);

        thisPlayer.isOnGround = false;

        // Stop at floor
        if (thisPlayer.y + thisPlayerVelocity < this.floorHeight) {
            thisPlayer.isOnGround = true;
            thisPlayerVelocity = this.floorHeight - thisPlayer.y;
        } if (opponent.y + opponentVelocity < this.floorHeight) {
            opponentVelocity = this.floorHeight - opponent.y;
        }

        if (thisPlayer.x + thisPlayerWidth > opponent.x && opponent.x + opponentWidth > thisPlayer.x) {
            if (thisPlayer.y + thisPlayerVelocity < opponent.y + opponentHeight + opponentVelocity && thisPlayer.y > opponent.y) {
                if (opponent.isOnGround) {
                    thisPlayer.isOnGround = true;
                }
                thisPlayerVelocity = opponent.y + opponentHeight + (opponentVelocity * 1.01) - thisPlayer.y;
            }
        }

        return thisPlayerVelocity;
    }

    // Update the screen
    public update() {
        this.playerOne.executePlayerAction();
        this.playerTwo.executePlayerAction();

        this.movePlayers()
    }
}