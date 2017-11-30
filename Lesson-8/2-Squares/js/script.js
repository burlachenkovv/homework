const COLOR_GREEN = "#009542";
const COLOR_RED = "#e60000";

let Square = function() {
	this.type = "span";
	this.side = 100;
	this.bgColor = COLOR_GREEN;
}

Square.prototype.draw = function() {
	let htmlElement = document.createElement(this.type);
	htmlElement.style.width = this.side+"px";
	htmlElement.style.height = this.side+"px";
	htmlElement.style.backgroundColor = this.bgColor;

	let linkToObject = this;
	htmlElement.addEventListener("click", function() {
		linkToObject.bgColor = (linkToObject.bgColor === COLOR_GREEN) ? COLOR_RED : COLOR_GREEN;
		htmlElement.style.backgroundColor = linkToObject.bgColor;
	});

	document.getElementById("container").appendChild(htmlElement);
}

let squaresArray = new Array();
for(let i = 0; i < 6; i++) {
	squaresArray.push(new Square());
	squaresArray[i].draw();
}