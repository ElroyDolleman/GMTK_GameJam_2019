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

        if (this.player.currentState == this)

        // Check if you land on the key
        if (this.player.key.active && 
            GameScene.instance.prevPlayerHitbox.bottom < this.player.key.posY && 
            this.player.globalHitbox.bottom > this.player.key.posY && 
            this.player.globalHitbox.Intersects(this.player.key.globalHitbox))
        {
            this.player.posY = this.player.key.posY - this.player.localHitbox.height - this.player.localHitbox.y;
            this.Land();
        }
    }
}