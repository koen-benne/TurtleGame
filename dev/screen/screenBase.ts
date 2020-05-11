abstract class ScreenBase {
    protected game : Game;

    protected constructor(g: Game) {
        this.game = g;
    }

    abstract update() : Promise<any>;

}