const COLOR_GREY = "#939393";
const COLOR_GREEN = "#009542";
const COLOR_RED = "#e60000";

let canvas = document.getElementById("container");
let ctx = canvas.getContext("2d");

let Square = function() {
	this.isActive = false;
	this.side = 100;
	this.x;
	this.y;
	this.deltaX;
	this.deltaY;
	this.bgColor;
}

Square.prototype.draw = function(x, y) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	if(!x) {
		this.x = canvas.width / 2 - this.side / 2;
		this.y = canvas.height / 2 - this.side / 2;
	} else {
		this.x = x - this.deltaX;
		this.y = y - this.deltaY;
	}

	this.bgColor = (this.isActive) ? COLOR_GREEN : COLOR_GREY;
	
	if(this.x <= 5 || this.x >= canvas.width - this.side - 5)
	{
		this.bgColor = COLOR_RED;
		canvas.className = "touchX";

	} else if(this.y <= 5 || this.y >= canvas.height - this.side - 5) {
		this.bgColor = COLOR_RED;
		canvas.className = "touchY";

	} else {
		canvas.className = "noTouch";
	}

	ctx.fillStyle = this.bgColor;
	ctx.fillRect(this.x, this.y, this.side,	this.side);
}

Square.prototype.move = function(event) {
	if (this.isActive
		&& event.offsetX > 0 + this.deltaX
		&& event.offsetX < canvas.width - (this.side - this.deltaX)
		&& event.offsetY > 0 + this.deltaY
		&& event.offsetY < canvas.height - (this.side - this.deltaY))
	{
		this.draw(event.offsetX, event.offsetY);
	}
}

Square.prototype.bones = function(linkToObject, event) {
	if (!linkToObject.isActive
		&& event.offsetX > linkToObject.x
		&& event.offsetX < linkToObject.x + linkToObject.side
		&& event.offsetY > linkToObject.y
		&& event.offsetY < linkToObject.y + linkToObject.side)
	{
		linkToObject.isActive = !linkToObject.isActive;
		linkToObject.deltaX = event.offsetX - linkToObject.x;
		linkToObject.deltaY = event.offsetY - linkToObject.y;

		canvas.addEventListener("mousemove", function(event) {
			linkToObject.move(event);
		});		
	} else if (linkToObject.isActive) {
		linkToObject.isActive = !linkToObject.isActive;
		linkToObject.draw(linkToObject.x + linkToObject.deltaX, linkToObject.y + linkToObject.deltaY);
	}
}

let square = new Square();
square.draw();

canvas.addEventListener("click", function(event) {
	square.bones(square, event);
});