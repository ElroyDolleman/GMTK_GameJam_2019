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

    public disappearDust: DisappearDust;

    useSound: Phaser.Sound.BaseSound;

    constructor()
    {
        super();
        Key.instance = this;

        this.sprite = GameScene.instance.add.sprite(48, 320-64, 'character', 8);
        this.sprite.setOrigin(0, 0);

        this.localHitbox = new Rectangle(0, 0, 8, 16);

        this.disappearDust = new DisappearDust(0,0);

        this.useSound = GameScene.instance.sound.add('key_use');
    }

    Update()
    {
        if (!this.active)
        {
            this.disappearDust.Update();
            return;
        }

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

    public BeforeCollisionCheck(tiles: Tile[])
    {
        let used = false;

        for (let i = 0; i < tiles.length; i++)
        {
            if (tiles[i] == undefined) continue;

            if ((tiles[i].tileType == TILETYPE_KEYBLOCK || tiles[i].tileType == TILETYPE_TRANSLUCENT_KEYBLOCK) && tiles[i].hitbox.Intersects(this.nextHitbox))
            {
                tiles[i].Unlock();
                used = true;
            }
        }

        if (used) this.Used();
    }

    public Used()
    {
        this.disappearDust.position = new Phaser.Geom.Point(this.globalHitbox.centerX, this.globalHitbox.centerY);
        this.disappearDust.Play();

        this.SetActive(false);

        if (GameScene.sfxOn) this.useSound.play();
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
            if (result.tiles[i] == undefined || (!result.tiles[i].solid && !result.tiles[i].semisolid)) continue;

            let hitbox = this.globalHitbox;

            if (result.tiles[i].hitbox.y == hitbox.bottom && hitbox.right > result.tiles[i].hitbox.x && hitbox.x < result.tiles[i].hitbox.right)
            {
                return;
            }
        }

        this.state = KEY_INAIR;
    }

}