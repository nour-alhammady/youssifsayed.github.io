/**
 * @copyright: youssif sayed<sayedgyussif@gmail.com>
 */

function send(Form) {
	var HTTP         = new XMLHttpRequest,
		submitbutton = this.querySelector("input[type='submit']"),
		API          = "https://mandrillapp.com/api/1.0/messages/send.json",
		data         = {},
		forms        = {};

	forms = {
		title: this.querySelector("input[name='name']").value || "مجهول",
		name: this.querySelector("input[name='title']").value || "بدون عنوان",
		email: this.querySelector("input[name='email']").value || "sayedgyussif@gmail.com",
		message: this.querySelector("textarea").value || "بدون رسالة:("
	}

	submitbutton.setAttribute("disable", "1")

	HTTP.open("POST", API)
	
	HTTP.onreadystatechange = function() {
		submitbutton.setAttribute("disable", "0")
		if (HTTP.readyState == 4) {
			switch (HTTP.status) {
			case 200:
				alert("تم الإرسال بنجاح.");
			break
			
			default:
				alert("خطأ حاول مرة أخرى.")
			}
		}
	}
	
	HTTP.setRequestHeader("Content-Type", "text/json")
	
	data = {
		key: "-us13",
		messages: {
			from_email: `<${forms.name}> ${forms.email}`,
			to: [{
				email: "sayedgyussif@gmail.com",
				type: "to"
			}]
		},
		subject: forms.title,
		html: "SDDS"
	} 
	
	HTTP.send(JSON.stringify(data))
}

var Form = document.body.querySelector("form");
if (typeof Form != "undefined" && Form)
	Form.addEventListener("submit", send.bind(Form));