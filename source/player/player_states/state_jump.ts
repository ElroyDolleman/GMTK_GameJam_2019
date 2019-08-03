/// <reference path="state_airborne.ts"/>

class JumpState extends AirborneState
{
    constructor(player: Player)
    {
        super(player);
    }

    public OnEnter()
    {
        this.player.speedY = -200;
        this.player.sprite.setFrame(2);
    }

    public Update()
    {
        super.Update();

        if (this.player.speedY >= 0)
        {
            this.player.ChangeState(this.player.fallState);
        }
    }

    public OnCollisionSolved(result: CollisionResult)
    {
        super.OnCollisionSolved(result);
    }
}