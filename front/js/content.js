chrome.runtime.onMessage.addListener((request) => {
	if (request === "API") {
		const re = /^(http(s)??\:\/\/)?(www\.)?((youtube\.com\/watch\?v=)|(youtu.be\/))([a-zA-Z0-9\-_])+/;
		let body = {
			url: window.location.href
		};
		if (re.test(body.url) == false) {
			alert("Mauvaise URL");
			return false;
		}
		chrome.runtime.sendMessage({ message: 'downloadIcon' });
		alert('Conversion en cours');
		fetch("https://youtube-converter-mp3-chrome.herokuapp.com/", {
			method: "POST",
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(body)
		})
		.then(response => response.json())
		.then(response => {
			if (response.error != null)
				alert('Impossible de convertir cette vidéo');
		});
	}
});
