/// <reference path="hitboxBase.ts"/>
class ConvexHitbox extends HitboxBase {

    public readonly vectors : Vector2[];

    // Takes an array of vectors relative to the position of its parent element
    constructor(displayable : boolean, vectors : Vector2[], player : Player) {
        super(displayable, player);

        this.vectors = vectors;
    }

    public display() {
        if (this.displayable) {
            this.element = this.createPolygon();
            this.displayable = false;
        }
    }

    public get minX() {
        let minX : number = Infinity;
        for (let i = 0; this.vectors.length > i; i++) {
            const x = this.vectors[i].x;
            minX = Math.min(minX, x);
        }
        return minX;
    }
    public get maxX() {
        let maxX : number = -Infinity;
        for (let i = 0; this.vectors.length > i; i++) {
            const x = this.vectors[i].x;
            if (x > maxX) {
                maxX = x;
            }
        }
        return maxX;
    }
    public get minY() {
        let minY : number = Infinity;
        for (let i = 0; this.vectors.length > i; i++) {
            const y = this.vectors[i].y;
            if (y < minY) {
                minY = y;
            }
        }
        return minY;
    }
    public get maxY() {
        let maxY : number = -Infinity;
        for (let i = 0; this.vectors.length > i; i++) {
            const y = this.vectors[i].y;
            if (y > maxY) {
                maxY = y;
            }
        }
        return maxY;
    }


    public get vectorAmount() : number {
        return this.vectors.length;
    }

    // Get new hitbox based on the hitbox's given position
    public getCurrentHitbox(currentPosition : Vector2) : ConvexHitbox {
        const vectors = [];
        for (let i = 0; this.vectors.length > i; i++) {
            vectors.push(Vector2.add(this.vectors[i], currentPosition));
        }
        return new ConvexHitbox(false, vectors, this.player);
    }

    // Gets Y of normal of side (where X = 1)
    public getNormal(number : number) {
        let vector1 : Vector2;
        let vector2 : Vector2;

        vector1 = this.vectors[number];
        vector2 = this.vectors[(number + 1) % this.vectorAmount];

        return 1 / -((vector1.y - vector2.y) / (vector1.x - vector2.x));
    }

}