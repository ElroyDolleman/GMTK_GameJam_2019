/// <reference path="basestate.ts"/>

class AirborneState extends BaseState
{
    gravity: number = 10;
    maxFallSpeed: number = 240;

    constructor(player: Player)
    {
        super(player);
    }

    public OnEnter()
    {

    }

    public Update()
    {
        this.player.UpdateMoveControls();

        if (this.player.speedY < this.maxFallSpeed)
        {
            this.player.speedY += this.gravity;
        }
        else if (this.player.speedY > this.maxFallSpeed)
        {
            this.player.speedY = this.maxFallSpeed;
        }
    }

    public OnCollisionSolved(result: CollisionResult)
    {
        if (result.onBottom)
        {
            this.Land();
        }

        if (result.onTop)
        {
            this.HeadBonk();
        }
    }

    public Land()
    {
        this.player.speedY = 0;
        this.player.ChangeState(this.player.speedX == 0 ? this.player.idleState : this.player.runState);
    }

    public HeadBonk()
    {
        this.player.speedY = 0;
    }
}