let sites = [];
const NUM_SITES = 100;
let t = 0;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('demo');

  // generate initial sites
  for (let i = 0; i < NUM_SITES; i++) {
    sites.push({ 
      x: random(width), 
      y: random(height),
      vx: random(-0.2, 0.2),
      vy: random(-0.2, 0.2)
    });
  }

  // Voronoi setup
  voronoiCellStrokeWeight(1);
  voronoiSiteStrokeWeight(3);
  voronoiCellStroke(0);
  voronoiSiteStroke(0);
}

function draw() {
  background(245, 245, 245, 30); // subtle fade for motion trails

  t += 0.01;

  // slowly move sites to give pulsing effect
  for (let p of sites) {
    p.x += p.vx * sin(t*0.5);
    p.y += p.vy * cos(t*0.5);

    // wrap around edges
    if (p.x < 0) p.x = width;
    if (p.x > width) p.x = 0;
    if (p.y < 0) p.y = height;
    if (p.y > height) p.y = 0;

    voronoiSite(p.x, p.y);
  }

  voronoi(width, height);
  voronoiDraw(0, 0, false);
}
