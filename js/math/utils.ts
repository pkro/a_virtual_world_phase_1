function getNearestPoint(p: Point, points: Point[], threshold=Number.MAX_SAFE_INTEGER) {
    let minDistance = Number.MAX_SAFE_INTEGER;
    let nearest = null;
    for (const point of points) {
        const dist = distance(p, point);
        if (dist < minDistance &&
            dist < threshold // only return a point if the clicked coords are within 10 px radius of the point
        ) {
            minDistance = dist;
            nearest = point;
        }
    }
    return nearest;
}

function getNearestSegment(p: Point, segments: Segment[], threshold=Number.MAX_SAFE_INTEGER) {
    let minDistance = Number.MAX_SAFE_INTEGER;
    let nearest = null;
    for (const seg of segments) {
        const dist = seg.distanceToPoint(p);
        if (dist < minDistance &&
            dist < threshold // only return a point if the clicked coords are within 10 px radius of the point
        ) {
            minDistance = dist;
            nearest = seg;
        }
    }
    return nearest;
}

function distance(p1: Point, p2: Point) {
    //return Math.abs(a.x-b.x)**2 + Math.abs(a.y-b.y)**2;
    return Math.hypot(p1.x-p2.x, p1.y-p2.y)
}

function add(p1: Point, p2: Point) {
    return new Point(p1.x + p2.x, p1.y + p2.y);
}

function subtract(p1: Point, p2: Point) {
    return new Point(p1.x - p2.x, p1.y - p2.y);
}

function scale(p: Point, scaler: number) {
    return new Point(p.x * scaler, p.y * scaler);
}

function normalize(p: Point) {
    return scale(p, 1 / magnitude(p));
}

function magnitude(p: Point) {
    return Math.hypot(p.x, p.y);
}
function translate(loc: Point, angle: number, offset: number) {
    return new Point(
        loc.x + Math.cos(angle) * offset,
        loc.y + Math.sin(angle) * offset
    )
}


function perpendicular(p: Point) {
    return new Point(-p.y, p.x);
}

function angle(p: Point) {
    return Math.atan2(p.y, p.x);
}

function lerp(A: number, B: number, t: number) {
    return A + (B - A) * t;
}

function lerp2d(p1: Point, p2: Point, t: number): Point {
    return new Point(
        lerp(p1.x, p2.x, t),
        lerp(p1.y, p2.y, t),
    )
}

function getIntersection(A: Point, B: Point, C: Point, D: Point) {
    const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
    const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
    const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

    // avoid floating point errors by not comparing bottom === 0 but "near" 0
    const eps = 0.001;

    if (Math.abs(bottom) > eps) {
        const t = tTop / bottom;
        const u = uTop / bottom;
        if(t>=0 && t<=1 && u>=0 && u<=1) {
            return {
                x: lerp(A.x, B.x, t),
                y: lerp(A.y, B.y, t),
                offset: t
            };
        }
    }
    return null;
}

function getRandomColor() {
    const hue = 290 + Math.random() * 260;
    return `hsl(${hue}, 100%, 60%)`;
}

function average(p1: Point, p2: Point) {
    //return new Point(lerp(p1.x, p2.x, 0.5), lerp(p1.y, p2.y, 0.5))
    // same, maybe quicker (?)
    return new Point((p1.x+p2.x) / 2, (p1.y+p2.y) / 2)
}



function dot(p1: Point, p2: Point) {
    return p1.x * p2.x + p1.y * p2.y;
}

function getFake3dPoint(point: Point, viewPoint: Point, height: number) {
    const dir = normalize(subtract(point, viewPoint));
    const dist = distance(point, viewPoint);
    const scaler = Math.atan(dist / 300) / (Math.PI / 2);
    return add(point, scale(dir, height * scaler));
}
