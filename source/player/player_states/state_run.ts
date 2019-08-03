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
        this.curFrame = !this.player.isHoldingKey ? 0 : 7;
        this.animTimer = 0;

        this.player.sprite.setFrame(this.curFrame);
    }

    public Update()
    {
        super.Update();

        this.player.UpdateMoveControls();

        if (this.player.currentState != this)
        {
            return;
        }

        if (this.player.speedX == 0)
        {
            this.player.ChangeState(this.player.idleState);
        }
        else
        {
            this.animTimer += (1/60);

            if (this.animTimer > 0.2 * (100 / Math.abs(this.player.speedX)))
            {
                this.animTimer = 0;

                if (this.curFrame == 1) this.curFrame = 0;
                else if (this.curFrame == 0) this.curFrame = 1;
                else if (this.curFrame == 6) this.curFrame = 7;
                else if (this.curFrame == 7) this.curFrame = 6;

                this.player.sprite.setFrame(this.curFrame);
            }
        }
    }

    public OnCollisionSolved(result: CollisionResult)
    {
        super.OnCollisionSolved(result);
    }
}