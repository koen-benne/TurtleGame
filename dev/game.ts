let pixelWidth = 2;
/// <reference path="player.ts"/>
class Game {
    public playerOne : Player = new Player();
    public playerTwo : Player = new Player();
    // Set game variables
    public currentScene : any;

    // Constructor
    constructor() {
        this.onStart();
        this.gameLoop();
    }

    private gameLoop() {
        this.currentScene.update().then(
            () => requestAnimationFrame(() => this.gameLoop())
        );
    }

    private onStart() {
        this.setPlayScreen();
    }

    public setStartScreen() {
        document.body.innerHTML = "";
        this.currentScene = new StartScreen(this);
    }

    public setPlayScreen() {
        document.body.innerHTML = "";
        this.currentScene = new PlayScreen(this);
    }
}
window.addEventListener("load", () => new Game());
