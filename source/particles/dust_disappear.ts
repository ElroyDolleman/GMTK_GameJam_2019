/// <reference path="particle_system.ts"/>

class DisappearDust extends ParticleSystem
{
    constructor(posX: number, posY: number)
    {
        super(posX, posY);

        this.minOffset = new Phaser.Geom.Point(-8, -8);
        this.maxOffset = new Phaser.Geom.Point(8, 8);

        this.minSpeed = 10;
        this.maxSpeed = 12;

        this.minSpawn = 48;
        this.maxSpawn = 64;

        this.minLifeTime = 0.75;
        this.maxLifeTime = 1.25;

        this.minDirection = 0 * (Math.PI/180);
        this.maxDirection = 360 * (Math.PI/180);

        this.duration = 0;
    }
}