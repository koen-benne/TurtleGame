/// <reference path="screenBase.ts"/>
class PlayScreen implements ScreenBase {
    private playerOne : Player;
    private playerTwo : Player;

    private floorHeight : number;

    constructor(game: HTMLElement) {

        // Set scene
        const background = document.createElement("background");
        background.style.backgroundImage = "url('docs/img/Blue-dummy-texture.png')";
        background.style.backgroundRepeat = "repeat";
        background.style.backgroundSize = (PIXEL_WIDTH * 2).toString() + "vw";
        background.style.width = "100%";
        background.style.height = "100%";
        background.style.position = "absolute";
        game.appendChild(background);

        this.floorHeight = toGrid(6);
        const floorHeight = this.floorHeight;
        const floor = document.createElement("floor");
        floor.style.backgroundImage = "url('docs/img/Green-dummy-texture.png')";
        floor.style.backgroundRepeat = "repeat";
        floor.style.backgroundSize = (PIXEL_WIDTH * 2).toString() + "vw";
        floor.style.position = "absolute";
        floor.style.width = "100vw";
        floor.style.height = floorHeight.toString() + "vw";
        floor.style.bottom = "0"
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

    public update() {
        this.playerOne.calculateVelocity();
        this.playerTwo.calculateVelocity();
        this.playerOne.executePlayerAction();
        this.playerTwo.executePlayerAction();

        this.movePlayers()
    }
}