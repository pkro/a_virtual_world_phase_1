"use strict";
class Tree {
    center;
    size;
    heightCoefficient;
    base;
    constructor(center, size, // size of base of tree
    heightCoefficient = 0.3 // how "tall" the tree is
    ) {
        this.center = center;
        this.size = size;
        this.heightCoefficient = heightCoefficient;
        // save base of the tree in case we want to interact with the tree, e.g.
        // check for collisions.
        this.base = this.#generateLevel(center, size);
    }
    #generateLevel(point, size) {
        const points = [];
        const rad = size / 2;
        const pointsOnCircle = 32;
        for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / (pointsOnCircle / 2)) {
            // avoid redraw of trees differently on every render; shouldn't we take care of this in hash somehow?
            // basically generate a pseudorandom number between 0 and 1 based on the trees x location
            const kindOfRandom = Math.cos(((angle + this.center.x) * size) % 17) ** 2;
            const noisyRadius = rad * lerp(0.5, 1, kindOfRandom);
            points.push(translate(point, angle, noisyRadius));
        }
        return new Polygon(points);
    }
    draw(ctx, viewPoint) {
        const diff = subtract(this.center, viewPoint);
        const top = add(this.center, scale(diff, this.heightCoefficient));
        const levelCount = 7;
        for (let level = 0; level < levelCount; level++) {
            const t = level / (levelCount - 1);
            const point = lerp2d(this.center, top, t);
            const color = `rgb(30,${lerp(50, 200, t)},70)`;
            const treeTipSize = 40;
            const size = lerp(this.size, treeTipSize, t);
            const poly = this.#generateLevel(point, size);
            poly.draw(ctx, { fill: color, stroke: "rgba(0,0,0,0" });
        }
    }
}
