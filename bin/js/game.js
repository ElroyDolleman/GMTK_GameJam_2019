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
    Object.defineProperty(Actor.prototype, "nextPosX", {
        get: function () { return this.sprite.x + this.speedX * (1 / 60); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Actor.prototype, "nextPosY", {
        get: function () { return this.sprite.y + this.speedY * (1 / 60); },
        enumerable: true,
        configurable: true
    });
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
    Actor.prototype.OnCollisionSolved = function (result) {
    };
    return Actor;
}());
var GameScene = /** @class */ (function (_super) {
    __extends(GameScene, _super);
    function GameScene() {
        var _this = _super.call(this, { key: 'GameScene', active: true }) || this;
        GameScene.instance = _this;
        return _this;
    }
    GameScene.prototype.preload = function () {
        console.log("Hello World!");
        this.load.spritesheet('character', 'assets/character.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('tilessheet', 'assets/tilessheet.png', { frameWidth: 16, frameHeight: 16 });
    };
    GameScene.prototype.create = function () {
        this.player = new Player(this);
        this.key = new Key(this.player);
        this.player.key = this.key;
        this.tiles = LevelLoader.load(LEVEL01);
    };
    GameScene.prototype.update = function () {
        this.player.Update();
        this.key.Update();
        this.moveActor(this.player);
        if (this.key.state != KEY_GRABBED) {
            this.moveActor(this.key);
        }
    };
    GameScene.prototype.moveActor = function (actor) {
        // if (actor.speedX == 0 && actor.speedY == 0)
        // {
        //     return;
        // }
        var result = new CollisionResult();
        var gridX = Math.floor(actor.nextPosX / 16);
        var gridY = Math.floor(actor.nextPosY / 16);
        // X
        actor.posX += actor.speedX * (1 / 60);
        for (var x = gridX; x <= gridX + 1; x++) {
            for (var y = gridY; y <= gridY + 1; y++) {
                var i = x % 20 + y * 20;
                result.tiles.push(this.tiles[i]);
                if (this.tiles[i] == undefined || !this.tiles[i].solid || !this.tiles[i].hitbox.Intersects(actor.globalHitbox)) {
                    continue;
                }
                if (actor.globalHitbox.x < this.tiles[i].hitbox.x) {
                    result.onRight = true;
                    actor.posX = this.tiles[i].hitbox.x - (actor.localHitbox.width + actor.localHitbox.x);
                }
                else if (actor.globalHitbox.right > this.tiles[i].hitbox.right) {
                    result.onLeft = true;
                    actor.posX = this.tiles[i].hitbox.right - actor.localHitbox.x;
                }
            }
        }
        // Y
        actor.posY += actor.speedY * (1 / 60);
        for (var x = gridX; x <= gridX + 1; x++) {
            for (var y = gridY; y <= gridY + 1; y++) {
                var i = x % 20 + y * 20;
                if (this.tiles[i] == undefined || !this.tiles[i].solid || !this.tiles[i].hitbox.Intersects(actor.globalHitbox)) {
                    //if (x == 9) console.log(this.tiles[i].hitbox.Intersects(actor.globalHitbox));
                    continue;
                }
                if (actor.globalHitbox.y < this.tiles[i].hitbox.y) {
                    result.onBottom = true;
                    actor.posY = this.tiles[i].hitbox.y - (actor.localHitbox.height + actor.localHitbox.y);
                }
                else if (actor.globalHitbox.bottom > this.tiles[i].hitbox.bottom) {
                    result.onTop = true;
                    actor.posY = this.tiles[i].hitbox.bottom - actor.localHitbox.y;
                }
            }
        }
        actor.OnCollisionSolved(result);
        if (actor.speedXDir < 0) {
            actor.sprite.flipX = true;
        }
        else if (actor.speedXDir > 0) {
            actor.sprite.flipX = false;
        }
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
var CollisionResult = /** @class */ (function () {
    function CollisionResult() {
        this.onTop = false;
        this.onLeft = false;
        this.onRight = false;
        this.onBottom = false;
        this.tiles = [];
        // this.onTop = onTop;
        // this.onLeft = onLeft;
        // this.onRight = onRight;
        // this.onBottom = onBottom;
    }
    return CollisionResult;
}());
var Rectangle = /** @class */ (function () {
    function Rectangle(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    Object.defineProperty(Rectangle.prototype, "right", {
        get: function () { return this.x + this.width; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "bottom", {
        get: function () { return this.y + this.height; },
        enumerable: true,
        configurable: true
    });
    Rectangle.prototype.Intersects = function (other) {
        return other.x < this.right &&
            this.x < other.right &&
            other.y < this.bottom &&
            this.y < other.bottom;
    };
    return Rectangle;
}());
var LEVEL01 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 25, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 13, 11, 0, 0, 0, 0, 0, 0, 28, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 13, 10, 12, 2, 2, 2, 2, 2, 2, 2, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
var LevelLoader = /** @class */ (function () {
    function LevelLoader() {
    }
    LevelLoader.load = function (array) {
        var tiles = [];
        for (var i = 0; i < array.length; i++) {
            var x = i % 20;
            var y = Math.floor(i / 20);
            var rect = new Rectangle(x * 16, y * 16, 16, 16);
            var tileType = TILETYPE_EMPTY;
            if (array[i] > 0) {
                tileType = TILETYPE_SOLID;
            }
            tiles.push(new Tile(rect, tileType, array[i] - 1));
        }
        return tiles;
    };
    return LevelLoader;
}());
var TILETYPE_EMPTY = 0;
var TILETYPE_SOLID = 1;
var Tile = /** @class */ (function () {
    function Tile(hitbox, tileType, frame) {
        this.hitbox = hitbox;
        this.tileType = tileType;
        if (tileType > 0) {
            this.sprite = GameScene.instance.add.sprite(hitbox.x, hitbox.y, 'tilessheet', frame);
            this.sprite.setOrigin(0, 0);
        }
    }
    Object.defineProperty(Tile.prototype, "solid", {
        get: function () { return this.tileType == TILETYPE_SOLID; },
        enumerable: true,
        configurable: true
    });
    return Tile;
}());
var KEY_GROUNDED = 0;
var KEY_INAIR = 1;
var KEY_GRABBED = 2;
var Key = /** @class */ (function (_super) {
    __extends(Key, _super);
    function Key(player) {
        var _this = _super.call(this) || this;
        _this.gravity = 10;
        _this.maxFallSpeed = 240;
        _this.state = KEY_GROUNDED;
        Key.instance = _this;
        _this.player = player;
        _this.sprite = GameScene.instance.add.sprite(48, 320 - 64, 'character', 8);
        _this.sprite.setOrigin(0, 0);
        _this.localHitbox = new Rectangle(0, 0, 8, 16);
        return _this;
    }
    Key.prototype.Update = function () {
        if (this.state == KEY_INAIR) {
            if (this.speedY < this.maxFallSpeed) {
                this.speedY += this.gravity;
            }
            else if (this.speedY > this.maxFallSpeed) {
                this.speedY = this.maxFallSpeed;
            }
        }
    };
    Key.prototype.OnCollisionSolved = function (result) {
        if (result.onBottom) {
            this.speedY = 0;
            this.state = KEY_GROUNDED;
        }
        if (result.onTop) {
            this.speedY = 0;
        }
        for (var i = 0; i < result.tiles.length; i++) {
            if (result.tiles[i] == undefined || !result.tiles[i].solid)
                continue;
            var hitbox = this.player.globalHitbox;
            if (result.tiles[i].hitbox.y == hitbox.bottom && hitbox.right > result.tiles[i].hitbox.x && hitbox.x < result.tiles[i].hitbox.right) {
                return;
            }
        }
        this.state = KEY_INAIR;
    };
    return Key;
}(Actor));
/// <reference path="../actor.ts"/>
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player(scene) {
        var _this = _super.call(this) || this;
        _this.scene = scene;
        _this.sprite = _this.scene.add.sprite(16, 320 - 48, 'character');
        _this.sprite.setOrigin(0, 0);
        _this.localHitbox = new Rectangle(3, 1, 10, 15);
        _this.inputUp = _this.scene.input.keyboard.addKey('up');
        _this.inputDown = _this.scene.input.keyboard.addKey('down');
        _this.inputLeft = _this.scene.input.keyboard.addKey('left');
        _this.inputRight = _this.scene.input.keyboard.addKey('right');
        _this.inputJump = _this.scene.input.keyboard.addKey('Z');
        _this.inputHold = _this.scene.input.keyboard.addKey('X');
        _this.idleState = new IdleState(_this);
        _this.runState = new RunState(_this);
        _this.jumpState = new JumpState(_this);
        _this.fallState = new FallState(_this);
        _this.ChangeState(_this.idleState);
        return _this;
    }
    Object.defineProperty(Player.prototype, "holdsKey", {
        get: function () { return this.key.state == KEY_GRABBED; },
        enumerable: true,
        configurable: true
    });
    Player.prototype.ChangeState = function (state) {
        this.currentState = state;
        this.currentState.OnEnter();
    };
    Player.prototype.Update = function () {
        this.currentState.Update();
        if (this.holdsKey) {
            //this.key.posX = this.globalHitbox.right;
            //this.key.posY = this.posY;
        }
    };
    Player.prototype.OnCollisionSolved = function (result) {
        this.currentState.OnCollisionSolved(result);
        if (!this.holdsKey && this.inputHold.isDown && this.key.globalHitbox.Intersects(this.globalHitbox)) {
            this.key.state = KEY_GRABBED;
        }
        if (this.holdsKey) {
            this.key.posX = this.globalHitbox.right;
            this.key.posY = this.posY;
            if (this.inputHold.isUp) {
                this.key.state = KEY_INAIR;
            }
        }
    };
    Player.prototype.UpdateMoveControls = function () {
        if (this.inputLeft.isDown) {
            if (this.speedX > -100) {
                this.speedX = Math.max(this.speedX - 20, -100);
            }
        }
        else if (this.inputRight.isDown) {
            if (this.speedX < 100) {
                this.speedX = Math.min(this.speedX + 20, 100);
            }
        }
        else {
            if (Math.abs(this.speedX) < 20) {
                this.speedX = 0;
            }
            else {
                this.speedX -= 20 * this.speedXDir;
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
    BaseState.prototype.OnCollisionSolved = function (result) {
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
        this.player.UpdateMoveControls();
        if (this.player.speedY < this.maxFallSpeed) {
            this.player.speedY += this.gravity;
        }
        else if (this.player.speedY > this.maxFallSpeed) {
            this.player.speedY = this.maxFallSpeed;
        }
    };
    AirborneState.prototype.OnCollisionSolved = function (result) {
        if (result.onBottom) {
            this.Land();
        }
        if (result.onTop) {
            this.HeadBonk();
        }
    };
    AirborneState.prototype.Land = function () {
        this.player.speedY = 0;
        this.player.ChangeState(this.player.speedX == 0 ? this.player.idleState : this.player.runState);
    };
    AirborneState.prototype.HeadBonk = function () {
        this.player.speedY = 0;
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
    FallState.prototype.OnCollisionSolved = function (result) {
        _super.prototype.OnCollisionSolved.call(this, result);
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
    GroundedState.prototype.OnCollisionSolved = function (result) {
        for (var i = 0; i < result.tiles.length; i++) {
            if (result.tiles[i] == undefined || !result.tiles[i].solid)
                continue;
            var hitbox = this.player.globalHitbox;
            if (result.tiles[i].hitbox.y == hitbox.bottom && hitbox.right > result.tiles[i].hitbox.x && hitbox.x < result.tiles[i].hitbox.right) {
                return;
            }
        }
        this.player.ChangeState(this.player.fallState);
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
    IdleState.prototype.OnCollisionSolved = function (result) {
        _super.prototype.OnCollisionSolved.call(this, result);
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
    JumpState.prototype.OnCollisionSolved = function (result) {
        _super.prototype.OnCollisionSolved.call(this, result);
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
    RunState.prototype.OnCollisionSolved = function (result) {
        _super.prototype.OnCollisionSolved.call(this, result);
    };
    return RunState;
}(GroundedState));
//# sourceMappingURL=game.js.map