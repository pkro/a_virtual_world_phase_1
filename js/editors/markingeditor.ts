class MarkingEditor {
    private ctx: CanvasRenderingContext2D | null;

    private mouse: Point | null = null;
    private canvas: HTMLCanvasElement;
    private listeners: Array<{ event: keyof HTMLElementEventMap, listener: any }> = []; // let's be pragmatic with the listener type
    private intent: Marking | null = null;
    public markings: Marking[];

    constructor(public viewport: Viewport, public world: World, public targetSegments: Segment[]) {
        this.viewport = viewport;
        this.ctx = viewport.ctx;
        this.canvas = viewport.canvas;

        this.markings = world.markings; // reference to world.markings, so when we add something to this.markings, it gets added to the world
    }

    #addEventListener(event: keyof HTMLElementEventMap, listener: any) {
        this.listeners.push({event, listener});
        this.canvas.addEventListener(event, listener as any);
    }

    #addEventListeners() {
        this.#addEventListener("mousemove",  this.#handleMouseMove.bind(this));
        this.#addEventListener("mousedown", this.#handleMouseDown.bind(this));

        this.#addEventListener("contextmenu", (evt: MouseEvent) => evt.preventDefault());
    }

    #removeEventListeners() {
        this.listeners.forEach(listener=>this.canvas.removeEventListener(listener.event, listener.listener));
        this.listeners.length=0;
    }

    #handleMouseMove(evt: MouseEvent) {
        this.mouse = this.viewport.getMouse(evt, true);
        const seg = getNearestSegment(
            this.mouse,
            this.targetSegments,
            10*this.viewport.zoom);

        if (seg) {
            const proj = seg.projectPoint(this.mouse);
            if(proj.offset >= 0 && proj.offset <=1) {
                this.intent = this.createMarking(
                    proj.point,
                    seg.directionVector());
            } else {
                this.intent = null;
            }
        } else {
            this.intent = null;
        }
    }

    createMarking(center: Point, directionVector: Point) {
        return new Marking(
            center,
            directionVector,
            this.world.roadWidth / 2,
            this.world.roadWidth / 2);
    }

    #handleMouseDown(evt: MouseEvent) {
        const LEFT_BUTTON = 0;
        const RIGHT_BUTTON = 2;

        if (!this.mouse) {
            return;
        }

        if (evt.button === LEFT_BUTTON) {
            if (this.intent) {
                this.markings.push(this.intent);
                this.intent = null;
            }
        }

        if (evt.button === RIGHT_BUTTON) {
            for(let [idx, marking ] of this.markings.entries()) {
                if(marking.poly.containsPoint(this.mouse))  {
                    this.markings.splice(idx, 1);
                    return;
                }
            }
        }
    }


    display() {
        if (this.intent) {
            this.intent.draw(this.ctx!);
        }
    }

    enable() {
        this.#addEventListeners();
    }

    disable() {
        this.#removeEventListeners();
    }
}