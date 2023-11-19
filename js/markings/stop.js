"use strict";
class Stop extends Marking {
    border = null;
    constructor(center, directionVector, width, height) {
        super(center, directionVector, width, height);
        this.border = this.poly.segments[2];
    }
    draw(ctx) {
        this.border.draw(ctx, { width: 5, color: "white" });
        ctx.save();
        ctx.translate(this.center.x, this.center.y);
        // rotate so it is always "up" in the direction of traffic (right side of road)
        ctx.rotate(angle(this.directionVector) - Math.PI / 2);
        ctx.scale(1, 3); // usually, the stop markings have a large character height, so we stretch it a little here
        ctx.beginPath();
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.font = "bold " + this.height * 0.3 + "px Arial";
        ctx.fillText("STOP", 0, 1); // 0 1 because we're already where we need to be due to the translate; 1 is just a slight offset
        ctx.restore(); // undo translate
    }
}
