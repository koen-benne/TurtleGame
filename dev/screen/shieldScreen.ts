class ShieldScreen {
    private game : Game
    private canvas : HTMLCanvasElement
    private input : HTMLInputElement
    private script : HTMLScriptElement

    constructor(g : Game) {
        this.game = g;
        //creating canvas
            this.canvas = document.createElement("canvas");
            document.body.appendChild(this.canvas);
            this.canvas.id = "canvas";
            this.canvas.height = 450;
            this.canvas.width = 400;
        //creating input
            this.input = document.createElement("input");
            document.body.appendChild(this.input);
            this.input.type = "color";
            this.input.id = "colourInput";
            this.input.value = "#3d34a5";
        //creating script tags
            this.script = document.createElement("script");
            document.body.appendChild(this.script);
            this.script.src = "docs/js/shield.js";
            this.script.defer = true;




    }
}