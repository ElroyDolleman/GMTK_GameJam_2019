/// <reference path="basestate.ts"/>

class GroundedState extends BaseState
{
    constructor(player: Player)
    {
        super(player);
    }

    public OnEnter()
    {
        
    }

    public Update()
    {
        if (this.player.inputJump.isDown)
        {
            this.player.ChangeState(this.player.jumpState);
        }
    }

    public OnCollisionSolved()
    {

    }
}