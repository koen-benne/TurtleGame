/// <reference path="screenBase.ts"/>
class PlayScreen implements ScreenBase {
    private game : Game;

    private readonly playerOne : Player;
    private readonly playerTwo : Player;

    readonly floorHeight : number;

    constructor(game: Game) {
        this.game = game;

        // Set floor height
        this.floorHeight = 3.6;

        //////////////////////////////// Set scene ////////////////////////////////
        // Set background
        const background = document.createElement("background");
        const backgroundStyle = background.style;
        backgroundStyle.backgroundImage = "url('docs/img/background.png')";
        backgroundStyle.backgroundRepeat = "no-repeat";
        backgroundStyle.backgroundSize = "100% 100%";
        backgroundStyle.width = "100%";
        backgroundStyle.height = "100%";
        backgroundStyle.position = "absolute";
        game.gameElement.appendChild(background);

        // Set floor
        const floorHeight = this.floorHeight;
        const floor = document.createElement("floor");
        const floorStyle = floor.style;
        //floorStyle.backgroundColor = "green";
        floorStyle.position = "absolute";
        floorStyle.width = "100vw";
        floorStyle.height = floorHeight.toString() + "vw";
        floorStyle.bottom = "0"
        game.gameElement.appendChild(floor);

        // Create players
        const playerOne = <Player>document.createElement("player-element", {is: "player-element"});
        const playerTwo = <Player>document.createElement("player-element", {is: "player-element"});
        playerOne.init(100, "KeyU", "KeyY","KeyW", "KeyA", "KeyD", "player-one", "right", "left", game.gameElement, this);
        playerTwo.init(100, "Numpad2", "Numpad1", "ArrowUp", "ArrowLeft", "ArrowRight", "player-two", "left","right", game.gameElement, this);

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
        this.playerOne.executePlayerAction(this.playerTwo);
        this.playerTwo.executePlayerAction(this.playerOne);

        this.movePlayers()
    }


    public gameOver(playerId : string) {
        const gameOverText = document.createElement("div");

        if (playerId == "player-one") {
            gameOverText.innerText = "Player Two Won!";
        } else if (playerId == "player-two") {
            gameOverText.innerText = "Player One Won!";
        } else {
            gameOverText.innerText = "Player " + playerId + " Won!";
        }
        gameOverText.style.position = "absolute";
        gameOverText.style.fontFamily = "arial";
        gameOverText.style.fontWeight = "bold";
        gameOverText.style.color = "red";
        gameOverText.style.fontSize = "7vw";
        gameOverText.style.width = "100vw";
        gameOverText.style.height = "15vw";
        gameOverText.style.top = "35vh";
        gameOverText.style.textAlign = "center"

        this.game.gameElement.appendChild(gameOverText);

        const replayButton : HTMLElement = document.createElement("button");
        replayButton.style.width = "30vw";
        replayButton.style.height = "10vw";
        replayButton.style.backgroundColor = "red";
        replayButton.style.fontSize = "50px";
        replayButton.style.position = "absolute";
        replayButton.style.top = "50vh";
        replayButton.style.left = "35vw";
        replayButton.innerText = "Play";
        replayButton.addEventListener("click", () => this.game.setPlayScreen());
        this.game.gameElement.appendChild(replayButton);

    }

}