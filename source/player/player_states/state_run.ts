/// <reference path="state_grounded.ts"/>

class RunState extends GroundedState
{
    animTimer: number;
    curFrame: number;

    constructor(player: Player)
    {
        super(player);
    }

    public OnEnter()
    {
        this.curFrame = 1;
        this.animTimer = 0;

        this.player.sprite.setFrame(this.curFrame);
    }

    public Update()
    {
        this.player.UpdateMoveControls();

        if (this.player.speedX == 0)
        {
            this.player.ChangeState(this.player.idleState);
        }
        else
        {
            this.animTimer += (1/60);

            if (this.animTimer > 0.2)
            {
                this.animTimer = 0;
                this.curFrame = this.curFrame == 1 ? 0 : 1;
                this.player.sprite.setFrame(this.curFrame);
            }
        }
    }

    public OnCollisionSolved()
    {

    }
}