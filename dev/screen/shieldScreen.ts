class ShieldScreen {
    private game : Game
    private canvas : HTMLCanvasElement
    private color : HTMLInputElement
    private width : HTMLInputElement
    private script : HTMLScriptElement

    constructor(g : Game) {
        this.game = g;
        //creating canvas
            this.canvas = document.createElement("canvas");
            document.body.appendChild(this.canvas);
            this.canvas.id = "canvas";
            this.canvas.height = 450;
            this.canvas.width = 400;
        //creating color
            this.color = document.createElement("input");
            document.body.appendChild(this.color);
            this.color.type = "color";
            this.color.id = "colourInput";
            this.color.value = "#3d34a5";
        //creating width
            this.width = document.createElement("input");
            document.body.appendChild(this.width);
            this.width.type = "number";
            this.width.id = "brushWidth"
            this.width.value = "25";
        //creating script tags
            this.script = document.createElement("script");
            document.body.appendChild(this.script);
            this.script.src = "docs/js/shield.js";
            this.script.defer = true;
    }
}