/// <reference path="screenBase.ts"/>
class PlayScreen extends ScreenBase {
    private playerOne : Player;
    private playerTwo : Player;

    constructor(g: Game) {
        super(g);

        // Set scene
        const floorHeight = toGrid(10).toString() + "vw";
        const floor = document.createElement("floor");
        floor.style.position = "absolute";
        floor.style.width = "100vw";
        floor.style.height = floorHeight;
        floor.style.bottom = "0"
        floor.style.backgroundColor = "green";
        document.body.appendChild(floor);

        // Create players
        const playerOne = <Player>document.createElement("player-element", {is: "player-element"});
        const playerTwo = <Player>document.createElement("player-element", {is: "player-element"});
        playerOne.init("KeyU", "KeyY", "KeyA", "KeyD", "player-one", "right");
        playerTwo.init("Numpad2", "Numpad1", "ArrowLeft", "ArrowRight", "player-two", "left");

        // Set start positions of players
        playerOne.style.bottom = floorHeight;
        playerTwo.style.bottom = floorHeight;
        playerOne.x = 10;
        playerTwo.x = 80;

        this.playerOne = playerOne;
        this.playerTwo = playerTwo;
    }

    async update() : Promise<any> {
        const movePromise1 = this.playerOne.movePlayer();
        const movePromise2 = this.playerTwo.movePlayer();

        this.playerOne.executePlayerAction();
        this.playerTwo.executePlayerAction();

        return await Promise.all([movePromise1, movePromise2]);
    }
}