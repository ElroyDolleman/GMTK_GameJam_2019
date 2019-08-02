class Player
{
    public idleState: IdleState;
    public runState: RunState;
    public jumpState: JumpState;
    public fallState: FallState;

    public currentState: BaseState;

    constructor()
    {
        this.idleState = new IdleState(this);
        this.runState = new RunState(this);
        this.jumpState = new JumpState(this);
        this.fallState = new FallState(this);

        this.ChangeState(this.idleState);
    }

    public ChangeState(state: BaseState)
    {
        this.currentState = state;
        this.currentState.OnEnter();
    }

    public Update()
    {
        this.currentState.Update();
    }
}