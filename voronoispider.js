let recolor=false;

function preload(){
	img1=loadImage("assets/cursor.png");
}

function setup() {
push();

	var canvas=createCanvas(windowWidth,windowHeight);
        canvas.parent('recipe-example');
	noSmooth();
	noLoop();
    background(255);
    angleMode(DEGREES);
	voronoiCellStrokeWeight(0.5);
	voronoiSiteStrokeWeight(0);
	voronoiSiteStroke(color(200,0,0)); 
    fill(255,255,255,1);
	if(recolor==false){
		push();
   		voronoiCellStroke(150,0,0);
		pop();
	}
   let radius=1;
	let center=createVector(random(width/3,width/1.2),random(height/1.6,height/3.4));
	for(i=0;i<20;i++){
		voronoiSite(center.x,center.y);
        voronoiSite((center.x+(cos(360)*radius)),center.y+(sin(360))*radius);
		voronoiSite(center.x+(cos(72)*radius),center.y+(sin(72))*radius);
		voronoiSite(center.x+(cos(144)*radius),center.y+(sin(144))*radius);
		voronoiSite(center.x+(cos(216)*radius),center.y+(sin(216))*radius);
		voronoiSite(center.x+(cos(288)*radius),center.y+(sin(288))*radius);
		radius+=9;
   }
	voronoi(width, height, true);
}

function draw(){
voronoiDraw(0,0,false,true);
   var celllist = voronoiGetCells();
	for (let index = 0; index < celllist.length; index++) {
		push();
   		stroke(0,30);
		for (let segment = 0; segment < celllist[index].length; segment++) {
			bezier(celllist[index][segment][0], celllist[index][segment][1], celllist[index][(segment+1) % celllist[index].length][0], +
			celllist[index][(segment+1) % celllist[index].length][1], celllist[index][(segment+1) % celllist[index].length][0], +
			celllist[index][(segment+1) % celllist[index].length][1], celllist[index][(segment+2) % celllist[index].length][0], +
			celllist[index][(segment+2) % celllist[index].length][1]);
		}
		pop();
	}
}


function mousePressed(){
	push();
	voronoiCellStrokeWeight(0.5);
	voronoiSite(mouseX,mouseY);
	voronoi(width,height,true);
	voronoiDraw(0,0,false,true);
	pop();
}

function keyPressed(){
	if (key === 's' || key === 'S') {  
		push();
		voronoiSiteStrokeWeight(6);
		voronoiDraw(0,0,false,true);
		pop();
	  }
	  if(key==='e'){
		location.reload();
	  }
	  if(key==='w'){
		recolor=true;
		voronoiCellStrokeWeight(4);
		voronoiCellStroke(color(random(255),random(255),random(255)));
		redraw();
	  }
}

