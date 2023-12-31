
class World {
    private envelopes: Envelope[] = [];
    private roadBorders: Segment[] = []
    private buildings: Building[] = [];
    private trees: Tree[] = [];
    public laneGuides: Segment[] = [];
    public markings: Marking[] = [];
    public zoom: number = 2.5; // used to save view state, no other use in this class
    public offset: Point = new Point(0,0); // used to save state

    constructor(public graph: Graph,
                public roadWidth = 100,
                public roadRoundness = 10,
                public buildingWidth = 150,
                public buildingMinLength = 150,
                public spacing = 50,
                public treeSize = 160 ) {

        this.generate();
    }

    static load(info: World) {
        const world = new World(new Graph());
        world.graph = Graph.load(info.graph);
        world.roadWidth = info.roadWidth;
        world.roadRoundness = info.roadRoundness;
        world.buildingWidth = info.buildingWidth;
        world.buildingMinLength = info.buildingMinLength;
        world.spacing = info.spacing;
        world.treeSize = info.treeSize;


        world.envelopes = info.envelopes.map((e) => Envelope.load(e));
        world.roadBorders = info.roadBorders.map(b=>new Segment(b.p1, b.p2));
        world.buildings = info.buildings.map(b => Building.load(b));
        world.trees = info.trees.map(t=>new Tree(t.center, t.size, t.height));
        world.laneGuides = info.laneGuides.map(g => new Segment(g.p1, g.p2));

        world.markings = info.markings.map(m => Marking.load(m));
        world.zoom = info.zoom;
        world.offset = info.offset;

        return world;
    }

    generate() {
        this.envelopes.length = 0;
        for (const seg of this.graph.segments) {
            this.envelopes.push(new Envelope(seg, this.roadWidth, this.roadRoundness));
        }

        this.roadBorders = Polygon.union(this.envelopes.map(e => e.poly));
        this.buildings = this.#generateBuildings();

        this.trees = this.#generateTrees();
        this.laneGuides.length = 0;
        this.laneGuides.push(...this.#generateLaneGuides());
    }

    #generateLaneGuides() {
        const tmpEnvelopes = [];
        for (const seg of this.graph.segments) {
            tmpEnvelopes.push(
                new Envelope(
                    seg,
                    this.roadWidth  / 2,
                    this.roadRoundness
                )
            )
        }

        const segments = Polygon.union(tmpEnvelopes.map((e)=>e.poly));
        return segments;
    }

    #generateTrees(count = 10) {
        const points = [
            ...this.roadBorders.map(s => [s.p1, s.p2]).flat(),
            ...this.buildings.map(b => b.base.points).flat(),
        ];

        const left = Math.min(...points.map(p => p.x));
        const right = Math.max(...points.map(p => p.x));
        const top = Math.min(...points.map(p => p.y));
        const bottom = Math.max(...points.map(p => p.y));

        const illegalPolys = [
            ...this.buildings.map(b=>b.base),
            ...this.envelopes.map(e => e.poly)
        ]
        const trees: Tree[] = [];

        if(this.buildings.length ===0  && this.envelopes.length === 0) {
            return trees;
        }

        let tryCount = 0;

        while (tryCount < 100) {
            const p = new Point(
                lerp(left, right, Math.random()),
                lerp(top, bottom, Math.random()),
            )
            let keep = true;
            for (const poly of illegalPolys) {
                if (poly.containsPoint(p) || poly.distanceToPoint(p) < this.treeSize/2) {
                    keep = false;
                    break;
                }
            }

            if (keep) {
                // check for overlapping trees
                for (const tree of trees) {
                    // we check for treeSize and not treeSize / 2 because each tree has a radius of treeSize/2
                    if (distance(tree.center, p) < this.treeSize) {
                        keep = false;
                        break;
                    }
                }
            }

            // we don't want to generate trees too far from road and buildings
            if (keep) {
                let closeToSomething = false;
                for (const poly of illegalPolys) {
                    if (poly.distanceToPoint(p)<this.treeSize * 2) {
                        closeToSomething = true;
                        break;
                    }
                }
                keep = closeToSomething;
            }
            if (keep) {
                trees.push(new Tree(p, this.treeSize));
                tryCount = 0;
            }

            tryCount++;
        }
        return trees;
    }

    #generateBuildings() {
        const tmpEnvelopes = [];
        for (const seg of this.graph.segments) {
            tmpEnvelopes.push(
                new Envelope(
                    seg,
                    this.roadWidth + this.buildingWidth + this.spacing * 2,
                    this.roadRoundness
                )
            )
        }

        const guides = Polygon.union(tmpEnvelopes.map(e => e.poly));

        // remove guides that are shorter than 1 building
        for (let i = 0; i < guides.length; i++) {
            const seg = guides[i];
            if (seg.length() < this.buildingMinLength) {
                guides.splice(i, 1);
                i--;
            }
        }

        const supports = [];
        for (let seg of guides) {
            const len = seg.length() + this.spacing;
            const buildingCount = Math.floor(
                len / (this.buildingMinLength + this.spacing)
            );
            const buildingLength = len / buildingCount - this.spacing;

            const dir = seg.directionVector();
            let q1 = seg.p1;
            let q2 = add(q1, scale(dir, buildingLength));
            supports.push(new Segment(q1, q2));

            for (let i = 2; i <= buildingCount; i++) {
                q1 = add(q2, scale(dir, this.spacing));
                q2 = add(q1, scale(dir, buildingLength));
                supports.push(new Segment(q1, q2));
            }
        }

        const bases: Polygon[] = [];
        for (const seg of supports) {
            bases.push(new Envelope(seg, this.buildingWidth).poly)
        }

        // find overlapping
        const eps = 0.001;
        for (let i = 0; i < bases.length - 1; i++) {
            for (let j = i + 1; j < bases.length; j++) {
                if (bases[i].intersectsPoly(bases[j]) ||
                bases[i].distanceToPoly(bases[j]) < this.spacing-eps) {
                    bases.splice(j, 1);
                    j--;
                }
            }
        }

        return bases.map(b=>new Building(b));
    }

    draw(ctx: CanvasRenderingContext2D, viewPoint: Point) {
        for (const env of this.envelopes) {
            env.draw(ctx, {fill: "#BBB", stroke: "#BBB", lineWidth: 15}); // linewidth adds a little gray margin
        }

        for (const marking of this.markings) {
            marking.draw(ctx);
        }
        // draw dashed midlines
        for (const seg of this.graph.segments) {
            seg.draw(ctx, {color: "white", width: 4, dash: [10, 10]});
        }
        for (const seg of this.roadBorders) {
            seg.draw(ctx, {color: "white", width: 4});
        }

        // draw closest items last

        const items = [...this.buildings, ...this.trees];
        items.sort(
            (a,b) =>
                b.base.distanceToPoint(viewPoint) - a.base.distanceToPoint(viewPoint)
        );

        for (const item of items) {
            item.draw(ctx, viewPoint);
        }

    }
}