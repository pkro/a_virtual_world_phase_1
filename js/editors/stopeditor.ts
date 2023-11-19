class StopEditor extends MarkingEditor {
    constructor(viewport: Viewport, world: World) {
        super(viewport, world, world.laneGuides);
    }
    createMarking(center: Point, directionVector: Point) {
        return new Stop(
            center,
            directionVector,
            this.world.roadWidth / 2,
            this.world.roadWidth / 2);
    }
}