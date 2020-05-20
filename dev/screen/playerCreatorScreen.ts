

class PlayerCreatorScreen implements ScreenBase {
    constructor(game: HTMLElement){
        const background = document.createElement("background");
        const backgroundStyle = background.style;
        backgroundStyle.backgroundColor = "green";
        backgroundStyle.width = "100%";
        backgroundStyle.height = "100%";
        backgroundStyle.position = "absolute";
        game.appendChild(background);
    }

    public update() {
        
    }
}
