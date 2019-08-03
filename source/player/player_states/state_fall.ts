/// <reference path="state_airborne.ts"/>

class FallState extends AirborneState
{
    constructor(player: Player)
    {
        super(player);
    }

    public OnEnter()
    {
        this.player.sprite.setFrame(3);
    }

    public Update()
    {
        super.Update();
    }

    public OnCollisionSolved(result: CollisionResult)
    {
        super.OnCollisionSolved(result);
    }
}