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

		let span = document.createElement("span");
		span.textContent = "[ Press here for edit ]";
		
		let listenerInput = (event) => {
			if(event.keyCode === 13) {
				event.target.parentElement.addEventListener("click", listenerSpan);
				event.target.parentElement.textContent = (/\S/.test(event.target.value)) ? event.target.value : "[ empty ]";

				this.element.setAttribute("draggable", true);
				if(this.element.dataset.key === "step") {
					this.element.parentElement.setAttribute("draggable", true);
				}
			}
		}

		let listenerSpan = (event) => {
			this.element.setAttribute("draggable", false);
			if(this.element.dataset.key === "step") {
				this.element.parentElement.setAttribute("draggable", false);
			}

			let input = document.createElement("textarea");
			input.value = span.textContent;
			input.addEventListener("keydown", listenerInput);

			span.replaceChild(input, span.firstChild);
			span.removeEventListener("click", listenerSpan);
		};

		span.addEventListener("click", listenerSpan, false);
		
		this.element.appendChild(span);
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

	addAttribute() {
		this.element.dataset.key = "step";
	}

	dragStart(arg) {
		this.element.addEventListener("dragstart", (event) => {
			event.dataTransfer.effectAllowed = arg;
			event.dataTransfer.setData("Text", [this.elementId, this.element.dataset.key]);
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

			if(dataValue === "step") {
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
	constructor(parentElement, elementText, elementIntend) {
		this.parentElement = parentElement;
		this.element;
		this.elementText = elementText;
		this.intend = elementIntend;
	}

	create() {
		this.element = document.createElement("button");
		this.element.textContent = this.elementText;
	}

	handlerTarget() {
		this.element.addEventListener("click", (event) => {
			let newElementNum = document.querySelectorAll("[data-key=task]").length;
			let newElementId = `task-${newElementNum}`;

			let newElement = new TargetElement("div", "task", newElementId);
			newElement.append();
			newElement.addAttribute();
			newElement.makeDragable();

			let button = new Button(newElementId, "Add Step", "step");
			button.append();
		});
	}

	handlerSource() {
		this.element.addEventListener("click", (event) => {
			let newElementNum = 0;
			let elementsNum = document.querySelectorAll("[data-key=step]").length;
			
			if(elementsNum) {
				let elements = document.querySelectorAll("[data-key=step]");
				let lastElementId = elements[elements.length - 1].id.split("-");

				newElementNum = ++lastElementId[lastElementId.length - 1];
			}

			let newElementId = `step-${newElementNum}`;

			let newElement = new SourceElement("div", "square", newElementId);
			newElement.append(this.parentElement);
			newElement.addAttribute();

			let button = new Button(newElementId, "X", "delete");
			button.append();
		});
	}

	handlerDelete() {
		this.element.addEventListener("click", (event) => {
			event.target.parentElement.remove();
		});
	}

	append() {
		this.create();

		if(this.intend === "step") {
			this.handlerSource();
		} else if(this.intend === "delete") {
			this.handlerDelete();
		} else {
			this.handlerTarget();
		}
		
		let appendTo = document.getElementById(this.parentElement);
		appendTo.appendChild(this.element);
	}
}


// main button
let button = new Button("header", "+ Add Task");
button.append();

/*// few main targets
let divTarget1 = new TargetElement("div", ["task"], "Day-1");
divTarget1.append();
divTarget1.addAttribute();
divTarget1.makeDragable();

let divTarget2 = new TargetElement("div", ["task"], "Important");
divTarget2.append();
divTarget2.addAttribute();
divTarget2.makeDragable();

// main button
let button = new Button("header", "+ Add Task");
button.append();

// source elements
let divSourse1 = new SourceElement("div", "square", "ThisWordIsTooooooooBig");
divSourse1.append("Day-1");
divSourse1.addAttribute();

let divSourse2 = new SourceElement("div", "square", "SomeThing");
divSourse2.append("Important");
divSourse2.addAttribute();

let divSourse3 = new SourceElement("div", "square", "ImportantStuff");
divSourse3.append("Important");
divSourse3.addAttribute();*/


