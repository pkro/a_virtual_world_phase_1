// Note: usually graphs are represented as points and connections, for simplicity in the course they are represented as segments between 2 points.

class Graph {

    constructor(points=[], segments=[]) {
        this.points = points;
        this.segments = segments;
    }

    draw(ctx) {
        for (const seg of this.segments) {
            seg.draw(ctx);
        }

        for (const point of this.points) {
            point.draw(ctx);
        }
    }
}