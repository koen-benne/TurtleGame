/// <reference path="screenBase.ts"/>
class StartScreen extends ScreenBase {
    constructor(g: Game) {
        super(g);
    }

    update(): Promise<any> {
        return Promise.resolve(undefined);
    }
}
