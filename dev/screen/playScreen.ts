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
        playerTwo.x = 80;

        this.playerOne = playerOne;
        this.playerTwo = playerTwo;
    }

    // Move player one and two
    private movePlayers() {
        const playerOne = this.playerOne;
        const playerTwo = this.playerTwo;
        // This specific method is necessary to not give one player an advantage (autism)
        playerOne.moveX(playerTwo);
        playerTwo.moveX(playerOne);

        let y1 = playerOne.getNewY();
        let y2 = playerTwo.getNewY();
        y1 = playerOne.formatY(y1, playerTwo, this.floorHeight);
        y2 = playerTwo.formatY(y2, playerOne, this.floorHeight);
        playerOne.y = y1;
        playerTwo.y = y2;
    }

    // Update the screen
    public update() {
        this.playerOne.calculateVelocity();
        this.playerTwo.calculateVelocity();
        this.playerOne.executePlayerAction();
        this.playerTwo.executePlayerAction();

        this.movePlayers()
    }
}