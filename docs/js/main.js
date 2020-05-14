"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const PIXEL_WIDTH = 0.5;
const GRAVITY_PER_FRAME = 0.1;
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
        this.setPlayScreen();
    }
    setStartScreen() {
        this.gameElement.innerHTML = "";
        this.currentScene = new StartScreen();
    }
    setPlayScreen() {
        this.gameElement.innerHTML = "";
        this.currentScene = new PlayScreen(this.gameElement);
    }
    setWindowHeight() {
        gameHeightInVw = Math.ceil(window.innerHeight / (window.innerWidth / 100) / PIXEL_WIDTH) * PIXEL_WIDTH;
        this.gameElement.style.height = gameHeightInVw.toString() + "vw";
    }
}
window.addEventListener("load", () => new Game());
class Player extends HTMLElement {
    constructor() {
        super();
        this.isExecutingAction = false;
        this.isOnSurface = false;
        this.jumpStrength = 1.8;
        this.verticalVelocity = 0;
        this.attackKeyPressed = 0;
        this.defendKeyPressed = 0;
        this.upPressed = false;
        this.leftPressed = false;
        this.rightPressed = false;
    }
    init(attackKey, defendKey, upKey, leftKey, rightKey, id, facing, game) {
        if (facing === "right") {
            this.facingRight = true;
        }
        else if (facing === "left") {
            this.facingRight = false;
        }
        else {
            throw "exeption: the parameter 'facing' in Player.init sould be either 'right' or 'left'.";
        }
        this.id = id;
        this.movementSpeed = 0.8;
        const style = this.style;
        style.position = "absolute";
        style.width = "5vw";
        style.height = "10vw";
        style.backgroundImage = "url('docs/img/Red-dummy-texture.png')";
        style.backgroundRepeat = "repeat";
        style.backgroundSize = (PIXEL_WIDTH * 2).toString() + "vw";
        this.attackKey = attackKey;
        this.defendKey = defendKey;
        this.upKey = upKey;
        this.leftKey = leftKey;
        this.rightKey = rightKey;
        document.addEventListener("keydown", (e) => this.keyDown(e));
        document.addEventListener("keyup", (e) => this.keyUp(e));
        game.appendChild(this);
    }
    get x() {
        return this.realX;
    }
    set x(x) {
        this.realX = x;
        x = toGrid(x);
        this.style.left = x.toString() + "vw";
    }
    get y() {
        return this.realY;
    }
    set y(y) {
        this.realY = y;
        y = toGrid(y);
        this.style.bottom = y.toString() + "vw";
    }
    keyDown(event) {
        switch (event.code) {
            case this.upKey: {
                this.upPressed = true;
                break;
            }
            case this.rightKey: {
                this.rightPressed = true;
                break;
            }
            case this.leftKey: {
                this.leftPressed = true;
                break;
            }
            case this.attackKey: {
                this.attackKeyPressed += 1;
                break;
            }
            case this.defendKey: {
                this.defendKeyPressed += 1;
                break;
            }
        }
    }
    keyUp(event) {
        switch (event.code) {
            case this.upKey: {
                this.upPressed = false;
                break;
            }
            case this.rightKey: {
                this.rightPressed = false;
                break;
            }
            case this.leftKey: {
                this.leftPressed = false;
                break;
            }
            case this.attackKey: {
                this.attackKeyPressed = 0;
                break;
            }
            case this.defendKey: {
                this.defendKeyPressed = 0;
                break;
            }
        }
    }
    attack() {
        return __awaiter(this, void 0, void 0, function* () {
            this.style.backgroundImage = "url('docs/img/Green-dummy-texture.png')";
            yield wait(100);
            this.style.backgroundImage = "url('docs/img/Red-dummy-texture.png')";
            yield wait(50);
            this.isExecutingAction = false;
        });
    }
    defend() {
        return __awaiter(this, void 0, void 0, function* () {
            this.style.backgroundImage = "url('docs/img/Green-dummy-texture.png')";
            yield wait(100);
            this.style.backgroundImage = "url('docs/img/Red-dummy-texture.png')";
            yield wait(50);
            this.isExecutingAction = false;
        });
    }
    calculateVelocity() {
        if (!this.isOnSurface) {
            this.verticalVelocity -= GRAVITY_PER_FRAME;
        }
        else if (this.upPressed) {
            this.verticalVelocity = this.jumpStrength;
            this.isOnSurface = false;
        }
        else {
            this.verticalVelocity = 0;
        }
    }
    executePlayerAction() {
        if (!this.isExecutingAction) {
            const maxKeypressTime = 2;
            if (this.attackKeyPressed < maxKeypressTime && this.attackKeyPressed > 0) {
                this.attackKeyPressed = maxKeypressTime;
                this.isExecutingAction = true;
                this.attack();
            }
            else if (this.defendKeyPressed < maxKeypressTime && this.defendKeyPressed > 0) {
                this.defendKeyPressed = maxKeypressTime;
                this.isExecutingAction = true;
                this.defend();
            }
            else {
                this.isExecutingAction = false;
            }
        }
    }
    formatX(x, opponent) {
        const width = vwToNum(this.style.width);
        const opponentWidth = vwToNum(opponent.style.width);
        const height = vwToNum(this.style.height);
        if (!(opponent.y - this.y >= height) && !(this.y - opponent.y >= vwToNum(opponent.style.height)) &&
            !(this.y - opponent.y - vwToNum(opponent.style.height) >= this.verticalVelocity - opponent.verticalVelocity) &&
            !(opponent.y - this.y - height >= opponent.verticalVelocity - this.verticalVelocity)) {
            if (opponent.x + opponentWidth > x && opponent.x <= x) {
                x = opponent.x + opponentWidth;
            }
            else if (x + width > opponent.x && x <= opponent.x) {
                x = opponent.x - width;
            }
        }
        if ((100 - x - width) < 0) {
            x = 100 - width;
        }
        else if (x < 0) {
            x = 0;
        }
        return x;
    }
    formatY(y, opponent, floorHeight) {
        const width = vwToNum(this.style.width);
        const opponentHeight = opponent.style.height;
        const height = vwToNum(this.style.height);
        this.isOnSurface = false;
        if (!(opponent.x - this.x >= width) && !(this.x - opponent.x >= vwToNum(opponent.style.width))) {
            if (opponent.y + vwToNum(opponentHeight) > y && opponent.y < y) {
                if (opponent.isOnSurface) {
                    this.isOnSurface = true;
                }
                y = opponent.y + vwToNum(opponentHeight);
            }
            else if (y + height > opponent.y && y <= opponent.y) {
                opponent.isOnSurface = false;
                this.verticalVelocity /= 2;
                opponent.verticalVelocity = this.verticalVelocity;
                y = (this.y - y) / 2 + this.y;
            }
        }
        if (y <= floorHeight) {
            y = floorHeight;
            this.isOnSurface = true;
        }
        else if (y + height >= gameHeightInVw) {
            this.verticalVelocity = 0;
            y = gameHeightInVw - height;
        }
        return y;
    }
    moveX(opponent) {
        let x = this.x;
        if (this.leftPressed) {
            x -= this.movementSpeed;
        }
        if (this.rightPressed) {
            x += this.movementSpeed;
        }
        if (this.x != x) {
            this.x = this.formatX(x, opponent);
        }
    }
    getNewY() {
        return this.y + this.verticalVelocity;
    }
}
customElements.define('player-element', Player);
function wait(time) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}
function vwToNum(vw) {
    return parseFloat(vw.slice(0, vw.length - 2));
}
function toGrid(num) {
    return Math.round(num / PIXEL_WIDTH) * PIXEL_WIDTH;
}
class PlayScreen {
    constructor(game) {
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
        floor.style.bottom = "0";
        game.appendChild(floor);
        const playerOne = document.createElement("player-element", { is: "player-element" });
        const playerTwo = document.createElement("player-element", { is: "player-element" });
        playerOne.init("KeyU", "KeyY", "KeyW", "KeyA", "KeyD", "player-one", "right", game);
        playerTwo.init("Numpad2", "Numpad1", "ArrowUp", "ArrowLeft", "ArrowRight", "player-two", "left", game);
        playerOne.y = floorHeight;
        playerTwo.y = floorHeight;
        playerOne.x = 10;
        playerTwo.x = 80;
        this.playerOne = playerOne;
        this.playerTwo = playerTwo;
    }
    movePlayers() {
        const playerOne = this.playerOne;
        const playerTwo = this.playerTwo;
        playerOne.moveX(playerTwo);
        playerTwo.moveX(playerOne);
        let y1 = playerOne.getNewY();
        let y2 = playerTwo.getNewY();
        y1 = playerOne.formatY(y1, playerTwo, this.floorHeight);
        y2 = playerTwo.formatY(y2, playerOne, this.floorHeight);
        playerOne.y = y1;
        playerTwo.y = y2;
    }
    update() {
        this.playerOne.calculateVelocity();
        this.playerTwo.calculateVelocity();
        this.playerOne.executePlayerAction();
        this.playerTwo.executePlayerAction();
        this.movePlayers();
    }
}
class StartScreen {
    constructor() {
    }
    update() {
    }
}
//# sourceMappingURL=main.js.map