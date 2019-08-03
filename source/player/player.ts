/// <reference path="../actor.ts"/>

class Player extends Actor
{
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
    public inputHold: Phaser.Input.Keyboard.Key;

    public key: Key;
    public get holdsKey(): boolean { return this.key.state == KEY_GRABBED; }

    constructor(scene: Phaser.Scene)
    {
        super();

        this.scene = scene;

        this.sprite = this.scene.add.sprite(16, 320-48, 'character');
        this.sprite.setOrigin(0, 0);

        this.localHitbox = new Rectangle(3, 1, 10, 15);

        this.inputUp = this.scene.input.keyboard.addKey('up');
        this.inputDown = this.scene.input.keyboard.addKey('down');
        this.inputLeft = this.scene.input.keyboard.addKey('left');
        this.inputRight = this.scene.input.keyboard.addKey('right');

        this.inputJump = this.scene.input.keyboard.addKey('Z');
        this.inputHold = this.scene.input.keyboard.addKey('X');

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

        if (this.holdsKey)
        {
            //this.key.posX = this.globalHitbox.right;
            //this.key.posY = this.posY;
        }
    }

    public OnCollisionSolved(result: CollisionResult)
    {
        this.currentState.OnCollisionSolved(result);

        if (!this.holdsKey && this.inputHold.isDown && this.key.globalHitbox.Intersects(this.globalHitbox))
        {
            this.key.state = KEY_GRABBED;
        }

        if (this.holdsKey)
        {
            this.key.posX = this.globalHitbox.right;
            this.key.posY = this.posY;

            if (this.inputHold.isUp)
            {
                this.key.state = KEY_INAIR;
            }
        }
    }

    public UpdateMoveControls()
    {
        if (this.inputLeft.isDown)
        {
            if (this.speedX > -100)
            {
                this.speedX = Math.max(this.speedX - 20, -100);
            }
        }
        else if (this.inputRight.isDown)
        {
            if (this.speedX < 100)
            {
                this.speedX = Math.min(this.speedX + 20, 100);
            }
        }
        else
        {
            if (Math.abs(this.speedX) < 20)
            {
                this.speedX = 0;
            }
            else
            {
                this.speedX -= 20 * this.speedXDir;
            }
        }
    }
}