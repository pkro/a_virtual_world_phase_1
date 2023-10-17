class World {
    private envelopes: Envelope[] = [];
    private roadBorders: Segment[] = []

    constructor(private graph: Graph, private roadWidth = 100, private roadRoundness = 10) {
        this.generate();
    }

    generate() {
        this.envelopes = [];
        for (const seg of this.graph.segments) {
            this.envelopes.push(new Envelope(seg, this.roadWidth, this.roadRoundness));
        }

        this.roadBorders = Polygon.union(this.envelopes.map(e => e.poly));
        //Polygon.multiBreak(this.envelopes.map(e=>e.poly));

    }

    draw(ctx: CanvasRenderingContext2D) {
        for (const env of this.envelopes) {
            env.draw(ctx, {fill: "#BBB", stroke: "#BBB", lineWidth: 15}); // linewidth adds a little gray margin
        }
        // draw dashed midlines
        for (const seg of this.graph.segments) {
            seg.draw(ctx, {color: "white", width: 4, dash: [10, 10]});
        }
        for (const seg of this.roadBorders) {
            seg.draw(ctx, {color: "white", width: 4});
        }
    }
}