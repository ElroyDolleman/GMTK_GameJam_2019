/// <reference path="state_grounded.ts"/>

class IdleState extends GroundedState
{
    constructor(player: Player)
    {
        super(player);
    }

    public OnEnter()
    {
        this.player.sprite.setFrame(!this.player.isHoldingKey ? 0 : 6);
    }

    public Update()
    {
        super.Update();

        this.player.UpdateMoveControls();

        if (this.player.speedX != 0 && this.player.currentState == this)
        {
            this.player.ChangeState(this.player.runState);
        }
    }

    public OnCollisionSolved(result: CollisionResult)
    {
        super.OnCollisionSolved(result);
    }
}