"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _GraphEditor_instances, _GraphEditor_addEventListeners, _GraphEditor_handleMouseMove, _GraphEditor_handleMouseDown, _GraphEditor_selectPoint, _GraphEditor_removePoint;
class GraphEditor {
    constructor(canvas, graph) {
        _GraphEditor_instances.add(this);
        this.canvas = canvas;
        this.graph = graph;
        this.selected = null;
        this.hovered = null;
        this.dragging = false;
        this.mouse = null;
        this.ctx = canvas.getContext("2d");
        __classPrivateFieldGet(this, _GraphEditor_instances, "m", _GraphEditor_addEventListeners).call(this);
    }
    display() {
        this.graph.draw(this.ctx);
        if (this.hovered) {
            this.hovered.draw(this.ctx, { fill: true });
        }
        if (this.selected) {
            // "preview" new segment that would be drawn
            const intent = this.hovered ? this.hovered : this.mouse;
            new Segment(this.selected, intent).draw(this.ctx, { dash: [3, 3] });
            this.selected.draw(this.ctx, { outline: true });
        }
    }
}
_GraphEditor_instances = new WeakSet(), _GraphEditor_addEventListeners = function _GraphEditor_addEventListeners() {
    // "this.#handleMouseDown" refers to the private method in the GraphEditor class to handle mouse-down events.
    // ".bind(this)" ensures that when the #handleMouseDown method is invoked, "this" inside the method will refer to the instance of GraphEditor.
    // Without .bind(this), "this" inside #handleMouseDown would not refer to the GraphEditor instance,
    // but to the element that the event was fired on, which would be this.canvas. This would make it difficult to access
    // other properties and methods of the GraphEditor instance within #handleMouseDown.
    this.canvas.addEventListener("mousemove", __classPrivateFieldGet(this, _GraphEditor_instances, "m", _GraphEditor_handleMouseMove).bind(this));
    this.canvas.addEventListener("mousedown", __classPrivateFieldGet(this, _GraphEditor_instances, "m", _GraphEditor_handleMouseDown).bind(this));
    this.canvas.addEventListener("contextmenu", (evt) => evt.preventDefault());
    this.canvas.addEventListener("mouseup", () => this.dragging = false);
}, _GraphEditor_handleMouseMove = function _GraphEditor_handleMouseMove(evt) {
    this.mouse = new Point(evt.offsetX, evt.offsetY);
    this.hovered = getNearestPoint(this.mouse, this.graph.points, 10);
    if (this.dragging && this.selected) {
        this.selected.x = this.mouse.x;
        this.selected.y = this.mouse.y;
    }
}, _GraphEditor_handleMouseDown = function _GraphEditor_handleMouseDown(evt) {
    const LEFT_BUTTON = 0;
    const RIGHT_BUTTON = 2;
    if (!this.mouse) {
        return;
    }
    if (evt.button === RIGHT_BUTTON) {
        if (this.selected) {
            this.selected = null;
        }
        else if (this.hovered) {
            __classPrivateFieldGet(this, _GraphEditor_instances, "m", _GraphEditor_removePoint).call(this, this.hovered);
        }
    }
    if (evt.button === LEFT_BUTTON) {
        // add new segment between last selected point and new point
        if (this.hovered) {
            __classPrivateFieldGet(this, _GraphEditor_instances, "m", _GraphEditor_selectPoint).call(this, this.hovered);
            this.dragging = true;
            return;
        }
        // add new point
        this.graph.addPoint(this.mouse);
        // add new segment between last selected point and new point
        __classPrivateFieldGet(this, _GraphEditor_instances, "m", _GraphEditor_selectPoint).call(this, this.mouse);
        this.hovered = this.mouse;
    }
}, _GraphEditor_selectPoint = function _GraphEditor_selectPoint(point) {
    if (this.selected) {
        this.graph.tryAddSegment(new Segment(this.selected, point));
    }
    this.selected = point;
}, _GraphEditor_removePoint = function _GraphEditor_removePoint(point) {
    this.graph.removePoint(point);
    this.hovered = null;
    if (this.selected === point) {
        this.selected = null;
    }
};
