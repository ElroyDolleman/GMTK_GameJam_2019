class Particle
{
    public graphic: Phaser.GameObjects.Graphics;

    public lifetime: number;

    public position: Phaser.Geom.Point;

    public speed: number;
    public direction: number;

    public isDead(): boolean { return this.lifetime <= 0; }

    constructor(positionX: number, positionY: number)
    {
        this.position = new Phaser.Geom.Point(positionX, positionY);

        this.graphic = GameScene.instance.add.graphics({ fillStyle: { color: 0xFFFFFF } });

        this.graphic.fillPointShape(new Phaser.Geom.Point(0, 0), 1);
    }

    Update()
    {
        this.lifetime -= (1/60);

        this.position.x += Math.sin(this.direction) * this.speed * (1/60);
        this.position.y += Math.cos(this.direction) * this.speed * (1/60);

        this.graphic.setPosition(this.position.x, this.position.y);
    }

    Destroy()
    {
        this.graphic.destroy();
    }
}