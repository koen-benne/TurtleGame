let pixelWidth = 2;
class Game {
    // Set game variables
    public currentScreen : any;

    // Constructor
    constructor() {
        this.setShieldScreen();
        this.gameLoop();
    }

    private gameLoop() {

        this.currentScreen.update();
        requestAnimationFrame(() => this.gameLoop());
    }

    private onStart() {

    }

    public setShieldScreen(){
        document.body.innerHTML = "";
        this.currentScreen = new ShieldScreen(this);
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
