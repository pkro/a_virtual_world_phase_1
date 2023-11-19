class CrossingEditor extends MarkingEditor {
    constructor(viewport: Viewport, world: World) {
        super(viewport, world, world.graph.segments);
    }

    createMarking(center: Point, directionVector: Point) {

        return new Crossing(
            center,
            directionVector,
            this.world.roadWidth, // crossings go over full road width
            this.world.roadWidth / 2);
    }
}