var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0},
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload(){
    this.load.image('sky', 'assets/sky.png')
    this.load.image('bird', 'assets/bird.png')
    this.load.image('pipe', 'assets/pipe.png')
}

var bottomPipes;

var topPipes;

var playerScore = 0;

var hasGameStarted = false;

var isGameOver = false;



function create(){

    this.add.image(400, 300, 'sky');


    if(hasGameStarted == false){
        this.physics.pause();
    }

    player = this.physics.add.sprite(100, 300, 'bird')
    player.setGravityY(1000);
    player.setCollideWorldBounds(true);
    player.setFlipX(true)
    player.setScale(0.2)
    player.setBounce(0)
    player.angle = -40;

    bottomPipes = this.physics.add.group({
        key: 'pipe',
        repeat: 2,
        setXY: {x: 400, y: 800, stepX: 400 }, 
        velocityX: -100
    });

    topPipes = this.physics.add.group({
        key: 'pipe',
        repeat: 2,
        setXY: {x: 400, y: -150, stepX: 400 },
        velocityX: -100
    });

    gameStartText = this.add.text(300, 300, 'Press Space to Start')

    gameEndText = this.add.text(400, 300, 'Press Space to restart')
    gameEndText.visible = false;

    scoreText = this.add.text(20, 20, 'Score: 0')

    bottomPipes.children.iterate(pipe => {
        pipe.setScale(0.4);
        pipe.setBounce(0);
    })

    topPipes.children.iterate(pipe => {
        pipe.setScale(0.4)
        pipe.setFlipY(true)
        pipe.setBounce(0);
    })



    spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    function setGameOver(){
        this.physics.pause()
        player.setTint(0xff0000);
        isGameOver = true;
        gameEndText.visible = true;
    }

    resetGame = function (){
        playerScore = 0;
        scoreText.text = 'Score: 0'
        player.x = 100;
        player.y = 300;
        player.body.velocity['y'] = 0;
        player.setTint(0xffffff)
        gameEndText.visible = false;
        gameStartText.visible = true;
        var xValue = 400

        bottomPipes.children.iterate(
            function(pipe){
                pipe.x = xValue;
                xValue += 400;
        });
        xValue = 400;
        topPipes.children.iterate(
            function(pipe){
                pipe.x = xValue;
                xValue += 400;
        });
        isGameOver = false;
        hasGameStarted = false;
    }



    this.physics.add.overlap(player, bottomPipes, setGameOver, null, this);
    this.physics.add.overlap(player, topPipes, setGameOver, null, this);

}

let pipeSpace = 0;

function update(){

    if(!hasGameStarted && Phaser.Input.Keyboard.JustDown(spacebar)){
        this.physics.resume()
        gameStartText.visible = false;
        hasGameStarted = true;
    }

    if(isGameOver && Phaser.Input.Keyboard.JustDown(spacebar)){
        resetGame();
    }

    if(Phaser.Input.Keyboard.JustDown(spacebar)){
        player.setVelocityY(-400)
    }

    bottomPipes.children.iterate(pipe => {
        if(pipe.x < -10){
            bottomPipeY = Phaser.Math.Between(550, 850);
            pipe.setPosition(1200, bottomPipeY)
            playerScore++;
            scoreText.text = `Score: ${playerScore}`
        }
    });

    topPipes.children.iterate(pipe => {
        if(pipe.x < -10){

            pipe.setPosition(1200, bottomPipeY - 800)
        }
    });

    player.angle = (player.body.velocity['y'] / 20)


}

