class Cycle{
    index : number = 0;
    objects : string[]
    cycle : HTMLElement;
    public cycleHeight = 0;
    constructor(playerCreator: HTMLElement, objects : string[]){
        this.cycle = document.createElement("cycle");
        this.objects = objects;
        this.right();
        this.cycle.style.backgroundColor = "black"
        this.cycle.style.width = "100%"
        this.cycle.style.height = "33%"
        this.cycle.style.position = "absolute"
        this.cycle.style.transform = `translate(, ${this.cycleHeight}%)`;
        playerCreator.appendChild(this.cycle)
    }
    
    public right(){
        this.index += 1;
        if (this.index == this.objects.length){
            this.index = 0
        }
        this.cycle.style.background = `${this.objects[this.index]}`;
        console.log(this.index)
    }
    public left(){
        this.index -= 1;
        if (this.index == -1){
            this.index = this.objects.length -1;
        }
        this.cycle.style.backgroundColor = `${this.objects[this.index]}`;
        console.log(this.index)

    }
}