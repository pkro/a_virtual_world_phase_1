class Start extends Marking {
    public img: HTMLImageElement;

    constructor(center: Point, directionVector: Point, width: number, height: number) {
        super(center, directionVector, width, height);
        this.img = new Image();
        this.img.src = "car.png";
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(this.center.x, this.center.y);
        // rotate so it is always "up" in the direction of traffic (right side of road)
        ctx.rotate(angle(this.directionVector) - Math.PI / 2);


        ctx.drawImage(this.img, -this.img.width / 2, -this.img.height / 2)
        ctx.restore(); // undo translate
    }
}