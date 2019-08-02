/// <reference path="state_grounded.ts"/>

class IdleState extends GroundedState
{
    constructor(player: Player)
    {
        super(player);
    }

    public OnEnter()
    {
        console.log("Enter idle state");
    }
}