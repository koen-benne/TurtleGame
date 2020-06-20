abstract class HitboxBase {
    protected displayable : boolean;
    protected player : Player;
    protected element : HTMLCanvasElement;

    vectors : Vector2[];

    protected constructor(displayable : boolean, player : Player) {
        this.player = player;
        this.displayable = displayable;
        if (displayable) {
            this.element = document.createElement("canvas");

            this.element.style.background = "none";

            player.appendChild(this.element);
        }
    }

    public flip(isFacingRight : boolean) : void {
        if (this.displayable) {
            if (isFacingRight) {
                this.element.style.transform = "scaleX(1)";
            } else {
                this.element.style.transform = "scaleX(-1)";
            }
        }
    }

    protected createPolygon() : any {
        const ctx = this.element.getContext("2d");

        const game : HTMLElement = <HTMLElement>document.getElementsByTagName("game")[0];
        const playerHeight : number = this.player.clientHeight;

        if (ctx !== null) {
            ctx.lineWidth = 2
            ctx.strokeStyle = '#f00';
            ctx.beginPath();
            ctx.moveTo(this.vectors[0].x / 100 * game.offsetWidth, -this.vectors[0].y / 100 * game.offsetWidth + playerHeight);
            for(let i = 1 ; i < this.vectors.length ; i++) {
                ctx.lineTo(this.vectors[i].x / 100 * game.offsetWidth, -this.vectors[i].y / 100 * game.offsetWidth + playerHeight);
            }
            ctx.closePath();
            ctx.stroke();
        }
    }

    public removeElement() : void {
        // @ts-ignore
        this.element.parentNode.removeChild(this.element);
    }

    abstract display() : void;



    abstract get minX() : number;
    abstract get maxX() : number;
    abstract get minY() : number;
    abstract get maxY() : number;

    abstract getCurrentHitbox(currentPosition : Vector2) : HitboxBase;

    abstract get vectorAmount() : number;

}