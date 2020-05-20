"use strict";
const GRAVITY_PER_FRAME = 0.1;
const FRICTION = 0.4;
let gameHeightInVw;
class Game {
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
    gameLoop() {
        this.currentScene.update();
        requestAnimationFrame(() => this.gameLoop());
    }
    onStart() {
        this.setPlayerCreatorScreen();
    }
    setPlayerCreatorScreen() {
        this.gameElement.innerHTML = "";
        this.currentScene = new PlayerCreatorScreen(this.gameElement);
    }
    setStartScreen() {
        this.gameElement.innerHTML = "";
        this.currentScene = new StartScreen(this.gameElement);
    }
    setPlayScreen() {
        this.gameElement.innerHTML = "";
        this.currentScene = new PlayScreen(this.gameElement);
    }
    setWindowHeight() {
        gameHeightInVw = window.innerHeight / (window.innerWidth / 100);
        this.gameElement.style.height = gameHeightInVw.toString() + "vw";
    }
}
window.addEventListener("load", () => new Game());
class PlayerController {
}
class PlayScreen {
    constructor(game) {
    }
}
class PlayerCreatorScreen {
    constructor(game) {
        const background = document.createElement("background");
        const backgroundStyle = background.style;
        backgroundStyle.backgroundColor = "green";
        backgroundStyle.width = "100%";
        backgroundStyle.height = "100%";
        backgroundStyle.position = "absolute";
        game.appendChild(background);
    }
    update() {
    }
}
class StartScreen {
    constructor(g) {
    }
}
//# sourceMappingURL=main.js.map