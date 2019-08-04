/// <reference path="../actor.ts"/>

const BASE_JUMPPOWER = 220;
const BASE_MAXRUNSPEED = 100;
const BASE_ACCELSPEED = 20;
const BASE_GRAVITY = 11.5;

const KEYHOLD_JUMPPOWER = 200;
const KEYHOLD_MAXRUNSPEED = 80;
const KEYHOLD_ACCELSPEED = 10;
const KEYHOLD_GRAVITY = 14.5;

class Player extends Actor
{
    public maxRunSpeed = BASE_MAXRUNSPEED;
    public accelSpeed = BASE_ACCELSPEED;
    public jumpPower = BASE_JUMPPOWER;
    public gravity = BASE_GRAVITY;

    public idleState: IdleState;
    public runState: RunState;
    public jumpState: JumpState;
    public fallState: FallState;

    public currentState: BaseState;

    public scene: Phaser.Scene;

    public inputUp: Phaser.Input.Keyboard.Key;
    public inputDown: Phaser.Input.Keyboard.Key;
    public inputLeft: Phaser.Input.Keyboard.Key;
    public inputRight: Phaser.Input.Keyboard.Key;

    public inputJump: Phaser.Input.Keyboard.Key;
    public inputGrab: Phaser.Input.Keyboard.Key;

    public keyRegrabable = true;
    public key: Key;
    public get isHoldingKey(): boolean { return this.key.state == KEY_GRABBED; }

    public hitboxWidth = 10;
    public hitboxX = 3;

    public landingDust: LandingDust;

    constructor(scene: Phaser.Scene)
    {
        super();

        this.scene = scene;
        this.key = GameScene.instance.key;

        this.sprite = this.scene.add.sprite(16, 320-48, 'character');
        this.sprite.setOrigin(0, 0);

        this.localHitbox = new Rectangle(this.hitboxX, 1, this.hitboxWidth, 15);

        this.inputUp = this.scene.input.keyboard.addKey('up');
        this.inputDown = this.scene.input.keyboard.addKey('down');
        this.inputLeft = this.scene.input.keyboard.addKey('left');
        this.inputRight = this.scene.input.keyboard.addKey('right');

        this.inputJump = this.scene.input.keyboard.addKey('Space');
        this.inputGrab = this.scene.input.keyboard.addKey('Z');

        this.landingDust = new LandingDust(0, 0);

        this.idleState = new IdleState(this);
        this.runState = new RunState(this);
        this.jumpState = new JumpState(this);
        this.fallState = new FallState(this);

        this.ChangeState(this.idleState);
    }

    public ChangeState(state: BaseState)
    {
        this.currentState = state;
        this.currentState.OnEnter();
    }

    public Update()
    {
        this.currentState.Update();

        this.landingDust.Update();
    }

    public OnCollisionSolved(result: CollisionResult)
    {
        this.currentState.OnCollisionSolved(result);

        if (this.speedXDir < 0)
        {
            this.sprite.flipX = true;
        }
        else if (this.speedXDir > 0)
        {
            this.sprite.flipX = false;
        }

        if (!this.key.active)
        {
            if (this.isHoldingKey)
            {
                this.ReleaseKey();
            }
            return;
        }

        let releaseKey = false;

        if (!this.keyRegrabable){
            this.keyRegrabable = this.inputGrab.isUp;
        }

        if (!this.isHoldingKey && this.keyRegrabable && this.inputGrab.isDown && this.currentState != this.jumpState && this.key.globalHitbox.IntersectsOrNextTo(this.globalHitbox))
        {
            this.GrabKey();
        }
        else if (this.isHoldingKey && this.inputGrab.isUp)
        {
            releaseKey = true;
        }

        if (this.isHoldingKey)
        {
            if (this.sprite.flipX)
            {
                this.key.sprite.flipX = true;
                this.key.sprite.setOrigin(0.5, 0);

                this.localHitbox.x = this.hitboxX - (this.key.localHitbox.width - 2);
            }
            else if (!this.sprite.flipX)
            {
                this.key.sprite.flipX = false;
                this.key.sprite.setOrigin(0, 0);

                this.localHitbox.x = this.hitboxX;
            }

            this.key.posX = !this.sprite.flipX ? this.globalHitbox.x + this.hitboxWidth : this.globalHitbox.x;
            this.key.posY = this.posY;

            if (releaseKey) this.ReleaseKey();
        }
    }

    public GrabKey()
    {
        this.key.state = KEY_GRABBED;
        this.localHitbox.width = this.hitboxWidth + this.key.localHitbox.width - 2;

        this.maxRunSpeed = KEYHOLD_MAXRUNSPEED;
        this.accelSpeed = KEYHOLD_ACCELSPEED;
        this.jumpPower = KEYHOLD_JUMPPOWER;
        this.gravity = KEYHOLD_GRAVITY;
    }

    public ReleaseKey()
    {
        this.keyRegrabable = this.inputGrab.isUp;

        this.key.state = KEY_GROUNDED;
        //this.key.speedY = -0.1;

        this.localHitbox.x = this.hitboxX;
        this.localHitbox.width = this.hitboxWidth;

        this.maxRunSpeed = BASE_MAXRUNSPEED;
        this.accelSpeed = BASE_ACCELSPEED;
        this.jumpPower = BASE_JUMPPOWER;
        this.gravity = BASE_GRAVITY;
    }

    public UpdateMoveControls()
    {
        if (this.inputLeft.isDown)
        {
            if (this.speedX > -this.maxRunSpeed)
            {
                this.speedX = Math.max(this.speedX - this.accelSpeed, -this.maxRunSpeed);
            }
            else if (this.speedX < -this.maxRunSpeed)
            {
                this.speedX = Math.min(this.speedX + this.accelSpeed, -this.maxRunSpeed);
            }
        }
        else if (this.inputRight.isDown)
        {
            if (this.speedX < this.maxRunSpeed)
            {
                this.speedX = Math.min(this.speedX + this.accelSpeed, this.maxRunSpeed);
            }
            else if (this.speedX > this.maxRunSpeed)
            {
                this.speedX = Math.max(this.speedX - this.accelSpeed, this.maxRunSpeed);
            }
        }
        else
        {
            if (Math.abs(this.speedX) < this.accelSpeed)
            {
                this.speedX = 0;
            }
            else
            {
                this.speedX -= this.accelSpeed * this.speedXDir;
            }
        }
    }
}