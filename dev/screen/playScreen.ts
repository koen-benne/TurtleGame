/// <reference path="screenBase.ts"/>
class PlayScreen implements ScreenBase {
    private readonly playerOne : Player;
    private readonly playerTwo : Player;

    readonly floorHeight : number;

    constructor(game: HTMLElement) {

        // Set floor height
        this.floorHeight = 6;

        //////////////////////////////// Set scene ////////////////////////////////
        // Set background
        const background = document.createElement("background");
        const backgroundStyle = background.style;
        backgroundStyle.backgroundColor = "blue";
        backgroundStyle.width = "100%";
        backgroundStyle.height = "100%";
        backgroundStyle.position = "absolute";
        game.appendChild(background);

        // Set floor
        const floorHeight = this.floorHeight;
        const floor = document.createElement("floor");
        const floorStyle = floor.style;
        floorStyle.backgroundColor = "green";
        floorStyle.position = "absolute";
        floorStyle.width = "100vw";
        floorStyle.height = floorHeight.toString() + "vw";
        floorStyle.bottom = "0"
        game.appendChild(floor);

        // Create players
        const playerOne = <Player>document.createElement("player-element", {is: "player-element"});
        const playerTwo = <Player>document.createElement("player-element", {is: "player-element"});
        playerOne.init(100, "KeyU", "KeyY","KeyW", "KeyA", "KeyD", "player-one", "right", game);
        playerTwo.init(100, "Numpad2", "Numpad1", "ArrowUp", "ArrowLeft", "ArrowRight", "player-two", "left", game);

        // Set start positions of players
        playerOne.position.y = floorHeight;
        playerTwo.position.y = floorHeight;
        playerOne.position.x = 10;
        playerTwo.position.x = 85;

        this.playerOne = playerOne;
        this.playerTwo = playerTwo;
    }

    // Move player one and two
    private movePlayers() {
        const playerOne = this.playerOne;
        const playerTwo = this.playerTwo;
        playerOne.calculateVelocity();
        playerTwo.calculateVelocity();

        this.keepPlayerInBounds(playerOne);
        this.keepPlayerInBounds(playerTwo);

        CollisionDetection.collide(playerOne, playerTwo, this);

        playerOne.applyVelocity();
        playerTwo.applyVelocity();
        playerOne.render();
        playerTwo.render();
    }

    private keepPlayerInBounds(player : Player) {
        const position = player.position;
        const velocity = player.velocity;
        // Keep player above the ground
        if (player.newPosition.y < this.floorHeight) {
             velocity.y = this.floorHeight - position.y
            player.isOnGround = true;
        } else if (player.newPosition.y + player.hitbox.maxY > gameHeightInVw) {
            velocity.y = gameHeightInVw - player.hitbox.maxY - position.y;
        }
        if (player.newPosition.x < 0) {
            velocity.x = -position.x;
        } else if(player.newPosition.x + player.hitbox.maxX > 100) {
            velocity.x = 100 - player.hitbox.maxX - position.x;
        }
    }


    // Update the screen
    public update() {
        this.playerOne.executePlayerAction();
        this.playerTwo.executePlayerAction();

        this.movePlayers()
    }
}