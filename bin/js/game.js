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
        this.active = true;
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
    Object.defineProperty(Actor.prototype, "nextHitbox", {
        get: function () { return new Rectangle(this.nextPosX + this.localHitbox.x, this.nextPosY + this.localHitbox.y, this.localHitbox.width, this.localHitbox.height); },
        enumerable: true,
        configurable: true
    });
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
    Actor.prototype.BeforeCollisionCheck = function (tiles) {
    };
    Actor.prototype.OnCollisionSolved = function (result) {
    };
    Actor.prototype.SetActive = function (active) {
        this.active = active;
        this.sprite.setVisible(active);
    };
    return Actor;
}());
var GameScene = /** @class */ (function (_super) {
    __extends(GameScene, _super);
    function GameScene() {
        var _this = _super.call(this, { key: 'GameScene', active: true }) || this;
        _this.levelOrder = [LEVEL01, LEVEL02, LEVEL03, LEVEL04, LEVEL05, LEVEL06, LEVEL_FINAL];
        _this.currentLevel = -1;
        _this.fruitsCollected = 0;
        _this.tiles = [];
        _this.canReset = true;
        _this.showTut = false;
        _this.roomTime = 0;
        GameScene.instance = _this;
        return _this;
    }
    GameScene.prototype.preload = function () {
        this.load.spritesheet('character', 'assets/character.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('tilessheet', 'assets/tilessheet.png', { frameWidth: 16, frameHeight: 16 });
        this.load.audio('jump', 'audio/player_jump.wav');
        this.load.audio('reset', 'audio/reset.wav');
        this.load.audio('key_use', 'audio/key_use.wav');
        this.load.audio('apple', 'audio/apple_collect.wav');
        this.load.audio('switch', 'audio/switch.wav');
    };
    GameScene.prototype.create = function () {
        this.inputReset = this.input.keyboard.addKey('R');
        this.key = new Key();
        this.player = new Player(this);
        this.key.player = this.player;
        this.fruit = new Fruit();
        this.resetSound = this.sound.add('reset');
        this.switchSound = this.sound.add('switch');
        this.nextLevel();
    };
    GameScene.prototype.nextLevel = function () {
        LevelLoader.unload();
        this.currentLevel = Math.min(this.currentLevel + 1, this.levelOrder.length - 1);
        this.tiles = LevelLoader.load(this.levelOrder[this.currentLevel]);
        this.resetObjects();
        this.roomTime = 0;
    };
    GameScene.prototype.reset = function () {
        if (GameScene.sfxOn)
            this.resetSound.play();
        LevelLoader.reload();
        this.resetObjects();
        this.roomTime = 0;
        if (!this.fruit.active) {
            this.fruitsCollected--;
        }
        if (this.currentLevel == 1 && !this.key.active && this.showTut) {
            for (var i = 0; i < this.tiles.length; i++) {
                if (this.tiles[i].frame > 40) {
                    this.tiles[i].sprite.setVisible(false);
                }
            }
            this.showTut = false;
        }
        this.canReset = false;
        setTimeout(function () {
            this.canReset = true;
        }.bind(this), 500);
    };
    GameScene.prototype.resetObjects = function () {
        if (this.player.isHoldingKey)
            this.player.ReleaseKey();
        this.key.SetActive(true);
        this.key.posX = this.keySpawn.x + (this.currentLevel == 5 ? 0 : 4);
        this.key.posY = this.keySpawn.y - 0.1;
        this.key.sprite.flipX = false;
        this.key.sprite.setOrigin(0, 0);
        this.key.disappearDust.Clear();
        if (GameScene.instance.currentLevel >= GameScene.instance.levelOrder.length - 1) {
            this.fruit.sprite.setVisible(false);
        }
        else {
            this.fruit.Reset();
            this.fruit.posX = this.fruitSpawn.x + (this.currentLevel == 4 ? 7 : 0);
            this.fruit.posY = this.fruitSpawn.y - 8;
        }
        this.player.posX = this.playerSpawn.x;
        this.player.posY = this.playerSpawn.y;
        this.player.speedX = 0;
        this.player.speedY = 0;
        this.player.sprite.flipX = false;
        this.player.ChangeState(this.player.idleState);
    };
    GameScene.prototype.showReset = function () {
        if (this.currentLevel > 2)
            return;
        this.showTut = true;
        setTimeout(function () {
            if ((this.currentLevel == 1 || this.currentLevel == 2) && (!this.key.active || this.roomTime > 35) && this.showTut) {
                for (var i = 0; i < this.tiles.length; i++) {
                    if (this.tiles[i].frame > 40) {
                        this.tiles[i].sprite.setVisible(true);
                    }
                }
            }
        }.bind(this), 8000);
    };
    GameScene.prototype.update = function () {
        if (this.player.posY < -48) {
            return;
        }
        if (this.currentLevel == 0) {
            var gridX = Math.floor((this.player.posX + 2) / 16);
            var gridY = Math.floor((this.player.posY + 2) / 16);
            if ((gridX == 10 || gridX == 11) && gridY == 14 && !this.player.isHoldingKey) {
                this.tiles[11 % 21 + 13 * 21].sprite.setVisible(true);
            }
            else {
                this.tiles[11 % 21 + 13 * 21].sprite.setVisible(false);
            }
        }
        else if ((this.currentLevel == 1 && !this.key.active && !this.showTut) ||
            (this.currentLevel == 2 && !this.key.active && this.key.posY < 260 && !this.showTut)) {
            this.showReset();
        }
        this.roomTime += 1 / 60;
        if (this.roomTime > 35 && !this.showTut && this.currentLevel > 0) {
            this.showReset();
        }
        if (this.player.active)
            this.player.Update();
        this.key.Update();
        this.prevPlayerHitbox = this.player.globalHitbox;
        this.moveActor(this.player);
        this.moveActor(this.key, this.key.state != KEY_GRABBED);
        if (this.player.posX < 0)
            this.player.posX = 0;
        if (this.key.posX < 2 && !this.player.isHoldingKey) {
            this.key.posX = 2;
        }
        this.fruit.Update();
        if (this.player.posX > 330) {
            this.nextLevel();
        }
        else if (Phaser.Input.Keyboard.JustDown(this.inputReset) && this.canReset && this.currentLevel < this.levelOrder.length - 1) {
            this.reset();
            //this.player.posX = 333;
        }
    };
    GameScene.prototype.moveActor = function (actor, solveCollision) {
        if (solveCollision === void 0) { solveCollision = true; }
        if (!actor.active)
            return;
        var result = new CollisionResult();
        var hitbox = actor.nextHitbox;
        var gridX = Math.floor((hitbox.x - 1) / 16);
        var gridY = Math.floor((hitbox.y - 1) / 16);
        var endX = Math.floor((hitbox.right + 2) / 16);
        var endY = Math.floor((hitbox.bottom + 2) / 16);
        for (var x = gridX; x <= gridX + endX; x++) {
            for (var y = gridY; y <= gridY + endY; y++) {
                result.tiles.push(this.tiles[x % 21 + y * 21]);
            }
        }
        actor.BeforeCollisionCheck(result.tiles);
        if (!solveCollision)
            return;
        // X
        actor.posX += actor.speedX * (1 / 60);
        for (var x = gridX; x <= gridX + endX; x++) {
            for (var y = gridY; y <= gridY + endY; y++) {
                var i = x % 21 + y * 21;
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
        var prevY = actor.globalHitbox.bottom;
        actor.posY += actor.speedY * (1 / 60);
        for (var x = gridX; x <= gridX + endX; x++) {
            for (var y = gridY; y <= gridY + endY; y++) {
                var i = x % 21 + y * 21;
                if (this.tiles[i] == undefined || !this.tiles[i].hitbox.Intersects(actor.globalHitbox))
                    continue;
                if (!this.tiles[i].solid && !this.tiles[i].semisolid)
                    continue;
                if (this.tiles[i].semisolid) {
                    if (prevY < this.tiles[i].hitbox.y && actor.globalHitbox.bottom > this.tiles[i].hitbox.y) {
                        result.onBottom = true;
                        actor.posY = this.tiles[i].hitbox.y - (actor.localHitbox.height + actor.localHitbox.y);
                    }
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
    };
    GameScene.prototype.draw = function () {
    };
    GameScene.sfxOn = true;
    return GameScene;
}(Phaser.Scene));
/// <reference path="scenes/game_scene.ts"/>
var config = {
    type: Phaser.AUTO,
    width: 320,
    height: 320,
    scaleMode: 3,
    pixelArt: true,
    backgroundColor: '#afb8cb',
    parent: 'GMTK Game Jam 2019',
    title: "GMTK Game Jam 2019",
    version: "0.0.1",
    disableContextMenu: true,
    scene: [GameScene],
};
var game = new Phaser.Game(config);
var RNG = /** @class */ (function () {
    function RNG() {
    }
    RNG.Number = function (min, max) {
        return min + Math.random() * (max - min);
    };
    RNG.Int = function (min, max) {
        return Math.round(min + Math.random() * (max - min));
    };
    return RNG;
}());
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
    Object.defineProperty(Rectangle.prototype, "centerX", {
        get: function () { return this.x + this.width / 2; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "centerY", {
        get: function () { return this.y + this.height / 2; },
        enumerable: true,
        configurable: true
    });
    Rectangle.prototype.Intersects = function (other) {
        return other.x < this.right &&
            this.x < other.right &&
            other.y < this.bottom &&
            this.y < other.bottom;
    };
    Rectangle.prototype.IntersectsOrNextTo = function (other) {
        return other.x <= this.right &&
            this.x <= other.right &&
            other.y <= this.bottom &&
            this.y <= other.bottom;
    };
    return Rectangle;
}());
var LEVEL01 = [4, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 5, 4, 18, 18, 18, 18, 18, 5, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 11, 0, 0, 0, 0, 0, 9, 10, 11, 0, 49, 61, 61, 58, 82, 75, 53, 84, 62, 0, 9, 11, 61, 0, 75, 53, 84, 9, 10, 11, 0, 0, 0, 0, 0, 67, 0, 0, 0, 0, 0, 9, 11, 0, 0, 67, 0, 0, 9, 10, 11, 0, 0, 0, 77, 58, 81, 53, 0, 0, 0, 0, 9, 11, 61, 53, 62, 53, 63, 9, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 11, 0, 0, 0, 0, 0, 9, 10, 11, 0, 62, 59, 49, 51, 53, 50, 49, 61, 0, 0, 9, 11, 85, 0, 75, 53, 84, 9, 10, 11, 0, 0, 0, 0, 0, 67, 0, 0, 0, 0, 0, 9, 11, 0, 0, 67, 0, 0, 9, 10, 11, 0, 0, 0, 74, 64, 77, 59, 0, 0, 0, 0, 9, 11, 55, 61, 49, 50, 0, 9, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 11, 0, 0, 0, 0, 0, 9, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 11, 0, 0, 0, 0, 0, 9, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 11, 8, 0, 0, 0, 0, 9, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 11, 0, 0, 0, 0, 0, 17, 18, 11, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 85, 9, 11, 0, 0, 0, 0, 0, 20, 0, 11, 0, 0, 0, 0, 1, 3, 0, 0, 9, 11, 0, 17, 19, 0, 0, 0, 0, 0, 28, 0, 11, 0, 7, 0, 0, 9, 11, 0, 0, 9, 11, 6, 0, 0, 0, 0, 1, 2, 2, 2, 2, 12, 2, 2, 2, 2, 13, 12, 2, 2, 13, 12, 2, 2, 2, 2, 2, 13, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
var LEVEL02 = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 4, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 5, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 10, 11, 0, 59, 61, 53, 62, 62, 0, 61, 0, 63, 58, 0, 61, 53, 62, 53, 63, 0, 9, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 18, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 25, 7, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 0, 0, 26, 0, 2, 2, 2, 2, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 26, 0, 0, 29, 0, 10, 10, 10, 10, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 29, 0, 0, 1, 2, 10, 10, 10, 10, 10, 12, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 13, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
var LEVEL03 = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 4, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 5, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 10, 11, 0, 59, 61, 53, 62, 62, 0, 61, 0, 63, 58, 0, 61, 53, 62, 53, 63, 0, 9, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 18, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 1, 2, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 18, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 0, 0, 7, 0, 0, 27, 0, 0, 0, 0, 27, 0, 0, 0, 0, 0, 0, 0, 0, 0, 26, 0, 0, 2, 3, 14, 14, 1, 2, 3, 0, 0, 0, 0, 0, 20, 0, 0, 21, 0, 0, 29, 1, 2, 10, 11, 14, 14, 17, 18, 19, 0, 1, 3, 0, 0, 28, 0, 0, 26, 0, 0, 1, 13, 10, 10, 11, 14, 14, 0, 6, 0, 0, 9, 11, 0, 0, 0, 0, 0, 29, 1, 2, 13, 10, 10, 10, 12, 2, 2, 2, 2, 2, 2, 13, 12, 2, 2, 2, 2, 2, 2, 13, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
var LEVEL04 = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 4, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 5, 10, 10, 10, 10, 10, 10, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 10, 10, 10, 10, 10, 10, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 10, 10, 10, 10, 10, 10, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 10, 10, 10, 10, 10, 10, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 10, 10, 10, 10, 10, 10, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 10, 10, 10, 10, 10, 10, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 18, 18, 18, 18, 18, 10, 10, 11, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 18, 18, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 7, 0, 30, 0, 0, 14, 0, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 10, 2, 2, 3, 0, 14, 6, 0, 30, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 31, 9, 10, 10, 10, 12, 2, 2, 2, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 10, 10, 10, 10, 10, 10, 10, 10, 11, 0, 0, 0, 14, 0, 31, 0, 0, 0, 27, 0, 9, 10, 10, 10, 10, 10, 10, 10, 10, 12, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 13, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
var LEVEL05 = [11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 10, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 10, 10, 11, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 10, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 9, 10, 10, 11, 0, 0, 0, 0, 0, 0, 0, 22, 0, 0, 0, 0, 0, 0, 0, 14, 14, 9, 10, 10, 11, 0, 0, 0, 0, 0, 0, 0, 30, 14, 14, 0, 14, 14, 22, 0, 0, 0, 9, 10, 10, 12, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 30, 0, 0, 0, 9, 10, 10, 10, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 13, 10, 10, 18, 18, 19, 0, 0, 31, 0, 27, 1, 2, 2, 2, 2, 13, 10, 10, 10, 10, 10, 10, 10, 0, 0, 0, 14, 14, 14, 0, 0, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 14, 0, 0, 1, 2, 2, 3, 0, 0, 0, 0, 1, 2, 2, 2, 2, 3, 0, 0, 10, 11, 0, 14, 14, 17, 18, 18, 19, 0, 0, 0, 21, 17, 18, 18, 18, 18, 19, 0, 0, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 26, 0, 0, 0, 0, 0, 0, 21, 0, 10, 11, 14, 14, 0, 0, 0, 0, 0, 22, 0, 0, 29, 0, 0, 0, 0, 0, 0, 26, 1, 10, 11, 0, 0, 0, 0, 0, 0, 0, 30, 0, 0, 0, 0, 0, 0, 0, 31, 0, 29, 9, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 31, 0, 0, 0, 1, 2, 2, 2, 2, 2, 13, 10, 12, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 13, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
var LEVEL06 = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 4, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 5, 10, 4, 18, 5, 10, 10, 10, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 10, 11, 0, 9, 10, 10, 10, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 10, 11, 0, 9, 10, 10, 10, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 10, 11, 6, 9, 10, 10, 10, 10, 11, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 4, 19, 38, 17, 5, 10, 10, 10, 12, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 19, 0, 0, 15, 9, 10, 18, 18, 18, 5, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 22, 0, 0, 0, 14, 9, 10, 0, 0, 0, 9, 12, 3, 0, 0, 0, 0, 0, 0, 0, 0, 30, 0, 0, 0, 0, 9, 10, 0, 0, 0, 9, 10, 11, 0, 0, 0, 1, 3, 0, 0, 0, 38, 0, 0, 0, 0, 9, 10, 0, 0, 0, 17, 18, 19, 0, 0, 1, 13, 11, 0, 0, 0, 0, 38, 0, 0, 0, 9, 10, 7, 0, 0, 15, 0, 27, 0, 0, 9, 10, 11, 8, 0, 0, 0, 0, 38, 1, 2, 13, 10, 2, 2, 2, 2, 2, 3, 14, 14, 17, 18, 19, 0, 0, 0, 0, 0, 0, 9, 10, 10, 10, 10, 10, 10, 10, 10, 11, 38, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 10, 10, 10, 10, 10, 10, 10, 10, 11, 0, 0, 0, 40, 0, 0, 0, 0, 0, 0, 0, 17, 18, 18, 18, 10, 10, 10, 10, 10, 11, 15, 0, 0, 39, 0, 0, 0, 0, 0, 0, 0, 0, 20, 22, 56, 10, 10, 10, 10, 10, 12, 2, 2, 2, 3, 0, 0, 0, 0, 0, 27, 27, 27, 28, 30, 73, 10, 10, 10, 10, 10, 10, 10, 10, 10, 12, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
var LEVEL_FINAL = [11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 0, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 0, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 0, 11, 0, 0, 0, 0, 0, 0, 0, 14, 14, 14, 0, 0, 0, 0, 0, 0, 0, 0, 9, 0, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 0, 11, 0, 0, 0, 0, 0, 63, 56, 53, 0, 53, 57, 52, 0, 0, 0, 0, 0, 0, 9, 53, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 76, 11, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 61, 11, 0, 0, 0, 0, 0, 0, 0, 14, 14, 14, 0, 0, 0, 0, 0, 0, 0, 0, 9, 58, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 84, 11, 0, 0, 0, 0, 0, 0, 0, 14, 14, 14, 0, 0, 0, 0, 0, 0, 0, 0, 9, 70, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 57, 11, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 73, 11, 0, 0, 0, 0, 0, 0, 0, 14, 14, 14, 0, 0, 0, 0, 0, 0, 0, 0, 9, 57, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 49, 19, 0, 0, 0, 0, 8, 0, 8, 0, 8, 0, 8, 0, 8, 0, 0, 0, 0, 0, 9, 0, 0, 0, 0, 0, 0, 14, 0, 14, 0, 14, 0, 14, 0, 14, 0, 0, 0, 36, 0, 9, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 13, 0, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 0];
var LevelLoader = /** @class */ (function () {
    function LevelLoader() {
    }
    LevelLoader.load = function (array) {
        var firstSecretFruit = true;
        var tiles = [];
        for (var i = 0; i < array.length; i++) {
            var x = i % 21;
            var y = Math.floor(i / 21);
            var rect = new Rectangle(x * 16, y * 16, 16, 16);
            var tileType = TILETYPE_EMPTY;
            var frame = array[i] - 1;
            switch (array[i]) {
                case 6:
                    GameScene.instance.keySpawn = new Phaser.Geom.Point(x * 16, y * 16);
                    frame = -1;
                    break;
                case 7:
                    GameScene.instance.playerSpawn = new Phaser.Geom.Point(x * 16, y * 16);
                    frame = -1;
                    break;
                case 8:
                    if (GameScene.instance.currentLevel >= GameScene.instance.levelOrder.length - 1) {
                        if ((GameScene.instance.fruitsCollected > 0 && !firstSecretFruit) ||
                            (firstSecretFruit && GameScene.instance.fruitsCollected >= GameScene.instance.levelOrder.length - 1)) {
                            tileType = TILETYPE_SEMISOLID;
                            GameScene.instance.fruitsCollected--;
                        }
                        else
                            frame = -1;
                        firstSecretFruit = false;
                    }
                    else {
                        GameScene.instance.fruitSpawn = new Phaser.Geom.Point(x * 16, y * 16);
                        frame = -1;
                    }
                    break;
                case 20:
                case 21:
                case 26:
                case 27:
                case 28:
                case 29:
                    tileType = TILETYPE_KEYBLOCK;
                    break;
                case 22:
                case 30:
                case 31:
                    tileType = TILETYPE_TRANSLUCENT_KEYBLOCK;
                    break;
                case 14:
                    tileType = TILETYPE_SEMISOLID;
                    break;
                case 15:
                case 16:
                    tileType = TILETYPE_SWITCH;
                    break;
                case 24:
                case 32:
                case 37:
                    tileType = TILETYPE_SWITCH_BLOCK_TRANSLUCENT;
                    break;
                case 38:
                case 39:
                case 40:
                    tileType = TILETYPE_SWITCH_BLOCK_SOLID;
                    break;
                case 36:
                    tileType = TILETYPE_SECRET_HEARTH;
                    break;
                default:
                    if (array[i] > 0 && array[i] < 40) {
                        tileType = TILETYPE_SOLID;
                    }
                    break;
            }
            tiles.push(new Tile(rect, tileType, frame));
        }
        return tiles;
    };
    LevelLoader.unload = function () {
        for (var i = 0; i < GameScene.instance.tiles.length; i++) {
            if (GameScene.instance.tiles[i].sprite == undefined)
                continue;
            GameScene.instance.tiles[i].sprite.destroy();
        }
        GameScene.instance.tiles = [];
    };
    LevelLoader.reload = function () {
        this.unload();
        GameScene.instance.tiles = this.load(GameScene.instance.levelOrder[GameScene.instance.currentLevel]);
    };
    return LevelLoader;
}());
var TILETYPE_EMPTY = 0;
var TILETYPE_SOLID = 1;
var TILETYPE_KEYBLOCK = 2;
var TILETYPE_SEMISOLID = 3;
var TILETYPE_TRANSLUCENT_KEYBLOCK = 4;
var TILETYPE_SWITCH = 5;
var TILETYPE_SWITCH_BLOCK_SOLID = 6;
var TILETYPE_SWITCH_BLOCK_TRANSLUCENT = 7;
var TILETYPE_SECRET_HEARTH = 8;
var Tile = /** @class */ (function () {
    function Tile(hitbox, tileType, frame) {
        this.connections = [];
        this.hitbox = hitbox;
        this.tileType = tileType;
        this.frame = frame;
        if (frame >= 0) {
            this.sprite = GameScene.instance.add.sprite(hitbox.x, hitbox.y, 'tilessheet', frame);
            this.sprite.setOrigin(0, 0);
            if (GameScene.instance.currentLevel > 0 && GameScene.instance.currentLevel < GameScene.instance.levelOrder.length - 1 && frame > 40) {
                this.sprite.setVisible(false);
            }
        }
        if (tileType == TILETYPE_KEYBLOCK) {
            switch (frame) {
                case 19:
                case 20:
                    this.connections.push(new Phaser.Geom.Point(hitbox.x / 16, hitbox.y / 16 + 1));
                    break;
                case 27:
                case 28:
                    this.connections.push(new Phaser.Geom.Point(hitbox.x / 16, hitbox.y / 16 - 1));
                    break;
                case 25:
                    this.connections.push(new Phaser.Geom.Point(hitbox.x / 16, hitbox.y / 16 - 1));
                    this.connections.push(new Phaser.Geom.Point(hitbox.x / 16, hitbox.y / 16 + 1));
                    break;
            }
        }
        else if (tileType == TILETYPE_TRANSLUCENT_KEYBLOCK) {
            switch (frame) {
                case 21:
                    this.connections.push(new Phaser.Geom.Point(hitbox.x / 16, hitbox.y / 16 + 1));
                    break;
                case 29:
                    this.connections.push(new Phaser.Geom.Point(hitbox.x / 16, hitbox.y / 16 - 1));
                    break;
            }
        }
    }
    Object.defineProperty(Tile.prototype, "solid", {
        get: function () { return this.tileType == TILETYPE_SOLID || this.tileType == TILETYPE_KEYBLOCK || this.tileType == TILETYPE_SWITCH_BLOCK_SOLID; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tile.prototype, "semisolid", {
        get: function () { return this.tileType == TILETYPE_SEMISOLID; },
        enumerable: true,
        configurable: true
    });
    Tile.ToggleSwitch = function () {
        if (GameScene.sfxOn)
            GameScene.instance.switchSound.play();
        Tile.toggleStatus = !Tile.toggleStatus;
        for (var i = 0; i < GameScene.instance.tiles.length; i++) {
            var tile = GameScene.instance.tiles[i];
            if (tile.tileType == TILETYPE_KEYBLOCK) {
                if (tile.frame == 19)
                    tile.frame = 21;
                else if (tile.frame == 27)
                    tile.frame = 29;
                else if (tile.frame == 26)
                    tile.frame = 30;
                tile.sprite.setFrame(tile.frame);
                tile.tileType = TILETYPE_TRANSLUCENT_KEYBLOCK;
            }
            else if (tile.tileType == TILETYPE_TRANSLUCENT_KEYBLOCK) {
                if (tile.frame == 21)
                    tile.frame = 19;
                else if (tile.frame == 29)
                    tile.frame = 27;
                else if (tile.frame == 30)
                    tile.frame = 26;
                tile.sprite.setFrame(tile.frame);
                tile.tileType = TILETYPE_KEYBLOCK;
            }
            else if (tile.tileType == TILETYPE_SWITCH_BLOCK_TRANSLUCENT) {
                if (tile.frame == 23)
                    tile.frame = 39;
                else if (tile.frame == 31)
                    tile.frame = 38;
                else if (tile.frame == 36)
                    tile.frame = 37;
                tile.sprite.setFrame(tile.frame);
                tile.tileType = TILETYPE_SWITCH_BLOCK_SOLID;
            }
            else if (tile.tileType == TILETYPE_SWITCH_BLOCK_SOLID) {
                if (tile.frame == 39)
                    tile.frame = 23;
                else if (tile.frame == 38)
                    tile.frame = 31;
                else if (tile.frame == 37)
                    tile.frame = 36;
                tile.sprite.setFrame(tile.frame);
                tile.tileType = TILETYPE_SWITCH_BLOCK_TRANSLUCENT;
            }
            else if (tile.tileType == TILETYPE_SWITCH) {
                tile.sprite.flipX = Tile.toggleStatus;
            }
        }
    };
    Tile.prototype.Unlock = function () {
        if (this.tileType == TILETYPE_KEYBLOCK) {
            this.tileType = TILETYPE_EMPTY;
            this.sprite.setVisible(false);
            while (this.connections.length > 0) {
                var index = this.connections[0].x % 21 + this.connections[0].y * 21;
                if (GameScene.instance.tiles[index].tileType == TILETYPE_KEYBLOCK) {
                    GameScene.instance.tiles[index].Unlock();
                }
                this.connections.splice(0, 1);
            }
        }
        else if (this.tileType == TILETYPE_TRANSLUCENT_KEYBLOCK) {
            this.tileType = TILETYPE_SOLID;
            if (this.frame == 30)
                this.sprite.setFrame(22);
            if (this.frame == 21)
                this.sprite.setFrame(20);
            if (this.frame == 29)
                this.sprite.setFrame(28);
            while (this.connections.length > 0) {
                var index = this.connections[0].x % 21 + this.connections[0].y * 21;
                if (GameScene.instance.tiles[index].tileType == TILETYPE_TRANSLUCENT_KEYBLOCK) {
                    GameScene.instance.tiles[index].Unlock();
                }
                this.connections.splice(0, 1);
            }
        }
    };
    Tile.toggleStatus = false;
    return Tile;
}());
var ParticleSystem = /** @class */ (function () {
    function ParticleSystem(posX, posY) {
        this.particles = [];
        this.position = new Phaser.Geom.Point(posX, posY);
    }
    ParticleSystem.prototype.Play = function () {
        this.timer = 0;
        this.Emit();
        if (this.duration > 0 && this.maxInterval != 0) {
            setTimeout(this.Emit.bind(this), RNG.Number(this.minInterval, this.maxInterval));
        }
    };
    ParticleSystem.prototype.Update = function () {
        if (this.timer < this.duration) {
            this.timer = Math.min(this.timer + (1 / 60), this.duration);
        }
        for (var i = 0; i < this.particles.length; i++) {
            this.particles[i].Update();
            if (this.particles[i].lifetime <= 0) {
                this.particles[i].Destroy();
                this.particles.splice(i, 1);
                i--;
            }
        }
    };
    ParticleSystem.prototype.Emit = function () {
        var spawnAmount = RNG.Int(this.minSpawn, this.maxSpawn);
        for (var i = 0; i < spawnAmount; i++) {
            var offsetX = RNG.Number(this.minOffset.x, this.maxOffset.x);
            var offsetY = RNG.Number(this.minOffset.y, this.maxOffset.y);
            var particle = new Particle(this.position.x + offsetX, this.position.y + offsetY);
            particle.lifetime = RNG.Number(this.minLifeTime, this.maxLifeTime);
            particle.speed = RNG.Number(this.minSpeed, this.maxSpeed);
            particle.direction = RNG.Number(this.minDirection, this.maxDirection);
            this.particles.push(particle);
        }
        if (this.timer < this.duration && this.maxInterval != 0) {
            setTimeout(this.Emit.bind(this), RNG.Number(this.minInterval, this.maxInterval));
        }
    };
    ParticleSystem.prototype.Clear = function () {
        for (var i = 0; i < this.particles.length; i++) {
            this.particles[i].Destroy();
            this.particles.splice(i, 1);
            i--;
        }
    };
    return ParticleSystem;
}());
/// <reference path="particle_system.ts"/>
var DisappearDust = /** @class */ (function (_super) {
    __extends(DisappearDust, _super);
    function DisappearDust(posX, posY) {
        var _this = _super.call(this, posX, posY) || this;
        _this.minOffset = new Phaser.Geom.Point(-8, -8);
        _this.maxOffset = new Phaser.Geom.Point(8, 8);
        _this.minSpeed = 10;
        _this.maxSpeed = 12;
        _this.minSpawn = 48;
        _this.maxSpawn = 64;
        _this.minLifeTime = 0.75;
        _this.maxLifeTime = 1.25;
        _this.minDirection = 0 * (Math.PI / 180);
        _this.maxDirection = 360 * (Math.PI / 180);
        _this.duration = 0;
        return _this;
    }
    return DisappearDust;
}(ParticleSystem));
/// <reference path="particle_system.ts"/>
var LandingDust = /** @class */ (function (_super) {
    __extends(LandingDust, _super);
    function LandingDust(posX, posY) {
        var _this = _super.call(this, posX, posY) || this;
        _this.minOffset = new Phaser.Geom.Point(-5, -4);
        _this.maxOffset = new Phaser.Geom.Point(5, 0);
        _this.minSpeed = 2.8;
        _this.maxSpeed = 4;
        _this.minSpawn = 16;
        _this.maxSpawn = 32;
        _this.minLifeTime = 0.75;
        _this.maxLifeTime = 1;
        _this.minDirection = 180 * (Math.PI / 180);
        _this.maxDirection = 180 * (Math.PI / 180);
        _this.duration = 0;
        return _this;
    }
    return LandingDust;
}(ParticleSystem));
var Particle = /** @class */ (function () {
    function Particle(positionX, positionY) {
        this.position = new Phaser.Geom.Point(positionX, positionY);
        this.graphic = GameScene.instance.add.graphics({ fillStyle: { color: 0xFFFFFF } });
        this.graphic.fillPointShape(new Phaser.Geom.Point(0, 0), 1);
    }
    Particle.prototype.isDead = function () { return this.lifetime <= 0; };
    Particle.prototype.Update = function () {
        this.lifetime -= (1 / 60);
        this.position.x += Math.sin(this.direction) * this.speed * (1 / 60);
        this.position.y += Math.cos(this.direction) * this.speed * (1 / 60);
        this.graphic.setPosition(this.position.x, this.position.y);
    };
    Particle.prototype.Destroy = function () {
        this.graphic.destroy();
    };
    return Particle;
}());
var Fruit = /** @class */ (function () {
    function Fruit() {
        this.active = true;
        this.animTimer = 0;
        this.animMoveTimer = 0;
        this.moveDir = 1;
        this.curFrame = 9;
        this.sprite = GameScene.instance.add.sprite(48, 320 - 64, 'character', this.curFrame);
        this.sprite.setOrigin(0, 0);
        this.grabFeedback = GameScene.instance.add.sprite(48, 320 - 64, 'character', 11);
        this.grabFeedback.setOrigin(0, 0);
        this.grabFeedback.setVisible(false);
        this.collectSound = GameScene.instance.sound.add('apple');
    }
    Object.defineProperty(Fruit.prototype, "hitbox", {
        get: function () { return new Rectangle(this.posX + 2, this.originalPosY + 1, 12, 14); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Fruit.prototype, "posX", {
        get: function () { return this.sprite.x; },
        set: function (x) { this.sprite.setX(x); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Fruit.prototype, "posY", {
        get: function () { return this.sprite.y; },
        set: function (y) { this.sprite.setY(y); this.originalPosY = y; this.animMoveTimer = 0.5; },
        enumerable: true,
        configurable: true
    });
    ;
    ;
    ;
    Fruit.prototype.Grab = function () {
        this.active = false;
        this.curFrame = 12;
        this.sprite.setFrame(12);
        this.animTimer = 0;
        this.grabFeedback.setVisible(true);
        this.grabFeedback.setPosition(this.posX, this.posY - 12);
        if (GameScene.sfxOn)
            this.collectSound.play();
    };
    Fruit.prototype.Reset = function () {
        this.sprite.setVisible(true);
        this.active = true;
        this.animTimer = 0;
        this.grabFeedback.setVisible(false);
        this.curFrame = 9;
        this.sprite.setFrame(9);
    };
    Fruit.prototype.Update = function () {
        if (!this.active) {
            if (this.grabFeedback.visible) {
                if (this.grabFeedback.y < this.posY - 36) {
                    this.grabFeedback.setVisible(false);
                }
                else {
                    this.grabFeedback.setPosition(this.posX, this.grabFeedback.y - 24 * (1 / 60));
                }
            }
            if (this.curFrame > 14)
                return;
            this.animTimer += (1 / 60);
            if (this.animTimer > 0.1) {
                this.animTimer -= 0.1;
                this.curFrame++;
                this.sprite.setFrame(this.curFrame);
                if (this.curFrame > 14) {
                    this.sprite.setVisible(false);
                }
            }
            return;
        }
        this.animTimer += (1 / 60);
        this.animMoveTimer += (1 / 61) * this.moveDir;
        if (this.animTimer >= 0.4) {
            this.animTimer -= 0.4;
            this.curFrame = this.curFrame == 9 ? 10 : 9;
            this.sprite.setFrame(this.curFrame);
        }
        if (this.animMoveTimer >= 1 && this.moveDir == 1) {
            this.moveDir = -1;
            this.animMoveTimer = 1 - (this.animMoveTimer - 1);
        }
        else if (this.animMoveTimer <= 0 && this.moveDir == -1) {
            this.moveDir = 1;
            this.animMoveTimer = Math.abs(this.animMoveTimer);
        }
        var ease = this.EaseInOutCubic(this.animMoveTimer);
        this.sprite.y = this.originalPosY - 1 + ease * 2;
        if (GameScene.instance.player.globalHitbox.Intersects(this.hitbox)) {
            this.Grab();
            GameScene.instance.fruitsCollected++;
        }
    };
    Fruit.prototype.EaseInOutCubic = function (t) {
        return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    };
    return Fruit;
}());
var KEY_GROUNDED = 0;
var KEY_INAIR = 1;
var KEY_GRABBED = 2;
var KEY_NOT_SO_KEY_ANYMORE = 3;
var Key = /** @class */ (function (_super) {
    __extends(Key, _super);
    function Key() {
        var _this = _super.call(this) || this;
        _this.gravity = 10;
        _this.maxFallSpeed = 240;
        _this.state = KEY_GROUNDED;
        _this.secret = false;
        Key.instance = _this;
        _this.sprite = GameScene.instance.add.sprite(48, 320 - 64, 'character', 8);
        _this.sprite.setOrigin(0, 0);
        _this.localHitbox = new Rectangle(0, 0, 8, 16);
        _this.disappearDust = new DisappearDust(0, 0);
        _this.useSound = GameScene.instance.sound.add('key_use');
        return _this;
    }
    Key.prototype.Update = function () {
        if (!this.active) {
            this.disappearDust.Update();
            return;
        }
        if (this.state == KEY_INAIR) {
            if (this.speedY < this.maxFallSpeed) {
                this.speedY += this.gravity;
            }
            else if (this.speedY > this.maxFallSpeed) {
                this.speedY = this.maxFallSpeed;
            }
        }
    };
    Key.prototype.BeforeCollisionCheck = function (tiles) {
        var used = false;
        for (var i = 0; i < tiles.length; i++) {
            if (tiles[i] == undefined)
                continue;
            if ((tiles[i].tileType == TILETYPE_KEYBLOCK || tiles[i].tileType == TILETYPE_TRANSLUCENT_KEYBLOCK) && tiles[i].hitbox.Intersects(this.nextHitbox)) {
                tiles[i].Unlock();
                used = true;
            }
            else if (tiles[i].tileType == TILETYPE_SECRET_HEARTH && tiles[i].hitbox.Intersects(this.nextHitbox)) {
                tiles[i].sprite.setVisible(false);
                tiles[i].tileType = TILETYPE_EMPTY;
                this.state = KEY_NOT_SO_KEY_ANYMORE;
                this.secret = true;
                this.sprite.setFrame(15);
                this.disappearDust.position = new Phaser.Geom.Point(this.globalHitbox.centerX, this.globalHitbox.centerY);
                this.disappearDust.Play();
                if (GameScene.sfxOn)
                    this.useSound.play();
            }
        }
        if (used)
            this.Used();
    };
    Key.prototype.Used = function () {
        this.disappearDust.position = new Phaser.Geom.Point(this.globalHitbox.centerX, this.globalHitbox.centerY);
        this.disappearDust.Play();
        this.SetActive(false);
        if (GameScene.sfxOn)
            this.useSound.play();
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
            if (result.tiles[i] == undefined || (!result.tiles[i].solid && !result.tiles[i].semisolid))
                continue;
            var hitbox = this.globalHitbox;
            if (result.tiles[i].hitbox.y == hitbox.bottom && hitbox.right > result.tiles[i].hitbox.x && hitbox.x < result.tiles[i].hitbox.right) {
                return;
            }
        }
        this.state = KEY_INAIR;
    };
    return Key;
}(Actor));
/// <reference path="../actor.ts"/>
var BASE_JUMPPOWER = 220;
var BASE_MAXRUNSPEED = 100;
var BASE_ACCELSPEED = 20;
var BASE_GRAVITY = 11.5;
var KEYHOLD_JUMPPOWER = 200;
var KEYHOLD_MAXRUNSPEED = 80;
var KEYHOLD_ACCELSPEED = 10;
var KEYHOLD_GRAVITY = 14.5;
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player(scene) {
        var _this = _super.call(this) || this;
        _this.maxRunSpeed = BASE_MAXRUNSPEED;
        _this.accelSpeed = BASE_ACCELSPEED;
        _this.jumpPower = BASE_JUMPPOWER;
        _this.gravity = BASE_GRAVITY;
        _this.keyRegrabable = true;
        _this.hitboxWidth = 10;
        _this.hitboxX = 3;
        _this.scene = scene;
        _this.key = GameScene.instance.key;
        _this.sprite = _this.scene.add.sprite(16, 320 - 48, 'character');
        _this.sprite.setOrigin(0, 0);
        _this.localHitbox = new Rectangle(_this.hitboxX, 1, _this.hitboxWidth, 15);
        _this.inputUp = _this.scene.input.keyboard.addKey('up');
        _this.inputDown = _this.scene.input.keyboard.addKey('down');
        _this.inputLeft = _this.scene.input.keyboard.addKey('left');
        _this.inputRight = _this.scene.input.keyboard.addKey('right');
        _this.inputJump = _this.scene.input.keyboard.addKey('Space');
        _this.inputGrab = _this.scene.input.keyboard.addKey('Z');
        _this.landingDust = new LandingDust(0, 0);
        _this.idleState = new IdleState(_this);
        _this.runState = new RunState(_this);
        _this.jumpState = new JumpState(_this);
        _this.fallState = new FallState(_this);
        _this.ChangeState(_this.idleState);
        return _this;
    }
    Object.defineProperty(Player.prototype, "isHoldingKey", {
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
        this.landingDust.Update();
    };
    Player.prototype.OnCollisionSolved = function (result) {
        this.currentState.OnCollisionSolved(result);
        if (this.currentSwitch != undefined) {
            if (!this.currentSwitch.hitbox.Intersects(this.globalHitbox)) {
                this.currentSwitch = undefined;
            }
        }
        else {
            for (var i = 0; i < result.tiles.length; i++) {
                if (result.tiles[i] != undefined && result.tiles[i].hitbox.Intersects(this.globalHitbox) && result.tiles[i].tileType == TILETYPE_SWITCH) {
                    this.currentSwitch = result.tiles[i];
                    Tile.ToggleSwitch();
                    break;
                }
            }
        }
        if (this.speedXDir < 0) {
            this.sprite.flipX = true;
        }
        else if (this.speedXDir > 0) {
            this.sprite.flipX = false;
        }
        if (!this.key.active) {
            if (this.isHoldingKey) {
                this.ReleaseKey();
            }
            return;
        }
        var releaseKey = false;
        if (!this.keyRegrabable) {
            this.keyRegrabable = this.inputGrab.isUp;
        }
        if (!this.isHoldingKey && this.keyRegrabable && this.inputGrab.isDown && this.currentState != this.jumpState && this.key.globalHitbox.IntersectsOrNextTo(this.globalHitbox)) {
            this.GrabKey();
        }
        else if (this.isHoldingKey && this.inputGrab.isUp) {
            releaseKey = true;
        }
        if (this.isHoldingKey) {
            if (this.sprite.flipX) {
                this.key.sprite.flipX = true;
                this.key.sprite.setOrigin(0.5, 0);
                this.localHitbox.x = this.hitboxX - (this.key.localHitbox.width - 2);
            }
            else if (!this.sprite.flipX) {
                this.key.sprite.flipX = false;
                this.key.sprite.setOrigin(0, 0);
                this.localHitbox.x = this.hitboxX;
            }
            this.key.posX = !this.sprite.flipX ? this.globalHitbox.x + this.hitboxWidth : this.globalHitbox.x;
            this.key.posY = this.posY;
            if (releaseKey)
                this.ReleaseKey();
        }
    };
    Player.prototype.GrabKey = function () {
        this.key.state = KEY_GRABBED;
        this.localHitbox.width = this.hitboxWidth + this.key.localHitbox.width - 2;
        this.maxRunSpeed = KEYHOLD_MAXRUNSPEED;
        this.accelSpeed = KEYHOLD_ACCELSPEED;
        this.jumpPower = KEYHOLD_JUMPPOWER;
        this.gravity = KEYHOLD_GRAVITY;
    };
    Player.prototype.ReleaseKey = function () {
        this.keyRegrabable = this.inputGrab.isUp;
        this.key.state = KEY_GROUNDED;
        //this.key.speedY = -0.1;
        this.localHitbox.x = this.hitboxX;
        this.localHitbox.width = this.hitboxWidth;
        this.maxRunSpeed = BASE_MAXRUNSPEED;
        this.accelSpeed = BASE_ACCELSPEED;
        this.jumpPower = BASE_JUMPPOWER;
        this.gravity = BASE_GRAVITY;
    };
    Player.prototype.UpdateMoveControls = function () {
        if (this.inputLeft.isDown) {
            if (this.speedX > -this.maxRunSpeed) {
                this.speedX = Math.max(this.speedX - this.accelSpeed, -this.maxRunSpeed);
            }
            else if (this.speedX < -this.maxRunSpeed) {
                this.speedX = Math.min(this.speedX + this.accelSpeed, -this.maxRunSpeed);
            }
        }
        else if (this.inputRight.isDown) {
            if (this.speedX < this.maxRunSpeed) {
                this.speedX = Math.min(this.speedX + this.accelSpeed, this.maxRunSpeed);
            }
            else if (this.speedX > this.maxRunSpeed) {
                this.speedX = Math.max(this.speedX - this.accelSpeed, this.maxRunSpeed);
            }
        }
        else {
            if (Math.abs(this.speedX) < this.accelSpeed) {
                this.speedX = 0;
            }
            else {
                this.speedX -= this.accelSpeed * this.speedXDir;
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
        _this.maxFallSpeed = 240;
        return _this;
    }
    AirborneState.prototype.OnEnter = function () {
    };
    AirborneState.prototype.Update = function () {
        this.player.UpdateMoveControls();
        if (this.player.speedY < this.maxFallSpeed) {
            this.player.speedY += this.player.gravity;
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
        var speedRequired = !this.player.isHoldingKey ? this.player.speedY + 15 : this.player.speedY + 40;
        if (speedRequired >= this.maxFallSpeed) {
            this.player.landingDust.position.x = this.player.globalHitbox.centerX;
            this.player.landingDust.position.y = this.player.globalHitbox.bottom;
            this.player.landingDust.Play();
        }
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
        if (this.player.currentState == this)
            // Check if you land on the key
            if (this.player.key.active &&
                GameScene.instance.prevPlayerHitbox.bottom < this.player.key.posY &&
                this.player.globalHitbox.bottom > this.player.key.posY &&
                this.player.globalHitbox.Intersects(this.player.key.globalHitbox)) {
                this.player.posY = this.player.key.posY - this.player.localHitbox.height - this.player.localHitbox.y;
                this.Land();
            }
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
        if (Phaser.Input.Keyboard.JustDown(this.player.inputJump)) {
            this.player.ChangeState(this.player.jumpState);
        }
    };
    GroundedState.prototype.OnCollisionSolved = function (result) {
        var hitbox = this.player.globalHitbox;
        var releaseKey = false;
        for (var i = 0; i < result.tiles.length; i++) {
            if (result.tiles[i] == undefined || (!result.tiles[i].solid && !result.tiles[i].semisolid))
                continue;
            if (result.tiles[i].hitbox.y == hitbox.bottom && hitbox.right > result.tiles[i].hitbox.x && hitbox.x < result.tiles[i].hitbox.right) {
                if (this.player.isHoldingKey) {
                    if (this.player.posX + this.player.hitboxX < result.tiles[i].hitbox.right && this.player.posX + this.player.hitboxX + this.player.hitboxWidth > result.tiles[i].hitbox.x) {
                        return;
                    }
                    else
                        releaseKey = true;
                }
                else
                    return;
            }
        }
        if (releaseKey) {
            this.player.ReleaseKey();
        }
        // If the key is also not under the player, fall
        else if (this.player.key.active && !this.player.isHoldingKey && this.player.key.globalHitbox.y == hitbox.bottom && hitbox.right > this.player.key.globalHitbox.x && hitbox.x < this.player.key.globalHitbox.right) {
            // if (!Phaser.Input.Keyboard.JustDown(this.player.inputGrab))
            // {
            //     return;
            // }
            // this.player.GrabKey();
            return;
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
        this.frame = !this.player.isHoldingKey ? 0 : 6;
        this.player.sprite.setFrame(this.frame);
    };
    IdleState.prototype.Update = function () {
        _super.prototype.Update.call(this);
        this.player.UpdateMoveControls();
        if (this.player.speedX != 0 && this.player.currentState == this) {
            this.player.ChangeState(this.player.runState);
        }
        else if (this.player.isHoldingKey && this.frame == 0) {
            this.frame = 6;
            this.player.sprite.setFrame(this.frame);
        }
        else if (!this.player.isHoldingKey && this.frame == 6) {
            this.frame = 0;
            this.player.sprite.setFrame(this.frame);
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
        var _this = _super.call(this, player) || this;
        _this.snd = GameScene.instance.sound.add('jump');
        return _this;
    }
    JumpState.prototype.OnEnter = function () {
        this.player.speedY = -this.player.jumpPower;
        if (this.player.key.secret && this.player.isHoldingKey) {
            this.player.speedY = -480;
        }
        this.player.sprite.setFrame(2);
        if (GameScene.sfxOn)
            this.snd.play();
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
        this.curFrame = !this.player.isHoldingKey ? 0 : 7;
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
            if ((this.curFrame == 1 || this.curFrame == 0) && this.player.isHoldingKey) {
                this.curFrame = 6;
            }
            else if ((this.curFrame == 6 || this.curFrame == 7) && !this.player.isHoldingKey) {
                this.curFrame = 0;
            }
            this.animTimer += (1 / 60);
            if (this.animTimer > 0.2 * (100 / Math.abs(this.player.speedX))) {
                this.animTimer = 0;
                if (this.curFrame == 1)
                    this.curFrame = 0;
                else if (this.curFrame == 0)
                    this.curFrame = 1;
                else if (this.curFrame == 6)
                    this.curFrame = 7;
                else if (this.curFrame == 7)
                    this.curFrame = 6;
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