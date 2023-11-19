"use strict";
class Segment {
    p1;
    p2;
    constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
    }
    equals(seg) {
        return this.includes(seg.p1) && this.includes(seg.p2);
    }
    includes(point) {
        return this.p1.equals(point) || this.p2.equals(point);
    }
    distanceToPoint(point) {
        const proj = this.projectPoint(point);
        if (proj.offset > 0 && proj.offset < 1) {
            // point is within line
            return distance(point, proj.point);
        }
        else {
            // projected point is outside of line
            const distToA = distance(point, this.p1);
            const distToB = distance(point, this.p2);
            return Math.min(distToB, distToA);
        }
    }
    projectPoint(point) {
        const a = subtract(point, this.p1);
        const b = subtract(this.p2, this.p1);
        const normB = normalize(b);
        const scaler = dot(a, normB);
        return {
            point: add(this.p1, scale(normB, scaler)),
            offset: scaler / magnitude(b)
        };
    }
    length() {
        return distance(this.p1, this.p2);
    }
    draw(ctx, options = {}) {
        const defaultOptions = { width: 2, color: "black", dash: [], cap: "butt" };
        const { width, color, dash, cap } = { ...defaultOptions, ...options };
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.strokeStyle = color;
        ctx.lineCap = cap;
        const oldLineDash = ctx.getLineDash();
        ctx.setLineDash(dash);
        ctx.moveTo(this.p1.x, this.p1.y);
        ctx.lineTo(this.p2.x, this.p2.y);
        ctx.stroke();
        ctx.setLineDash(oldLineDash);
    }
    directionVector() {
        return normalize(subtract(this.p2, this.p1));
    }
}
