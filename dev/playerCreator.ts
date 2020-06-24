class PlayerCreator {
    index : number = 0;
    suckMieTittie : number = 0;
    upKey : string;
    downKey : string;
    leftKey : string;
    rightKey : string;
    creator : HTMLElement;
    ready : HTMLElement;
    cycles : Cycle[] = [];
    constructor(game: HTMLElement, upKey : string, downKey : string, leftKey : string, rightKey : string){
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
        
        document.addEventListener("keydown", event => this.update(event))
        
        this.cycles.push(new Cycle(this.creator,["blue", "red", "black"],))
        this.cycles.push(new Cycle(this.creator,["blue", "red", "black"]))
        this.cycles.push(new Cycle(this.creator,["blue", "red", "black"]))
        this.cycles[1].cycle.style.transform = `translate(0,100%)`;
        this.cycles[2].cycle.style.transform = `translate(0,200%)`;
        
        game.appendChild(creator);
    }
    update(event : KeyboardEvent){
    let style = this.creator.style;
    switch (event.code) {
        case this.downKey: {
            this.cycles[this.index].cycle.style.opacity = "100%";
            this.index += 1;
            if (this.index == this.cycles.length){
                this.index = 0
            }
            this.cycles[this.index].cycle.style.opacity = "80%";
            console.log(this.index)
            break;
        } case this.upKey: {
            this.cycles[this.index].cycle.style.opacity = "100%";
            this.index -= 1;
            if (this.index == -1){
                this.index = this.cycles.length -1;
            }
            this.cycles[this.index].cycle.style.opacity = "80%";
            console.log(this.index)
            break;
        } case this.rightKey: {
            this.cycles[this.index].right()
            break;
        } case this.leftKey: {
            this.cycles[this.index].left()
            break;
        }
    }
    

    }
}