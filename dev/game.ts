const PIXEL_WIDTH = 0.5;
const GRAVITY_PER_FRAME = 0.1;
let gameHeightInVw : number;
/// <reference path="player.ts"/>
class Game {
    // Set game variables
    public gameElement : HTMLElement;
    public currentScene : any;

    // Constructor
    constructor() {
        this.gameElement = document.createElement("game");
        const style = this.gameElement.style;
        style.width = "100vw";
        style.height = "50vw";
        style.backgroundColor = "black";
        style.position = "fixed";
        style.imageRendering = "pixelated";
        style.margin = "0";
        document.body.appendChild(this.gameElement);

        window.addEventListener("resize", () => this.setWindowHeight());
        this.setWindowHeight();

        this.onStart();
        this.gameLoop();
    }

    private gameLoop() {
        this.currentScene.update();
        requestAnimationFrame(() => this.gameLoop());
    }

    private onStart() {
        this.setPlayScreen();
    }

    public setStartScreen() {
        this.gameElement.innerHTML = "";
        this.currentScene = new StartScreen();
    }

    public setPlayScreen() {
        this.gameElement.innerHTML = "";
        this.currentScene = new PlayScreen(this.gameElement);
    }

    public setWindowHeight() {
        gameHeightInVw = Math.ceil(window.innerHeight / (window.innerWidth / 100) / PIXEL_WIDTH) * PIXEL_WIDTH;
        this.gameElement.style.height = gameHeightInVw.toString() + "vw"
    }

}

window.addEventListener("load", () => new Game());