class GameScene extends Phaser.Scene
{
    public static sfxOn: boolean = true;

    public levelOrder = [LEVEL01, LEVEL02, LEVEL03, LEVEL04, LEVEL05, LEVEL06, LEVEL_FINAL];
    public currentLevel = -1;

    public fruitsCollected = 0;

    public inputReset: Phaser.Input.Keyboard.Key;

    public static instance: GameScene;

    public player: Player;
    public key: Key;
    public fruit: Fruit;

    public keySpawn: Phaser.Geom.Point;
    public playerSpawn: Phaser.Geom.Point;
    public fruitSpawn: Phaser.Geom.Point;

    public prevPlayerHitbox: Rectangle;

    public tiles: Tile[] = [];

    public switchSound: Phaser.Sound.BaseSound;
    resetSound: Phaser.Sound.BaseSound;
    canReset: boolean = true;
    showTut: boolean = false;
    roomTime: number = 0;

    constructor()
    {
        super({ key: 'GameScene', active: true});

        GameScene.instance = this;
    }

    preload()
    {
        this.load.spritesheet('character', 'assets/character.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('tilessheet', 'assets/tilessheet.png', { frameWidth: 16, frameHeight: 16 });

        this.load.audio('jump', 'audio/player_jump.wav');
        this.load.audio('reset', 'audio/reset.wav');
        this.load.audio('key_use', 'audio/key_use.wav');
        this.load.audio('apple', 'audio/apple_collect.wav');
        this.load.audio('switch', 'audio/switch.wav');
    }

    create()
    {
        this.inputReset = this.input.keyboard.addKey('R');

        this.key = new Key();
        this.player = new Player(this);
        this.key.player = this.player;
        this.fruit = new Fruit();

        this.resetSound = this.sound.add('reset');
        this.switchSound = this.sound.add('switch');

        this.nextLevel();
    }

    nextLevel()
    {
        LevelLoader.unload();

        this.currentLevel = Math.min(this.currentLevel + 1, this.levelOrder.length - 1);

        this.tiles = LevelLoader.load(this.levelOrder[this.currentLevel]);
        
        this.resetObjects();

        this.roomTime = 0;
    }

    reset()
    {
        if (GameScene.sfxOn) this.resetSound.play();

        LevelLoader.reload();
        this.resetObjects();

        this.roomTime = 0;

        if (!this.fruit.active) {
            this.fruitsCollected--;
        }

        if (this.currentLevel == 1 && !this.key.active && this.showTut)
        {
            for (let i = 0; i < this.tiles.length; i++)
            {
                if (this.tiles[i].frame > 40) {
                    this.tiles[i].sprite.setVisible(false);
                }
            }
            this.showTut = false;
        }

        this.canReset = false;
        setTimeout(function() {
            this.canReset = true;
        }.bind(this), 500);
    }

    resetObjects()
    {
        if (this.player.isHoldingKey) this.player.ReleaseKey();

        this.key.SetActive(true);
        this.key.posX = this.keySpawn.x + (this.currentLevel == 5 ? 0 : 4);
        this.key.posY = this.keySpawn.y - 0.1;
        this.key.sprite.flipX = false;
        this.key.sprite.setOrigin(0, 0);
        this.key.disappearDust.Clear();

        if (GameScene.instance.currentLevel >= GameScene.instance.levelOrder.length - 1)
        {
            this.fruit.sprite.setVisible(false);
        }
        else
        {
            this.fruit.Reset();
            this.fruit.posX = this.fruitSpawn.x + (this.currentLevel == 4 ? 7 : 0);
            this.fruit.posY = this.fruitSpawn.y - 8;
        }

        this.player.posX = this.playerSpawn.x;
        this.player.posY = this.playerSpawn.y;
        this.player.speedX = 0;
        this.player.speedY = 0;
        this.player.sprite.flipX = false;
        this.player.ChangeState(this.player.idleState);
    }

    showReset()
    {
        if (this.currentLevel > 2) return;

        this.showTut = true;

        setTimeout(function() {
            if ((this.currentLevel == 1 || this.currentLevel == 2) && (!this.key.active || this.roomTime > 35) && this.showTut) 
            {
                for (let i = 0; i < this.tiles.length; i++)
                {
                    if (this.tiles[i].frame > 40) {
                        this.tiles[i].sprite.setVisible(true);
                    }
                }
            }
        }.bind(this), 8000);
    }

    update()
    {
        if (this.player.posY < -48) {
            return;
        }

        if (this.currentLevel == 0)
        {
            let gridX = Math.floor((this.player.posX + 2) / 16);
            let gridY = Math.floor((this.player.posY + 2) / 16);

            if ((gridX == 10 || gridX == 11) && gridY == 14 && !this.player.isHoldingKey)
            {
                this.tiles[11 % 21 + 13 * 21].sprite.setVisible(true);
            }
            else
            {
                this.tiles[11 % 21 + 13 * 21].sprite.setVisible(false);
            }
        }
        else if ((this.currentLevel == 1 && !this.key.active && !this.showTut) ||
                (this.currentLevel == 2 && !this.key.active && this.key.posY < 260 && !this.showTut))
        {
            this.showReset();
        }

        this.roomTime += 1/60;
        if (this.roomTime > 35 && !this.showTut && this.currentLevel > 0)
        {
            this.showReset();
        }

        if (this.player.active) this.player.Update();

        this.key.Update();
        this.prevPlayerHitbox = this.player.globalHitbox;

        this.moveActor(this.player);
        this.moveActor(this.key, this.key.state != KEY_GRABBED);

        if (this.player.posX < 0) this.player.posX = 0;
        if (this.key.posX < 2 && !this.player.isHoldingKey) {
            this.key.posX = 2;
        }

        this.fruit.Update();

        if (this.player.posX > 330)
        {
            this.nextLevel();
        }
        else if (Phaser.Input.Keyboard.JustDown(this.inputReset) && this.canReset && this.currentLevel < this.levelOrder.length - 1)
        {
            this.reset();
            //this.player.posX = 333;
        }
    }

    moveActor(actor: Actor, solveCollision: boolean = true)
    {
        if (!actor.active) return;

        let result = new CollisionResult();
        let hitbox = actor.nextHitbox;

        let gridX = Math.floor((hitbox.x - 1) / 16);
        let gridY = Math.floor((hitbox.y - 1) / 16);

        let endX = Math.floor((hitbox.right + 2) / 16);
        let endY = Math.floor((hitbox.bottom + 2) / 16);

        for (let x = gridX; x <= gridX + endX; x++)
        {
            for (let y = gridY; y <= gridY + endY; y++)
            {
                result.tiles.push(this.tiles[x % 21 + y * 21]);
            }
        }

        actor.BeforeCollisionCheck(result.tiles);

        if (!solveCollision) return;

        // X
        actor.posX += actor.speedX * (1/60);
        
        for (let x = gridX; x <= gridX + endX; x++)
        {
            for (let y = gridY; y <= gridY + endY; y++)
            {
                let i = x % 21 + y * 21;

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
        let prevY = actor.globalHitbox.bottom;
        actor.posY += actor.speedY * (1/60);

        for (let x = gridX; x <= gridX + endX; x++)
        {
            for (let y = gridY; y <= gridY + endY; y++)
            {
                let i = x % 21 + y * 21;

                if (this.tiles[i] == undefined || !this.tiles[i].hitbox.Intersects(actor.globalHitbox)) continue;
                if (!this.tiles[i].solid && !this.tiles[i].semisolid) continue;

                if (this.tiles[i].semisolid)
                {
                    if (prevY < this.tiles[i].hitbox.y && actor.globalHitbox.bottom > this.tiles[i].hitbox.y)
                    {
                        result.onBottom = true;
                        actor.posY = this.tiles[i].hitbox.y - (actor.localHitbox.height + actor.localHitbox.y);
                    }
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