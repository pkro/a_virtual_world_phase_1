"use strict";
class Viewport {
    zoom;
    offset;
    canvas;
    ctx;
    center = new Point(0, 0);
    drag = {
        start: new Point(0, 0),
        end: new Point(0, 0),
        offset: new Point(0, 0),
        active: false // are we dragging or not
    };
    constructor(canvas, zoom = 2.5, offset = new Point(0, 0)) {
        this.zoom = zoom;
        this.offset = offset;
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.center = new Point(canvas.width / 2, canvas.height / 2);
        this.offset = scale(this.center, -1);
        this.#addEventListeners();
    }
    getMouse(evt, subtractDragOffset = false) {
        const p = new Point((evt.offsetX - this.center.x) * this.zoom - this.offset.x, (evt.offsetY - this.center.y) * this.zoom - this.offset.y);
        return subtractDragOffset ? subtract(p, this.drag.offset) : p;
    }
    getOffset() {
        return add(this.offset, this.drag.offset);
    }
    reset() {
        if (!this.ctx) {
            return;
        }
        this.ctx.restore();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        // scroll wheel button drag
        this.ctx.translate(this.center.x, this.center.y); // we want to zoom from the center
        this.ctx.scale(1 / this.zoom, 1 / this.zoom); // scroll wheel zoom
        const offset = this.getOffset();
        this.ctx.translate(offset.x, offset.y); // scroll wheel button drag
    }
    #addEventListeners() {
        this.canvas.addEventListener('wheel', this.#handleMouseWheel.bind(this));
        this.canvas.addEventListener('mousedown', this.#handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.#handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.#handleMouseUp.bind(this));
    }
    #handleMouseWheel(evt) {
        const dir = Math.sign(evt.deltaY); // 1 or -1
        const step = 0.1;
        this.zoom += dir * step;
        this.zoom = Math.max(1, Math.min(5, this.zoom)); // cap zoom between 1 and 5
    }
    #handleMouseDown(evt) {
        if (evt.button !== 1) { // middle button = wheel click
            return;
        }
        this.drag.active = true;
        this.drag.start = this.getMouse(evt);
    }
    #handleMouseMove(evt) {
        if (this.drag.active) {
            this.drag.end = this.getMouse(evt);
            //this.drag.offset = new Point(this.drag.end.x - this.drag.start.x, this.drag.end.y - this.drag.start.y);
            this.drag.offset = subtract(this.drag.end, this.drag.start);
        }
    }
    #handleMouseUp(evt) {
        if (evt.button !== 1) { // middle button = wheel click
            return;
        }
        this.offset = add(this.offset, this.drag.offset);
        this.drag = {
            start: new Point(0, 0),
            end: new Point(0, 0),
            offset: new Point(0, 0),
            active: false // are we dragging or not
        };
    }
}
// Great course, as all others from you that I followed. I am following along using typescript and noticed that the "mousewheel" event is deprecated and should be replaced by "wheel" (https://developer.mozilla.org/en-US/docs/Web/API/Element/mousewheel_event). No other changes should be necessary
