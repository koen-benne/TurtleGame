"use strict";
let pixelWidth = 2;
class Game {
    constructor() {
        this.setShieldScreen();
        this.gameLoop();
    }
    gameLoop() {
        this.currentScreen.update();
        requestAnimationFrame(() => this.gameLoop());
    }
    onStart() {
    }
    setShieldScreen() {
        document.body.innerHTML = "";
        this.currentScreen = new ShieldScreen(this);
    }
    setStartScreen() {
        document.body.innerHTML = "";
        this.currentScreen = new StartScreen(this);
    }
    setPlayScreen() {
        document.body.innerHTML = "";
        this.currentScreen = new PlayScreen(this);
    }
}
class PlayerController {
}
function toGrid(num) {
    return Math.round(num / pixelWidth) * pixelWidth;
}
class PlayScreen {
    constructor(g) {
    }
}
class ShieldScreen {
    constructor(g) {
        this.game = g;
        this.canvas = document.createElement("canvas");
        document.body.appendChild(this.canvas);
        this.canvas.id = "canvas";
        this.canvas.height = 450;
        this.canvas.width = 400;
        this.input = document.createElement("input");
        document.body.appendChild(this.input);
        this.input.type = "color";
        this.input.id = "colourinput";
        this.input.value = "#3d34a5";
        this.script = document.createElement("script");
        document.body.appendChild(this.script);
        this.script.src = "docs/js/shield.js";
        this.script.defer = true;
    }
}
class StartScreen {
    constructor(g) {
    }
}
//# sourceMappingURL=main.js.map