class HealthBar {
    private div : HTMLElement;
    private bar : HTMLElement;

    private maxBarWidth : number;

    private _health : number = 100;


    get health() {
        return this._health;
    }
    set health(health : number) {
        if (health > 100) {
            this._health = 100;
        } else if (health < 0) {
            this._health = 0;
        } else {
            this._health = health;
        }

        // Set bar
        this.bar.style.width = (this._health / 100 * this.maxBarWidth).toString() + "vw";
    }

    constructor(side : string, game : HTMLElement) {

        const width = 40;
        const height = 5;
        const offset = 0.6;

        this.maxBarWidth = width - offset * 2;

        // Set health bar
        this.div = document.createElement("health-bar-container");
        const containerStyle = this.div.style;
        containerStyle.width = width.toString() + "vw";
        containerStyle.height = height.toString() + "vw";
        containerStyle.position = "absolute";
        containerStyle.backgroundColor = "lightgrey";
        containerStyle.top = "2vw"

        if(side === "right") {
            containerStyle.right = "5vw"
        } else if(side === "left") {
            containerStyle.left = "5vw"
        } else {
            // Throw custom error if facing is incorrect
            throw "exeption: the parameter 'facing' in Player.init should be either 'right' or 'left'."
        }

        this.bar = document.createElement("health-bar");
        const style = this.bar.style;
        style.zIndex = "10";
        style.width = this.maxBarWidth.toString() + "vw";
        style.height = (height - offset * 2).toString() + "vw";
        style.left = offset.toString() + "vw";
        style.top = offset.toString() + "vw";
        style.backgroundColor = "red";
        style.position = "absolute";

        this.div.appendChild(this.bar);

        game.appendChild(this.div);
    }

}