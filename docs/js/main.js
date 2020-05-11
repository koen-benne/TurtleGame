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
const PIXEL_WIDTH = 2;
class Game {
    constructor() {
        this.playerOne = new Player();
        this.playerTwo = new Player();
        this.onStart();
        this.gameLoop();
    }
    gameLoop() {
        this.currentScene.update().then(() => requestAnimationFrame(() => this.gameLoop()));
    }
    onStart() {
        this.setPlayScreen();
    }
    setStartScreen() {
        document.body.innerHTML = "";
        this.currentScene = new StartScreen(this);
    }
    setPlayScreen() {
        document.body.innerHTML = "";
        this.currentScene = new PlayScreen(this);
    }
}
window.addEventListener("load", () => new Game());
class ScreenBase {
    constructor(g) {
        this.game = g;
    }
}
class PlayScreen extends ScreenBase {
    constructor(g) {
        super(g);
        const floorHeight = toGrid(10).toString() + "vw";
        const floor = document.createElement("floor");
        floor.style.position = "absolute";
        floor.style.width = "100vw";
        floor.style.height = floorHeight;
        floor.style.bottom = "0";
        floor.style.backgroundColor = "green";
        document.body.appendChild(floor);
        const playerOne = document.createElement("player-element", { is: "player-element" });
        const playerTwo = document.createElement("player-element", { is: "player-element" });
        playerOne.init("KeyU", "KeyY", "KeyA", "KeyD", "player-one", "right");
        playerTwo.init("Numpad2", "Numpad1", "ArrowLeft", "ArrowRight", "player-two", "left");
        playerOne.style.bottom = floorHeight;
        playerTwo.style.bottom = floorHeight;
        playerOne.x = 10;
        playerTwo.x = 80;
        this.playerOne = playerOne;
        this.playerTwo = playerTwo;
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            const movePromise1 = this.playerOne.movePlayer();
            const movePromise2 = this.playerTwo.movePlayer();
            this.playerOne.executePlayerAction();
            this.playerTwo.executePlayerAction();
            return yield Promise.all([movePromise1, movePromise2]);
        });
    }
}
class StartScreen extends ScreenBase {
    constructor(g) {
        super(g);
    }
    update() {
        return Promise.resolve(undefined);
    }
}
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
class Player extends HTMLElement {
    constructor() {
        super();
        this.isExecutingAction = false;
        this.attackKeyPressed = 0;
        this.defendKeyPressed = 0;
        this.leftPressed = false;
        this.rightPressed = false;
    }
    get x() {
        return this.realX;
    }
    set x(x) {
        const playerList = document.getElementsByTagName("player-element");
        const width = this.style.width;
        if (this.facingRight) {
            let lowestValue = 100;
            for (let i = 0; i < playerList.length; i++) {
                let currentPlayer = playerList[i];
                if (!currentPlayer.facingRight) {
                    let leftSide = currentPlayer.x;
                    if (leftSide < lowestValue) {
                        lowestValue = leftSide;
                    }
                }
            }
            if ((x + vwToNum(width)) > lowestValue) {
                x = lowestValue - vwToNum(width);
            }
        }
        else {
            let highestValue = 0;
            for (let i = 0; i < playerList.length; i++) {
                let currentPlayer = playerList[i];
                if (currentPlayer.facingRight) {
                    let rightSide = currentPlayer.x + vwToNum(currentPlayer.style.width);
                    if (rightSide > highestValue) {
                        highestValue = rightSide;
                    }
                }
            }
            if (x < highestValue) {
                x = highestValue;
            }
        }
        if ((100 - x - vwToNum(width)) < 0) {
            x = 100 - vwToNum(width);
        }
        else if (x < 0) {
            x = 0;
        }
        this.realX = x;
        x = toGrid(x);
        this.style.left = x.toString() + "vw";
    }
    get y() {
        return this.realY;
    }
    set y(y) {
        if (y < 0) {
            y = 0;
        }
        this.realY = y;
        y = toGrid(y);
        this.style.bottom = y.toString() + "vw";
    }
    init(attackKey, defendKey, leftKey, rightKey, id, facing) {
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
        style.width = "10vw";
        style.height = "20vw";
        style.backgroundColor = "red";
        this.attackKey = attackKey;
        this.defendKey = defendKey;
        this.leftKey = leftKey;
        this.rightKey = rightKey;
        document.addEventListener("keydown", (e) => this.keyDown(e));
        document.addEventListener("keyup", (e) => this.keyUp(e));
        document.body.appendChild(this);
    }
    keyUp(event) {
        switch (event.code) {
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
    keyDown(event) {
        switch (event.code) {
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
    attack() {
        return __awaiter(this, void 0, void 0, function* () {
            this.style.backgroundColor = "green";
            return yield wait(100).then(() => __awaiter(this, void 0, void 0, function* () {
                this.style.backgroundColor = "red";
                return yield wait(50);
            }));
        });
    }
    defend() {
        return __awaiter(this, void 0, void 0, function* () {
            this.style.backgroundColor = "yellow";
            return yield wait(100).then(() => __awaiter(this, void 0, void 0, function* () {
                this.style.backgroundColor = "red";
                return yield wait(50);
            }));
        });
    }
    executePlayerAction() {
        if (!this.isExecutingAction) {
            const maxKeypressTime = 2;
            if (this.attackKeyPressed < maxKeypressTime && this.attackKeyPressed > 0) {
                this.attackKeyPressed = maxKeypressTime;
                this.isExecutingAction = true;
                this.attack().then(() => {
                    this.isExecutingAction = false;
                });
            }
            else if (this.defendKeyPressed < maxKeypressTime && this.defendKeyPressed > 0) {
                this.defendKeyPressed = maxKeypressTime;
                this.isExecutingAction = true;
                this.defend().then(() => {
                    this.isExecutingAction = false;
                });
            }
            else {
                this.isExecutingAction = false;
            }
        }
    }
    movePlayer() {
        return __awaiter(this, void 0, void 0, function* () {
            let x = this.x;
            if (this.leftPressed) {
                x -= this.movementSpeed;
            }
            if (this.rightPressed) {
                x += this.movementSpeed;
            }
            if (this.x != x) {
                this.x = x;
            }
        });
    }
}
customElements.define('player-element', Player);
//# sourceMappingURL=main.js.map