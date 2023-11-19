class Crossing extends Marking{
    public borders;

    constructor(public center: Point, public directionVector: Point, public width: number, public height: number) {
        super(center, directionVector, width, height);

        this.borders = [this.poly.segments[0], this.poly.segments[2]];
    }

    draw(ctx: CanvasRenderingContext2D) {
        const perp  = perpendicular(this.directionVector);
        const line = new Segment(
            add(this.center, scale(perp, this.width / 2)),
            add(this.center, scale(perp, -this.width / 2)),
        );
        line.draw(ctx, {
            width: this.height, // thick line
            color: "white",
            dash: [11,11]
        });
    }
}