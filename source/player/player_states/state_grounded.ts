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

    public OnCollisionSolved(result: CollisionResult)
    {
        for (let i = 0; i < result.tiles.length; i++)
        {
            if (!result.tiles[i].solid) continue;

            let hitbox = this.player.globalHitbox;

            if (result.tiles[i].hitbox.y == hitbox.bottom && hitbox.right > result.tiles[i].hitbox.x && hitbox.x < result.tiles[i].hitbox.right)
            {
                return;
            }
        }

        this.player.ChangeState(this.player.fallState);
    }
}