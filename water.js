const NUM_SITES = 800;
const EDGE_MARGIN = 20;
const MOUSE_RADIUS = 250;

let sites = [];
let vx = [];
let vy = [];
let colors = [];
let noiseOffsets = [];
let heights = [];
let rotations = [];
let gradOffsets = [];

let bwMode = false; // toggle state

function setup() {
  var canvas1=createCanvas(windowWidth, windowHeight);
  canvas1.parent('water');
  noSmooth();
  angleMode(DEGREES);
  background(245);

  voronoiCellStrokeWeight(0);
  voronoiSiteStroke(0);

  for (let i = 0; i < NUM_SITES; i++) {
    let x = random(EDGE_MARGIN, width - EDGE_MARGIN);
    let y = random(EDGE_MARGIN, height - EDGE_MARGIN);
    sites.push([x, y]);

    let speed = random(0.01, 0.04);
    let angle = random(TWO_PI);
    vx.push(speed * cos(angle));
    vy.push(speed * sin(angle));

    colors.push(color(random(20, 30), random(120, 140), random(170, 190), 150));
    noiseOffsets.push({ nx: random(1000), ny: random(1000) });
    heights.push(random(5, 20));
    rotations.push(random(TWO_PI));
    gradOffsets.push({ gx: random(1000), gy: random(1000) });
  }
}

function draw() {
  background(245, 245, 245, 15);
  noStroke();
  let t = millis() / 1000;

  // --- Update sites ---
  for (let i = 0; i < NUM_SITES; i++) {
    let offset = noiseOffsets[i];
    let nX = (noise(offset.nx + t * 0.1) - 0.5) * 0.3;
    let nY = (noise(offset.ny + t * 0.1) - 0.5) * 0.3;
    offset.nx += 0.005;
    offset.ny += 0.005;

    let dx = sites[i][0] - mouseX;
    let dy = sites[i][1] - mouseY;
    let d = sqrt(dx * dx + dy * dy);
    if (d < MOUSE_RADIUS && d > 0) {
      let force = (MOUSE_RADIUS - d) / MOUSE_RADIUS * 0.05;
      vx[i] += (dx / d) * force;
      vy[i] += (dy / d) * force;
    }

    sites[i][0] += vx[i] + nX;
    sites[i][1] += vy[i] + nY;

    if (sites[i][0] <= EDGE_MARGIN || sites[i][0] >= width - EDGE_MARGIN) vx[i] *= -1;
    if (sites[i][1] <= EDGE_MARGIN || sites[i][1] >= height - EDGE_MARGIN) vy[i] *= -1;

    sites[i][0] = constrain(sites[i][0], EDGE_MARGIN, width - EDGE_MARGIN);
    sites[i][1] = constrain(sites[i][1], EDGE_MARGIN, height - EDGE_MARGIN);

    vx[i] *= 0.995;
    vy[i] *= 0.995;
    rotations[i] += 0.002;
  }

  voronoiClearSites();
  voronoiSites(sites);
  voronoi(width, height, false);
  let cells = voronoiGetCells();

  for (let i = 0; i < cells.length; i++) {
    let verts = cells[i];
    let n = verts.length;

    if (bwMode) {
      stroke(0);
      strokeWeight(0.5);
      noFill();
      beginShape();
      for (let j = 0; j < n; j++) {
        vertex(verts[j][0], verts[j][1]);
      }
      endShape(CLOSE);
    } else {
      let c = colors[i];
      let baseHeight = heights[i];
      let rotation = rotations[i];
      let gradOffset = gradOffsets[i];

      let centerX = 0,
        centerY = 0;
      for (let v of verts) {
        centerX += v[0];
        centerY += v[1];
      }
      centerX /= verts.length;
      centerY /= verts.length;

      let h = baseHeight * sin(t + i);

      let gx = (noise(gradOffset.gx + t * 0.5) - 0.5) * 10;
      let gy = (noise(gradOffset.gy + t * 0.5) - 0.5) * 10;
      gradOffset.gx += 0.002;
      gradOffset.gy += 0.002;

      let jitterX = centerX + cos(rotation) * 3 + gx;
      let jitterY = centerY - h * 0.5 + sin(rotation) * 3 + gy;

      let maxDist = 0;
      for (let v of verts) {
        let d = dist(centerX, centerY, v[0], v[1]);
        if (d > maxDist) maxDist = d;
      }
      maxDist *= random(1.5, 1.8);

      let ctx = drawingContext;
      let grad = ctx.createRadialGradient(jitterX, jitterY, 0, jitterX, jitterY, maxDist);
      grad.addColorStop(0, c.toString());
      grad.addColorStop(1, color(245, 245, 245, 30).toString());
      ctx.fillStyle = grad;

      beginShape();
      for (let j = 0; j < n; j++) {
        let next = verts[(j + 1) % n];
        let prev = verts[(j - 1 + n) % n];
        let [midPrev, curr, midNext] = smoothVertex(prev, verts[j], next);
        curveVertex(midPrev[0], midPrev[1]);
        curveVertex(curr[0], curr[1]);
        curveVertex(midNext[0], midNext[1]);
      }
      endShape(CLOSE);
    }
  }

  fill(255);
  noStroke();
  ellipse(mouseX, mouseY, 40, 40);
}

function keyPressed() {
  if (key === 'b' || key === 'B') {
    bwMode = !bwMode;
  }
  if(key==='e'){
    location.reload();
  }
}

function lerpPoint(a, b, amt) {
  return [a[0] * (1 - amt) + b[0] * amt, a[1] * (1 - amt) + b[1] * amt];
}
function smoothVertex(prev, current, next) {
  let mid1 = lerpPoint(prev, current, 0.7);
  let mid2 = lerpPoint(next, current, 0.7);
  return [mid1, current, mid2];
}
