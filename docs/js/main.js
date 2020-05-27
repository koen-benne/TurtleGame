"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const PIXEL_WIDTH = 0.5;
const GRAVITY_PER_FRAME = 0.1;
const FRICTION = 0.4;
let gameHeightInVw;
class Game {
    constructor() {
        this.gameElement = document.createElement("game");
        const style = this.gameElement.style;
        style.width = "100vw";
        style.height = "50vw";
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
        this.setShieldScreen();
    }
    setShieldScreen() {
        this.gameElement.innerHTML = "";
        this.currentScene = new ShieldScreen(this);
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
        this.movementSpeed = 0.3;
        this.jumpStrength = 1.8;
        this.isOnGround = false;
        this.horizontalVelocity = 0;
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
        this.horizontalVelocity -= FRICTION * this.horizontalVelocity;
        if (this.leftPressed) {
            this.horizontalVelocity += -this.movementSpeed;
        }
        if (this.rightPressed) {
            this.horizontalVelocity += this.movementSpeed;
        }
        if ((this.horizontalVelocity < 0.01 && this.horizontalVelocity > 0) || (this.horizontalVelocity > -0.01 && this.horizontalVelocity < 0)) {
            this.horizontalVelocity = 0;
        }
        this.verticalVelocity -= GRAVITY_PER_FRAME;
        if (this.upPressed && this.isOnGround) {
            this.isOnGround = false;
            this.verticalVelocity = this.jumpStrength;
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
    applyVelocity() {
        this.x += this.horizontalVelocity;
        this.y += this.verticalVelocity;
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
        this.floorHeight = toGrid(6);
        const background = document.createElement("background");
        const backgroundStyle = background.style;
        backgroundStyle.backgroundImage = "url('docs/img/Blue-dummy-texture.png')";
        backgroundStyle.backgroundRepeat = "repeat";
        backgroundStyle.backgroundSize = (PIXEL_WIDTH * 2).toString() + "vw";
        backgroundStyle.width = "100%";
        backgroundStyle.height = "100%";
        backgroundStyle.position = "absolute";
        game.appendChild(background);
        const floorHeight = this.floorHeight;
        const floor = document.createElement("floor");
        const floorStyle = floor.style;
        floorStyle.backgroundImage = "url('docs/img/Green-dummy-texture.png')";
        floorStyle.backgroundRepeat = "repeat";
        floorStyle.backgroundSize = (PIXEL_WIDTH * 2).toString() + "vw";
        floorStyle.position = "absolute";
        floorStyle.width = "100vw";
        floorStyle.height = floorHeight.toString() + "vw";
        floorStyle.bottom = "0";
        game.appendChild(floor);
        const playerOne = document.createElement("player-element", { is: "player-element" });
        const playerTwo = document.createElement("player-element", { is: "player-element" });
        playerOne.init("KeyU", "KeyY", "KeyW", "KeyA", "KeyD", "player-one", "right", game);
        playerTwo.init("Numpad2", "Numpad1", "ArrowUp", "ArrowLeft", "ArrowRight", "player-two", "left", game);
        playerOne.y = floorHeight;
        playerTwo.y = floorHeight;
        playerOne.x = 10;
        playerTwo.x = 85;
        this.playerOne = playerOne;
        this.playerTwo = playerTwo;
    }
    movePlayers() {
        const playerOne = this.playerOne;
        const playerTwo = this.playerTwo;
        playerOne.calculateVelocity();
        playerTwo.calculateVelocity();
        const horizontalVelocity1 = this.formatHorizontalVelocity(playerOne, playerTwo);
        const horizontalVelocity2 = this.formatHorizontalVelocity(playerTwo, playerOne);
        const verticalVelocity1 = this.formatVerticalVelocity(playerOne, playerTwo);
        const verticalVelocity2 = this.formatVerticalVelocity(playerTwo, playerOne);
        playerOne.horizontalVelocity = horizontalVelocity1;
        playerTwo.horizontalVelocity = horizontalVelocity2;
        playerOne.verticalVelocity = verticalVelocity1;
        playerTwo.verticalVelocity = verticalVelocity2;
        playerOne.applyVelocity();
        playerTwo.applyVelocity();
    }
    formatHorizontalVelocity(thisPlayer, opponent) {
        let thisPlayerVelocity = thisPlayer.horizontalVelocity;
        let opponentVelocity = opponent.horizontalVelocity;
        let isLeftPlayer;
        if (thisPlayer.id == 'player-one') {
            isLeftPlayer = (thisPlayer.x <= opponent.x);
        }
        else {
            isLeftPlayer = (thisPlayer.x < opponent.x);
        }
        const thisPlayerHeight = vwToNum(thisPlayer.style.height);
        const opponentHeight = vwToNum(opponent.style.height);
        const thisPlayerWidth = vwToNum(thisPlayer.style.width);
        const opponentWidth = vwToNum(opponent.style.width);
        if (thisPlayer.x + thisPlayerVelocity < 0) {
            thisPlayerVelocity = 0 - thisPlayer.x;
        }
        else if (thisPlayer.x + thisPlayerWidth + thisPlayerVelocity > 100) {
            thisPlayerVelocity = 100 - thisPlayer.x - thisPlayerWidth;
        }
        if (opponent.x + opponentVelocity < 0) {
            opponentVelocity = 0 - opponent.x;
        }
        else if (opponent.x + opponentWidth + opponentVelocity > 100) {
            opponentVelocity = 100 - opponent.x - opponentWidth;
        }
        if (thisPlayer.y + thisPlayerHeight > opponent.y && opponent.y + opponentHeight > thisPlayer.y) {
            if (thisPlayer.x + thisPlayerWidth + thisPlayerVelocity > opponent.x + opponentVelocity &&
                opponent.x + opponentWidth + opponentVelocity > thisPlayer.x + thisPlayerVelocity) {
                let distance;
                if (isLeftPlayer) {
                    distance = opponent.x - (thisPlayer.x + thisPlayerWidth);
                }
                else {
                    distance = (opponent.x + opponentWidth) - thisPlayer.x;
                }
                if (thisPlayerVelocity == opponentVelocity) {
                    if (isLeftPlayer) {
                        thisPlayerVelocity += distance / 2;
                        opponentVelocity += distance / 2;
                    }
                    else {
                        thisPlayerVelocity += distance / 2;
                        opponentVelocity += distance / 2;
                    }
                }
                else {
                    thisPlayerVelocity = thisPlayerVelocity / (thisPlayerVelocity - opponentVelocity) * distance;
                }
            }
        }
        return thisPlayerVelocity;
    }
    formatVerticalVelocity(thisPlayer, opponent) {
        let thisPlayerVelocity = thisPlayer.verticalVelocity;
        let opponentVelocity = opponent.verticalVelocity;
        const thisPlayerHeight = vwToNum(thisPlayer.style.height);
        const opponentHeight = vwToNum(opponent.style.height);
        const thisPlayerWidth = vwToNum(thisPlayer.style.width);
        const opponentWidth = vwToNum(opponent.style.width);
        thisPlayer.isOnGround = false;
        if (thisPlayer.y + thisPlayerVelocity < this.floorHeight) {
            thisPlayer.isOnGround = true;
            thisPlayerVelocity = this.floorHeight - thisPlayer.y;
        }
        if (opponent.y + opponentVelocity < this.floorHeight) {
            opponentVelocity = this.floorHeight - opponent.y;
        }
        if (thisPlayer.x + thisPlayerWidth > opponent.x && opponent.x + opponentWidth > thisPlayer.x) {
            if (thisPlayer.y + thisPlayerVelocity < opponent.y + opponentHeight + opponentVelocity && thisPlayer.y > opponent.y) {
                if (opponent.isOnGround) {
                    thisPlayer.isOnGround = true;
                }
                thisPlayerVelocity = opponent.y + opponentHeight + (opponentVelocity * 1.01) - thisPlayer.y;
            }
        }
        return thisPlayerVelocity;
    }
    update() {
        this.playerOne.executePlayerAction();
        this.playerTwo.executePlayerAction();
        this.movePlayers();
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
        this.color = document.createElement("input");
        document.body.appendChild(this.color);
        this.color.type = "color";
        this.color.id = "colourInput";
        this.color.value = "#3d34a5";
        this.width = document.createElement("input");
        document.body.appendChild(this.width);
        this.width.type = "number";
        this.width.id = "brushWidth";
        this.width.value = "25";
        this.script = document.createElement("script");
        document.body.appendChild(this.script);
        this.script.src = "docs/js/shield.js";
        this.script.defer = true;
    }
}
class StartScreen {
    constructor() {
    }
    update() {
    }
}
//# sourceMappingURL=main.js.map