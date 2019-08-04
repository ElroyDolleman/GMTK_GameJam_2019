/// <reference path="particle_system.ts"/>

class LandingDust extends ParticleSystem
{
    constructor(posX: number, posY: number)
    {
        super(posX, posY);

        this.minOffset = new Phaser.Geom.Point(-5, -4);
        this.maxOffset = new Phaser.Geom.Point(5, 0);

        this.minSpeed = 2.8;
        this.maxSpeed = 4;

        this.minSpawn = 16;
        this.maxSpawn = 32;

        this.minLifeTime = 0.75;
        this.maxLifeTime = 1;

        this.minDirection = 180 * (Math.PI/180);
        this.maxDirection = 180 * (Math.PI/180);

        this.duration = 0;
    }
}