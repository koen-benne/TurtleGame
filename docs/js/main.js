"use strict";
class Cycle {
    constructor(playerCreator, objects) {
        this.index = 0;
        this.cycleHeight = 0;
        this.cycle = document.createElement("cycle");
        this.objects = objects;
        this.right();
        this.cycle.style.backgroundColor = "black";
        this.cycle.style.width = "100%";
        this.cycle.style.height = "33%";
        this.cycle.style.position = "absolute";
        this.cycle.style.transform = `translate(, ${this.cycleHeight}%)`;
        playerCreator.appendChild(this.cycle);
    }
    right() {
        this.index += 1;
        if (this.index == this.objects.length) {
            this.index = 0;
        }
        this.cycle.style.background = `${this.objects[this.index]}`;
        console.log(this.index);
    }
    left() {
        this.index -= 1;
        if (this.index == -1) {
            this.index = this.objects.length - 1;
        }
        this.cycle.style.backgroundColor = `${this.objects[this.index]}`;
        console.log(this.index);
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
class PlayerCreator {
    constructor(game, upKey, downKey, leftKey, rightKey) {
        this.index = 0;
        this.suckMieTittie = 0;
        this.cycles = [];
        const creator = document.createElement("creator");
        const creatorStyle = creator.style;
        creatorStyle.backgroundColor = "none";
        creatorStyle.width = "50%";
        creatorStyle.height = "100%";
        creatorStyle.position = "absolute";
        this.creator = creator;
        this.upKey = upKey;
        this.downKey = downKey;
        this.leftKey = leftKey;
        this.rightKey = rightKey;
        document.addEventListener("keydown", event => this.update(event));
        this.cycles.push(new Cycle(this.creator, ["blue", "red", "black"]));
        this.cycles.push(new Cycle(this.creator, ["blue", "red", "black"]));
        this.cycles.push(new Cycle(this.creator, ["blue", "red", "black"]));
        this.cycles[1].cycle.style.transform = `translate(0,100%)`;
        this.cycles[2].cycle.style.transform = `translate(0,200%)`;
        game.appendChild(creator);
    }
    update(event) {
        let style = this.creator.style;
        switch (event.code) {
            case this.downKey: {
                this.cycles[this.index].cycle.style.opacity = "100%";
                this.index += 1;
                if (this.index == this.cycles.length) {
                    this.index = 0;
                }
                this.cycles[this.index].cycle.style.opacity = "80%";
                console.log(this.index);
                break;
            }
            case this.upKey: {
                this.cycles[this.index].cycle.style.opacity = "100%";
                this.index -= 1;
                if (this.index == -1) {
                    this.index = this.cycles.length - 1;
                }
                this.cycles[this.index].cycle.style.opacity = "80%";
                console.log(this.index);
                break;
            }
            case this.rightKey: {
                this.cycles[this.index].right();
                break;
            }
            case this.leftKey: {
                this.cycles[this.index].left();
                break;
            }
        }
    }
}
class Ready {
    constructor(game) {
        const ready = document.createElement("ready");
        const readystyle = ready.style;
        readystyle.backgroundColor = `black`;
        readystyle.position = `absolute`;
        readystyle.transform = `translate(40vw,80vh)`;
        readystyle.width = `20vw`;
        readystyle.height = `10vh`;
        readystyle.borderRadius = `20px`;
        ready.innerText = `Ready Bithces`;
        readystyle.textAlign = `center`;
        readystyle.textTransform = `uppercase`;
        readystyle.color = `white`;
        readystyle.fontSize = `40px`;
        readystyle;
        document.addEventListener(`click`, event => this.click(event));
        game.appendChild(ready);
    }
    click(event) {
    }
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
        let playerCreator1 = new PlayerCreator(game, 'KeyW', 'KeyS', 'KeyA', 'KeyD');
        let playerCreator2 = new PlayerCreator(game, 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight');
        playerCreator1.creator.style.transform = `translate(0vw, 0vh)`;
        playerCreator2.creator.style.transform = `translate(50vw, 0vh)`;
        let ready = new Ready(game);
    }
    update() {
    }
}
class StartScreen {
    constructor(g) {
    }
}
//# sourceMappingURL=main.js.map