let sites=[];
let bool=true;

function preload(){
	img1=loadImage("assets/cursor.png");
}

function setup() {
push();

	var canvas=createCanvas(windowWidth+20,windowHeight+20);
        canvas.parent('recipe-example');
	noSmooth();
    background(255);
    angleMode(DEGREES);
	//Set Cell Stroke Weight
	voronoiCellStrokeWeight(2);
	//Set Site Stroke Weight
	voronoiSiteStrokeWeight(0);
	//Set Cell Stroke
	voronoiCellStroke(0);
    fill(255,255,255,1);

    let points=[];


	//let angle=72;
	//let i=0;
	let radius=30;
	let center=createVector(random(width/1.2,width/1.6),random(height/1.6,height/3.4));
    for(i=0;i<27;i++){
		voronoiSite(center.x,center.y);
		//points.push(center.x,center.y);
        voronoiSite((center.x+(cos(360)*radius)),center.y+(sin(360))*radius);
		//points.push((center.x+(cos(360)*radius)),center.y+(sin(360))*radius);
		voronoiSite(center.x+(cos(72)*radius),center.y+(sin(72))*radius);
		//points.push(center.x+(cos(72)*radius),center.y+(sin(72))*radius);
		voronoiSite(center.x+(cos(144)*radius),center.y+(sin(144))*radius);
		//points.push(center.x+(cos(144)*radius),center.y+(sin(144))*radius);
		voronoiSite(center.x+(cos(216)*radius),center.y+(sin(216))*radius);
		//points.push(center.x+(cos(216)*radius),center.y+(sin(216))*radius);
		voronoiSite(center.x+(cos(288)*radius),center.y+(sin(288))*radius);
		//points.push(center.x+(cos(288)*radius),center.y+(sin(288))*radius);
		radius+=9;
   }

  	voronoiSite(mouseX,mouseY);
	//Clear custom sites (does not clear random sites)
	//voronoiClearSites();

	//Jitter Settings (These are the default settings)

	//Maximum distance between jitters
	voronoiJitterStepMax(20);
	//Minimum distance between jitters
	voronoiJitterStepMin(5);
	//Scales each jitter
	voronoiJitterFactor(3);
	//Jitter edges of diagram
	voronoiJitterBorder(false);

	//Compute voronoi diagram with size 700 by 500
	//With a prepared jitter structure (true)
	voronoi(width, height, true);

	var diagram = voronoiGetDiagram();
	console.log(diagram);

	//Get simplified cells without jitter, for more advanced use
	var normal = voronoiGetCells();
	console.log(normal);

	//Get simplified cells with jitter, for more advanced use
	var jitter = voronoiGetCellsJitter();
	console.log(jitter);
}

function draw(){
    voronoiCellStroke(2,0,0);
	stroke(0,30);
   voronoiDraw(0, 0, false, false);

   var celllist = voronoiGetCells();
   if (bool==true){
	for (let index = 0; index < celllist.length; index++) {
		push();
   		stroke(0,2);
		for (let segment = 0; segment < celllist[index].length; segment++) {
			bezier(celllist[index][segment][0], celllist[index][segment][1], celllist[index][(segment+1) % celllist[index].length][0], +
			celllist[index][(segment+1) % celllist[index].length][1], celllist[index][(segment+1) % celllist[index].length][0], +
			celllist[index][(segment+1) % celllist[index].length][1], celllist[index][(segment+2) % celllist[index].length][0], +
			celllist[index][(segment+2) % celllist[index].length][1]);
		}
		pop();

	}
	}

}


function mousePressed(){
	push();
	voronoiCellStrokeWeight(0.5);
	stroke(50,3);
	voronoiSite(mouseX,mouseY);
	voronoi(width,height,true);
	voronoiDraw(0,0,false,false);
	pop();
}

function keyPressed(){
	bool==false;
	voronoiSiteStrokeWeight(7);
}


