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

        //this.load.spritesheet();

        this.player = new Player();
    }

    create()
    {
        
    }

    update()
    {
        this.player.Update();
    }

    draw()
    {
        
    }
}