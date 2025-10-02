let points = [];
let lerpSpeed = 1; 
let bbox;
let whimsyMode = false;

let delaunay, voronoi;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('blackhole');
  bbox = { xl: 0, xr: width, yt: 0, yb: height };
  for (let i = 0; i < 9000; i++) {
    let x = random(width);
    let y = random(height);
    points.push(createVector(x, y));
  }

  delaunay = calculateDelaunay(points);
  voronoi = delaunay.voronoi([0, 0, width, height]);
  background(255);
}

function draw() {
  let polygons = voronoi.cellPolygons();
  let cells = Array.from(polygons);

  for (let poly of cells) {
    if (whimsyMode) {
      fill(random(50, 255), random(50, 255), random(50, 255));
    } else {
      fill(random(250, 255));
    }

    beginShape();
    for (let i = 0; i < poly.length; i++) {
      vertex(poly[i][0], poly[i][1]);
    }
    endShape();
  }

  let centroids = [];
  for (let poly of cells) {
    let centroid = createVector(0, 0);
    for (let i = 0; i < poly.length; i++) {
      centroid.x += poly[i][0];
      centroid.y += poly[i][1];
    }
    centroid.div(poly.length);
    centroids.push(centroid);
  }

  for (let i = 0; i < points.length; i++) {
    points[i].lerp(centroids[i], lerpSpeed);
  }

  delaunay = calculateDelaunay(points);
  voronoi = delaunay.voronoi([0, 0, width, height]);
}

function calculateDelaunay(points) {
  let pointsArray = [];
  for (let v of points) {
    pointsArray.push(v.x, v.y);
  }
  return new d3.Delaunay(pointsArray);
}

function keyPressed() {
  if (key === 'e') {
    location.reload();
  }
  if (key === 'f') {
    lerpSpeed += 0.25;  
    if (lerpSpeed > 2) lerpSpeed = 2;
  }
  if (key === 's') {
    lerpSpeed -= 0.25;      
    if (lerpSpeed < 0.1) lerpSpeed = 0.1;
  }
  if (key === 'w') {
    whimsyMode = !whimsyMode; 
  }
}
