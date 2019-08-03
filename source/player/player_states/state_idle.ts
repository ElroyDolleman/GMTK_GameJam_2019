/// <reference path="state_grounded.ts"/>

class IdleState extends GroundedState
{
    frame: number;

    constructor(player: Player)
    {
        super(player);
    }

    public OnEnter()
    {
        this.frame = !this.player.isHoldingKey ? 0 : 6;
        this.player.sprite.setFrame(this.frame);
    }

    public Update()
    {
        super.Update();

        this.player.UpdateMoveControls();

        if (this.player.speedX != 0 && this.player.currentState == this)
        {
            this.player.ChangeState(this.player.runState);
        }
        else if (this.player.isHoldingKey && this.frame == 0)
        {
            this.frame = 6;
            this.player.sprite.setFrame(this.frame);
        }
        else if (!this.player.isHoldingKey && this.frame == 6)
        {
            this.frame = 0;
            this.player.sprite.setFrame(this.frame);
        }
    }

    public OnCollisionSolved(result: CollisionResult)
    {
        super.OnCollisionSolved(result);
    }
}