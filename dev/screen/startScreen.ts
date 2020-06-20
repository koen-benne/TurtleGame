/// <reference path="screenBase.ts"/>
class StartScreen implements ScreenBase {

    constructor(game : Game) {
        // Set play button
        const playButton : HTMLElement = document.createElement("button");
        playButton.style.width = "30vw";
        playButton.style.height = "10vw";
        playButton.style.backgroundColor = "grey";
        playButton.style.fontSize = "50px";
        playButton.style.position = "absolute";
        playButton.style.top = "40vh";
        playButton.style.left = "10vw";
        playButton.innerText = "Play";
        playButton.addEventListener("click", () => game.start());
        game.gameElement.appendChild(playButton);


        const shieldButton : HTMLElement = document.createElement("button");
        shieldButton.style.width = "30vw";
        shieldButton.style.height = "10vw";
        shieldButton.style.backgroundColor = "green";
        shieldButton.style.fontSize = "50px";
        shieldButton.style.position = "absolute";
        shieldButton.style.top = "40vh";
        shieldButton.style.right = "10vw";
        shieldButton.innerText = "Shield";
        shieldButton.addEventListener("click", () => game.start());
        game.gameElement.appendChild(shieldButton);

    }

    public update() {

    }

}
