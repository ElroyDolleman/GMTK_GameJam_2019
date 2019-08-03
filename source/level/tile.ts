const TILETYPE_EMPTY = 0;
const TILETYPE_SOLID = 1;

class Tile
{
    public hitbox: Rectangle;
    public tileType: number;
    public sprite: Phaser.GameObjects.Sprite;

    public get solid(): boolean { return this.tileType == TILETYPE_SOLID; }

    constructor(hitbox: Rectangle, tileType: number, frame: number)
    {
        this.hitbox = hitbox;
        this.tileType = tileType;

        if (tileType > 0)
        {
            this.sprite = GameScene.instance.add.sprite(hitbox.x, hitbox.y, 'tilessheet', frame);
            this.sprite.setOrigin(0, 0);
        }
    }
}