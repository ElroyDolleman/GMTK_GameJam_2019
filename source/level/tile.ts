const TILETYPE_EMPTY = 0;
const TILETYPE_SOLID = 1;
const TILETYPE_KEYBLOCK = 2;
const TILETYPE_SEMISOLID = 3;
const TILETYPE_TRANSLUCENT_KEYBLOCK = 4;
const TILETYPE_SWITCH = 5;
const TILETYPE_SWITCH_BLOCK_SOLID = 6;
const TILETYPE_SWITCH_BLOCK_TRANSLUCENT = 7;
const TILETYPE_SECRET_HEARTH = 8;

class Tile
{
    public static toggleStatus: boolean = false;

    public hitbox: Rectangle;
    public tileType: number;
    public sprite: Phaser.GameObjects.Sprite;

    public connections: Phaser.Geom.Point[] = [];

    public get solid(): boolean { return this.tileType == TILETYPE_SOLID || this.tileType == TILETYPE_KEYBLOCK || this.tileType == TILETYPE_SWITCH_BLOCK_SOLID; }
    public get semisolid(): boolean { return this.tileType == TILETYPE_SEMISOLID; }

    frame: number;

    constructor(hitbox: Rectangle, tileType: number, frame: number)
    {
        this.hitbox = hitbox;
        this.tileType = tileType;
        this.frame = frame;

        if (frame >= 0)
        {
            this.sprite = GameScene.instance.add.sprite(hitbox.x, hitbox.y, 'tilessheet', frame);
            this.sprite.setOrigin(0, 0);

            if (GameScene.instance.currentLevel > 0 && GameScene.instance.currentLevel < GameScene.instance.levelOrder.length - 1 && frame > 40)
            {
                this.sprite.setVisible(false);
            }
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
        else if (tileType == TILETYPE_TRANSLUCENT_KEYBLOCK)
        {
            switch(frame)
            {
                case 21: this.connections.push(new Phaser.Geom.Point(hitbox.x / 16, hitbox.y / 16 + 1)); break;
                case 29: this.connections.push(new Phaser.Geom.Point(hitbox.x / 16, hitbox.y / 16 - 1)); break;
            }
        }
    }

    public static ToggleSwitch()
    {
        if (GameScene.sfxOn) GameScene.instance.switchSound.play();

        Tile.toggleStatus = !Tile.toggleStatus;

        for (let i = 0; i < GameScene.instance.tiles.length; i++)
        {
            let tile = GameScene.instance.tiles[i];

            if (tile.tileType == TILETYPE_KEYBLOCK)
            {
                if (tile.frame == 19) tile.frame = 21;
                else if (tile.frame == 27) tile.frame = 29;
                else if (tile.frame == 26) tile.frame = 30;

                tile.sprite.setFrame(tile.frame);
                tile.tileType = TILETYPE_TRANSLUCENT_KEYBLOCK;
            }
            else if (tile.tileType == TILETYPE_TRANSLUCENT_KEYBLOCK)
            {
                if (tile.frame == 21) tile.frame = 19;
                else if (tile.frame == 29) tile.frame = 27;
                else if (tile.frame == 30) tile.frame = 26;

                tile.sprite.setFrame(tile.frame);
                tile.tileType = TILETYPE_KEYBLOCK;
            }
            else if (tile.tileType == TILETYPE_SWITCH_BLOCK_TRANSLUCENT)
            {
                if (tile.frame == 23) tile.frame = 39;
                else if (tile.frame == 31) tile.frame = 38;
                else if (tile.frame == 36) tile.frame = 37;

                tile.sprite.setFrame(tile.frame);
                tile.tileType = TILETYPE_SWITCH_BLOCK_SOLID;
            }
            else if (tile.tileType == TILETYPE_SWITCH_BLOCK_SOLID)
            {
                if (tile.frame == 39) tile.frame = 23;
                else if (tile.frame == 38) tile.frame = 31;
                else if (tile.frame == 37) tile.frame = 36;

                tile.sprite.setFrame(tile.frame);
                tile.tileType = TILETYPE_SWITCH_BLOCK_TRANSLUCENT;
            }
            else if (tile.tileType == TILETYPE_SWITCH)
            {
                tile.sprite.flipX = Tile.toggleStatus;
            }
        }
    }

    Unlock()
    {
        if (this.tileType == TILETYPE_KEYBLOCK)
        {
            this.tileType = TILETYPE_EMPTY;
            this.sprite.setVisible(false);

            while(this.connections.length > 0)
            {
                let index = this.connections[0].x % 21 + this.connections[0].y * 21;

                if (GameScene.instance.tiles[index].tileType == TILETYPE_KEYBLOCK)
                {
                    GameScene.instance.tiles[index].Unlock();
                }

                this.connections.splice(0, 1);
            }
        }
        else if (this.tileType == TILETYPE_TRANSLUCENT_KEYBLOCK)
        {
            this.tileType = TILETYPE_SOLID;

            if (this.frame == 30) this.sprite.setFrame(22);
            if (this.frame == 21) this.sprite.setFrame(20);
            if (this.frame == 29) this.sprite.setFrame(28);

            while(this.connections.length > 0)
            {
                let index = this.connections[0].x % 21 + this.connections[0].y * 21;

                if (GameScene.instance.tiles[index].tileType == TILETYPE_TRANSLUCENT_KEYBLOCK)
                {
                    GameScene.instance.tiles[index].Unlock();
                }

                this.connections.splice(0, 1);
            }
        }
    }
}