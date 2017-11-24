function checkFields() {
	let form = document.getElementsByTagName("form")[0];
	let login = document.getElementsByName("login")[0];
	let email = document.getElementsByName("email")[0];
	let phone = document.getElementsByName("phone")[0];

	let loginPattern = /^[a-zA-Z0-9_.]{3,20}$/;
	let emailPattern = /^[a-zA-Z0-9_.-]+[@]+[a-zA-Z0-9-]+[.]+[a-zA-Z]{2,6}$/;
	let phonePattern = /^[0-9]{12}$/;

	let loginHint = "Length from 3 to 20.<br> The valid symbols are: a-z, A-Z, 0-9, _, .";
	let emailHint = "Example: john.doe@mail.com";
	let phoneHint = "The valid formats are: 380971234567 or +38 (097) 123-45-67.<br>The length of phone number must be 12 <u>numbers</u>.";

	let noErrors = true;

	clearErrors();
	checkCertainField(login, loginPattern, loginHint);
	checkCertainField(email, emailPattern, emailHint);
	checkCertainField(phone, phonePattern, phoneHint);
	
	if(!noErrors) {
		checkErrors();
	}

	function checkCertainField(fieldName, fieldPattern, fieldHint) {
		if(fieldName.name === "phone") {
			fieldName.value = fieldName.value.replace(/[+()-\s]/g, "");
		}

		if(!fieldPattern.test(fieldName.value)) {
			let errorMsg = document.createElement("span");
			errorMsg.className = "error";
			errorMsg.innerHTML = fieldHint;

			fieldName.className = "error";
			form.insertBefore(errorMsg, fieldName.nextSibling);

			noErrors = false;
		} else {
			fieldName.className = "valid";
		}
	}

	function checkErrors() {
			let sectionMain = document.getElementById("main");
			let errorMsg = document.createElement("span");
			errorMsg.className = "error";
			errorMsg.innerText = "Please fill all the fields correctly and press 'Register' again.";
			sectionMain.insertBefore(errorMsg, form);
	}

	function clearErrors() {
		let previousErrors = document.getElementsByTagName("span");
		while(previousErrors.length) {
			previousErrors[0].remove();
		}
	}
}
