class GameScene extends Phaser.Scene
{
    public static instance: GameScene;

    public player: Player;
    public tiles: Tile[];

    constructor()
    {
        super({ key: 'GameScene', active: true});

        GameScene.instance = this;
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

        this.tiles = LevelLoader.load(LEVEL01);
    }

    update()
    {
        this.player.Update();

        this.moveActor(this.player);
    }

    moveActor(actor: Actor)
    {
        let gridX = Math.floor(actor.nextPosX / 16);
        let gridY = Math.floor(actor.nextPosY / 16);

        // X
        actor.posX += actor.speedX * (1/60);
        
        for (let x = gridX; x <= gridX + 1; x++)
        {
            for (let y = gridY; y <= gridY + 1; y++)
            {
                let i = x % 20 + y * 20;

                if (this.tiles[i] == undefined || !this.tiles[i].solid || !this.tiles[i].hitbox.Intersects(actor.globalHitbox))
                {
                    //if (x == 9) console.log(this.tiles[i].hitbox.Intersects(actor.globalHitbox));
                    continue;
                }

                if (actor.globalHitbox.x < this.tiles[i].hitbox.x)
                {
                    console.log("on right", x, y);
                    actor.posX = this.tiles[i].hitbox.x - (actor.localHitbox.width + actor.localHitbox.x);
                }

                else if (actor.globalHitbox.right > this.tiles[i].hitbox.right)
                {
                    console.log("on left", x, y);
                    actor.posX = this.tiles[i].hitbox.right - actor.localHitbox.x;
                }
            }
        }

        // Y
        actor.posY += actor.speedY * (1/60);

        for (let x = gridX; x <= gridX + 1; x++)
        {
            for (let y = gridY; y <= gridY + 1; y++)
            {
                let i = x % 20 + y * 20;

                if (this.tiles[i] == undefined || !this.tiles[i].solid || !this.tiles[i].hitbox.Intersects(actor.globalHitbox))
                {
                    //if (x == 9) console.log(this.tiles[i].hitbox.Intersects(actor.globalHitbox));
                    continue;
                }

                if (actor.globalHitbox.y < this.tiles[i].hitbox.y)
                {
                    console.log("on bottom", x, y);
                    actor.posY = this.tiles[i].hitbox.y - (actor.localHitbox.height + actor.localHitbox.y);
                }

                else if (actor.globalHitbox.bottom > this.tiles[i].hitbox.bottom)
                {
                    console.log("on top", x, y);
                    actor.posY = this.tiles[i].hitbox.bottom - actor.localHitbox.y;
                }
            }
        }

        if (actor.speedXDir < 0)
        {
            actor.sprite.flipX = true;
        }
        else if (actor.speedXDir > 0)
        {
            actor.sprite.flipX = false;
        }
    }

    draw()
    {
        
    }
}