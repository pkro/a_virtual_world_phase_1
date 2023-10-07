type DrawOptions = {size: number, color: string, outline: boolean, fill: boolean};

class Point {
    constructor(public x: number, public y: number) {
    }

    equals(point: Point) {
        return this.x === point.x && this.y === point.y;
    }



    draw(ctx: CanvasRenderingContext2D, options: Partial<DrawOptions> = {}) {
        const defaultOptions: DrawOptions = {size: 18, color: "black", outline: false, fill: false};
        const {size, color, outline, fill} = {...defaultOptions, ...options} as DrawOptions;
        const rad = size/2;
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(this.x, this.y, rad, 0, Math.PI*2);
        ctx.fill();
        if (outline) {
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "yellow";
            ctx.arc(this.x, this.y, rad*0.6,0, Math.PI*2);
            ctx.stroke();
        }
        // for highlighting a hovered point
        if (fill) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, rad*0.4, 0, Math.PI*2);
            ctx.fillStyle = "yellow";
            ctx.fill();
        }
    }
}