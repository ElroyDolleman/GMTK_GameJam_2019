class RNG
{
    public static Number(min: number, max: number): number
    {
        return min + Math.random() * (max - min);
    }

    public static Int(min: number, max: number): number
    {
        return Math.round(min + Math.random() * (max - min));
    }
}