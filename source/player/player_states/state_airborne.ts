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
        if (this.player.speedY < this.maxFallSpeed)
        {
            this.player.speedY += this.gravity;
        }
        else if (this.player.speedY > this.maxFallSpeed)
        {
            this.player.speedY = this.maxFallSpeed;
        }
    }

    public OnCollisionSolved()
    {
        
    }
}