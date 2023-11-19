"use strict";
class CrossingEditor extends MarkingEditor {
    constructor(viewport, world) {
        super(viewport, world, world.graph.segments);
    }
    createMarking(center, directionVector) {
        return new Crossing(center, directionVector, this.world.roadWidth, // crossings go over full road width
        this.world.roadWidth / 2);
    }
}
