var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var GameScene = /** @class */ (function (_super) {
    __extends(GameScene, _super);
    function GameScene() {
        return _super.call(this, { key: 'GameScene', active: true }) || this;
    }
    GameScene.prototype.preload = function () {
        console.log("Hello World!");
        //this.load.spritesheet();
        this.player = new Player();
    };
    GameScene.prototype.create = function () {
    };
    GameScene.prototype.update = function () {
        this.player.Update();
    };
    GameScene.prototype.draw = function () {
    };
    return GameScene;
}(Phaser.Scene));
/// <reference path="scenes/game_scene.ts"/>
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 720,
    backgroundColor: '#e9f4fc',
    parent: 'GMTK Game Jam 2019',
    title: "GMTK Game Jam 2019",
    version: "0.0.1",
    disableContextMenu: true,
    scene: [GameScene]
};
var game = new Phaser.Game(config);
var Player = /** @class */ (function () {
    function Player() {
        this.idleState = new IdleState(this);
        this.runState = new RunState(this);
        this.jumpState = new JumpState(this);
        this.fallState = new FallState(this);
        this.ChangeState(this.idleState);
    }
    Player.prototype.ChangeState = function (state) {
        this.currentState = state;
        this.currentState.OnEnter();
    };
    Player.prototype.Update = function () {
        this.currentState.Update();
    };
    return Player;
}());
var BaseState = /** @class */ (function () {
    function BaseState(player) {
        this.player = player;
    }
    BaseState.prototype.OnEnter = function () {
        console.log("BaseState::OnEnter");
    };
    BaseState.prototype.Update = function () {
    };
    BaseState.prototype.OnCollisionSolved = function () {
    };
    return BaseState;
}());
/// <reference path="basestate.ts"/>
var AirborneState = /** @class */ (function (_super) {
    __extends(AirborneState, _super);
    function AirborneState(player) {
        return _super.call(this, player) || this;
    }
    AirborneState.prototype.OnEnter = function () {
    };
    AirborneState.prototype.Update = function () {
    };
    AirborneState.prototype.OnCollisionSolved = function () {
    };
    return AirborneState;
}(BaseState));
/// <reference path="state_airborne.ts"/>
var FallState = /** @class */ (function (_super) {
    __extends(FallState, _super);
    function FallState(player) {
        return _super.call(this, player) || this;
    }
    return FallState;
}(AirborneState));
/// <reference path="basestate.ts"/>
var GroundedState = /** @class */ (function (_super) {
    __extends(GroundedState, _super);
    function GroundedState(player) {
        return _super.call(this, player) || this;
    }
    return GroundedState;
}(BaseState));
/// <reference path="state_grounded.ts"/>
var IdleState = /** @class */ (function (_super) {
    __extends(IdleState, _super);
    function IdleState(player) {
        return _super.call(this, player) || this;
    }
    IdleState.prototype.OnEnter = function () {
        console.log("Enter idle state");
        _super.prototype.OnEnter.call(this);
    };
    return IdleState;
}(GroundedState));
/// <reference path="state_airborne.ts"/>
var JumpState = /** @class */ (function (_super) {
    __extends(JumpState, _super);
    function JumpState(player) {
        return _super.call(this, player) || this;
    }
    return JumpState;
}(AirborneState));
/// <reference path="state_grounded.ts"/>
var RunState = /** @class */ (function (_super) {
    __extends(RunState, _super);
    function RunState(player) {
        return _super.call(this, player) || this;
    }
    return RunState;
}(GroundedState));
//# sourceMappingURL=game.js.map