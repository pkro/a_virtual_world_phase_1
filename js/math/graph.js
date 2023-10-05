// Note: usually graphs are represented as points and connections, for simplicity in the course they are represented as segments between 2 points.

class Graph {

    constructor(points=[], segments=[]) {
        this.points = points;
        this.segments = segments;
    }

    tryAddPoint(p) {
        if(!this.containsPoint(p)) {
            this.addPoint(p);
            return true;
        }
        return false;
    }

    addPoint(point) {
        this.points.push(point);
    }

    containsPoint(point) {
        return this.points.find(p => p.equals(point));
    }

    tryAddSegment(seg) {
        if (!this.containsSegment(seg) && !seg.p1.equals(seg.p2)) {
            this.addSegment(seg);
            return true;
        }
        return false;
    }

    addSegment(seg) {
        this.segments.push(seg)
    }

    containsSegment(seg) {
        return this.segments.find(s=>s.equals(seg));
    }

    removeSegment(seg) {
        this.segments.splice(this.segments.indexOf(seg), 1);
        //this.segments = this.segments.reduce((acc, _, idx) => index === idx ? [...acc] : [...acc, this.segments[idx]], []);
    }

    removePoint(point) {
        const segs = this.getSegmentsWithPoint(point);
        for (const seg of segs) {
            this.removeSegment(seg);
        }
        this.points.splice(this.points.indexOf(point), 1);

    }

    getSegmentsWithPoint(point) {
        return this.segments.filter(seg => seg.includes(point));
    }

    dispose() {
        this.segments = [];
        this.points = [];
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