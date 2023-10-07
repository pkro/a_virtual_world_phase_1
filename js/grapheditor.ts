class GraphEditor {
    private ctx: CanvasRenderingContext2D | null;
    private selected: Point | null = null;
    private hovered: Point | null = null;

    constructor(public canvas: HTMLCanvasElement, public graph: Graph) {
        this.ctx = canvas.getContext("2d");
        this.#addEventListeners();
    }

    #addEventListeners() {
        this.canvas.addEventListener("mousedown", evt=>{
            const mouse = new Point(evt.offsetX, evt.offsetY);
            this.hovered = getNearestPoint(mouse, this.graph.points, 10);
            if (this.hovered) {
                this.selected = this.hovered;
                return;
            }

            this.graph.addPoint(mouse);
            this.selected = mouse;
        })

        this.canvas.addEventListener("mousemove", evt=>{
            const mouse = new Point(evt.offsetX, evt.offsetY);
            this.hovered = getNearestPoint(mouse, this.graph.points, 10);
        })
    }

    display() {
        this.graph.draw(this.ctx!);
        if(this.hovered) {
            this.hovered.draw(this.ctx!, {fill: true})

        }
        if (this.selected) {
            this.selected.draw(this.ctx!, {outline: true})
        }
    }
}