type Class = { new(...args: any[]): any; };

class Marking {
    support: Segment;
    poly: Polygon;
    type: String;

    constructor(public center: Point, public directionVector: Point, public width: number, public height: number) {
        this.support = new Segment(
            translate(center, angle(directionVector), height / 2),
            translate(center, angle(directionVector), -height / 2)
        );

        this.poly = new Envelope(this.support, width, 0).poly;

        this.type = this.constructor.name.toLowerCase();
    }

    static load(marking: Marking) {
        const center = new Point(marking.center.x, marking.center.y);
        const directionVector = new Point(marking.directionVector.x, marking.directionVector.y);
        switch (marking.type) {
            case 'crossing':
                return new Crossing(center, directionVector, marking.width, marking.height);
            case 'light':
                return new Light(center, directionVector, marking.width, marking.height);
            case 'parking':
                return new Parking(center, directionVector, marking.width, marking.height);
            case 'start':
                return new Start(center, directionVector, marking.width, marking.height);
            case 'stop':
                return new Stop(center, directionVector, marking.width, marking.height);
            case 'target':
                return new Target(center, directionVector, marking.width, marking.height);
            case 'yield':
                return new Yield(center, directionVector, marking.width, marking.height);
            case 'marking':
                return new Marking(center, directionVector, marking.width, marking.height);
            default:
                throw Error(`Unknown marking type: ${marking.type}`)

        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.poly.draw(ctx);
    }
}