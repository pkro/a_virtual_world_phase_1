// Note: usually graphs are represented as points and connections, for simplicity in the course they are represented as segments between 2 points.

class Graph {

    constructor(public points: Point[] = [], public segments: Segment[] = []) {

    }

    tryAddPoint(p: Point) {
        if (!this.containsPoint(p)) {
            this.addPoint(p);
            return true;
        }
        return false;
    }

    addPoint(point: Point) {
        this.points.push(point);
    }

    containsPoint(point: Point) {
        return this.points.find(p => p.equals(point));
    }

    tryAddSegment(seg: Segment) {
        if (!this.containsSegment(seg) && !seg.p1.equals(seg.p2)) {
            this.addSegment(seg);
            return true;
        }
        return false;
    }

    addSegment(seg: Segment) {
        this.segments.push(seg)
    }

    containsSegment(seg: Segment) {
        return this.segments.find(s => s.equals(seg));
    }

    removeSegment(seg: Segment) {
        this.segments.splice(this.segments.indexOf(seg), 1);
        //this.segments = this.segments.reduce((acc, _, idx) => index === idx ? [...acc] : [...acc, this.segments[idx]], []);
    }

    removePoint(point: Point) {
        const segs = this.getSegmentsWithPoint(point);
        for (const seg of segs) {
            this.removeSegment(seg);
        }
        this.points.splice(this.points.indexOf(point), 1);

    }

    getSegmentsWithPoint(point: Point) {
        return this.segments.filter(seg => seg.includes(point));
    }

    dispose() {
        this.segments = [];
        this.points = [];
    }

    draw(ctx: CanvasRenderingContext2D) {
        for (const seg of this.segments) {
            seg.draw(ctx);
        }

        for (const point of this.points) {
            point.draw(ctx);
        }
    }

}