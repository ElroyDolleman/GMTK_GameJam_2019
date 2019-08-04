/// <reference path="state_airborne.ts"/>

class JumpState extends AirborneState
{
    snd: Phaser.Sound.BaseSound;

    constructor(player: Player)
    {
        super(player);

        this.snd = GameScene.instance.sound.add('jump');
    }

    public OnEnter()
    {
        this.player.speedY = -this.player.jumpPower;
        this.player.sprite.setFrame(2);

        if (GameScene.sfxOn) this.snd.play();
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