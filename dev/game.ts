const GRAVITY_PER_FRAME = 0.1;
const FRICTION = 0.4;
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
        style.margin = "0";
        style.position = "fixed";
        document.body.appendChild(this.gameElement);

        window.addEventListener("resize", () => this.setWindowHeight());
        this.setWindowHeight();

        this.setStartScreen();
    }

    public gameLoop() {
        this.currentScene.update();

        requestAnimationFrame(() => this.gameLoop());
    }

    public start() {
        this.setPlayScreen();
        this.gameLoop();
    }

    public setShieldScreen(){
        this.gameElement.innerHTML = "";
        this.currentScene = new ShieldScreen(this);
    }

    public setStartScreen() {
        this.gameElement.innerHTML = "";
        this.currentScene = new StartScreen(this);
    }

    public setPlayScreen() {
        this.gameElement.innerHTML = "";
        this.currentScene = new PlayScreen(this);
    }

    public setWindowHeight() {
        gameHeightInVw = window.innerHeight / (window.innerWidth / 100);
        this.gameElement.style.height = gameHeightInVw.toString() + "vw"
    }

}

window.addEventListener("load", () => new Game());