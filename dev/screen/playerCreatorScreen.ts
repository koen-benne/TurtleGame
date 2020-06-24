class PlayerCreatorScreen implements ScreenBase {
    ready : HTMLElement
    constructor(game: HTMLElement){
        const background = document.createElement("background");
        const backgroundStyle = background.style;
        backgroundStyle.backgroundImage = `url("docs/img/bg.png")`;
        backgroundStyle.backgroundSize = `cover`
        backgroundStyle.width = "100vw";
        backgroundStyle.height = "100vh";
        backgroundStyle.position = "absolute";
        game.appendChild(background);
        
        let playerCreator1 : PlayerCreator = new PlayerCreator(game,'KeyW','KeyS', 'KeyA', 'KeyD');
        let playerCreator2 : PlayerCreator = new PlayerCreator(game,'ArrowUp','ArrowDown', 'ArrowLeft', 'ArrowRight');
        playerCreator1.creator.style.left = `10vw`
        playerCreator2.creator.style.right = `-15vw`
        let ready : Ready = new Ready(game);
    }
    public update() {
        
    }
}
