const KEY_GROUNDED = 0;
const KEY_INAIR = 1;
const KEY_GRABBED = 2;

class Key extends Actor
{
    public static instance: Key;

    gravity: number = 10;
    maxFallSpeed: number = 240;

    public state: number = KEY_GROUNDED;
    
    public player: Player;

    constructor(player: Player)
    {
        super();
        Key.instance = this;

        this.player = player;

        this.sprite = GameScene.instance.add.sprite(48, 320-64, 'character', 8);
        this.sprite.setOrigin(0, 0);

        this.localHitbox = new Rectangle(0, 0, 8, 16);
    }

    Update()
    {
        if (this.state == KEY_INAIR)
        {
            if (this.speedY < this.maxFallSpeed)
            {
                this.speedY += this.gravity;
            }
            else if (this.speedY > this.maxFallSpeed)
            {
                this.speedY = this.maxFallSpeed;
            }
        }
    }

    public OnCollisionSolved(result: CollisionResult)
    {
        if (result.onBottom)
        {
            this.speedY = 0;
            this.state = KEY_GROUNDED;
        }

        if (result.onTop)
        {
            this.speedY = 0;
        }

        for (let i = 0; i < result.tiles.length; i++)
        {
            if (result.tiles[i] == undefined || !result.tiles[i].solid) continue;

            let hitbox = this.player.globalHitbox;

            if (result.tiles[i].hitbox.y == hitbox.bottom && hitbox.right > result.tiles[i].hitbox.x && hitbox.x < result.tiles[i].hitbox.right)
            {
                return;
            }
        }

        this.state = KEY_INAIR;
    }

}