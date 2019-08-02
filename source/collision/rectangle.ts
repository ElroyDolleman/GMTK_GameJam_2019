class Rectangle
{
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
        return other.x < (this.x + this.width) &&
            this.x < (other.x + other.width) &&
            other.y < this.y + this.height &&
            this.y < other.y + other.height;
    }
}