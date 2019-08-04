class Fruit
{
    public get hitbox(): Rectangle { return new Rectangle(this.posX + 2, this.originalPosY + 1, 12, 14); };

    public get posX(): number { return this.sprite.x; };
    public get posY(): number { return this.sprite.y; };

    public set posX(x: number) { this.sprite.setX(x); };
    public set posY(y: number) { this.sprite.setY(y); this.originalPosY = y; this.animMoveTimer = 0.5; };

    public sprite: Phaser.GameObjects.Sprite;
    public grabFeedback: Phaser.GameObjects.Sprite;

    public active: boolean = true;

    animTimer: number = 0;
    animMoveTimer: number = 0;
    moveDir: number = 1;
    curFrame: number = 9;

    originalPosY: number;

    collectSound: Phaser.Sound.BaseSound;

    constructor()
    {
        this.sprite = GameScene.instance.add.sprite(48, 320-64, 'character', this.curFrame);
        this.sprite.setOrigin(0, 0);

        this.grabFeedback = GameScene.instance.add.sprite(48, 320-64, 'character', 11);
        this.grabFeedback.setOrigin(0, 0);
        this.grabFeedback.setVisible(false);

        this.collectSound = GameScene.instance.sound.add('apple');
    }

    Grab()
    {
        this.active = false;
        this.curFrame = 12;
        this.sprite.setFrame(12);
        this.animTimer = 0;
        this.grabFeedback.setVisible(true);
        this.grabFeedback.setPosition(this.posX, this.posY - 12);

        if (GameScene.sfxOn) this.collectSound.play();
    }

    Reset()
    {
        this.sprite.setVisible(true);
        this.active = true;
        this.animTimer = 0;
        this.grabFeedback.setVisible(false);
        this.curFrame = 9;
        this.sprite.setFrame(9);
    }

    Update()
    {
        if (!this.active)
        {
            if (this.grabFeedback.visible) {
                if (this.grabFeedback.y < this.posY - 36) {
                    this.grabFeedback.setVisible(false);
                }
                else {
                    this.grabFeedback.setPosition(this.posX, this.grabFeedback.y - 24 * (1/60));
                }
            }

            if (this.curFrame > 14) return;

            this.animTimer += (1/60);
            if (this.animTimer > 0.1)
            {
                this.animTimer -= 0.1;
                this.curFrame++;
                this.sprite.setFrame(this.curFrame);

                if (this.curFrame > 14) {
                    this.sprite.setVisible(false);
                }
            }
            return;
        }

        this.animTimer += (1/60);
        this.animMoveTimer += (1/61) * this.moveDir;

        if (this.animTimer >= 0.4)
        {
            this.animTimer -= 0.4;
            this.curFrame = this.curFrame == 9 ? 10 : 9;
            this.sprite.setFrame(this.curFrame);
        }

        if (this.animMoveTimer >= 1 && this.moveDir == 1)
        {
            this.moveDir = -1;
            this.animMoveTimer = 1 - (this.animMoveTimer - 1);
        }
        else if (this.animMoveTimer <= 0 && this.moveDir == -1)
        {
            this.moveDir = 1;
            this.animMoveTimer = Math.abs(this.animMoveTimer);
        }

        let ease = this.EaseInOutCubic(this.animMoveTimer);
        this.sprite.y = this.originalPosY - 1 + ease * 2

        if (GameScene.instance.player.globalHitbox.Intersects(this.hitbox))
        {
            this.Grab();
            GameScene.instance.fruitsCollected++;
        }
    }

    EaseInOutCubic(t: number): number 
    { 
        return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 
    }
}