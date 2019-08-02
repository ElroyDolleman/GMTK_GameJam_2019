/// <reference path="state_grounded.ts"/>

class IdleState extends GroundedState
{
    constructor(player: Player)
    {
        super(player);
    }

    public OnEnter()
    {
        this.player.sprite.setFrame(0);
    }

    public Update()
    {
        this.player.UpdateMoveControls();

        if (this.player.speedX != 0)
        {
            this.player.ChangeState(this.player.runState);
        }
    }

    public OnCollisionSolved()
    {

    }
}