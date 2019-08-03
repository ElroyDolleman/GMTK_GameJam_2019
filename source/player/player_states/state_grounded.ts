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
        let releaseKey = false;

        for (let i = 0; i < result.tiles.length; i++)
        {
            if (result.tiles[i] == undefined || (!result.tiles[i].solid && !result.tiles[i].semisolid)) continue;

            if (result.tiles[i].hitbox.y == hitbox.bottom && hitbox.right > result.tiles[i].hitbox.x && hitbox.x < result.tiles[i].hitbox.right)
            {
                if (this.player.isHoldingKey)
                {
                    if (this.player.posX + this.player.hitboxX < result.tiles[i].hitbox.right && this.player.posX + this.player.hitboxX + this.player.hitboxWidth > result.tiles[i].hitbox.x)
                    {
                        return;
                    }
                    else releaseKey = true;
                }
                else return;
            }
        }

        if (releaseKey)
        {
            this.player.ReleaseKey();
        }

        // If the key is also not under the player, fall
        else if (this.player.key.active && !this.player.isHoldingKey && this.player.key.globalHitbox.y == hitbox.bottom && hitbox.right > this.player.key.globalHitbox.x && hitbox.x < this.player.key.globalHitbox.right)
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