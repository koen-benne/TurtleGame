class PlayerCreatorScreen implements ScreenBase {
    ready : HTMLElement
    constructor(game: HTMLElement){
        const background = document.createElement("background");
        const backgroundStyle = background.style;
        backgroundStyle.backgroundColor = "green";
        backgroundStyle.width = "100%";
        backgroundStyle.height = "100%";
        backgroundStyle.position = "absolute";
        game.appendChild(background);
        
        let playerCreator1 : PlayerCreator = new PlayerCreator(game,'KeyW','KeyS', 'KeyA', 'KeyD');
        let playerCreator2 : PlayerCreator = new PlayerCreator(game,'ArrowUp','ArrowDown', 'ArrowLeft', 'ArrowRight');
        playerCreator1.creator.style.transform = `translate(0vw, 0vh)`
        playerCreator2.creator.style.transform = `translate(50vw, 0vh)`
        let ready : Ready = new Ready(game);
    }
    public update() {
        
    }
}
