"use strict";
class Polygon {
    points;
    segments = [];
    constructor(points) {
        this.points = points;
        for (let i = 1; i <= points.length; i++) {
            this.segments.push(new Segment(points[i - 1], points[i % points.length] // connects 2 points and connects the last point to the first
            ));
        }
    }
    static union(polys) {
        Polygon.multiBreak(polys);
        const keptSegments = [];
        for (let i = 0; i < polys.length; i++) {
            for (const seg of polys[i].segments) {
                let keep = true;
                for (let j = 0; j < polys.length; j++) {
                    if (i != j) {
                        if (polys[j].containsSegment(seg)) {
                            keep = false;
                            break;
                        }
                    }
                }
                if (keep) {
                    keptSegments.push(seg);
                }
            }
        }
        return keptSegments;
    }
    containsSegment(seg) {
        // we just check if the midpoint is contained, good enough
        const midpoint = average(seg.p1, seg.p2);
        return this.containsPoint(midpoint);
    }
    intersectsPoly(polygon) {
        for (const seg1 of this.segments) {
            for (const seg2 of polygon.segments) {
                if (getIntersection(seg1.p1, seg1.p2, seg2.p1, seg2.p2)) {
                    return true;
                }
            }
        }
        return false;
    }
    containsPoint(p) {
        // we will check how often a line from an outer point to the point we are checking
        // intersects the segments of the polygon
        // if it intersects an odd number of times, the point is inside the polygon (in/out/in),
        // otherwise (even) it isn't (it goes in and out)
        const outerPoint = new Point(-1000, -1000);
        // we could just use p and outerPoint, but this makes it easier to think about it imho
        const seg = new Segment(outerPoint, p);
        let intersectionCount = 0;
        for (let i = 0; i < this.segments.length; i++) {
            if (getIntersection(seg.p1, seg.p2, this.segments[i].p1, this.segments[i].p2)) {
                intersectionCount++;
            }
        }
        return intersectionCount % 2 !== 0;
    }
    distanceToPoint(p) {
        return Math.min(...this.segments.map(s => s.distanceToPoint(p)));
    }
    distanceToPoly(poly) {
        return Math.min(...this.points.map(p => poly.distanceToPoint(p)));
    }
    static multiBreak(polygons) {
        for (let i = 0; i < polygons.length - 1; i++) {
            for (let j = i + 1; j < polygons.length; j++) {
                Polygon.break(polygons[i], polygons[j]);
            }
        }
    }
    static break(poly1, poly2) {
        const segs1 = poly1.segments;
        const segs2 = poly2.segments;
        for (let i = 0; i < segs1.length; i++) {
            for (let j = 0; j < segs2.length; j++) {
                const intersection = getIntersection(segs1[i].p1, segs1[i].p2, segs2[j].p1, segs2[j].p2);
                if (intersection &&
                    intersection.offset != 1 && intersection.offset != 0 // make sure they don't intersect exactly at the tip (?)
                ) {
                    const point = new Point(intersection.x, intersection.y);
                    let aux = segs1[i].p2; // keep reference to former p2 (which is after the intersecting point)
                    segs1[i].p2 = point; // and replace it with the intersecting point
                    segs1.splice(i + 1, 0, new Segment(point, aux));
                    aux = segs2[j].p2;
                    segs2[j].p2 = point;
                    segs2.splice(j + 1, 0, new Segment(point, aux));
                }
            }
        }
    }
    drawSegments(ctx, width = 5) {
        for (const seg of this.segments) {
            seg.draw(ctx, { color: getRandomColor(), width });
        }
    }
    draw(ctx, { stroke = "blue", lineWidth = 2, fill = "rgba(0,0,255,0.3" } = {}) {
        if (this.points.length <= 1) {
            return;
        }
        ctx.beginPath();
        ctx.fillStyle = fill;
        ctx.strokeStyle = stroke;
        ctx.lineWidth = lineWidth;
        ctx.moveTo(this.points[0].x, this.points[0].y);
        for (let i = 1; i < this.points.length; i++) {
            ctx.lineTo(this.points[i].x, this.points[i].y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
}
