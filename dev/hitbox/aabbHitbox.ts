/// <reference path="hitboxBase.ts"/>
class AabbHitbox extends HitboxBase {

    public readonly position : Vector2;
    public readonly opposite : Vector2;

    constructor(displayable : boolean, relativePosition : Vector2, opposite : Vector2, player : Player) {
        super(displayable, player);

        this.position = relativePosition;
        this.opposite = opposite;

        if (displayable) {
            const game: HTMLElement = <HTMLElement>document.getElementsByTagName("game")[0];
            this.element.setAttribute("height", "1000");
            this.element.setAttribute("width", ((this.maxX + this.minX) / 100 * game.offsetWidth).toString());
        }
    }

    public display() {
        if (this.displayable) {
            this.createPolygon();
            this.displayable = false;
        }
    }

    public get vectors() {
        return [
            this.position,
            Vector2.add(this.position, new Vector2(this.opposite.x, 0)),
            Vector2.add(this.opposite, this.position),
            Vector2.add(this.position, new Vector2(0, this.opposite.y))
        ];
    }

    public get minX() {
        if (this.position.x < this.opposite.x) {
            return this.position.x;
        } else {
            return this.opposite.x;
        }
    }
    public get maxX() {
        if (this.position.x > this.opposite.x) {
            return this.position.x;
        } else {
            return this.opposite.x;
        }
    }
    public get minY() {
        if (this.position.y < this.opposite.y) {
            return this.position.y;
        } else {
            return this.opposite.y;
        }
    }
    public get maxY() {
        if (this.position.y > this.opposite.y) {
            return this.position.y;
        } else {
            return this.opposite.y;
        }
    }


    public get vectorAmount() : number {
        return 4;
    }

    // Get new hitbox based on the hitox's given position
    public getCurrentHitbox(currentPosition : Vector2) : AabbHitbox {
        return new AabbHitbox(this.displayable, Vector2.add(currentPosition, this.position), Vector2.add(currentPosition, this.opposite), this.player);
    }

    public getAllUniqueNormals(): number[] {
        return [Infinity, -Infinity, 0];
    }

}