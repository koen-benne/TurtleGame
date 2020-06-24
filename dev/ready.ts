class Ready{
    constructor(game:HTMLElement){
        const ready = document.createElement("ready")
        const readystyle = ready.style;
        readystyle.backgroundColor = `black`;
        readystyle.position = `absolute`;
        readystyle.transform = `translate(40vw,80vh)`
        readystyle.width = `20vw`;
        readystyle.height = `6vw`;
        readystyle.borderRadius = `20px`
        ready.innerText = `Ready`
        readystyle.textAlign = `center`
        readystyle.textTransform = `uppercase`
        readystyle.color = `white`
        readystyle.fontSize = `5vw`
        readystyle
        document.addEventListener(`click`, event => this.click(event))
        game.appendChild(ready);
    }
    click(event : MouseEvent){

    }
}