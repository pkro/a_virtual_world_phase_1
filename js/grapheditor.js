"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _GraphEditor_instances, _GraphEditor_addEventListeners;
class GraphEditor {
    constructor(canvas, graph) {
        _GraphEditor_instances.add(this);
        this.canvas = canvas;
        this.graph = graph;
        this.selected = null;
        this.hovered = null;
        this.ctx = canvas.getContext("2d");
        __classPrivateFieldGet(this, _GraphEditor_instances, "m", _GraphEditor_addEventListeners).call(this);
    }
    display() {
        this.graph.draw(this.ctx);
        if (this.hovered) {
            this.hovered.draw(this.ctx, { fill: true });
        }
        if (this.selected) {
            this.selected.draw(this.ctx, { outline: true });
        }
    }
}
_GraphEditor_instances = new WeakSet(), _GraphEditor_addEventListeners = function _GraphEditor_addEventListeners() {
    this.canvas.addEventListener("mousedown", evt => {
        const mouse = new Point(evt.offsetX, evt.offsetY);
        this.hovered = getNearestPoint(mouse, this.graph.points, 10);
        if (this.hovered) {
            this.selected = this.hovered;
            return;
        }
        this.graph.addPoint(mouse);
        this.selected = mouse;
    });
    this.canvas.addEventListener("mousemove", evt => {
        const mouse = new Point(evt.offsetX, evt.offsetY);
        this.hovered = getNearestPoint(mouse, this.graph.points, 10);
    });
};
