class BaseState
{
    public player: Player;

    constructor(player: Player)
    {
        this.player = player;
    }

    public OnEnter()
    {
        console.log("BaseState::OnEnter");
    }

    public Update()
    {

    }

    public OnCollisionSolved()
    {

    }
}