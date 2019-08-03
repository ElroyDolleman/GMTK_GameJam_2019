class Actor
{
    public sprite: Phaser.GameObjects.Sprite;

    public get posX(): number { return this.sprite.x; };
    public get posY(): number { return this.sprite.y; };

    public set posX(x: number) { this.sprite.setX(x); };
    public set posY(y: number) { this.sprite.setY(y); };

    public get nextPosX(): number { return this.sprite.x + this.speedX * (1/60); };
    public get nextPosY(): number { return this.sprite.y + this.speedY * (1/60); };

    public get nextHitbox(): Rectangle { return new Rectangle(this.nextPosX + this.localHitbox.x, this.nextPosY + this.localHitbox.y, this.localHitbox.width, this.localHitbox.height); }

    public speedX: number = 0;
    public speedY: number = 0;

    public get speedXDir(): number { return this.speedX == 0 ? 0 : (this.speedX > 0 ? 1 : -1); }
    public get speedYDir(): number { return this.speedY == 0 ? 0 : (this.speedY > 0 ? 1 : -1); }

    public localHitbox: Rectangle;
    public get globalHitbox(): Rectangle { return new Rectangle(this.posX + this.localHitbox.x, this.posY + this.localHitbox.y, this.localHitbox.width, this.localHitbox.height); }

    constructor()
    {

    }

    public OnCollisionSolved(result: CollisionResult)
    {

    }
}