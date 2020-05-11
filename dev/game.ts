let pixelWidth = 2;
class Game {
    // Set game variables
    public currentScreen : any;

    // Constructor
    constructor() {
        this.onStart();
        this.gameLoop();
    }

    private gameLoop() {

        this.currentScreen.update();
        requestAnimationFrame(() => this.gameLoop());
    }

    private onStart() {

    }

    public setStartScreen() {
        document.body.innerHTML = "";
        this.currentScreen = new StartScreen(this);
    }

    public setPlayScreen() {
        document.body.innerHTML = "";
        this.currentScreen = new PlayScreen(this);
    }
}
