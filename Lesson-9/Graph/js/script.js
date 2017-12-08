const COLOR_GREEN = "#52bc18";

const canvas = document.getElementById("container");
const ctx = canvas.getContext("2d");

const graphData = [
	{value: 262, name: "Monero", img: "monero.png"},
	{value: 449, name: "Ethereum", img: "ethereum.png"},
	{value: 758, name: "Dash", img: "dash.png"},
	{value: 101, name: "Litecoin", img: "litecoin.png"},
	{value: 331, name: "Zcash", img: "zcash.png"}
];


//////////////// Graph Line //////////////////
let Line = function(x, y, height, width, graphValue, graphName, graphImage) {
	this.x = x;
	this.y = y;
	this.currentWidth = x;
	this.height = height;
	this.width = width;
	this.color = COLOR_GREEN;
	this.isActive = false;
	this.graphValue = graphValue;
	this.graphName = graphName;
	this.graphImage = graphImage;
}

Line.prototype.draw = function() {
	ctx.beginPath();
	ctx.lineWidth = this.height;
	ctx.strokeStyle = "#fff";
	ctx.moveTo(this.x, this.y);
	ctx.lineTo(this.currentWidth, this.y);
	ctx.stroke();

	ctx.lineWidth = this.height - 2;
	ctx.strokeStyle = this.color;
	ctx.moveTo(this.x, this.y);
	ctx.lineTo(this.currentWidth, this.y);
	ctx.stroke();
}

Line.prototype.animation = function() {
	let linkToObject = this;
	let animationInterval = setInterval(function() {
		linkToObject.currentWidth += 2;
		linkToObject.draw();

		if(linkToObject.currentWidth >= linkToObject.width) {
			clearInterval(animationInterval);
		}
	}, 1);
}

//////////////// Graph Body //////////////////
let Graph = function() {
	this.graphData;
	this.lineHeight;
	this.lineCoefficient;
}

Graph.prototype.calcValues = function() {
	this.graphData = graphData.slice().sort(function(a, b) {
		return b.value - a.value;
	});

	this.lineHeight = canvas.height / this.graphData.length;
	this.lineCoefficient = ((canvas.width / 2) / this.graphData[0].value);
}

Graph.prototype.draw = function() {
	let linesArray = new Array();
	for(let i = 0; i < this.graphData.length; i++) {
		linesArray.push(new Line(
			0,
			this.lineHeight * i + (this.lineHeight / 2),
			this.lineHeight,
			this.graphData[i].value * this.lineCoefficient,
			this.graphData[i].value,
			this.graphData[i].name,
			this.graphData[i].img
		));

		linesArray[i].animation();
	}

	return linesArray;
}

Graph.prototype.listener = function() {
	canvas.addEventListener("mousemove", function(event) {
		let info = new Info();

		for(let i = 0; i < linesArray.length; i++) {
			if(event.offsetX <= linesArray[i].width
				&& event.offsetY >= linesArray[i].y - linesArray[i].height / 2
				&& event.offsetY <= linesArray[i].y + linesArray[i].height / 2)
			{
				if(!linesArray[i].isActive) {
					linesArray[i].isActive = true;

					info = new Info();
					info.animation(linesArray[i].graphValue + "$", linesArray[i].graphImage);
				}
			} else {
				linesArray[i].isActive = false;
			}

			if(!linesArray.some(function(obj) {return obj.isActive})) {
				info.clear();
			}
		}
	});
}

//////////////// Info Body //////////////////
let Info = function() {
	this.step = 10;
	this.x = canvas.width / 2 + 20;
	this.y;	
	this.width = 220;
	this.height = canvas.height;
}

Info.prototype.draw = function() {
	ctx.clearRect(this.x, 0, this.width, canvas.height);
	ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
	ctx.fillRect(this.x, this.y, this.width, this.step);
}

Info.prototype.animation = function(textToView, imageToView) {
	let linkToObject = this;

	let animationInterval = setInterval(function() {
		linkToObject.step += 10;
		linkToObject.y = (canvas.height / 2) - (linkToObject.step / 2);
		linkToObject.draw();

		if(linkToObject.step >= linkToObject.height) {
			clearInterval(animationInterval);

			let img = new Image();
			img.src = "./img/" + imageToView;
			img.onload = function() {
				ctx.drawImage(img, linkToObject.x + linkToObject.width / 2 - 50, 80);
			}

			ctx.font = "bold 30px Arial"
			ctx.fillStyle = "rgb(0, 0, 0)";
			ctx.fillText(textToView,
				linkToObject.x + linkToObject.width / 2 - 30,
				linkToObject.height / 2 + 110); 
		}
	}, 5);
}

Info.prototype.clear = function() {
	ctx.clearRect(this.x, this.y, this.width, this.height);
}



//create new graph
let graph = new Graph(graphData);

//calculate values from main array
graph.calcValues();

//draw lines
let linesArray = graph.draw();

//check graph body for mouse moving
graph.listener();
