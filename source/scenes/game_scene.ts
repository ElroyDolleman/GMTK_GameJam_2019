class GameScene extends Phaser.Scene
{
    public player: Player;

    constructor()
    {
        super({ key: 'GameScene', active: true});
    }

    preload()
    {
        console.log("Hello World!");

        this.load.spritesheet('character', 'assets/character.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('tilessheet', 'assets/tilessheet.png', { frameWidth: 16, frameHeight: 16 });
    }

    create()
    {
        this.player = new Player(this);
    }

    update()
    {
        this.player.Update();

        this.player.posX += this.player.speedX * (1/60);
        this.player.posY += this.player.speedY * (1/60);

        if (this.player.speedXDir < 0)
        {
            this.player.sprite.flipX = true;
        }
        else if (this.player.speedXDir > 0)
        {
            this.player.sprite.flipX = false;
        }

        console.log(this.player.posX);
    }

    draw()
    {
        
    }
}