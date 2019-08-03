const TILETYPE_EMPTY = 0;
const TILETYPE_SOLID = 1;
const TILETYPE_KEYBLOCK = 2;

class Tile
{
    public hitbox: Rectangle;
    public tileType: number;
    public sprite: Phaser.GameObjects.Sprite;

    public connections: Phaser.Geom.Point[] = [];

    public get solid(): boolean { return this.tileType == TILETYPE_SOLID || this.tileType == TILETYPE_KEYBLOCK; }

    constructor(hitbox: Rectangle, tileType: number, frame: number)
    {
        this.hitbox = hitbox;
        this.tileType = tileType;

        if (tileType > 0)
        {
            this.sprite = GameScene.instance.add.sprite(hitbox.x, hitbox.y, 'tilessheet', frame);
            this.sprite.setOrigin(0, 0);
        }

        if (tileType == TILETYPE_KEYBLOCK)
        {
            switch(frame)
            {
                case 19: case 20: this.connections.push(new Phaser.Geom.Point(hitbox.x / 16, hitbox.y / 16 + 1)); break;
                case 27: case 28: this.connections.push(new Phaser.Geom.Point(hitbox.x / 16, hitbox.y / 16 - 1)); break;
                case 25: 
                    this.connections.push(new Phaser.Geom.Point(hitbox.x / 16, hitbox.y / 16 - 1));
                    this.connections.push(new Phaser.Geom.Point(hitbox.x / 16, hitbox.y / 16 + 1));
                    break;
            }
        }
    }

    Unlock()
    {
        this.tileType = TILETYPE_EMPTY;
        this.sprite.setVisible(false);

        while(this.connections.length > 0)
        {
            let index = this.connections[0].x % 20 + this.connections[0].y * 20;

            if (GameScene.instance.tiles[index].tileType == TILETYPE_KEYBLOCK)
            {
                GameScene.instance.tiles[index].Unlock();
            }

            this.connections.splice(0, 1);
        }
    }
}