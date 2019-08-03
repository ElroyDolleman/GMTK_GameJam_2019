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
        _this.levelOrder = [LEVEL01, LEVEL02, LEVEL03];
        _this.currentLevel = 0;
        _this.fruitsCollected = 0;
        GameScene.instance = _this;
        return _this;
    }
    GameScene.prototype.preload = function () {
        this.load.spritesheet('character', 'assets/character.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('tilessheet', 'assets/tilessheet.png', { frameWidth: 16, frameHeight: 16 });
    };
    GameScene.prototype.create = function () {
        this.inputReset = this.input.keyboard.addKey('R');
        this.tiles = LevelLoader.load(LEVEL01);
        this.key = new Key();
        this.player = new Player(this);
        this.key.player = this.player;
        this.key.posX = this.keySpawn.x;
        this.key.posY = this.keySpawn.y;
        this.player.posX = this.playerSpawn.x;
        this.player.posY = this.playerSpawn.y;
        this.fruit = new Fruit();
        this.fruit.posX = this.fruitSpawn.x;
        this.fruit.posY = this.fruitSpawn.y - 8;
    };
    GameScene.prototype.nextLevel = function () {
        LevelLoader.unload();
        this.currentLevel = Math.min(this.currentLevel + 1, this.levelOrder.length - 1);
        this.tiles = LevelLoader.load(this.levelOrder[this.currentLevel]);
        this.resetObjects();
    };
    GameScene.prototype.reset = function () {
        LevelLoader.reload();
        this.resetObjects();
    };
    GameScene.prototype.resetObjects = function () {
        this.key.SetActive(true);
        this.key.posX = this.keySpawn.x;
        this.key.posY = this.keySpawn.y;
        this.fruit.active = true;
        this.fruit.posX = this.fruitSpawn.x;
        this.fruit.posY = this.fruitSpawn.y - 8;
        this.player.posX = this.playerSpawn.x;
        this.player.posY = this.playerSpawn.y;
        this.player.speedX = 0;
        this.player.speedY = 0;
        this.player.sprite.flipX = false;
        this.player.ChangeState(this.player.idleState);
    };
    GameScene.prototype.update = function () {
        if (this.player.active)
            this.player.Update();
        if (this.key.active)
            this.key.Update();
        this.prevPlayerHitbox = this.player.globalHitbox;
        this.moveActor(this.player);
        this.moveActor(this.key, this.key.state != KEY_GRABBED);
        if (this.player.posX < 0)
            this.player.posX = 0;
        if (this.key.posX < 0)
            this.key.posX = 0;
        if (this.fruit.active)
            this.fruit.Update();
        if (this.player.posX > 321 + this.player.localHitbox.width) {
            this.nextLevel();
        }
        else if (Phaser.Input.Keyboard.JustDown(this.inputReset)) {
            this.reset();
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
var LEVEL01 = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 4, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 5, 4, 18, 18, 18, 18, 18, 5, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 11, 0, 0, 0, 0, 0, 9, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 11, 0, 0, 0, 0, 0, 9, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 11, 0, 0, 0, 0, 0, 9, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 11, 0, 0, 0, 0, 0, 9, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 11, 0, 0, 0, 0, 0, 9, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 11, 0, 0, 0, 0, 0, 9, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 11, 0, 0, 0, 0, 0, 9, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 11, 0, 0, 0, 0, 0, 9, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 11, 0, 0, 0, 0, 0, 9, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 11, 8, 0, 0, 0, 0, 9, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 11, 0, 0, 0, 0, 0, 17, 18, 11, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 0, 9, 11, 0, 0, 0, 0, 0, 20, 0, 11, 0, 0, 0, 0, 1, 3, 0, 0, 9, 11, 0, 17, 19, 0, 0, 0, 0, 0, 28, 0, 11, 0, 7, 0, 0, 9, 11, 0, 0, 9, 11, 6, 0, 0, 0, 0, 1, 2, 2, 2, 2, 12, 2, 2, 2, 2, 13, 12, 2, 2, 13, 12, 2, 2, 2, 2, 2, 13, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
var LEVEL02 = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 4, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 5, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 18, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 25, 7, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 0, 0, 26, 0, 2, 2, 2, 2, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 26, 0, 0, 29, 0, 10, 10, 10, 10, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 29, 0, 0, 1, 2, 10, 10, 10, 10, 10, 12, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 13, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
var LEVEL03 = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 4, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 5, 10, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 10, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 10, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 10, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 18, 18, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 1, 2, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 18, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 0, 0, 7, 0, 0, 27, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 26, 0, 0, 2, 3, 14, 14, 1, 2, 3, 0, 27, 0, 0, 0, 20, 0, 0, 21, 0, 0, 29, 1, 2, 10, 11, 14, 14, 17, 18, 19, 0, 1, 3, 0, 0, 28, 0, 0, 26, 0, 0, 1, 13, 10, 10, 11, 14, 14, 0, 6, 0, 0, 9, 11, 0, 0, 0, 0, 0, 29, 1, 2, 13, 10, 10, 10, 12, 2, 2, 2, 2, 2, 2, 13, 12, 2, 2, 2, 2, 2, 2, 13, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
var LevelLoader = /** @class */ (function () {
    function LevelLoader() {
    }
    LevelLoader.load = function (array) {
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
                    GameScene.instance.fruitSpawn = new Phaser.Geom.Point(x * 16, y * 16);
                    frame = -1;
                    break;
                case 20:
                case 21:
                case 26:
                case 27:
                case 28:
                case 29:
                    tileType = TILETYPE_KEYBLOCK;
                    break;
                case 14:
                    tileType = TILETYPE_SEMISOLID;
                    break;
                default:
                    if (array[i] > 0) {
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
var Tile = /** @class */ (function () {
    function Tile(hitbox, tileType, frame) {
        this.connections = [];
        this.hitbox = hitbox;
        this.tileType = tileType;
        if (tileType > 0) {
            this.sprite = GameScene.instance.add.sprite(hitbox.x, hitbox.y, 'tilessheet', frame);
            this.sprite.setOrigin(0, 0);
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
    }
    Object.defineProperty(Tile.prototype, "solid", {
        get: function () { return this.tileType == TILETYPE_SOLID || this.tileType == TILETYPE_KEYBLOCK; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tile.prototype, "semisolid", {
        get: function () { return this.tileType == TILETYPE_SEMISOLID; },
        enumerable: true,
        configurable: true
    });
    Tile.prototype.Unlock = function () {
        this.tileType = TILETYPE_EMPTY;
        this.sprite.setVisible(false);
        while (this.connections.length > 0) {
            var index = this.connections[0].x % 21 + this.connections[0].y * 21;
            if (GameScene.instance.tiles[index].tileType == TILETYPE_KEYBLOCK) {
                GameScene.instance.tiles[index].Unlock();
            }
            this.connections.splice(0, 1);
        }
    };
    return Tile;
}());
var Fruit = /** @class */ (function () {
    function Fruit() {
        this.animTimer = 0;
        this.curFrame = 9;
        this.sprite = GameScene.instance.add.sprite(48, 320 - 64, 'character', this.curFrame);
        this.sprite.setOrigin(0, 0);
    }
    Object.defineProperty(Fruit.prototype, "hitbox", {
        get: function () { return new Rectangle(this.posX + 2, this.posY + 1, 12, 14); },
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
        set: function (y) { this.sprite.setY(y); },
        enumerable: true,
        configurable: true
    });
    ;
    ;
    ;
    Object.defineProperty(Fruit.prototype, "active", {
        get: function () { return this.sprite.visible; },
        set: function (a) { this.sprite.setVisible(a); },
        enumerable: true,
        configurable: true
    });
    ;
    ;
    Fruit.prototype.Update = function () {
        this.animTimer += (1 / 60);
        if (this.animTimer >= 0.5) {
            this.animTimer -= 0.5;
            this.curFrame = this.curFrame == 9 ? 10 : 9;
            this.sprite.setFrame(this.curFrame);
        }
        if (GameScene.instance.player.globalHitbox.Intersects(this.hitbox)) {
            this.active = false;
            GameScene.instance.fruitsCollected++;
        }
    };
    return Fruit;
}());
var KEY_GROUNDED = 0;
var KEY_INAIR = 1;
var KEY_GRABBED = 2;
var Key = /** @class */ (function (_super) {
    __extends(Key, _super);
    function Key() {
        var _this = _super.call(this) || this;
        _this.gravity = 10;
        _this.maxFallSpeed = 240;
        _this.state = KEY_GROUNDED;
        Key.instance = _this;
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
    Key.prototype.BeforeCollisionCheck = function (tiles) {
        var used = false;
        for (var i = 0; i < tiles.length; i++) {
            if (tiles[i] != undefined && tiles[i].tileType == TILETYPE_KEYBLOCK && tiles[i].hitbox.Intersects(this.globalHitbox)) {
                tiles[i].Unlock();
                used = true;
            }
        }
        if (used)
            this.Used();
    };
    Key.prototype.Used = function () {
        this.SetActive(false);
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
        if (this.isHoldingKey) {
            //this.key.posX = this.globalHitbox.right;
            //this.key.posY = this.posY;
        }
    };
    Player.prototype.OnCollisionSolved = function (result) {
        this.currentState.OnCollisionSolved(result);
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
        if (!this.isHoldingKey && Phaser.Input.Keyboard.JustDown(this.inputGrab) && this.key.globalHitbox.Intersects(this.globalHitbox)) {
            this.GrabKey();
        }
        else if (this.isHoldingKey && Phaser.Input.Keyboard.JustDown(this.inputGrab)) {
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
        this.key.state = KEY_INAIR;
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
        for (var i = 0; i < result.tiles.length; i++) {
            if (result.tiles[i] == undefined || (!result.tiles[i].solid && !result.tiles[i].semisolid))
                continue;
            if (result.tiles[i].hitbox.y == hitbox.bottom && hitbox.right > result.tiles[i].hitbox.x && hitbox.x < result.tiles[i].hitbox.right) {
                return;
            }
        }
        // If the key is also not under the player, fall
        if (this.player.key.active && !this.player.isHoldingKey && this.player.key.globalHitbox.y == hitbox.bottom && hitbox.right > this.player.key.globalHitbox.x && hitbox.x < this.player.key.globalHitbox.right) {
            if (!Phaser.Input.Keyboard.JustDown(this.player.inputGrab)) {
                return;
            }
            this.player.GrabKey();
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
        this.player.sprite.setFrame(!this.player.isHoldingKey ? 0 : 6);
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
        this.player.speedY = -this.player.jumpPower;
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