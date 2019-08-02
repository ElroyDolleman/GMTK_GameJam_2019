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
var Actor = /** @class */ (function () {
    function Actor() {
        this.speedX = 0;
        this.speedY = 0;
    }
    Object.defineProperty(Actor.prototype, "posX", {
        get: function () { return this.sprite.x; },
        set: function (x) { this.sprite.setX(x); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Actor.prototype, "posY", {
        get: function () { return this.sprite.y; },
        set: function (y) { this.sprite.setY(y); },
        enumerable: true,
        configurable: true
    });
    ;
    ;
    ;
    Object.defineProperty(Actor.prototype, "speedXDir", {
        get: function () { return this.speedX == 0 ? 0 : (this.speedX > 0 ? 1 : -1); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Actor.prototype, "speedYDir", {
        get: function () { return this.speedY == 0 ? 0 : (this.speedY > 0 ? 1 : -1); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Actor.prototype, "globalHitbox", {
        get: function () { return new Rectangle(this.posX + this.localHitbox.x, this.posY + this.localHitbox.y, this.localHitbox.width, this.localHitbox.height); },
        enumerable: true,
        configurable: true
    });
    return Actor;
}());
var GameScene = /** @class */ (function (_super) {
    __extends(GameScene, _super);
    function GameScene() {
        return _super.call(this, { key: 'GameScene', active: true }) || this;
    }
    GameScene.prototype.preload = function () {
        console.log("Hello World!");
        this.load.spritesheet('character', 'assets/character.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('tilessheet', 'assets/tilessheet.png', { frameWidth: 16, frameHeight: 16 });
    };
    GameScene.prototype.create = function () {
        this.player = new Player(this);
    };
    GameScene.prototype.update = function () {
        this.player.Update();
        this.player.posX += this.player.speedX * (1 / 60);
        this.player.posY += this.player.speedY * (1 / 60);
        if (this.player.speedXDir < 0) {
            this.player.sprite.flipX = true;
        }
        else if (this.player.speedXDir > 0) {
            this.player.sprite.flipX = false;
        }
        console.log(this.player.posX);
    };
    GameScene.prototype.draw = function () {
    };
    return GameScene;
}(Phaser.Scene));
/// <reference path="scenes/game_scene.ts"/>
var config = {
    type: Phaser.AUTO,
    width: 320,
    height: 320,
    scaleMode: 3,
    pixelArt: true,
    backgroundColor: '#e9f4fc',
    parent: 'GMTK Game Jam 2019',
    title: "GMTK Game Jam 2019",
    version: "0.0.1",
    disableContextMenu: true,
    scene: [GameScene],
};
var game = new Phaser.Game(config);
var Rectangle = /** @class */ (function () {
    function Rectangle(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    Rectangle.prototype.Intersects = function (other) {
        return other.x < (this.x + this.width) &&
            this.x < (other.x + other.width) &&
            other.y < this.y + this.height &&
            this.y < other.y + other.height;
    };
    return Rectangle;
}());
/// <reference path="../actor.ts"/>
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player(scene) {
        var _this = _super.call(this) || this;
        _this.scene = scene;
        _this.sprite = _this.scene.add.sprite(0, 320 - 16, 'character');
        _this.sprite.setOrigin(0, 0);
        _this.inputDown = _this.scene.input.keyboard.addKey('S');
        _this.inputLeft = _this.scene.input.keyboard.addKey('A');
        _this.inputRight = _this.scene.input.keyboard.addKey('D');
        _this.inputJump = _this.scene.input.keyboard.addKey('W');
        _this.idleState = new IdleState(_this);
        _this.runState = new RunState(_this);
        _this.jumpState = new JumpState(_this);
        _this.fallState = new FallState(_this);
        _this.ChangeState(_this.idleState);
        return _this;
    }
    Player.prototype.ChangeState = function (state) {
        this.currentState = state;
        this.currentState.OnEnter();
    };
    Player.prototype.Update = function () {
        this.currentState.Update();
    };
    Player.prototype.UpdateMoveControls = function () {
        if (this.inputLeft.isDown) {
            if (this.speedX > -120) {
                this.speedX = Math.max(this.speedX - 30, -120);
            }
        }
        else if (this.inputRight.isDown) {
            if (this.speedX < 120) {
                this.speedX = Math.min(this.speedX + 30, 120);
            }
        }
        else {
            if (Math.abs(this.speedX) < 30) {
                this.speedX = 0;
            }
            else {
                this.speedX -= 30 * this.speedXDir;
            }
        }
    };
    return Player;
}(Actor));
var BaseState = /** @class */ (function () {
    function BaseState(player) {
        this.player = player;
    }
    BaseState.prototype.OnEnter = function () {
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
        var _this = _super.call(this, player) || this;
        _this.gravity = 10;
        _this.maxFallSpeed = 240;
        return _this;
    }
    AirborneState.prototype.OnEnter = function () {
    };
    AirborneState.prototype.Update = function () {
        if (this.player.speedY < this.maxFallSpeed) {
            this.player.speedY += this.gravity;
        }
        else if (this.player.speedY > this.maxFallSpeed) {
            this.player.speedY = this.maxFallSpeed;
        }
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
    FallState.prototype.OnEnter = function () {
        this.player.sprite.setFrame(3);
    };
    FallState.prototype.Update = function () {
        _super.prototype.Update.call(this);
    };
    FallState.prototype.OnCollisionSolved = function () {
    };
    return FallState;
}(AirborneState));
/// <reference path="basestate.ts"/>
var GroundedState = /** @class */ (function (_super) {
    __extends(GroundedState, _super);
    function GroundedState(player) {
        return _super.call(this, player) || this;
    }
    GroundedState.prototype.OnEnter = function () {
    };
    GroundedState.prototype.Update = function () {
        if (this.player.inputJump.isDown) {
            this.player.ChangeState(this.player.jumpState);
        }
    };
    GroundedState.prototype.OnCollisionSolved = function () {
    };
    return GroundedState;
}(BaseState));
/// <reference path="state_grounded.ts"/>
var IdleState = /** @class */ (function (_super) {
    __extends(IdleState, _super);
    function IdleState(player) {
        return _super.call(this, player) || this;
    }
    IdleState.prototype.OnEnter = function () {
        this.player.sprite.setFrame(0);
    };
    IdleState.prototype.Update = function () {
        _super.prototype.Update.call(this);
        this.player.UpdateMoveControls();
        if (this.player.speedX != 0 && this.player.currentState == this) {
            this.player.ChangeState(this.player.runState);
        }
    };
    IdleState.prototype.OnCollisionSolved = function () {
    };
    return IdleState;
}(GroundedState));
/// <reference path="state_airborne.ts"/>
var JumpState = /** @class */ (function (_super) {
    __extends(JumpState, _super);
    function JumpState(player) {
        return _super.call(this, player) || this;
    }
    JumpState.prototype.OnEnter = function () {
        this.player.speedY = -200;
        this.player.sprite.setFrame(2);
    };
    JumpState.prototype.Update = function () {
        _super.prototype.Update.call(this);
        if (this.player.speedY >= 0) {
            this.player.ChangeState(this.player.fallState);
        }
    };
    JumpState.prototype.OnCollisionSolved = function () {
    };
    return JumpState;
}(AirborneState));
/// <reference path="state_grounded.ts"/>
var RunState = /** @class */ (function (_super) {
    __extends(RunState, _super);
    function RunState(player) {
        return _super.call(this, player) || this;
    }
    RunState.prototype.OnEnter = function () {
        this.curFrame = 1;
        this.animTimer = 0;
        this.player.sprite.setFrame(this.curFrame);
    };
    RunState.prototype.Update = function () {
        _super.prototype.Update.call(this);
        this.player.UpdateMoveControls();
        if (this.player.currentState != this) {
            return;
        }
        if (this.player.speedX == 0) {
            this.player.ChangeState(this.player.idleState);
        }
        else {
            this.animTimer += (1 / 60);
            if (this.animTimer > 0.2) {
                this.animTimer = 0;
                this.curFrame = this.curFrame == 1 ? 0 : 1;
                this.player.sprite.setFrame(this.curFrame);
            }
        }
    };
    RunState.prototype.OnCollisionSolved = function () {
    };
    return RunState;
}(GroundedState));
//# sourceMappingURL=game.js.map