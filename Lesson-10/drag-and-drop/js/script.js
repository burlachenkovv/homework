class DomElement {
	constructor(elementType, elementClass, elementId) {
		this.element;
		this.elementId = elementId;
		this.elementType = elementType;
		this.elementClass = elementClass;
	}

	create() {
		this.element = document.createElement(this.elementType);
		this.element.setAttribute("draggable", true);
		this.element.id = this.elementId;
		this.element.textContent = this.elementId;

		this.setClasses();
	}

	setClasses() {
		if(typeof this.elementClass === "string") {
			this.element.classList.add(this.elementClass);
		} else {
			this.element.classList.add(...this.elementClass);
		}
	}

	append() {
		this.create();
		main.appendChild(this.element);
	}
}

class SourceElement extends DomElement {
	constructor(...args) {
		super(...args);
	}

	dragStart(arg) {
		this.element.addEventListener("dragstart", (event) => {
			//this.element.style.border = "3px dotted #000";

			event.dataTransfer.effectAllowed = arg;
			event.dataTransfer.setData("Text", [this.elementId, this.element.dataset.key]);
			//event.dataTransfer.setData("Text", this.elementId);
		}, true);
	}

	dragEnd() {
		this.element.addEventListener("dragend", (event) => {
			this.element.style.border = "1px solid #ccc";
		}, false);
	}

	append(parentElement) {
		this.create();

		this.dragStart("move");
		this.dragEnd();

		let appendTo = document.getElementById(parentElement);
		appendTo.appendChild(this.element);
	}
}

class TargetElement extends SourceElement {
	constructor(...args) {
		super(...args);
	}

	addAttribute() {
		this.element.dataset.key = "task";
	}

	dragEnter() {
		this.element.addEventListener("dragenter", (event) => {
			//console.log(event.dataTransfer.getData("Text"));
			this.element.classList.add("active");
		}, false);
	}

	dragLeave() {
		this.element.addEventListener("dragleave", (event) => {
			this.element.classList.remove("active");
		}, false);
	}

	dragOver() {
		this.element.addEventListener("dragover", (event) => {
			if(event.preventDefault) event.preventDefault();
			return false;
		}, false);
	}

	dragDrop() {
		this.element.addEventListener("drop", (event) => {
			//console.log(event.dataTransfer.getData("Text"));
			if(event.preventDefault) event.preventDefault();
			if(event.stopPropagation) event.stopPropagation();

			this.element.classList.remove("active");
			
			let elementAttributes = event.dataTransfer.getData("Text").split(",");
			let id = elementAttributes[0];
			let dataValue = elementAttributes[1];

			let elem = document.getElementById(id);

			if(!dataValue) {
				this.element.appendChild(elem);
			} else if (dataValue === "task") {
				main.insertBefore(elem, this.element);
			}

			return false;
		}, false);
	}

	makeDragable() {
		this.dragStart("move");
		this.dragEnd();
	}

	append() {
		this.create();

		this.dragEnter();
		this.dragLeave();
		this.dragOver();
		this.dragDrop();

		main.appendChild(this.element);
	}
}

class Button {
	constructor(parentElement, elementText) {
		this.parentElement = parentElement;
		this.element;
		this.elementText = elementText;
	}

	create() {
		this.element = document.createElement("button");
		this.element.textContent = this.elementText;
	}

	handler() {
		this.element.addEventListener("click", (event) => {
			let newElementNum = document.querySelectorAll("[data-key=task]").length;
			let newElementId = `NoTitle${newElementNum}`;

			let newElement = new TargetElement("div", "task", newElementId);
			newElement.append();
			newElement.addAttribute();
			newElement.makeDragable();
		});
	}

	append() {
		this.create();
		this.handler();
		
		let appendTo = document.getElementById(this.parentElement);
		appendTo.appendChild(this.element);
	}
}

// few main targets
let divTarget1 = new TargetElement("div", ["task"], "Day-1");
divTarget1.append();
divTarget1.addAttribute();
divTarget1.makeDragable();

let divTarget2 = new TargetElement("div", ["task"], "Important");
divTarget2.append();
divTarget2.addAttribute();
divTarget2.makeDragable();

// main button
let button = new Button("header", "+ Add new");
button.append();

// source elements
let divSourse1 = new SourceElement("div", "square", "ThisWordIsTooooooooBig");
divSourse1.append("Day-1");

let divSourse2 = new SourceElement("div", "square", "SomeThing");
divSourse2.append("Important");

let divSourse3 = new SourceElement("div", "square", "ImportantStuff");
divSourse3.append("Important");


