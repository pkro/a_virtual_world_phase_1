"use strict";
class MarkingEditor {
    viewport;
    world;
    targetSegments;
    ctx;
    mouse = null;
    canvas;
    listeners = []; // let's be pragmatic with the listener type
    intent = null;
    markings;
    constructor(viewport, world, targetSegments) {
        this.viewport = viewport;
        this.world = world;
        this.targetSegments = targetSegments;
        this.viewport = viewport;
        this.ctx = viewport.ctx;
        this.canvas = viewport.canvas;
        this.markings = world.markings; // reference to world.markings, so when we add something to this.markings, it gets added to the world
    }
    #addEventListener(event, listener) {
        this.listeners.push({ event, listener });
        this.canvas.addEventListener(event, listener);
    }
    #addEventListeners() {
        this.#addEventListener("mousemove", this.#handleMouseMove.bind(this));
        this.#addEventListener("mousedown", this.#handleMouseDown.bind(this));
        this.#addEventListener("contextmenu", (evt) => evt.preventDefault());
    }
    #removeEventListeners() {
        this.listeners.forEach(listener => this.canvas.removeEventListener(listener.event, listener.listener));
        this.listeners.length = 0;
    }
    #handleMouseMove(evt) {
        this.mouse = this.viewport.getMouse(evt, true);
        const seg = getNearestSegment(this.mouse, this.targetSegments, 10 * this.viewport.zoom);
        if (seg) {
            const proj = seg.projectPoint(this.mouse);
            if (proj.offset >= 0 && proj.offset <= 1) {
                this.intent = this.createMarking(proj.point, seg.directionVector());
            }
            else {
                this.intent = null;
            }
        }
        else {
            this.intent = null;
        }
    }
    createMarking(center, directionVector) {
        return new Marking(center, directionVector, this.world.roadWidth / 2, this.world.roadWidth / 2);
    }
    #handleMouseDown(evt) {
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
            for (let [idx, marking] of this.markings.entries()) {
                if (marking.poly.containsPoint(this.mouse)) {
                    this.markings.splice(idx, 1);
                    return;
                }
            }
        }
    }
    display() {
        if (this.intent) {
            this.intent.draw(this.ctx);
        }
    }
    enable() {
        this.#addEventListeners();
    }
    disable() {
        this.#removeEventListeners();
    }
}
