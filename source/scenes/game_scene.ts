class GameScene extends Phaser.Scene
{
    public static instance: GameScene;

    public player: Player;
    public key: Key;

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
        this.key = new Key(this.player);

        this.player.key = this.key;

        this.tiles = LevelLoader.load(LEVEL01);
    }

    update()
    {
        this.player.Update();
        this.key.Update();

        this.moveActor(this.player);

        if (this.key.state != KEY_GRABBED)
        {
            this.moveActor(this.key);
        }
    }

    moveActor(actor: Actor)
    {
        // if (actor.speedX == 0 && actor.speedY == 0)
        // {
        //     return;
        // }

        let result = new CollisionResult();
        let hitbox = actor.nextHitbox;

        let gridX = Math.floor((hitbox.x - 1) / 16);
        let gridY = Math.floor((hitbox.y - 1) / 16);

        let endX = Math.floor((hitbox.right + 2) / 16);
        let endY = Math.floor((hitbox.bottom + 2) / 16);

        // X
        actor.posX += actor.speedX * (1/60);
        
        for (let x = gridX; x <= gridX + endX; x++)
        {
            for (let y = gridY; y <= gridY + endY; y++)
            {
                let i = x % 20 + y * 20;

                result.tiles.push(this.tiles[i]);

                if (this.tiles[i] == undefined || !this.tiles[i].solid || !this.tiles[i].hitbox.Intersects(actor.globalHitbox))
                {
                    continue;
                }

                if (actor.globalHitbox.x < this.tiles[i].hitbox.x)
                {
                    result.onRight = true;
                    actor.posX = this.tiles[i].hitbox.x - (actor.localHitbox.width + actor.localHitbox.x);
                }

                else if (actor.globalHitbox.right > this.tiles[i].hitbox.right)
                {
                    result.onLeft = true;
                    actor.posX = this.tiles[i].hitbox.right - actor.localHitbox.x;
                }
            }
        }

        // Y
        actor.posY += actor.speedY * (1/60);

        for (let x = gridX; x <= gridX + endX; x++)
        {
            for (let y = gridY; y <= gridY + endY; y++)
            {
                let i = x % 20 + y * 20;

                if (this.tiles[i] == undefined || !this.tiles[i].solid || !this.tiles[i].hitbox.Intersects(actor.globalHitbox))
                {
                    //if (x == 9) console.log(this.tiles[i].hitbox.Intersects(actor.globalHitbox));
                    continue;
                }

                if (actor.globalHitbox.y < this.tiles[i].hitbox.y)
                {
                    result.onBottom = true;
                    actor.posY = this.tiles[i].hitbox.y - (actor.localHitbox.height + actor.localHitbox.y);
                }

                else if (actor.globalHitbox.bottom > this.tiles[i].hitbox.bottom)
                {
                    result.onTop = true;
                    actor.posY = this.tiles[i].hitbox.bottom - actor.localHitbox.y;
                }
            }
        }

        actor.OnCollisionSolved(result);
    }

    draw()
    {
        
    }
}