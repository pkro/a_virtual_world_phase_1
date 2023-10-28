class Building {
    constructor(public base: Polygon, private heightCoef = 0.2) {
    }

    draw(ctx: CanvasRenderingContext2D, viewPoint: Point) {
        const topPoints = this.base.points.map(p=>
            add(p, scale(subtract(p, viewPoint), this.heightCoef))
        );
        const ceiling = new Polygon(topPoints);
        const sides: Polygon[] = [];
        for (let i = 0; i < this.base.points.length; i++) {
            const nextI = (i + 1) % this.base.points.length;
            const poly = new Polygon([
                this.base.points[i], this.base.points[nextI],
                topPoints[nextI], topPoints[i]
            ]);
            sides.push(poly);
        }

        // draw closest sides last
        sides.sort(
            (a,b) =>
                b.distanceToPoint(viewPoint) - a.distanceToPoint(viewPoint)
        );

        this.base.draw(ctx, {fill: "white", stroke: "#AAA"});
        for (const side of sides) {
            side.draw(ctx, {fill: 'yellow', stroke: 'black'})
        }
        ceiling.draw(ctx, {fill: "blue", stroke: "#BBB"})
    }
}