class GraphEditor {
    private ctx: CanvasRenderingContext2D | null;
    private selected: Point | null = null;
    private hovered: Point | null = null;
    private dragging = false;
    private mouse: Point | null = null;
    private canvas: HTMLCanvasElement;
    private listeners: Array<{ event: keyof HTMLElementEventMap, listener: any }> = []; // let's be pragmatic with the listener type


    constructor(public viewport: Viewport, public graph: Graph) {
        this.viewport = viewport;
        this.ctx = viewport.ctx;
        this.canvas = viewport.canvas;
    }

    #addEventListener(event: keyof HTMLElementEventMap, listener: any) {
        this.listeners.push({event, listener});
        this.canvas.addEventListener(event, listener as any);
    }

    #addEventListeners() {
        // "this.#handleMouseDown" refers to the private method in the GraphEditor class to handle mouse-down events.
        // ".bind(this)" ensures that when the #handleMouseDown method is invoked, "this" inside the method will refer to the instance of GraphEditor.
        // Without .bind(this), "this" inside #handleMouseDown would not refer to the GraphEditor instance,
        // but to the element that the event was fired on, which would be this.canvas. This would make it difficult to access
        // other properties and methods of the GraphEditor instance within #handleMouseDown.
        this.#addEventListener("mousemove",  this.#handleMouseMove.bind(this));
        this.#addEventListener("mousedown", this.#handleMouseDown.bind(this));

        this.#addEventListener("contextmenu", (evt: MouseEvent) => evt.preventDefault());
        this.#addEventListener("mouseup", () => this.dragging = false);
    }

    #removeEventListeners() {
        this.listeners.forEach(listener=>this.canvas.removeEventListener(listener.event, listener.listener));
        this.listeners.length=0;
    }


    #handleMouseMove(evt: MouseEvent) {
        this.mouse = this.viewport.getMouse(evt, true);
        this.hovered = getNearestPoint(this.mouse, this.graph.points, 10 * this.viewport.zoom);
        if (this.dragging && this.selected) {
            this.selected.x = this.mouse.x;
            this.selected.y = this.mouse.y;
        }
    }

    #handleMouseDown(evt: MouseEvent) {
        const LEFT_BUTTON = 0;
        const RIGHT_BUTTON = 2;

        if (!this.mouse) {
            return;
        }

        if (evt.button === RIGHT_BUTTON) {
            if (this.selected) {
                this.selected = null;
            } else if (this.hovered) {
                this.#removePoint(this.hovered);
            }
        }

        if (evt.button === LEFT_BUTTON) {
            // add new segment between last selected point and new point
            if (this.hovered) {
                this.#selectPoint(this.hovered);
                this.dragging = true;
                return;
            }
            // add new point
            this.graph.addPoint(this.mouse);

            // add new segment between last selected point and new point
            this.#selectPoint(this.mouse);
            this.hovered = this.mouse;
        }
    }


    #selectPoint(point: Point) {
        if (this.selected) {
            this.graph.tryAddSegment(new Segment(this.selected, point));
        }
        this.selected = point;
    }

    #removePoint(point: Point) {
        this.graph.removePoint(point);
        this.hovered = null;
        if (this.selected === point) {
            this.selected = null;
        }
    }

    dispose() {
        this.graph.dispose();
        this.selected = null;
        this.hovered = null;
    }

    display() {
        this.graph.draw(this.ctx!);

        if (this.hovered) {
            this.hovered.draw(this.ctx!, {fill: true})

        }
        if (this.selected) {
            // "preview" new segment that would be drawn
            const intent = this.hovered ? this.hovered : this.mouse;
            // we don't save the segment anywhere, we just create it to draw it
            new Segment(this.selected, intent!)
                .draw(this.ctx!, {dash: [3,3]});
            this.selected.draw(this.ctx!, {outline: true})
        }
    }

    enable() {
        this.#addEventListeners();
    }

    disable() {
        this.#removeEventListeners();
        this.selected = null;
        this.hovered = null;
    }
}