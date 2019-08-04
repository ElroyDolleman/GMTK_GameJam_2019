class Rectangle
{
    public get right(): number { return this.x + this.width; }
    public get bottom(): number { return this.y + this.height; }
    public get centerX(): number { return this.x + this.width / 2; }
    public get centerY(): number { return this.y + this.height / 2; }

    public x: number;
    public y: number;
    public width: number;
    public height: number;

    constructor(x: number, y: number, width: number, height: number)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    public Intersects(other: Rectangle)
    {
        return other.x < this.right &&
            this.x < other.right &&
            other.y < this.bottom &&
            this.y < other.bottom;
    }

    public IntersectsOrNextTo(other: Rectangle)
    {
        return other.x <= this.right &&
            this.x <= other.right &&
            other.y <= this.bottom &&
            this.y <= other.bottom;
    }
}