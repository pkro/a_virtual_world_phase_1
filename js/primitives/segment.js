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
    draw(ctx, options = {}) {
        const defaultOptions = { width: 2, color: "black", dash: [] };
        const { width, color, dash } = { ...defaultOptions, ...options };
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.strokeStyle = color;
        const oldLineDash = ctx.getLineDash();
        ctx.setLineDash(dash);
        ctx.moveTo(this.p1.x, this.p1.y);
        ctx.lineTo(this.p2.x, this.p2.y);
        ctx.stroke();
        ctx.setLineDash(oldLineDash);
    }
}
