/// <reference path="basestate.ts"/>

class AirborneState extends BaseState
{
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
            this.player.speedY += this.player.gravity;
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
        let speedRequired = !this.player.isHoldingKey ? this.player.speedY + 15 : this.player.speedY + 40;
        if (speedRequired >= this.maxFallSpeed)
        {
            this.player.landingDust.position.x = this.player.globalHitbox.centerX;
            this.player.landingDust.position.y = this.player.globalHitbox.bottom;
            this.player.landingDust.Play();
        }

        this.player.speedY = 0;
        this.player.ChangeState(this.player.speedX == 0 ? this.player.idleState : this.player.runState);
    }

    public HeadBonk()
    {
        this.player.speedY = 0;
    }
}