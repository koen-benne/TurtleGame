// Class for vectors, can also be used for points
class Vector2 {
    public x : number;
    public y : number;


    constructor(x : number, y : number) {
        this.x = x;
        this.y = y;
    }

    public add(vec2 : Vector2) : void {
        this.x += vec2.x;
        this.y += vec2.y;
    }

    public static add(first : Vector2, second : Vector2) : Vector2 {
        return new Vector2(
            first.x + second.x,
            first.y + second.y
        );
    }

    public subtract(vec2 : Vector2) {
        this.x -= vec2.x;
        this.y -= vec2.y;
    }

    public transform(x : number, y : number) {
        this.x += x;
        this.y += y;
    }

    public static dotProduct(vector1 : Vector2, vector2 : Vector2) : number {
        return vector1.x * vector2.x + vector1.y * vector2.y;
    }

}