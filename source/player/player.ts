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

    constructor(scene: Phaser.Scene)
    {
        super();

        this.scene = scene;

        this.sprite = this.scene.add.sprite(0, 320-16, 'character');
        this.sprite.setOrigin(0, 0);

        this.inputUp = this.scene.input.keyboard.addKey('W');
        this.inputDown = this.scene.input.keyboard.addKey('S');
        this.inputLeft = this.scene.input.keyboard.addKey('A');
        this.inputRight = this.scene.input.keyboard.addKey('D');

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
    }

    public UpdateMoveControls()
    {
        if (this.inputLeft.isDown)
        {
            if (this.speedX > -120)
            {
                this.speedX = Math.max(this.speedX - 30, -120);
            }
        }
        else if (this.inputRight.isDown)
        {
            if (this.speedX < 120)
            {
                this.speedX = Math.min(this.speedX + 30, 120);
            }
        }
        else
        {
            if (Math.abs(this.speedX) < 30)
            {
                this.speedX = 0;
            }
            else
            {
                this.speedX -= 30 * this.speedXDir;
            }
        }
    }
}