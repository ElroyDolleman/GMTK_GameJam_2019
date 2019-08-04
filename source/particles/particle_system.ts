class ParticleSystem
{
    public position: Phaser.Geom.Point;

    public minOffset: Phaser.Geom.Point;
    public maxOffset: Phaser.Geom.Point;

    public minLifeTime: number;
    public maxLifeTime: number;

    public minSpeed: number;
    public maxSpeed: number;

    public minDirection: number;
    public maxDirection: number;

    public minSpawn: number;
    public maxSpawn: number;

    public minInterval: number;
    public maxInterval: number;

    public duration: number;
    public timer: number;

    public particles: Particle[] = [];

    constructor(posX: number, posY: number)
    {
        this.position = new Phaser.Geom.Point(posX, posY);
    }

    Play()
    {
        this.timer = 0;
        this.Emit();

        if (this.duration > 0 && this.maxInterval != 0)
        {
            setTimeout(this.Emit.bind(this), RNG.Number(this.minInterval, this.maxInterval));
        }
    }

    Update()
    {
        if (this.timer < this.duration)
        {
            this.timer = Math.min(this.timer + (1/60), this.duration);
        }

        for (let i = 0; i < this.particles.length; i++)
        {
            this.particles[i].Update();

            if (this.particles[i].lifetime <= 0)
            {
                this.particles[i].Destroy();
                this.particles.splice(i, 1);
                i--;
            }
        }
    }

    Emit()
    {
        let spawnAmount = RNG.Int(this.minSpawn, this.maxSpawn);

        for (let i = 0; i < spawnAmount; i++)
        {
            let offsetX = RNG.Number(this.minOffset.x, this.maxOffset.x);
            let offsetY = RNG.Number(this.minOffset.y, this.maxOffset.y);

            let particle = new Particle(this.position.x + offsetX, this.position.y + offsetY);

            particle.lifetime = RNG.Number(this.minLifeTime, this.maxLifeTime);
            particle.speed = RNG.Number(this.minSpeed, this.maxSpeed);
            particle.direction = RNG.Number(this.minDirection, this.maxDirection);

            this.particles.push(particle);
        }

        if (this.timer < this.duration && this.maxInterval != 0)
        {
            setTimeout(this.Emit.bind(this), RNG.Number(this.minInterval, this.maxInterval));
        }
    }

    Clear()
    {
        for (let i = 0; i < this.particles.length; i++)
        {
            this.particles[i].Destroy();
            this.particles.splice(i, 1);
            i--;
        }
    }
}