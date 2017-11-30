let login = document.getElementById("login");
login.addEventListener("keyup", function() {
	checkLogin("keyup");
	checkForm();
});

let email = document.getElementById("email");
email.addEventListener("keyup", function() {
	checkEmail("keyup");
	checkForm();
});

$("#phone").mask("+380 (99) 999-99-99",{autoclear: false, completed: function() {
	checkPhone();
	checkForm();
}});


function checkLogin(eventType) {
	let loginPattern = /^[a-zA-Z0-9_.]{3,20}$/;
	let loginLengthHint = "Length from 3 to 20.";
	let loginCharHint = "The valid symbols are: a-z, A-Z, 0-9, _, .";

	if(login.value.length < 3 || login.value.length > 20) {
		checkCertainField(login, loginPattern, loginLengthHint, eventType);
	} else {
		checkCertainField(login, loginPattern, loginCharHint, eventType);
	}
	eventType = "";
}

function checkEmail(eventType) {
	let emailPattern = /^[a-zA-Z0-9_.-]+[@]+[a-zA-Z0-9-]+[.]+[a-zA-Z.]{2,6}[a-z]$/;
	let emailHint = "Example: john.doe@mail.com";

	checkCertainField(email, emailPattern, emailHint, eventType);
}

function checkPhone() {
	let phone = document.getElementById("phone");
	let phonePattern = /^[+]+[0-9-\s\(\)]{10,30}$/;
	let phoneHint = "The valid format is: +380 (97) 123-45-67.";
	
	checkCertainField(phone, phonePattern, phoneHint);
}

function checkCertainField(fieldName, fieldPattern, fieldHint, eventType) {
	let errorSpan = fieldName.parentElement.getElementsByTagName("span")[0];

	if(!fieldPattern.test(fieldName.value) && eventType != "keyup") {
		if(errorSpan) {
			errorSpan.remove();	
		}
		let errorMsg = document.createElement("span");
		errorMsg.className = "error";
		errorMsg.innerHTML = fieldHint;

		fieldName.className = "error";
		fieldName.parentElement.appendChild(errorMsg);
	} else if(fieldPattern.test(fieldName.value)) {
		fieldName.className = "valid";
		if(errorSpan) {
			errorSpan.remove();	
		}
	} else if(!fieldPattern.test(fieldName.value) && eventType === "keyup") {
		fieldName.className = "error";
	}
}

function checkForm() {
	let form = document.getElementsByTagName("form")[0];
	if(form.querySelectorAll("input.valid").length === 3) {
		document.getElementById("button").removeAttribute("disabled");
	} else {
		document.getElementById("button").setAttribute("disabled", "disabled");
	}
}