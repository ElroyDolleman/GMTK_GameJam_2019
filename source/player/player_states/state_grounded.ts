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
        if (Phaser.Input.Keyboard.JustDown(this.player.inputJump))
        {
            this.player.ChangeState(this.player.jumpState);
        }
    }

    public OnCollisionSolved(result: CollisionResult)
    {
        let hitbox = this.player.globalHitbox;

        for (let i = 0; i < result.tiles.length; i++)
        {
            if (result.tiles[i] == undefined || (!result.tiles[i].solid && !result.tiles[i].semisolid)) continue;

            if (result.tiles[i].hitbox.y == hitbox.bottom && hitbox.right > result.tiles[i].hitbox.x && hitbox.x < result.tiles[i].hitbox.right)
            {
                return;
            }
        }

        // If the key is also not under the player, fall
        if (this.player.key.active && !this.player.isHoldingKey && this.player.key.globalHitbox.y == hitbox.bottom && hitbox.right > this.player.key.globalHitbox.x && hitbox.x < this.player.key.globalHitbox.right)
        {
            if (!Phaser.Input.Keyboard.JustDown(this.player.inputGrab))
            {
                return;
            }
            this.player.GrabKey();
        }

        this.player.ChangeState(this.player.fallState);
    }
}