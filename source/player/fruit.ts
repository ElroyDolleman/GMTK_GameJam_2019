class Fruit
{
    public get hitbox(): Rectangle { return new Rectangle(this.posX + 2, this.posY + 1, 12, 14); };

    public get posX(): number { return this.sprite.x; };
    public get posY(): number { return this.sprite.y; };

    public set posX(x: number) { this.sprite.setX(x); };
    public set posY(y: number) { this.sprite.setY(y); };

    public sprite: Phaser.GameObjects.Sprite;

    public get active(): boolean { return this.sprite.visible; };
    public set active(a: boolean) { this.sprite.setVisible(a); };

    animTimer: number = 0;
    curFrame: number = 9;

    constructor()
    {
        this.sprite = GameScene.instance.add.sprite(48, 320-64, 'character', this.curFrame);
        this.sprite.setOrigin(0, 0);
    }

    Update()
    {
        this.animTimer += (1/60);

        if (this.animTimer >= 0.5)
        {
            this.animTimer -= 0.5;
            this.curFrame = this.curFrame == 9 ? 10 : 9;
            this.sprite.setFrame(this.curFrame);
        }

        if (GameScene.instance.player.globalHitbox.Intersects(this.hitbox))
        {
            this.active = false;
            GameScene.instance.fruitsCollected++;
        }
    }
}