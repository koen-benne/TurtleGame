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
class CollisionDetection {
    static collide(playerOne, playerTwo, screen) {
        let currentHitboxOne = playerOne.hitbox.getCurrentHitbox(Vector2.add(playerOne.position, playerOne.velocity));
        let currentHitboxTwo = playerTwo.hitbox.getCurrentHitbox(Vector2.add(playerTwo.position, playerTwo.velocity));
        let overlapX = Math.min(currentHitboxOne.maxX, currentHitboxTwo.maxX) - Math.max(currentHitboxOne.minX, currentHitboxTwo.minX);
        let overlapY = Math.min(currentHitboxOne.maxY, currentHitboxTwo.maxY) - Math.max(currentHitboxOne.minY, currentHitboxTwo.minY);
        if (overlapX > 0 && overlapY > 0) {
            let overlap = Math.min(overlapX, overlapY);
            let normal;
            if (overlap == overlapX) {
                normal = new Vector2(1, 0);
            }
            else {
                if (playerOne.newPosition.y < playerTwo.newPosition.y) {
                    normal = new Vector2(0, 1);
                }
                else {
                    normal = new Vector2(0, -1);
                }
            }
            if (currentHitboxOne instanceof ConvexHitbox || currentHitboxTwo instanceof ConvexHitbox) {
                const uniqueNormals = [];
                for (let i = 0; i < 2; i++) {
                    let currentHitbox;
                    if (i === 1)
                        currentHitbox = currentHitboxOne;
                    else
                        currentHitbox = currentHitboxTwo;
                    if (currentHitbox instanceof ConvexHitbox) {
                        for (let i = 0; currentHitboxOne.vectorAmount > i; i++) {
                            const currentNormal = currentHitbox.getNormal(i);
                            if (uniqueNormals.indexOf(currentNormal) === -1 &&
                                currentNormal !== Infinity && currentNormal !== -Infinity && currentNormal !== 0) {
                                uniqueNormals.push(currentNormal);
                            }
                        }
                    }
                }
                for (let n = 0; n < uniqueNormals.length; n++) {
                    let minHb1 = Infinity;
                    let maxHb1 = -Infinity;
                    for (let v = 0; v < currentHitboxOne.vectorAmount; v++) {
                        const current = (currentHitboxOne.vectors[v].x + currentHitboxOne.vectors[v].y * uniqueNormals[n]);
                        minHb1 = Math.min(minHb1, current);
                        maxHb1 = Math.max(maxHb1, current);
                    }
                    let minHb2 = Infinity;
                    let maxHb2 = -Infinity;
                    for (let v = 0; v < currentHitboxTwo.vectorAmount; v++) {
                        const current = (currentHitboxTwo.vectors[v].x + currentHitboxTwo.vectors[v].y * uniqueNormals[n]);
                        minHb2 = Math.min(minHb2, current);
                        maxHb2 = Math.max(maxHb2, current);
                    }
                    const currentOverlap = Math.min(maxHb1, maxHb2) - Math.max(minHb1, minHb2);
                    if (currentOverlap <= 0) {
                        return;
                    }
                    if (currentOverlap < overlap) {
                        overlap = currentOverlap;
                        normal = new Vector2(1, uniqueNormals[n]);
                    }
                }
            }
            if (currentHitboxOne.minX > currentHitboxTwo.minX && normal.x != 0) {
                normal.x *= -1;
                normal.y *= -1;
            }
            else if (normal.y == 1) {
                playerTwo.isOnGround = true;
            }
            else if (normal.y == -1) {
                playerOne.isOnGround = true;
            }
            const s = Math.sqrt(1 + normal.y * normal.y);
            const x = (overlap * normal.x / s) / 2;
            const y = (overlap * normal.y / s) / 2;
            const addVelocityOne = new Vector2(-x, -y);
            const addVelocityTwo = new Vector2(x, y);
            currentHitboxOne = currentHitboxOne.getCurrentHitbox(addVelocityOne);
            currentHitboxTwo = currentHitboxTwo.getCurrentHitbox(addVelocityTwo);
            let overBorder = Math.min(currentHitboxOne.minX, currentHitboxTwo.minX);
            if (overBorder < 0) {
                addVelocityOne.x -= overBorder;
                addVelocityTwo.x -= overBorder;
            }
            else {
                overBorder = Math.max(currentHitboxOne.maxX, currentHitboxTwo.maxX) - 100;
                if (overBorder > 0) {
                    addVelocityOne.x -= overBorder;
                    addVelocityTwo.x -= overBorder;
                }
            }
            overBorder = Math.min(currentHitboxOne.minY, currentHitboxTwo.minY) - screen.floorHeight;
            if (overBorder < 0) {
                addVelocityOne.y -= overBorder;
                addVelocityTwo.y -= overBorder;
            }
            else {
                overBorder = Math.max(currentHitboxOne.maxY, currentHitboxTwo.maxY) - gameHeightInVw;
                if (overBorder > 0) {
                    addVelocityOne.y -= overBorder;
                    addVelocityTwo.y -= overBorder;
                }
            }
            playerOne.velocity.add(addVelocityOne);
            playerTwo.velocity.add(addVelocityTwo);
        }
        else {
            if (currentHitboxOne.minY > screen.floorHeight) {
                playerOne.isOnGround = false;
            }
            if (currentHitboxTwo.minY > screen.floorHeight) {
                playerTwo.isOnGround = false;
            }
        }
    }
    static isCollidingAABB(hitbox1, hitbox2) {
        if (hitbox1.maxX > hitbox2.minX && hitbox2.maxX > hitbox1.minX && hitbox1.maxY > hitbox2.minY && hitbox2.maxY > hitbox1.minY) {
            return true;
        }
        else {
            return false;
        }
    }
}
const GRAVITY_PER_FRAME = 0.1;
const FRICTION = 0.4;
let gameHeightInVw;
class Game {
    constructor() {
        this.gameElement = document.createElement("game");
        const style = this.gameElement.style;
        style.width = "100vw";
        style.height = "50vw";
        style.position = "fixed";
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
        gameHeightInVw = window.innerHeight / (window.innerWidth / 100);
        this.gameElement.style.height = gameHeightInVw.toString() + "vw";
    }
}
window.addEventListener("load", () => new Game());
class Player extends HTMLElement {
    constructor() {
        super();
        this.position = new Vector2(0, 0);
        this.isExecutingAction = false;
        this.movementSpeed = 0.3;
        this.jumpStrength = 2.2;
        this.isOnGround = false;
        this.isWalking = false;
        this.velocity = new Vector2(0, 0);
        this.attackKeyPressed = 0;
        this.defendKeyPressed = 0;
        this.upPressed = false;
        this.leftPressed = false;
        this.rightPressed = false;
    }
    get newPosition() {
        return Vector2.add(this.position, this.velocity);
    }
    init(maxHealth, attackKey, defendKey, upKey, leftKey, rightKey, id, facing, healthBarSide, game) {
        this.maxHealth = maxHealth;
        this.health = maxHealth;
        if (facing === "right") {
            this.facingRight = true;
        }
        else if (facing === "left") {
            this.facingRight = false;
        }
        else {
            throw "exeption: the parameter 'facing' in Player.init should be either 'right' or 'left'.";
        }
        this.healthBar = new HealthBar(healthBarSide, game);
        this.id = id;
        this.hitbox = new ConvexHitbox(false, [
            new Vector2(2, 0),
            new Vector2(0, 4),
            new Vector2(0, 10.4),
            new Vector2(2, 14.9),
            new Vector2(6.5, 14.9),
            new Vector2(8.5, 10.4),
            new Vector2(8.5, 4),
            new Vector2(6.5, 0),
        ], this);
        this.width = this.hitbox.maxX + this.hitbox.minX;
        this.height = this.hitbox.maxY + this.hitbox.minY;
        const style = this.style;
        style.position = "absolute";
        this.image = document.createElement("div");
        this.appendChild(this.image);
        const imageStyle = this.image.style;
        this.body = "1";
        preloadImages([
            "docs/img/turtle/" + this.body + "/Default.png",
            "docs/img/turtle/" + this.body + "/Jumping1.png",
            "docs/img/turtle/" + this.body + "/Jumping2.png",
            "docs/img/turtle/" + this.body + "/Jumping3.png",
            "docs/img/turtle/" + this.body + "/Jumping4.png",
            "docs/img/turtle/" + this.body + "/Walking1.png",
            "docs/img/turtle/" + this.body + "/Walking2.png",
            "docs/img/turtle/" + this.body + "/Walking3.png",
            "docs/img/turtle/" + this.body + "/Walking4.png",
            "docs/img/turtle/" + this.body + "/Walking5.png",
            "docs/img/turtle/" + this.body + "/Walking6.png",
        ]);
        imageStyle.backgroundImage = "url('docs/img/turtle/" + this.body + "/Default.png')";
        imageStyle.backgroundRepeat = "no-repeat";
        const playerHeight = 19.5;
        imageStyle.width = (playerHeight * 1.14).toString() + "vw ";
        imageStyle.height = playerHeight.toString() + "vw";
        imageStyle.backgroundSize = "100% 100%";
        imageStyle.position = "absolute";
        imageStyle.left = "-7.27vw";
        imageStyle.top = "-2.87vw";
        this.attackKey = attackKey;
        this.defendKey = defendKey;
        this.upKey = upKey;
        this.leftKey = leftKey;
        this.rightKey = rightKey;
        document.addEventListener("keydown", (e) => this.keyDown(e));
        document.addEventListener("keyup", (e) => this.keyUp(e));
        game.appendChild(this);
    }
    get height() {
        return vwToNum(this.style.height);
    }
    set height(height) {
        this.style.height = height.toString() + "vw";
    }
    get width() {
        return vwToNum(this.style.width);
    }
    set width(width) {
        this.style.width = width.toString() + "vw";
    }
    render() {
        this.style.left = this.position.x.toString() + "vw";
        this.style.bottom = this.position.y.toString() + "vw";
        this.hitbox.flip(this.facingRight);
        if (this.facingRight) {
            this.style.transform = "scaleX(1)";
        }
        else {
            this.style.transform = "scaleX(-1)";
        }
        this.hitbox.display();
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
    damage(amount, knockBack, opponent) {
        return __awaiter(this, void 0, void 0, function* () {
            this.isExecutingAction = true;
            this.health -= amount;
            if (opponent.position.x <= this.position.x) {
                this.velocity.x += knockBack;
            }
            else {
                this.velocity.x -= knockBack;
            }
            yield wait(130);
            this.isExecutingAction = false;
            this.healthBar.health = this.health;
        });
    }
    attack(opponent) {
        return __awaiter(this, void 0, void 0, function* () {
            this.image.style.backgroundImage = "url('docs/img/Green-dummy-texture.png')";
            let attackHitbox;
            const reach = 5;
            const hitbox = this.hitbox;
            if (this.facingRight) {
                attackHitbox = new AabbHitbox(false, new Vector2(hitbox.maxX, hitbox.minY), new Vector2(hitbox.maxX + reach, hitbox.maxY), this);
            }
            else {
                attackHitbox = new AabbHitbox(false, new Vector2(-reach, hitbox.minY), new Vector2(0, hitbox.maxY), this);
            }
            if (CollisionDetection.isCollidingAABB(opponent.hitbox.getCurrentHitbox(opponent.position), attackHitbox.getCurrentHitbox(this.position))) {
                opponent.damage(5, 3, this);
            }
            yield wait(100);
            this.image.style.backgroundImage = "url('docs/img/turtle/" + this.body + "/Default.png')";
            yield wait(50);
            this.isExecutingAction = false;
        });
    }
    defend() {
        return __awaiter(this, void 0, void 0, function* () {
            this.image.style.backgroundImage = "url('docs/img/Green-dummy-texture.png')";
            yield wait(100);
            this.image.style.backgroundImage = "url('docs/img/turtle/" + this.body + "/Default.png')";
            yield wait(50);
            this.isExecutingAction = false;
        });
    }
    jumpAnimation() {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 1; i <= 4; i++) {
                if (this.isOnGround) {
                    return;
                }
                yield wait(30);
                this.image.style.backgroundImage = "url('docs/img/turtle/" + this.body + "/Jumping" + i.toString() + ".png')";
            }
            while (!this.isOnGround) {
                yield wait(60);
            }
        });
    }
    walkingAnimation() {
        return __awaiter(this, void 0, void 0, function* () {
            const frames = 6;
            for (let i = 1; i < frames * 2; i++) {
                if (!this.isWalking || !this.isOnGround) {
                    return;
                }
                let frame;
                if (i > frames) {
                    frame = i * -1 + frames * 2;
                }
                else {
                    frame = i;
                }
                yield wait(40);
                this.image.style.backgroundImage = "url('docs/img/turtle/" + this.body + "/Walking" + frame.toString() + ".png')";
                if (i >= frames * 2 - 1)
                    i = 1;
            }
        });
    }
    calculateVelocity() {
        this.velocity.x -= FRICTION * this.velocity.x;
        if (this.leftPressed) {
            this.facingRight = false;
            this.velocity.x += -this.movementSpeed;
        }
        if (this.rightPressed) {
            this.facingRight = true;
            this.velocity.x += this.movementSpeed;
        }
        if ((this.leftPressed || this.rightPressed) && this.isOnGround) {
            if (!this.isWalking) {
                this.isWalking = true;
                this.walkingAnimation().then(() => {
                    this.image.style.backgroundImage = "url('docs/img/turtle/" + this.body + "/Default.png')";
                });
            }
            else {
                this.isWalking = true;
            }
        }
        else {
            this.isWalking = false;
        }
        if ((this.velocity.x < 0.01 && this.velocity.x > 0) || (this.velocity.x > -0.01 && this.velocity.x < 0)) {
            this.velocity.x = 0;
        }
        this.velocity.y -= GRAVITY_PER_FRAME;
        if (this.upPressed && this.isOnGround) {
            this.isOnGround = false;
            this.jumpAnimation().then(() => {
                this.image.style.backgroundImage = "url('docs/img/turtle/" + this.body + "/Default.png')";
            });
            this.velocity.y = this.jumpStrength;
        }
    }
    executePlayerAction(opponent) {
        if (!this.isExecutingAction) {
            const maxKeypressTime = 2;
            if (this.attackKeyPressed < maxKeypressTime && this.attackKeyPressed > 0) {
                this.attackKeyPressed = maxKeypressTime;
                this.isExecutingAction = true;
                this.attack(opponent);
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
        this.position.add(this.velocity);
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
function preloadImages(list) {
    const imageList = [];
    for (let i = 0; i < list.length; i++) {
        const img = new Image();
        img.src = list[i];
    }
}
class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(vec2) {
        this.x += vec2.x;
        this.y += vec2.y;
    }
    static add(first, second) {
        return new Vector2(first.x + second.x, first.y + second.y);
    }
    subtract(vec2) {
        this.x -= vec2.x;
        this.y -= vec2.y;
    }
    transform(x, y) {
        this.x += x;
        this.y += y;
    }
    static dotProduct(vector1, vector2) {
        return vector1.x * vector2.x + vector1.y * vector2.y;
    }
}
class HitboxBase {
    constructor(displayable, player) {
        this.player = player;
        this.displayable = displayable;
        if (displayable) {
            this.element = document.createElement("canvas");
            this.element.style.background = "none";
            player.appendChild(this.element);
        }
    }
    flip(isFacingRight) {
        if (this.displayable) {
            if (isFacingRight) {
                this.element.style.transform = "scaleX(1)";
            }
            else {
                this.element.style.transform = "scaleX(-1)";
            }
        }
    }
    createPolygon() {
        const ctx = this.element.getContext("2d");
        const game = document.getElementsByTagName("game")[0];
        const playerHeight = this.player.clientHeight;
        if (ctx !== null) {
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#f00';
            ctx.beginPath();
            ctx.moveTo(this.vectors[0].x / 100 * game.offsetWidth, -this.vectors[0].y / 100 * game.offsetWidth + playerHeight);
            for (let i = 1; i < this.vectors.length; i++) {
                ctx.lineTo(this.vectors[i].x / 100 * game.offsetWidth, -this.vectors[i].y / 100 * game.offsetWidth + playerHeight);
            }
            ctx.closePath();
            ctx.stroke();
        }
    }
    removeElement() {
        this.element.parentNode.removeChild(this.element);
    }
}
class AabbHitbox extends HitboxBase {
    constructor(displayable, relativePosition, opposite, player) {
        super(displayable, player);
        this.position = relativePosition;
        this.opposite = opposite;
        if (displayable) {
            const game = document.getElementsByTagName("game")[0];
            this.element.setAttribute("height", "1000");
            this.element.setAttribute("width", ((this.maxX + this.minX) / 100 * game.offsetWidth).toString());
        }
    }
    display() {
        if (this.displayable) {
            this.createPolygon();
            this.displayable = false;
        }
    }
    get vectors() {
        return [
            this.position,
            Vector2.add(this.position, new Vector2(this.opposite.x, 0)),
            Vector2.add(this.opposite, this.position),
            Vector2.add(this.position, new Vector2(0, this.opposite.y))
        ];
    }
    get minX() {
        if (this.position.x < this.opposite.x) {
            return this.position.x;
        }
        else {
            return this.opposite.x;
        }
    }
    get maxX() {
        if (this.position.x > this.opposite.x) {
            return this.position.x;
        }
        else {
            return this.opposite.x;
        }
    }
    get minY() {
        if (this.position.y < this.opposite.y) {
            return this.position.y;
        }
        else {
            return this.opposite.y;
        }
    }
    get maxY() {
        if (this.position.y > this.opposite.y) {
            return this.position.y;
        }
        else {
            return this.opposite.y;
        }
    }
    get vectorAmount() {
        return 4;
    }
    getCurrentHitbox(currentPosition) {
        return new AabbHitbox(this.displayable, Vector2.add(currentPosition, this.position), Vector2.add(currentPosition, this.opposite), this.player);
    }
    getAllUniqueNormals() {
        return [Infinity, -Infinity, 0];
    }
}
class ConvexHitbox extends HitboxBase {
    constructor(displayable, vectors, player) {
        super(displayable, player);
        this.vectors = vectors;
        if (displayable) {
            const game = document.getElementsByTagName("game")[0];
            this.element.setAttribute("height", "1000");
            this.element.setAttribute("width", ((this.maxX + this.minX) / 100 * game.offsetWidth).toString());
        }
    }
    display() {
        if (this.displayable) {
            this.createPolygon();
            this.displayable = false;
        }
    }
    get minX() {
        let minX = Infinity;
        for (let i = 0; this.vectors.length > i; i++) {
            const x = this.vectors[i].x;
            minX = Math.min(minX, x);
        }
        return minX;
    }
    get maxX() {
        let maxX = -Infinity;
        for (let i = 0; this.vectors.length > i; i++) {
            const x = this.vectors[i].x;
            if (x > maxX) {
                maxX = x;
            }
        }
        return maxX;
    }
    get minY() {
        let minY = Infinity;
        for (let i = 0; this.vectors.length > i; i++) {
            const y = this.vectors[i].y;
            if (y < minY) {
                minY = y;
            }
        }
        return minY;
    }
    get maxY() {
        let maxY = -Infinity;
        for (let i = 0; this.vectors.length > i; i++) {
            const y = this.vectors[i].y;
            if (y > maxY) {
                maxY = y;
            }
        }
        return maxY;
    }
    get vectorAmount() {
        return this.vectors.length;
    }
    getCurrentHitbox(currentPosition) {
        const vectors = [];
        for (let i = 0; this.vectors.length > i; i++) {
            vectors.push(Vector2.add(this.vectors[i], currentPosition));
        }
        return new ConvexHitbox(false, vectors, this.player);
    }
    getNormal(number) {
        let vector1;
        let vector2;
        vector1 = this.vectors[number];
        vector2 = this.vectors[(number + 1) % this.vectorAmount];
        return 1 / -((vector1.y - vector2.y) / (vector1.x - vector2.x));
    }
}
class PlayScreen {
    constructor(game) {
        this.floorHeight = 6;
        const background = document.createElement("background");
        const backgroundStyle = background.style;
        backgroundStyle.backgroundColor = "blue";
        backgroundStyle.width = "100%";
        backgroundStyle.height = "100%";
        backgroundStyle.position = "absolute";
        game.appendChild(background);
        const floorHeight = this.floorHeight;
        const floor = document.createElement("floor");
        const floorStyle = floor.style;
        floorStyle.backgroundColor = "green";
        floorStyle.position = "absolute";
        floorStyle.width = "100vw";
        floorStyle.height = floorHeight.toString() + "vw";
        floorStyle.bottom = "0";
        game.appendChild(floor);
        const playerOne = document.createElement("player-element", { is: "player-element" });
        const playerTwo = document.createElement("player-element", { is: "player-element" });
        playerOne.init(100, "KeyU", "KeyY", "KeyW", "KeyA", "KeyD", "player-one", "right", "left", game);
        playerTwo.init(100, "Numpad2", "Numpad1", "ArrowUp", "ArrowLeft", "ArrowRight", "player-two", "left", "right", game);
        playerOne.position.y = floorHeight;
        playerTwo.position.y = floorHeight;
        playerOne.position.x = 10;
        playerTwo.position.x = 85;
        this.playerOne = playerOne;
        this.playerTwo = playerTwo;
    }
    movePlayers() {
        const playerOne = this.playerOne;
        const playerTwo = this.playerTwo;
        playerOne.calculateVelocity();
        playerTwo.calculateVelocity();
        this.keepPlayerInBounds(playerOne);
        this.keepPlayerInBounds(playerTwo);
        CollisionDetection.collide(playerOne, playerTwo, this);
        playerOne.applyVelocity();
        playerTwo.applyVelocity();
        playerOne.render();
        playerTwo.render();
    }
    keepPlayerInBounds(player) {
        const position = player.position;
        const velocity = player.velocity;
        if (player.newPosition.y < this.floorHeight) {
            velocity.y = this.floorHeight - position.y;
            player.isOnGround = true;
        }
        else if (player.newPosition.y + player.hitbox.maxY > gameHeightInVw) {
            velocity.y = gameHeightInVw - player.hitbox.maxY - position.y;
        }
        if (player.newPosition.x < 0) {
            velocity.x = -position.x;
        }
        else if (player.newPosition.x + player.hitbox.maxX > 100) {
            velocity.x = 100 - player.hitbox.maxX - position.x;
        }
    }
    update() {
        this.playerOne.executePlayerAction(this.playerTwo);
        this.playerTwo.executePlayerAction(this.playerOne);
        this.movePlayers();
    }
}
class StartScreen {
    constructor() {
    }
    update() {
    }
}
class HealthBar {
    constructor(side, game) {
        this._health = 100;
        const width = 40;
        const height = 5;
        const offset = 0.6;
        this.maxBarWidth = width - offset * 2;
        this.div = document.createElement("health-bar-container");
        const containerStyle = this.div.style;
        containerStyle.zIndex = "10";
        containerStyle.width = width.toString() + "vw";
        containerStyle.height = height.toString() + "vw";
        containerStyle.position = "absolute";
        containerStyle.backgroundColor = "lightgrey";
        containerStyle.top = "2vw";
        if (side === "right") {
            containerStyle.right = "6.5vw";
        }
        else if (side === "left") {
            containerStyle.left = "6.5vw";
        }
        else {
            throw "exeption: the parameter 'facing' in Player.init should be either 'right' or 'left'.";
        }
        this.bar = document.createElement("health-bar");
        const style = this.bar.style;
        style.zIndex = "11";
        style.width = this.maxBarWidth.toString() + "vw";
        style.height = (height - offset * 2).toString() + "vw";
        style.left = offset.toString() + "vw";
        style.top = offset.toString() + "vw";
        style.backgroundColor = "red";
        style.position = "absolute";
        this.div.appendChild(this.bar);
        game.appendChild(this.div);
    }
    get health() {
        return this._health;
    }
    set health(health) {
        if (health > 100) {
            this._health = 100;
        }
        else if (health < 0) {
            this._health = 0;
        }
        else {
            this._health = health;
        }
        this.bar.style.width = (this._health / 100 * this.maxBarWidth).toString() + "vw";
    }
}
//# sourceMappingURL=main.js.map