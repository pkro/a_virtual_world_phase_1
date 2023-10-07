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

function distance(p1: Point, p2: Point) {
    //return Math.abs(a.x-b.x)**2 + Math.abs(a.y-b.y)**2;
    return Math.hypot(p1.x-p2.x, p1.y-p2.y)
}