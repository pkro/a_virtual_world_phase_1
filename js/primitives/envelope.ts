class Envelope {
    public poly;

    constructor(private skeleton: Segment, // The main line segment around which the envelope is constructed.
                private width: number,
                private roundness=1 // The roundness of the envelope's corners. A value of 1 results in a square envelope.
     ) {
        // Generate the envelope polygon based on the given width and roundness.
        this.poly = this.#generatePolygon(width, this.roundness);
    }

    #generatePolygon(width: number, roundndess: number) {
        const {p1, p2} = this.skeleton;

        // Calculate the radius of the envelope. It is half of the desired width.
        const radius = width/2;

        // Calculate the angle formed by the skeleton segment.
        const alpha = angle(subtract(p1, p2));

        // Calculate the clockwise and counterclockwise perpendicular angles to the skeleton segment.
        const alpha_clockwise = alpha + Math.PI/2;
        const alpha_counterclockwise = alpha - Math.PI/2;

        const points = [];
        // Calculate the angular step for generating points. If roundness is 0,
        // treat it the same as 1 to avoid dividing by zero and create a square shape.
        const step = Math.PI / Math.max(1, roundndess);
        const eps = step / 2; // A small epsilon value to ensure the loop covers the entire range.

        // Generate points around the first endpoint of the skeleton segment.
        for(let i=alpha_counterclockwise; i<alpha_clockwise + eps; i+=step) {
            points.push(translate(p1, i, radius));
        }

        // Generate points around the second endpoint of the skeleton segment, but in the opposite direction.
        for(let i=alpha_counterclockwise; i<alpha_clockwise + eps; i+=step) {
            points.push(translate(p2, Math.PI + i, radius));
        }

        return new Polygon(points);
    }

    // Parameters utility type, which returns a tuple of a function's parameters' types. We then use indexing to get the type of the second parameter (index 1).
    draw(ctx: CanvasRenderingContext2D, options: Parameters<Polygon['draw']>[1]) {
        // Draw the polygon (envelope) on the canvas context.
        this.poly.draw(ctx, options)
    }
}
